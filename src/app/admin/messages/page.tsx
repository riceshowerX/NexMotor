'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Mail,
  Phone,
  Building2,
  Eye,
  CheckCircle,
  X,
  Search,
  Filter,
  Calendar,
  Send,
  Trash2,
  Reply,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  content: string;
  status: 'unread' | 'read' | 'replied';
  reply?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminMessagesPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchMessages();
  }, [isAuthenticated, user, statusFilter]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/messages?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.data.messages || []);
      }
    } catch (error) {
      console.error('获取留言失败:', error);
      toast.error('获取留言失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('状态更新成功');
        fetchMessages();
      } else {
        toast.error(data.message || '更新失败');
      }
    } catch (error) {
      console.error('更新状态失败:', error);
      toast.error('更新失败');
    }
  };

  const handleReply = async () => {
    if (!selectedMessage) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages/${selectedMessage.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'replied',
          reply: replyText,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('回复成功');
        setReplyText('');
        setSelectedMessage(null);
        fetchMessages();
      } else {
        toast.error(data.message || '回复失败');
      }
    } catch (error) {
      console.error('回复失败:', error);
      toast.error('回复失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条留言吗？')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('删除成功');
        fetchMessages();
      } else {
        toast.error(data.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      toast.error('删除失败');
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
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
              留言管理
            </h1>
          </div>
          <p className="text-muted-foreground">管理用户留言和回复</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filters */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索留言..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('all')}
                  >
                    全部 ({messages.length})
                  </Button>
                  <Button
                    variant={statusFilter === 'unread' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('unread')}
                  >
                    未读 ({messages.filter((m) => m.status === 'unread').length})
                  </Button>
                  <Button
                    variant={statusFilter === 'replied' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('replied')}
                  >
                    已回复 ({messages.filter((m) => m.status === 'replied').length})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages List */}
          <div className="space-y-4">
            {filteredMessages.length === 0 ? (
              <Card className="border-2">
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-lg text-muted-foreground">暂无留言</p>
                </CardContent>
              </Card>
            ) : (
              filteredMessages.map((message) => (
                <Card key={message.id} className="border-2 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                          {message.name[0].toUpperCase()}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{message.name}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {message.email}
                            </span>
                            {message.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {message.phone}
                              </span>
                            )}
                            {message.company && (
                              <span className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {message.company}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            message.status === 'unread'
                              ? 'default'
                              : message.status === 'replied'
                              ? 'secondary'
                              : 'outline'
                          }
                          className={
                            message.status === 'unread'
                              ? 'bg-red-500 hover:bg-red-600'
                              : message.status === 'replied'
                              ? 'bg-green-500 hover:bg-green-600'
                              : ''
                          }
                        >
                          {message.status === 'unread' ? '未读' : message.status === 'replied' ? '已回复' : '已读'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">{message.subject}</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">{message.content}</p>
                      </div>

                      {message.reply && (
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Reply className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">您的回复：</span>
                          </div>
                          <p className="text-sm">{message.reply}</p>
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            setReplyText(message.reply || '');
                          }}
                          className="gap-2"
                        >
                          <Reply className="h-4 w-4" />
                          {message.reply ? '修改回复' : '回复'}
                        </Button>
                        {message.status === 'unread' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(message.id, 'read')}
                            className="gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            标记已读
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(message.id)}
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          删除
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Reply Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Reply className="h-5 w-5" />
              回复留言
            </DialogTitle>
            <DialogDescription>回复来自 {selectedMessage?.name} 的留言</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMessage && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold mb-2">{selectedMessage.subject}</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="reply">回复内容</Label>
              <Textarea
                id="reply"
                placeholder="请输入您的回复..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMessage(null)}>
              取消
            </Button>
            <Button onClick={handleReply} disabled={!replyText.trim() || isSubmitting} className="gap-2">
              <Send className="h-4 w-4" />
              {isSubmitting ? '发送中...' : '发送回复'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
