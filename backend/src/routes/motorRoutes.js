// routes/motors.js（生产终极版）
const express = require('express');
const router = express.Router();
const motorController = require('../controllers/motorController');
const { authenticateToken } = require('../middleware/auth'); // 推荐统一用这个名字

/**
 * @route   GET /api/motors
 * @desc    获取电机列表（公开接口，支持筛选）
 * @access  Public
 */
router.get('/', motorController.getMotors);

/**
 * @route   GET /api/motors/:id
 * @desc    获取单个电机详情（公开接口）
 * @access  Public
 */
router.get('/:id', motorController.getMotorById);

/**
 * @route   POST /api/motors
 * @desc    添加新电机
 * @access  Private（需登录）
 */
router.post('/', authenticateToken, motorController.addMotor);

/**
 * @route   PUT /api/motors/:id
 * @desc    更新电机信息（支持部分更新）
 * @access  Private（需登录）
 */
router.put('/:id', authenticateToken, motorController.updateMotor);

/**
 * @route   DELETE /api/motors/:id
 * @desc    删除电机
 * @access  Private（需登录）
 */
router.delete('/:id', authenticateToken, motorController.deleteMotor);

module.exports = router;