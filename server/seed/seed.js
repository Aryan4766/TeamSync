const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'Admin',
    });

    const member1 = await User.create({
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'password123',
      role: 'Member',
    });

    const member2 = await User.create({
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'password123',
      role: 'Member',
    });

    console.log('Created users');

    // Create projects
    const project1 = await Project.create({
      title: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern design',
      createdBy: admin._id,
      members: [admin._id, member1._id, member2._id],
    });

    const project2 = await Project.create({
      title: 'Mobile App MVP',
      description: 'Build the first version of our mobile application',
      createdBy: admin._id,
      members: [admin._id, member1._id],
    });

    // Update users with project references
    admin.projects = [project1._id, project2._id];
    await admin.save();
    member1.projects = [project1._id, project2._id];
    await member1.save();
    member2.projects = [project1._id];
    await member2.save();

    console.log('Created projects');

    // Create tasks
    const now = new Date();
    const pastDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const futureDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const farFuture = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    await Task.create([
      {
        title: 'Design homepage mockup',
        description: 'Create wireframes and high-fidelity mockups for the homepage',
        projectId: project1._id,
        assignedTo: member1._id,
        status: 'Completed',
        dueDate: pastDate,
      },
      {
        title: 'Implement navigation bar',
        description: 'Build responsive navigation with dropdown menus',
        projectId: project1._id,
        assignedTo: member2._id,
        status: 'In Progress',
        dueDate: futureDate,
      },
      {
        title: 'Set up CI/CD pipeline',
        description: 'Configure automated testing and deployment',
        projectId: project1._id,
        assignedTo: member1._id,
        status: 'Todo',
        dueDate: pastDate, // Overdue!
      },
      {
        title: 'Write API documentation',
        description: 'Document all REST endpoints',
        projectId: project1._id,
        assignedTo: null,
        status: 'Todo',
        dueDate: farFuture,
      },
      {
        title: 'Set up React Native project',
        description: 'Initialize the mobile app with proper structure',
        projectId: project2._id,
        assignedTo: member1._id,
        status: 'Completed',
        dueDate: pastDate,
      },
      {
        title: 'Design login screen',
        description: 'Create mobile login UI with form validation',
        projectId: project2._id,
        assignedTo: member1._id,
        status: 'In Progress',
        dueDate: futureDate,
      },
    ]);

    console.log('Created tasks');
    console.log('\n✅ Seed data created successfully!');
    console.log('\nTest Accounts:');
    console.log('  Admin: admin@example.com / password123');
    console.log('  Member: alice@example.com / password123');
    console.log('  Member: bob@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
