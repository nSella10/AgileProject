import mongoose from 'mongoose';
import User from '../../models/userModel.js';

describe('User Model', () => {
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
  });

  describe('User Creation', () => {
    test('should create a new user with valid data', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.firstName).toBe(userData.firstName);
      expect(savedUser.lastName).toBe(userData.lastName);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).not.toBe(userData.password); // Should be hashed
    });

    test('should require firstName', async () => {
      const userData = {
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    test('should require lastName', async () => {
      const userData = {
        firstName: 'John',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    test('should require email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    test('should require password', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    test('should enforce unique email', async () => {
      const userData1 = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const userData2 = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'john.doe@example.com', // Same email
        password: 'password456'
      };

      const user1 = new User(userData1);
      await user1.save();

      const user2 = new User(userData2);
      await expect(user2.save()).rejects.toThrow();
    });
  });

  describe('Password Hashing', () => {
    test('should hash password before saving', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      await user.save();

      expect(user.password).not.toBe('password123');
      expect(user.password.length).toBeGreaterThan(20); // Hashed passwords are longer
    });

    test('should not rehash password if not modified', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      await user.save();
      const originalHash = user.password;

      // Update other field
      user.firstName = 'Johnny';
      await user.save();

      expect(user.password).toBe(originalHash);
    });
  });

  describe('matchPassword Method', () => {
    test('should return true for correct password', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      await user.save();

      const isMatch = await user.matchPassword('password123');
      expect(isMatch).toBe(true);
    });

    test('should return false for incorrect password', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      await user.save();

      const isMatch = await user.matchPassword('wrongpassword');
      expect(isMatch).toBe(false);
    });

    test('should handle empty password', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      await user.save();

      const isMatch = await user.matchPassword('');
      expect(isMatch).toBe(false);
    });
  });
});
