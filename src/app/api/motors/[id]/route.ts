// 单个电机的 API
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const motor = db.prepare('SELECT * FROM motors WHERE id = ?').get(Number(id)) as any;
    db.close();

    if (!motor) {
      return NextResponse.json(
        { success: false, message: '电机不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: motor
    });
  } catch (error) {
    console.error('Get motor error:', error);
    return NextResponse.json(
      { success: false, message: '获取电机详情失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    const setClauses: string[] = [];
    const values: any[] = [];

    const allowedFields = [
      'model', 'frameSize', 'power', 'voltage', 'current', 'rpm', 'efficiency',
      'powerFactor', 'frequency', 'poles', 'ip', 'insulation', 'mounting',
      'weight', 'connection', 'lockedRotorTorque', 'maxTorque',
      'startingCurrent', 'noise', 'description', 'imageUrl'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined && body[field] !== null) {
        setClauses.push(`${field} = ?`);
        values.push(body[field]);
      }
    });

    if (setClauses.length === 0) {
      db.close();
      return NextResponse.json(
        { success: false, message: '没有提供任何更新数据' },
        { status: 400 }
      );
    }

    values.push(Number(id));
    const sql = `UPDATE motors SET ${setClauses.join(', ')} WHERE id = ?`;
    const result = db.prepare(sql).run(...values);
    db.close();

    return NextResponse.json({
      success: true,
      changes: result.changes
    });
  } catch (error) {
    console.error('Update motor error:', error);
    return NextResponse.json(
      { success: false, message: '更新电机失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const result = db.prepare('DELETE FROM motors WHERE id = ?').run(Number(id));
    db.close();

    return NextResponse.json({
      success: true,
      changes: result.changes
    });
  } catch (error) {
    console.error('Delete motor error:', error);
    return NextResponse.json(
      { success: false, message: '删除电机失败' },
      { status: 500 }
    );
  }
}
