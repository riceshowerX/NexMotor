// 获取电机列表 API
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { MotorFilters } from '@/types/motor';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: MotorFilters = {
      model: searchParams.get('model') || undefined,
      frameSize: searchParams.get('frameSize') || undefined,
      power_min: searchParams.get('power_min') ? Number(searchParams.get('power_min')) : undefined,
      power_max: searchParams.get('power_max') ? Number(searchParams.get('power_max')) : undefined,
      voltage: searchParams.get('voltage') ? Number(searchParams.get('voltage')) : undefined,
      rpm_min: searchParams.get('rpm_min') ? Number(searchParams.get('rpm_min')) : undefined,
      rpm_max: searchParams.get('rpm_max') ? Number(searchParams.get('rpm_max')) : undefined,
      efficiency_min: searchParams.get('efficiency_min') ? Number(searchParams.get('efficiency_min')) : undefined,
      efficiency_max: searchParams.get('efficiency_max') ? Number(searchParams.get('efficiency_max')) : undefined,
      poles: searchParams.get('poles') ? Number(searchParams.get('poles')) : undefined,
      ip: searchParams.get('ip') || undefined,
      insulation: searchParams.get('insulation') || undefined,
      frequency: searchParams.get('frequency') ? Number(searchParams.get('frequency')) : undefined,
      description: searchParams.get('description') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || undefined
    };

    const db = getDb();
    let query = 'SELECT * FROM motors WHERE 1=1';
    const params: any[] = [];

    // 添加筛选条件
    if (filters.model) {
      query += ' AND model LIKE ?';
      params.push(`%${filters.model}%`);
    }

    if (filters.frameSize) {
      query += ' AND frameSize = ?';
      params.push(filters.frameSize);
    }

    if (filters.power_min !== undefined) {
      query += ' AND power >= ?';
      params.push(filters.power_min);
    }

    if (filters.power_max !== undefined) {
      query += ' AND power <= ?';
      params.push(filters.power_max);
    }

    if (filters.voltage !== undefined) {
      query += ' AND voltage = ?';
      params.push(filters.voltage);
    }

    if (filters.rpm_min !== undefined) {
      query += ' AND rpm >= ?';
      params.push(filters.rpm_min);
    }

    if (filters.rpm_max !== undefined) {
      query += ' AND rpm <= ?';
      params.push(filters.rpm_max);
    }

    if (filters.efficiency_min !== undefined) {
      query += ' AND efficiency >= ?';
      params.push(filters.efficiency_min);
    }

    if (filters.efficiency_max !== undefined) {
      query += ' AND efficiency <= ?';
      params.push(filters.efficiency_max);
    }

    if (filters.poles !== undefined) {
      query += ' AND poles = ?';
      params.push(filters.poles);
    }

    if (filters.ip) {
      query += ' AND ip = ?';
      params.push(filters.ip);
    }

    if (filters.insulation) {
      query += ' AND insulation = ?';
      params.push(filters.insulation);
    }

    if (filters.frequency !== undefined) {
      query += ' AND frequency = ?';
      params.push(filters.frequency);
    }

    if (filters.description) {
      query += ' AND description LIKE ?';
      params.push(`%${filters.description}%`);
    }

    // 排序
    const sortOptions: Record<string, string> = {
      power_asc: 'power ASC',
      power_desc: 'power DESC',
      rpm_asc: 'rpm ASC',
      rpm_desc: 'rpm DESC',
      efficiency_desc: 'efficiency DESC'
    };

    query += ` ORDER BY ${sortOptions[filters.sortBy || ''] || 'model ASC'}`;

    const motors = db.prepare(query).all(...params) as any[];
    db.close();

    return NextResponse.json({
      success: true,
      data: motors,
      count: motors.length
    });
  } catch (error) {
    console.error('Get motors error:', error);
    return NextResponse.json(
      { success: false, message: '获取电机列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    const fields: string[] = [];
    const placeholders: string[] = [];
    const values: any[] = [];

    const allFields = [
      'model', 'frameSize', 'power', 'voltage', 'current', 'rpm', 'efficiency',
      'powerFactor', 'frequency', 'poles', 'ip', 'insulation', 'mounting',
      'weight', 'connection', 'lockedRotorTorque', 'maxTorque',
      'startingCurrent', 'noise', 'description', 'imageUrl'
    ];

    allFields.forEach(field => {
      if (body[field] !== undefined && body[field] !== null) {
        fields.push(field);
        placeholders.push('?');
        values.push(body[field]);
      }
    });

    if (fields.length === 0) {
      db.close();
      return NextResponse.json(
        { success: false, message: '没有提供任何数据' },
        { status: 400 }
      );
    }

    const sql = `INSERT INTO motors (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;
    const result = db.prepare(sql).run(...values);
    db.close();

    return NextResponse.json({
      success: true,
      data: { id: result.lastInsertRowid, ...body }
    });
  } catch (error) {
    console.error('Create motor error:', error);
    return NextResponse.json(
      { success: false, message: '创建电机失败' },
      { status: 500 }
    );
  }
}
