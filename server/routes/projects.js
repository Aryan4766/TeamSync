const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const {
  createProjectRules,
  addMemberRules,
  mongoIdParam,
  validate,
} = require('../validators');

router
  .route('/')
  .get(protect, getProjects)
  .post(protect, requireRole('Admin'), createProjectRules, validate, createProject);

router
  .route('/:id')
  .get(protect, mongoIdParam, validate, getProject)
  .delete(protect, requireRole('Admin'), mongoIdParam, validate, deleteProject);

router.put(
  '/:id/add-member',
  protect,
  requireRole('Admin'),
  mongoIdParam,
  addMemberRules,
  validate,
  addMember
);

router.put(
  '/:id/remove-member',
  protect,
  requireRole('Admin'),
  mongoIdParam,
  validate,
  removeMember
);

module.exports = router;
