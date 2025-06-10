require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const teamRoutes = require('./routes/teamRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/team', teamRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB connected');
    const User = require('./models/User');
    const bcrypt = require('bcrypt');

    const adminEmail = 'admin@tracker.com';
    const adminPassword = 'Admin123';

    async function ensureAdminUser() {
      const existingAdmin = await User.findOne({ email: adminEmail });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await User.create({
          email: adminEmail,
          password: adminPassword,
          role: 'Admin',
        });
        console.log('✅ Admin user created');
      } else {
        console.log('ℹ️ Admin already exists, skipping creation.');
      }
    }

    ensureAdminUser().then(() => {
      app.listen(5000, () => console.log(' Server running on http://localhost:5000'));
    }).catch(err => {
      console.error('Error ensuring admin user:', err);
    });
  })
  .catch(err => console.error(' MongoDB Connection Error:', err));
