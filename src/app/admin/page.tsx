'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTranslation } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import type { Motor } from '@/types/motor';
import { toast } from 'sonner';

export default function AdminPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useAuth();
  const [motors, setMotors] = useState<Motor[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchMotors();
  }, [isAuthenticated, loading]);

  const fetchMotors = async () => {
    try {
      const response = await fetch('/api/motors');
      const data = await response.json();
      if (data.success) {
        setMotors(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch motors:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/motors/${deleteId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        toast.success(t('admin.delete_success'));
        fetchMotors();
      }
    } catch (error) {
      console.error('Failed to delete motor:', error);
      toast.error(t('common.error'));
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
          <p className="mt-2 text-muted-foreground">管理电机产品和数据</p>
        </div>
        <Link href="/admin/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t('admin.add')}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>产品列表</CardTitle>
        </CardHeader>
        <CardContent>
          {motors.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">暂无产品</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>型号</TableHead>
                  <TableHead>机座号</TableHead>
                  <TableHead>功率</TableHead>
                  <TableHead>电压</TableHead>
                  <TableHead>转速</TableHead>
                  <TableHead>效率</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {motors.map((motor) => (
                  <TableRow key={motor.id}>
                    <TableCell className="font-medium">{motor.model}</TableCell>
                    <TableCell>{motor.frameSize}</TableCell>
                    <TableCell>{motor.power} kW</TableCell>
                    <TableCell>{motor.voltage} V</TableCell>
                    <TableCell>{motor.rpm}</TableCell>
                    <TableCell>{motor.efficiency}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/edit/${motor.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(motor.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('detail.actions.delete')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('admin.delete_confirm')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                {t('common.cancel')}
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete}>
                                {t('common.confirm')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
