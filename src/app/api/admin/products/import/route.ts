import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import * as XLSX from 'xlsx';
import { Readable } from 'stream';

// 定义Excel数据行的接口
interface ExcelMotorData {
  model: string;
  frameSize: string;
  power: number;
  voltage: number;
  current: number;
  rpm: number;
  efficiency: number;
  powerFactor: number;
  frequency: number;
  poles: number;
  ip: string;
  insulation: string;
  mounting: string;
  weight: number;
  connection: string;
  lockedRotorTorque: number;
  maxTorque: number;
  startingCurrent: number;
  noise: number;
  description: string;
  imageUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 验证是否为管理员
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // 验证JWT token
    const { verifyToken } = await import('@/lib/jwt');
    try {
      const decoded = verifyToken(token) as any;
      if (!decoded || decoded.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: '权限不足' },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: '无效的认证token' },
        { status: 401 }
      );
    }

    // 获取上传的文件
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '未选择文件' },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (
      file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      file.type !== 'application/vnd.ms-excel'
    ) {
      return NextResponse.json(
        { success: false, error: '请上传Excel文件' },
        { status: 400 }
      );
    }

    // 读取文件内容
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // 获取第一个工作表
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // 解析为JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Excel文件为空' },
        { status: 400 }
      );
    }

    // 验证并转换数据
    const motors: ExcelMotorData[] = [];
    const errors: string[] = [];

    jsonData.forEach((row: any, index: number) => {
      try {
        const motor: ExcelMotorData = {
          model: row['型号'] || row['model'] || '',
          frameSize: row['机座号'] || row['frameSize'] || '',
          power: parseFloat(row['功率'] || row['power'] || '0'),
          voltage: parseInt(row['电压'] || row['voltage'] || '0'),
          current: parseFloat(row['电流'] || row['current'] || '0'),
          rpm: parseInt(row['转速'] || row['rpm'] || '0'),
          efficiency: parseFloat(row['效率'] || row['efficiency'] || '0'),
          powerFactor: parseFloat(row['功率因数'] || row['powerFactor'] || '0'),
          frequency: parseInt(row['频率'] || row['frequency'] || '50'),
          poles: parseInt(row['极数'] || row['poles'] || '0'),
          ip: row['防护等级'] || row['ip'] || 'IP54',
          insulation: row['绝缘等级'] || row['insulation'] || 'F',
          mounting: row['安装方式'] || row['mounting'] || 'B3',
          weight: parseFloat(row['重量'] || row['weight'] || '0'),
          connection: row['接法'] || row['connection'] || 'Y',
          lockedRotorTorque: parseFloat(row['堵转转矩'] || row['lockedRotorTorque'] || '0'),
          maxTorque: parseFloat(row['最大转矩'] || row['maxTorque'] || '0'),
          startingCurrent: parseFloat(row['启动电流'] || row['startingCurrent'] || '0'),
          noise: parseFloat(row['噪声'] || row['noise'] || '0'),
          description: row['描述'] || row['description'] || '',
          imageUrl: row['图片'] || row['imageUrl'] || null,
        };

        // 基本验证
        if (!motor.model) {
          errors.push(`第${index + 2}行：型号不能为空`);
          return;
        }

        if (motor.power <= 0) {
          errors.push(`第${index + 2}行：功率必须大于0`);
          return;
        }

        if (motor.voltage <= 0) {
          errors.push(`第${index + 2}行：电压必须大于0`);
          return;
        }

        motors.push(motor);
      } catch (error) {
        errors.push(`第${index + 2}行：数据解析失败`);
      }
    });

    if (motors.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '没有有效的数据行',
          details: errors,
        },
        { status: 400 }
      );
    }

    // 批量插入数据库
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO motors (
        model, frameSize, power, voltage, current, rpm,
        efficiency, powerFactor, frequency, poles, ip,
        insulation, mounting, weight, connection,
        lockedRotorTorque, maxTorque, startingCurrent, noise,
        description, imageUrl
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let successCount = 0;
    let failCount = 0;

    motors.forEach(motor => {
      try {
        stmt.run(
          motor.model,
          motor.frameSize,
          motor.power,
          motor.voltage,
          motor.current,
          motor.rpm,
          motor.efficiency,
          motor.powerFactor,
          motor.frequency,
          motor.poles,
          motor.ip,
          motor.insulation,
          motor.mounting,
          motor.weight,
          motor.connection,
          motor.lockedRotorTorque,
          motor.maxTorque,
          motor.startingCurrent,
          motor.noise,
          motor.description,
          motor.imageUrl || null
        );
        successCount++;
      } catch (error) {
        failCount++;
        errors.push(`型号 ${motor.model} 插入失败：${error}`);
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        total: motors.length,
        success: successCount,
        failed: failCount,
        errors: errors,
      },
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '导入失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
