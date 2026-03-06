import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// GET - 获取所有系统配置（管理员）或公开配置
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get('public') === 'true';

    const db = getDb();

    if (isPublic) {
      // 获取公开配置（不需要管理员权限）
      const publicConfigs = db.prepare(`
        SELECT * FROM system_config
        WHERE key IN ('site_title', 'site_description', 'contact_email', 'contact_phone', 'contact_address', 'company_name')
      `).all();
      db.close();

      return NextResponse.json({ success: true, data: publicConfigs });
    } else {
      // 获取所有配置（需要管理员权限）
      const user = requireAdmin(request);
      if (!user) {
        return NextResponse.json({ success: false, message: '需要管理员权限' }, { status: 403 });
      }

      const configs = db.prepare('SELECT * FROM system_config ORDER BY key').all();
      db.close();

      return NextResponse.json({ success: true, data: configs });
    }
  } catch (error) {
    console.error('获取系统配置失败:', error);
    return NextResponse.json({ success: false, message: '获取系统配置失败' }, { status: 500 });
  }
}

// POST - 更新系统配置（需要管理员权限）
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '需要管理员权限' }, { status: 403 });
    }

    const body = await request.json();

    const db = getDb();

    // 遍历所有键值对，批量更新或插入配置
    for (const [key, value] of Object.entries(body)) {
      const existing = db.prepare('SELECT id FROM system_config WHERE key = ?').get(key);

      if (existing) {
        // Update existing config
        db.prepare('UPDATE system_config SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?').run(value, key);
      } else {
        // Insert new config
        db.prepare('INSERT INTO system_config (key, value, is_public) VALUES (?, ?, 1)').run(key, value);
      }
    }

    db.close();

    return NextResponse.json({ success: true, message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Update system config error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update system configuration' }, { status: 500 });
  }
}
