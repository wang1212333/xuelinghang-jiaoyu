import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import tutorRoutes from './routes/tutors.js';
import courseRoutes from './routes/courses.js';
import requirementRoutes from './routes/requirements.js';
import messageRoutes from './routes/messages.js';
import appointmentRoutes from './routes/appointments.js';
import favoriteRoutes from './routes/favorites.js';
import enrollmentRoutes from './routes/enrollments.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Mojin Academy API running on port ${PORT}`);
});