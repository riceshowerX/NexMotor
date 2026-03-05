import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// GET - 获取统计数据（需要管理员权限）
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = requireAdmin(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '需要管理员权限' }, { status: 403 });
    }

    const db = getDb();

    // 产品统计
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM motors').get() as { count: number };
    const productsByFrameSize = db.prepare(`
      SELECT frameSize, COUNT(*) as count
      FROM motors
      GROUP BY frameSize
      ORDER BY count DESC
    `).all();

    const productsByPower = db.prepare(`
      SELECT
        CASE
          WHEN power < 1 THEN '<1kW'
          WHEN power < 3 THEN '1-3kW'
          WHEN power < 7.5 THEN '3-7.5kW'
          WHEN power < 15 THEN '7.5-15kW'
          ELSE '>15kW'
        END as range,
        COUNT(*) as count
      FROM motors
      GROUP BY range
      ORDER BY MIN(power)
    `).all();

    // 留言统计
    const totalMessages = db.prepare('SELECT COUNT(*) as count FROM messages').get() as { count: number };
    const unreadMessages = db.prepare("SELECT COUNT(*) as count FROM messages WHERE status = 'unread'").get() as { count: number };
    const messagesByStatus = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM messages
      GROUP BY status
    `).all();

    // 用户统计
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    const usersByRole = db.prepare(`
      SELECT role, COUNT(*) as count
      FROM users
      GROUP BY role
    `).all();

    // 最近7天留言趋势
    const messageTrend = db.prepare(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as count
      FROM messages
      WHERE created_at >= datetime('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date
    `).all();

    // 最近添加的产品
    const recentProducts = db.prepare(`
      SELECT * FROM motors
      ORDER BY id DESC
      LIMIT 5
    `).all();

    // 最近留言
    const recentMessages = db.prepare(`
      SELECT * FROM messages
      ORDER BY created_at DESC
      LIMIT 5
    `).all();

    db.close();

    return NextResponse.json({
      success: true,
      data: {
        products: {
          total: totalProducts.count,
          byFrameSize: productsByFrameSize,
          byPower: productsByPower,
          recent: recentProducts,
        },
        messages: {
          total: totalMessages.count,
          unread: unreadMessages.count,
          byStatus: messagesByStatus,
          recent: recentMessages,
          trend: messageTrend,
        },
        users: {
          total: totalUsers.count,
          byRole: usersByRole,
        },
      },
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return NextResponse.json({ success: false, message: '获取统计数据失败' }, { status: 500 });
  }
}
