import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    // 获取公开配置信息
    const db = getDb();
    const configs = db
      .prepare(`
        SELECT key, value
        FROM system_config
        WHERE key IN (
          'site_title',
          'site_description',
          'contact_email',
          'contact_phone',
          'contact_address',
          'company_name',
          'address',
          'working_hours',
          'website_url',
          'linkedin_url',
          'twitter_url',
          'facebook_url',
          'instagram_url',
          'site_name'
        )
      `)
      .all() as { key: string; value: string }[];

    // 转换为对象
    const config: Record<string, any> = {};
    configs.forEach((item) => {
      config[item.key] = item.value;
    });

    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error('获取公开配置失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取配置失败',
      },
      { status: 500 }
    );
  }
}
