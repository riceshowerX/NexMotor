// test/api.test.js —— 后端冒烟测试（node:test + supertest）
// 使用独立临时测试库 backend/test/test.db，不触碰生产 motors.db
'use strict';

const path = require('path');
const fs = require('fs');
const test = require('node:test');
const assert = require('node:assert/strict');
const { before, after } = require('node:test');

// ==================== 环境变量（必须在 require 任何 src 模块之前设置） ====================
process.env.NODE_ENV = 'test';
process.env.DB_PATH = path.join(__dirname, 'test.db');
process.env.JWT_SECRET = 'test-secret-key-0123456789-abcdefghijklmnopqrstuvwxyz';
process.env.ADMIN_PASSWORD = 'TestAdminPass123!';
process.env.LOG_SQL = 'false';
process.env.PORT = '5999';

const request = require('supertest');
const { initializeDatabase, closeDatabase } = require('../src/models/db');
const { app } = require('../src/server');

const TEST_DB_PATH = path.join(__dirname, 'test.db');
let authToken = '';
let createdId = null;

// 清理残留测试库
function removeTestDb() {
  for (const suffix of ['', '-wal', '-shm']) {
    try {
      fs.rmSync(TEST_DB_PATH + suffix, { force: true });
    } catch (err) {
      // 忽略删除错误
    }
  }
}

before(async () => {
  removeTestDb();
  await initializeDatabase();
});

after(async () => {
  await closeDatabase();
  removeTestDb();
});

// ==================== 基础接口 ====================
test('GET /health 返回 200 且状态 ok', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
  assert.ok(res.body.timestamp);
});

test('helmet 安全响应头存在（X-Content-Type-Options）', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.headers['x-content-type-options'], 'nosniff');
  assert.ok(res.headers['x-frame-options']);
});

// ==================== 电机列表与筛选 ====================
test('GET /api/motors 返回 200 且 data 为数组', async () => {
  const res = await request(app).get('/api/motors');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(Array.isArray(res.body.data));
  assert.equal(res.body.total, res.body.data.length);
});

test('筛选参数生效：model=Y160M-4 只返回匹配项', async () => {
  const res = await request(app).get('/api/motors').query({ model: 'Y160M-4' });
  assert.equal(res.status, 200);
  assert.ok(res.body.data.length >= 1);
  for (const motor of res.body.data) {
    assert.ok(motor.model.includes('Y160M-4'));
  }
});

test('范围筛选生效：power_min=15 返回的电机功率均 >= 15', async () => {
  const res = await request(app).get('/api/motors').query({ power_min: 15 });
  assert.equal(res.status, 200);
  for (const motor of res.body.data) {
    assert.ok(motor.power >= 15);
  }
});

test('新补全筛选生效：mounting=IM B3 只返回安装方式匹配项', async () => {
  const res = await request(app).get('/api/motors').query({ mounting: 'IM B3' });
  assert.equal(res.status, 200);
  for (const motor of res.body.data) {
    assert.equal(motor.mounting, 'IM B3');
  }
});

// ==================== 非法参数 ====================
test('非法筛选参数 power_min=abc 返回 400', async () => {
  const res = await request(app).get('/api/motors').query({ power_min: 'abc' });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

test('负数范围参数 power_min=-5 返回 400', async () => {
  const res = await request(app).get('/api/motors').query({ power_min: -5 });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

// ==================== 认证 ====================
test('登录成功返回 token（使用 ADMIN_PASSWORD）', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: process.env.ADMIN_PASSWORD });
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.token);
  assert.equal(res.body.user.username, 'admin');
  authToken = res.body.token;
});

test('错误密码登录返回 401', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'wrong-password' });
  assert.equal(res.status, 401);
  assert.equal(res.body.success, false);
});

test('无 token 访问 POST /api/motors 返回 401', async () => {
  const res = await request(app)
    .post('/api/motors')
    .send({ model: 'TEST-NO-TOKEN', frameSize: 'X', power: 1, voltage: 380, rpm: 1000 });
  assert.equal(res.status, 401);
});

// ==================== CRUD 全流程 ====================
test('CRUD 流程：新增 → 查询 → 更新 → 删除', async () => {
  assert.ok(authToken, '前置登录应已取得 token');

  // 新增
  const createRes = await request(app)
    .post('/api/motors')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      model: 'TEST-MOTOR-001',
      frameSize: 'TEST',
      power: 22,
      voltage: 380,
      rpm: 1470,
      efficiency: 93.5,
      current: 42.3,
      powerFactor: 0.86,
      frequency: 50,
      poles: 4,
      ip: 'IP55',
      insulation: 'F',
      mounting: 'IM B3',
      weight: 180,
      connection: 'Y',
      noise: 74,
      description: '冒烟测试电机',
    });
  assert.equal(createRes.status, 201);
  assert.ok(createRes.body.data.id);
  createdId = createRes.body.data.id;

  // 查询（详情）
  const getRes = await request(app).get(`/api/motors/${createdId}`);
  assert.equal(getRes.status, 200);
  assert.equal(getRes.body.data.model, 'TEST-MOTOR-001');
  assert.equal(getRes.body.data.power, 22);

  // 更新
  const updateRes = await request(app)
    .put(`/api/motors/${createdId}`)
    .set('Authorization', `Bearer ${authToken}`)
    .send({ power: 25, description: '冒烟测试电机-已更新' });
  assert.equal(updateRes.status, 200);
  assert.equal(updateRes.body.success, true);

  // 验证更新生效
  const getUpdatedRes = await request(app).get(`/api/motors/${createdId}`);
  assert.equal(getUpdatedRes.status, 200);
  assert.equal(getUpdatedRes.body.data.power, 25);
  assert.equal(getUpdatedRes.body.data.description, '冒烟测试电机-已更新');

  // 重复型号新增 → 409
  const duplicateRes = await request(app)
    .post('/api/motors')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      model: 'TEST-MOTOR-001',
      frameSize: 'TEST',
      power: 11,
      voltage: 380,
      rpm: 1000,
    });
  assert.equal(duplicateRes.status, 409);

  // 删除
  const deleteRes = await request(app)
    .delete(`/api/motors/${createdId}`)
    .set('Authorization', `Bearer ${authToken}`);
  assert.equal(deleteRes.status, 200);
  assert.equal(deleteRes.body.success, true);

  // 验证已删除 → 404
  const getDeletedRes = await request(app).get(`/api/motors/${createdId}`);
  assert.equal(getDeletedRes.status, 404);
  createdId = null;
});

// ==================== 鉴权保护补充 ====================
test('无效 token 访问 PUT /api/motors 返回 403/401', async () => {
  const res = await request(app)
    .put('/api/motors/1')
    .set('Authorization', 'Bearer invalid-token-xyz')
    .send({ power: 30 });
  assert.ok(res.status === 401 || res.status === 403);
});
