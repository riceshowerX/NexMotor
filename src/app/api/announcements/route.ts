import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// GET - 获取公告列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get('public') === 'true';

    const db = getDb();

    if (isPublic) {
      // 获取公开的激活公告
      const announcements = db.prepare(`
        SELECT * FROM announcements
        WHERE is_active = 1
        ORDER BY priority DESC, created_at DESC
      `).all();
      db.close();
      return NextResponse.json({ success: true, data: announcements });
    } else {
      // 获取所有公告（需要管理员权限）
      const user = requireAdmin(request);
      if (!user) {
        return NextResponse.json({ success: false, message: '需要管理员权限' }, { status: 403 });
      }

      const announcements = db.prepare(`
        SELECT * FROM announcements
        ORDER BY priority DESC, created_at DESC
      `).all();
      db.close();
      return NextResponse.json({ success: true, data: announcements });
    }
  } catch (error) {
    console.error('获取公告失败:', error);
    return NextResponse.json({ success: false, message: '获取公告失败' }, { status: 500 });
  }
}

// POST - 创建公告（需要管理员权限）
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '需要管理员权限' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, type, isActive, priority } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, message: '标题和内容不能为空' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO announcements (title, content, type, is_active, priority)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      title,
      content,
      type || 'info',
      isActive ? 1 : 0,
      priority || 0
    );
    db.close();

    return NextResponse.json({
      success: true,
      data: { id: result.lastInsertRowid },
      message: '创建成功',
    });
  } catch (error) {
    console.error('创建公告失败:', error);
    return NextResponse.json({ success: false, message: '创建公告失败' }, { status: 500 });
  }
}

// PUT - 更新公告（需要管理员权限）
export async function PUT(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '需要管理员权限' }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, content, type, isActive, priority } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少ID' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare(`
      UPDATE announcements
      SET title = ?, content = ?, type = ?, is_active = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title,
      content,
      type || 'info',
      isActive ? 1 : 0,
      priority || 0,
      id
    );
    db.close();

    if (result.changes === 0) {
      return NextResponse.json({ success: false, message: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Updated successfully' });
  } catch (error) {
    console.error('Update announcement error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update announcement' }, { status: 500 });
  }
}

// DELETE - 删除公告（需要管理员权限）
export async function DELETE(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '需要管理员权限' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少ID' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare('DELETE FROM announcements WHERE id = ?').run(Number(id));
    db.close();

    if (result.changes === 0) {
      return NextResponse.json({ success: false, message: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete announcement' }, { status: 500 });
  }
}
