import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { protect } from '../../middlewares/authMiddleware.js';
import User from '../../models/userModel.js';

describe('Auth Middleware', () => {
  let testUser;
  let validToken;

  beforeAll(async () => {
    // התחברות למסד נתונים לבדיקות
    const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/guessify_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // ניקוי ונתק מהמסד נתונים
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // ניקוי המשתמשים לפני כל בדיקה
    await User.deleteMany({});

    // יצירת משתמש לבדיקות
    testUser = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123'
    });
    await testUser.save();

    // יצירת טוקן תקין
    validToken = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '1h' }
    );
  });

  describe('protect middleware', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        headers: {},
        user: null
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
    });

    test('should authenticate user with valid Bearer token', async () => {
      req.headers.authorization = `Bearer ${validToken}`;

      await protect(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user._id.toString()).toBe(testUser._id.toString());
      expect(req.user.email).toBe(testUser.email);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should reject request without authorization header', async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, no token'
      });
      expect(next).not.toHaveBeenCalled();
      expect(req.user).toBeNull();
    });

    test('should reject request with invalid token format', async () => {
      req.headers.authorization = 'InvalidFormat token123';

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, no token'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject request with invalid token', async () => {
      req.headers.authorization = 'Bearer invalidtoken123';

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, token failed'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject request with expired token', async () => {
      const expiredToken = jwt.sign(
        { id: testUser._id },
        process.env.JWT_SECRET || 'testsecret',
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      req.headers.authorization = `Bearer ${expiredToken}`;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, token failed'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject request with token for non-existent user', async () => {
      // מחיקת המשתמש אחרי יצירת הטוקן
      await User.findByIdAndDelete(testUser._id);

      req.headers.authorization = `Bearer ${validToken}`;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, token failed'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should handle malformed JWT token', async () => {
      req.headers.authorization = 'Bearer malformed.jwt.token';

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, token failed'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should handle token with wrong secret', async () => {
      const wrongSecretToken = jwt.sign(
        { id: testUser._id },
        'wrongsecret',
        { expiresIn: '1h' }
      );

      req.headers.authorization = `Bearer ${wrongSecretToken}`;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, token failed'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should handle database connection error', async () => {
      // סגירת החיבור למסד הנתונים לסימולציה של שגיאה
      await mongoose.connection.close();

      req.headers.authorization = `Bearer ${validToken}`;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, token failed'
      });
      expect(next).not.toHaveBeenCalled();

      // חיבור מחדש למסד הנתונים
      const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/guessify_test';
      await mongoose.connect(mongoUri);
    });

    test('should work with different token formats', async () => {
      // בדיקה עם רווחים נוספים
      req.headers.authorization = `  Bearer   ${validToken}  `;

      await protect(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user._id.toString()).toBe(testUser._id.toString());
      expect(next).toHaveBeenCalled();
    });

    test('should preserve user data correctly', async () => {
      req.headers.authorization = `Bearer ${validToken}`;

      await protect(req, res, next);

      expect(req.user.firstName).toBe('Test');
      expect(req.user.lastName).toBe('User');
      expect(req.user.email).toBe('test@example.com');
      expect(req.user.password).toBeDefined(); // Password should be included
    });
  });
});
