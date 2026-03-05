'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Motor {
  id: number;
  model: string;
  frameSize: string;
  power: number;
  voltage: number;
  current: number;
  rpm: number;
  description: string;
  imageUrl: string | null;
}

export default function AdminProductsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchProducts();
  }, [isAuthenticated, user]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/motors');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('获取产品失败:', error);
      toast.error('获取产品失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个产品吗？')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/motors/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('删除成功');
        fetchProducts();
      } else {
        toast.error(data.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      toast.error('删除失败');
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.frameSize.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              产品管理
            </h1>
          </div>
          <p className="text-muted-foreground">管理产品信息和库存</p>
        </div>
        <Link href="/admin/add">
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600">
            <Plus className="h-4 w-4" />
            添加产品
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索产品..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Products List */}
          <div className="grid gap-4">
            {filteredProducts.length === 0 ? (
              <Card className="border-2">
                <CardContent className="py-12 text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-lg text-muted-foreground">暂无产品</p>
                </CardContent>
              </Card>
            ) : (
              filteredProducts.map((product) => (
                <Card key={product.id} className="border-2 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="h-32 w-32 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 flex items-center justify-center flex-shrink-0">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.model}
                            className="h-full w-full object-contain rounded-lg"
                          />
                        ) : (
                          <Package className="h-12 w-12 text-muted-foreground opacity-50" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-2xl font-bold mb-1">{product.model}</h3>
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                          </div>
                          <Badge variant="secondary">{product.frameSize}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">功率</p>
                            <p className="font-semibold">{product.power} kW</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">电压</p>
                            <p className="font-semibold">{product.voltage} V</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">电流</p>
                            <p className="font-semibold">{product.current} A</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">转速</p>
                            <p className="font-semibold">{product.rpm} rpm</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link href={`/admin/edit/${product.id}`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="h-4 w-4" />
                            编辑
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          删除
                        </Button>
                        <Link href={`/products/${product.id}`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            查看
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
