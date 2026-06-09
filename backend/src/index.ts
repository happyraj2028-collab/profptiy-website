import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Controllers
import * as authController from './controllers/auth';
import * as propertyController from './controllers/properties';
import * as inquiryController from './controllers/inquiries';
import * as blogController from './controllers/blogs';
import * as testimonialController from './controllers/testimonials';
import * as settingController from './controllers/settings';
import * as analyticsController from './controllers/analytics';
import * as userController from './controllers/users';
import * as notificationController from './controllers/notifications';

// Middleware
import { authenticateJWT, requireAdmin } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware: Helmet (headers protection)
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows cross-origin image loads
}));

// Global Rate Limiting: General requests limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 300, // Limit each IP to 300 requests per windowMs
  message: { message: 'Too many requests from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);

// Brute-force limiters on sensitive Auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 30, // Limit each IP to 30 authentication attempts per window
  message: { message: 'Too many authentication attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Public API Status Route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Luxury Real Estate API is running securely' });
});

// Authentication Routes
app.post('/api/auth/register', authController.register); 
app.post('/api/auth/login', authLimiter as any, authController.login);
app.get('/api/auth/me', authenticateJWT as any, authController.getMe as any);
app.post('/api/auth/forgot-password', authLimiter as any, authController.forgotPassword);
app.post('/api/auth/reset-password', authLimiter as any, authController.resetPassword);

// User Management (Admin Only)
app.get('/api/users', authenticateJWT as any, requireAdmin as any, userController.getUsers as any);
app.post('/api/users', authenticateJWT as any, requireAdmin as any, userController.createUser as any);
app.put('/api/users/:id', authenticateJWT as any, requireAdmin as any, userController.updateUser as any);
app.delete('/api/users/:id', authenticateJWT as any, requireAdmin as any, userController.deleteUser as any);

// Notifications Registry (Admin Only)
app.get('/api/notifications', authenticateJWT as any, notificationController.getNotifications as any);
app.put('/api/notifications/:id/read', authenticateJWT as any, notificationController.markNotificationRead as any);
app.put('/api/notifications/read-all', authenticateJWT as any, notificationController.markAllNotificationsRead as any);
app.delete('/api/notifications/:id', authenticateJWT as any, notificationController.deleteNotification as any);

// Property Routes
app.get('/api/properties', propertyController.getProperties);
app.get('/api/properties/:id', propertyController.getPropertyById);
app.post('/api/properties', authenticateJWT as any, propertyController.createProperty as any);
app.put('/api/properties/:id', authenticateJWT as any, propertyController.updateProperty as any);
app.delete('/api/properties/:id', authenticateJWT as any, propertyController.deleteProperty as any);

// Inquiry Routes
app.post('/api/inquiries', inquiryController.createInquiry);
app.get('/api/inquiries', authenticateJWT as any, inquiryController.getInquiries as any);
app.put('/api/inquiries/:id/status', authenticateJWT as any, inquiryController.updateInquiryStatus as any);
app.delete('/api/inquiries/:id', authenticateJWT as any, inquiryController.deleteInquiry as any);

// Blog Routes
app.get('/api/blogs', blogController.getBlogs);
app.get('/api/blogs/:slug', blogController.getBlogBySlug);
app.post('/api/blogs', authenticateJWT as any, blogController.createBlog as any);
app.put('/api/blogs/:id', authenticateJWT as any, blogController.updateBlog as any);
app.delete('/api/blogs/:id', authenticateJWT as any, blogController.deleteBlog as any);

// Testimonial Routes
app.get('/api/testimonials', testimonialController.getTestimonials);
app.post('/api/testimonials', testimonialController.createTestimonial);
app.put('/api/testimonials/:id', authenticateJWT as any, testimonialController.updateTestimonial as any); // Direct edit
app.put('/api/testimonials/:id/approve', authenticateJWT as any, testimonialController.toggleApproveTestimonial as any);
app.delete('/api/testimonials/:id', authenticateJWT as any, testimonialController.deleteTestimonial as any);

// Settings Routes
app.get('/api/settings', settingController.getSettings);
app.post('/api/settings', authenticateJWT as any, requireAdmin as any, settingController.updateSetting as any);
app.post('/api/settings/bulk', authenticateJWT as any, requireAdmin as any, settingController.bulkUpdateSettings as any);

// Analytics Routes (Admin Only)
app.get('/api/analytics/dashboard', authenticateJWT as any, requireAdmin as any, analyticsController.getDashboardAnalytics as any);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Server Error:', err);
  res.status(500).json({
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Secure Luxury Real Estate Backend Server running on port ${PORT}`);
});
