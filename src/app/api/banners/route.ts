import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// GET - 获取轮播图列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get('public') === 'true';

    const db = getDb();

    if (isPublic) {
      // 获取公开的激活轮播图
      const banners = db.prepare(`
        SELECT * FROM banners
        WHERE is_active = 1
        ORDER BY order_num ASC
      `).all();
      db.close();
      return NextResponse.json({ success: true, data: banners });
    } else {
      // 获取所有轮播图（需要管理员权限）
      const user = requireAdmin(request);
      if (!user) {
        return NextResponse.json({ success: false, message: '需要管理员权限' }, { status: 403 });
      }

      const banners = db.prepare('SELECT * FROM banners ORDER BY order_num ASC').all();
      db.close();
      return NextResponse.json({ success: true, data: banners });
    }
  } catch (error) {
    console.error('获取轮播图失败:', error);
    return NextResponse.json({ success: false, message: '获取轮播图失败' }, { status: 500 });
  }
}

// POST - 创建轮播图（需要管理员权限）
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '需要管理员权限' }, { status: 403 });
    }

    const body = await request.json();
    const { title, subtitle, imageUrl, linkUrl, orderNum, isActive } = body;

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO banners (title, subtitle, image_url, link_url, order_num, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      title || '',
      subtitle || '',
      imageUrl || '',
      linkUrl || '',
      orderNum || 0,
      isActive ? 1 : 0
    );
    db.close();

    return NextResponse.json({
      success: true,
      data: { id: result.lastInsertRowid },
      message: '创建成功',
    });
  } catch (error) {
    console.error('创建轮播图失败:', error);
    return NextResponse.json({ success: false, message: '创建轮播图失败' }, { status: 500 });
  }
}

// PUT - 更新轮播图（需要管理员权限）
export async function PUT(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '需要管理员权限' }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, subtitle, imageUrl, linkUrl, orderNum, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少ID' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare(`
      UPDATE banners
      SET title = ?, subtitle = ?, image_url = ?, link_url = ?, order_num = ?, is_active = ?
      WHERE id = ?
    `).run(
      title || '',
      subtitle || '',
      imageUrl || '',
      linkUrl || '',
      orderNum || 0,
      isActive ? 1 : 0,
      id
    );
    db.close();

    if (result.changes === 0) {
      return NextResponse.json({ success: false, message: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Updated successfully' });
  } catch (error) {
    console.error('Update banner error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update banner' }, { status: 500 });
  }
}

// DELETE - 删除轮播图（需要管理员权限）
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
    const result = db.prepare('DELETE FROM banners WHERE id = ?').run(Number(id));
    db.close();

    if (result.changes === 0) {
      return NextResponse.json({ success: false, message: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Delete banner error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete banner' }, { status: 500 });
  }
}
