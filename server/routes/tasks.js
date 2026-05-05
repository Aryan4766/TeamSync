const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  getTaskStats,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const {
  createTaskRules,
  updateTaskRules,
  mongoIdParam,
  projectIdParam,
  validate,
} = require('../validators');

// Dashboard stats (must be before /:id routes)
router.get('/dashboard/stats', protect, getTaskStats);

// Tasks by project
router.get('/:projectId', protect, projectIdParam, validate, getTasksByProject);

// Create task
router.post(
  '/',
  protect,
  requireRole('Admin'),
  createTaskRules,
  validate,
  createTask
);

// Update task
router.put('/:id', protect, mongoIdParam, updateTaskRules, validate, updateTask);

// Delete task
router.delete(
  '/:id',
  protect,
  requireRole('Admin'),
  mongoIdParam,
  validate,
  deleteTask
);

module.exports = router;
