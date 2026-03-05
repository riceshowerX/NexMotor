import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// GET - 获取所有留言（需要管理员权限）
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = requireAdmin(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '需要管理员权限' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const db = getDb();

    // 构建查询条件
    let whereClause = '1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    // 获取总数
    const countResult = db.prepare(`SELECT COUNT(*) as count FROM messages WHERE ${whereClause}`).get(...params) as { count: number };
    const total = countResult.count;

    // 获取留言列表
    const messages = db.prepare(`
      SELECT * FROM messages
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, pageSize, (page - 1) * pageSize);

    db.close();

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('获取留言列表失败:', error);
    return NextResponse.json({ success: false, message: '获取留言列表失败' }, { status: 500 });
  }
}

// POST - 创建留言（公开）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, subject, message } = body;

    // 验证必填字段
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, message: '请填写必填字段' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO messages (name, email, phone, company, subject, content, status)
      VALUES (?, ?, ?, ?, ?, ?, 'unread')
    `).run(name, email, phone || '', company || '', subject, message);

    db.close();

    return NextResponse.json({
      success: true,
      data: { id: result.lastInsertRowid },
      message: '留言提交成功，我们会尽快回复您！',
    });
  } catch (error) {
    console.error('提交留言失败:', error);
    return NextResponse.json({ success: false, message: '提交留言失败' }, { status: 500 });
  }
}
