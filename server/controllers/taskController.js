const Task = require('../models/Task');
const Project = require('../models/Project');

/**
 * @route   POST /api/tasks
 * @desc    Create a new task in a project (Admin only)
 * @access  Private/Admin
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo, status, dueDate } = req.body;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Verify user is the project creator
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project creator can create tasks',
      });
    }

    // If assignedTo, verify user is a member of the project
    if (assignedTo) {
      const isMember = project.members.some(
        (m) => m.toString() === assignedTo
      );
      if (!isMember) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user must be a member of the project',
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo: assignedTo || null,
      status: status || 'Todo',
      dueDate: dueDate || null,
    });

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task: populated },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/tasks/:projectId
 * @desc    Get all tasks for a project
 * @access  Private
 */
const getTasksByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Verify user is a member or creator
    const isMember = project.members.some(
      (m) => m.toString() === req.user._id.toString()
    );
    const isCreator = project.createdBy.toString() === req.user._id.toString();

    if (!isMember && !isCreator) {
      return res.status(403).json({
        success: false,
        message: 'Access denied — you are not a member of this project',
      });
    }

    // Get tasks with optional status filter
    const filter = { projectId };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/tasks/dashboard/stats
 * @desc    Get task statistics for the current user
 * @access  Private
 */
const getTaskStats = async (req, res, next) => {
  try {
    // Find all projects the user is part of
    const projects = await Project.find({
      $or: [{ createdBy: req.user._id }, { members: req.user._id }],
    });

    const projectIds = projects.map((p) => p._id);

    // Build filter based on role
    let taskFilter = { projectId: { $in: projectIds } };

    const [total, completed, inProgress, todo] = await Promise.all([
      Task.countDocuments(taskFilter),
      Task.countDocuments({ ...taskFilter, status: 'Completed' }),
      Task.countDocuments({ ...taskFilter, status: 'In Progress' }),
      Task.countDocuments({ ...taskFilter, status: 'Todo' }),
    ]);

    // Overdue: not completed + past due date
    const overdue = await Task.countDocuments({
      ...taskFilter,
      status: { $ne: 'Completed' },
      dueDate: { $lt: new Date(), $ne: null },
    });

    // Recent tasks
    const recentTasks = await Task.find(taskFilter)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        stats: { total, completed, inProgress, todo, overdue },
        recentTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task (Members can only update status)
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Verify user belongs to the project
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Associated project not found',
      });
    }

    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isMember = project.members.some(
      (m) => m.toString() === req.user._id.toString()
    );

    if (!isCreator && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Members can only update status of tasks assigned to them
    if (req.user.role === 'Member') {
      // Check if task is assigned to this member
      if (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only update tasks assigned to you',
        });
      }

      // Members can only update status
      const allowedFields = ['status'];
      const updateFields = Object.keys(req.body);
      const isValid = updateFields.every((field) => allowedFields.includes(field));

      if (!isValid) {
        return res.status(403).json({
          success: false,
          message: 'Members can only update task status',
        });
      }
    }

    // If assigning to someone, verify they're a project member
    if (req.body.assignedTo) {
      const isAssigneeMember = project.members.some(
        (m) => m.toString() === req.body.assignedTo
      );
      if (!isAssigneeMember) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user must be a member of the project',
        });
      }
    }

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task: updatedTask },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task (Admin only)
 * @access  Private/Admin
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Verify user is the project creator
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Associated project not found',
      });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project creator can delete tasks',
      });
    }

    await Task.findByIdAndDelete(task._id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getTaskStats,
  updateTask,
  deleteTask,
};
