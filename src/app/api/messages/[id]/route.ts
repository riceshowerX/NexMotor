import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// GET - 获取单个留言详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '需要管理员权限' }, { status: 403 });
    }

    const { id } = await params;
    const db = getDb();
    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(Number(id));
    db.close();

    if (!message) {
      return NextResponse.json({ success: false, message: '留言不存在' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error('获取留言详情失败:', error);
    return NextResponse.json({ success: false, message: '获取留言详情失败' }, { status: 500 });
  }
}

// PATCH - 更新留言（回复、标记已读等）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '需要管理员权限' }, { status: 403 });
    }

    const { id } = await params;
    const db = getDb();

    // 检查留言是否存在
    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(Number(id));
    if (!message) {
      return NextResponse.json({ success: false, message: '留言不存在' }, { status: 404 });
    }

    const body = await request.json();
    const { status, reply } = body;

    // 构建更新语句
    const updates: string[] = [];
    const updateParams: any[] = [];

    if (status !== undefined) {
      updates.push('status = ?');
      updateParams.push(status);
    }

    if (reply !== undefined) {
      updates.push('reply = ?');
      updates.push('replied_at = CURRENT_TIMESTAMP');
      updateParams.push(reply);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, message: '没有要更新的字段' }, { status: 400 });
    }

    updateParams.push(Number(id));

    const result = db.prepare(`
      UPDATE messages
      SET ${updates.join(', ')}
      WHERE id = ?
    `).run(...updateParams);

    db.close();

    if (result.changes === 0) {
      return NextResponse.json({ success: false, message: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Updated successfully' });
  } catch (error) {
    console.error('Update message error:', error);
    return NextResponse.json({ success: false, message: '更新留言失败' }, { status: 500 });
  }
}

// DELETE - 删除留言
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '需要管理员权限' }, { status: 403 });
    }

    const { id } = await params;
    const db = getDb();
    const result = db.prepare('DELETE FROM messages WHERE id = ?').run(Number(id));
    db.close();

    if (result.changes === 0) {
      return NextResponse.json({ success: false, message: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete message' }, { status: 500 });
  }
}
