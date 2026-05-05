const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

/**
 * @route   POST /api/projects
 * @desc    Create a new project (Admin only)
 * @access  Private/Admin
 */
const createProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members: [req.user._id], // Admin is also a member
    });

    // Add project to admin's projects array
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { projects: project._id },
    });

    const populated = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project: populated },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/projects
 * @desc    Get all projects for current user
 * @access  Private
 */
const getProjects = async (req, res, next) => {
  try {
    // Return projects where user is creator OR member
    const projects = await Project.find({
      $or: [{ createdBy: req.user._id }, { members: req.user._id }],
    })
      .populate('createdBy', 'name email')
      .populate('members', 'name email role')
      .sort({ createdAt: -1 });

    // Attach task counts to each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({ projectId: project._id });
        const completedCount = await Task.countDocuments({
          projectId: project._id,
          status: 'Completed',
        });
        return {
          ...project.toJSON(),
          taskCount,
          completedCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: projectsWithCounts.length,
      data: { projects: projectsWithCounts },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project by ID
 * @access  Private
 */
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email role');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is a member or creator
    const isMember = project.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    const isCreator = project.createdBy._id.toString() === req.user._id.toString();

    if (!isMember && !isCreator) {
      return res.status(403).json({
        success: false,
        message: 'Access denied — you are not a member of this project',
      });
    }

    res.status(200).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project and its tasks (Admin only)
 * @access  Private/Admin
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Only the creator (Admin) can delete
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project creator can delete this project',
      });
    }

    // Remove project from all members' projects arrays
    await User.updateMany(
      { projects: project._id },
      { $pull: { projects: project._id } }
    );

    // Delete all tasks associated with this project
    await Task.deleteMany({ projectId: project._id });

    // Delete the project
    await Project.findByIdAndDelete(project._id);

    res.status(200).json({
      success: true,
      message: 'Project and associated tasks deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/projects/:id/add-member
 * @desc    Add a member to a project (Admin only)
 * @access  Private/Admin
 */
const addMember = async (req, res, next) => {
  try {
    const { email } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Only the creator can add members
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project creator can add members',
      });
    }

    // Find user by email
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: 'User not found with that email',
      });
    }

    // Check if already a member
    const alreadyMember = project.members.some(
      (m) => m.toString() === userToAdd._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this project',
      });
    }

    // Add member to project
    project.members.push(userToAdd._id);
    await project.save();

    // Add project to user's projects array
    await User.findByIdAndUpdate(userToAdd._id, {
      $addToSet: { projects: project._id },
    });

    const updated = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email role');

    res.status(200).json({
      success: true,
      message: `${userToAdd.name} added to the project`,
      data: { project: updated },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/projects/:id/remove-member
 * @desc    Remove a member from a project (Admin only)
 * @access  Private/Admin
 */
const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Only the creator can remove members
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project creator can remove members',
      });
    }

    // Can't remove the creator
    if (userId === project.createdBy.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove the project creator',
      });
    }

    // Remove member from project
    project.members = project.members.filter(
      (m) => m.toString() !== userId
    );
    await project.save();

    // Remove project from user's projects array
    await User.findByIdAndUpdate(userId, {
      $pull: { projects: project._id },
    });

    // Unassign any tasks assigned to this user in the project
    await Task.updateMany(
      { projectId: project._id, assignedTo: userId },
      { assignedTo: null }
    );

    const updated = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Member removed from project',
      data: { project: updated },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  deleteProject,
  addMember,
  removeMember,
};
