import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Game from '../../models/Game.js';
import User from '../../models/userModel.js';
import gameRoutes from '../../routes/gameRoutes.js';
import { protect } from '../../middlewares/authMiddleware.js';

// יצירת אפליקציה לבדיקות
const app = express();
app.use(express.json());
app.use('/api/games', gameRoutes);

describe('Game Controller', () => {
  let testUser;
  let authToken;

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
    // ניקוי המסד נתונים לפני כל בדיקה
    await Game.deleteMany({});
    await User.deleteMany({});

    // יצירת משתמש לבדיקות
    testUser = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123'
    });
    await testUser.save();

    // יצירת טוקן אימות
    authToken = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/games', () => {
    test('should create a new game with valid data', async () => {
      const gameData = {
        title: 'Test Game',
        description: 'A test game',
        songs: [
          {
            title: 'Test Song',
            artist: 'Test Artist',
            correctAnswer: 'Test Song',
            correctAnswers: ['Test Song'],
            previewUrl: 'https://example.com/preview.mp3',
            artworkUrl: 'https://example.com/artwork.jpg'
          }
        ],
        isPublic: true,
        guessTimeLimit: 30,
        guessInputMethod: 'freeText'
      };

      const response = await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send(gameData)
        .expect(201);

      expect(response.body.title).toBe(gameData.title);
      expect(response.body.description).toBe(gameData.description);
      expect(response.body.songs).toHaveLength(1);
      expect(response.body.isPublic).toBe(true);
      expect(response.body.guessTimeLimit).toBe(30);
      expect(response.body.guessInputMethod).toBe('freeText');
    });

    test('should require authentication', async () => {
      const gameData = {
        title: 'Test Game',
        songs: []
      };

      await request(app)
        .post('/api/games')
        .send(gameData)
        .expect(401);
    });

    test('should require title', async () => {
      const gameData = {
        songs: []
      };

      await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send(gameData)
        .expect(400);
    });

    test('should require at least one song', async () => {
      const gameData = {
        title: 'Test Game',
        songs: []
      };

      await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send(gameData)
        .expect(400);
    });

    test('should set default values for optional fields', async () => {
      const gameData = {
        title: 'Test Game',
        songs: [
          {
            title: 'Test Song',
            artist: 'Test Artist',
            correctAnswer: 'Test Song'
          }
        ]
      };

      const response = await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send(gameData)
        .expect(201);

      expect(response.body.guessTimeLimit).toBe(15); // Default value
      expect(response.body.guessInputMethod).toBe('freeText'); // Default value
      expect(response.body.isPublic).toBe(false); // Default value
    });

    test('should validate guessTimeLimit values', async () => {
      const gameData = {
        title: 'Test Game',
        songs: [
          {
            title: 'Test Song',
            artist: 'Test Artist',
            correctAnswer: 'Test Song'
          }
        ],
        guessTimeLimit: 25 // Invalid value
      };

      const response = await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send(gameData)
        .expect(201);

      // Should use default value instead of invalid value
      expect(response.body.guessTimeLimit).toBe(15);
    });
  });

  describe('GET /api/games', () => {
    beforeEach(async () => {
      // יצירת משחקים לבדיקה
      await Game.create({
        title: 'Public Game',
        createdBy: testUser._id,
        songs: [],
        isPublic: true
      });

      await Game.create({
        title: 'Private Game',
        createdBy: testUser._id,
        songs: [],
        isPublic: false
      });

      // יצירת משתמש אחר ומשחק שלו
      const otherUser = new User({
        firstName: 'Other',
        lastName: 'User',
        email: 'other@example.com',
        password: 'password123'
      });
      await otherUser.save();

      await Game.create({
        title: 'Other User Game',
        createdBy: otherUser._id,
        songs: [],
        isPublic: true
      });
    });

    test('should get all public games', async () => {
      const response = await request(app)
        .get('/api/games')
        .expect(200);

      expect(response.body).toHaveLength(2); // 2 public games
      expect(response.body.every(game => game.isPublic)).toBe(true);
    });

    test('should get user games when authenticated', async () => {
      const response = await request(app)
        .get('/api/games/my')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2); // User's games (public + private)
      expect(response.body.every(game => game.createdBy === testUser._id.toString())).toBe(true);
    });
  });

  describe('GET /api/games/:id', () => {
    let testGame;

    beforeEach(async () => {
      testGame = await Game.create({
        title: 'Test Game',
        createdBy: testUser._id,
        songs: [
          {
            title: 'Test Song',
            artist: 'Test Artist',
            correctAnswer: 'Test Song'
          }
        ],
        isPublic: true
      });
    });

    test('should get game by id', async () => {
      const response = await request(app)
        .get(`/api/games/${testGame._id}`)
        .expect(200);

      expect(response.body._id).toBe(testGame._id.toString());
      expect(response.body.title).toBe('Test Game');
    });

    test('should return 404 for non-existent game', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .get(`/api/games/${fakeId}`)
        .expect(404);
    });

    test('should return 400 for invalid game id', async () => {
      await request(app)
        .get('/api/games/invalid-id')
        .expect(400);
    });
  });

  describe('PUT /api/games/:id', () => {
    let testGame;

    beforeEach(async () => {
      testGame = await Game.create({
        title: 'Test Game',
        createdBy: testUser._id,
        songs: [],
        isPublic: false
      });
    });

    test('should update game when user is owner', async () => {
      const updateData = {
        title: 'Updated Game',
        description: 'Updated description',
        isPublic: true
      };

      const response = await request(app)
        .put(`/api/games/${testGame._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe('Updated Game');
      expect(response.body.description).toBe('Updated description');
      expect(response.body.isPublic).toBe(true);
    });

    test('should require authentication', async () => {
      const updateData = {
        title: 'Updated Game'
      };

      await request(app)
        .put(`/api/games/${testGame._id}`)
        .send(updateData)
        .expect(401);
    });

    test('should return 404 for non-existent game', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = {
        title: 'Updated Game'
      };

      await request(app)
        .put(`/api/games/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /api/games/:id', () => {
    let testGame;

    beforeEach(async () => {
      testGame = await Game.create({
        title: 'Test Game',
        createdBy: testUser._id,
        songs: [],
        isPublic: false
      });
    });

    test('should delete game when user is owner', async () => {
      await request(app)
        .delete(`/api/games/${testGame._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify game is deleted
      const deletedGame = await Game.findById(testGame._id);
      expect(deletedGame).toBeNull();
    });

    test('should require authentication', async () => {
      await request(app)
        .delete(`/api/games/${testGame._id}`)
        .expect(401);
    });

    test('should return 404 for non-existent game', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .delete(`/api/games/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
