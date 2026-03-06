import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();

    // 获取所有电机数据
    const motors = db.prepare(`
      SELECT * FROM motors
      ORDER BY power, rpm
    `).all();

    return NextResponse.json({
      success: true,
      data: motors,
    });
  } catch (error) {
    console.error('Error fetching motors:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch motors',
      },
      { status: 500 }
    );
  }
}
