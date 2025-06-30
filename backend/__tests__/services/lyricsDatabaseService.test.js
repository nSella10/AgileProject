import mongoose from 'mongoose';
import {
  findLyricsInDatabase,
  addLyricsToDatabase,
  searchSongsInDatabase,
  getPopularSongs,
  getDatabaseStats,
  rateSongQuality
} from '../../services/lyricsDatabaseService.js';
import LyricsDatabase from '../../models/LyricsDatabase.js';
import User from '../../models/userModel.js';

describe('LyricsDatabaseService', () => {
  let testUser;

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
    await LyricsDatabase.deleteMany({});
    await User.deleteMany({});

    // יצירת משתמש לבדיקות
    testUser = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123'
    });
    await testUser.save();
  });

  describe('addLyricsToDatabase', () => {
    test('should add new lyrics to database', async () => {
      const songData = {
        title: 'Test Song',
        artist: 'Test Artist',
        lyrics: 'These are test lyrics for the song',
        trackId: '12345',
        previewUrl: 'https://example.com/preview.mp3',
        artworkUrl: 'https://example.com/artwork.jpg'
      };

      const result = await addLyricsToDatabase(songData, testUser._id);

      expect(result.success).toBe(true);
      expect(result.message).toContain('added successfully');
      expect(result.lyricsEntry).toBeDefined();
      expect(result.lyricsEntry.title).toBe(songData.title);
      expect(result.lyricsEntry.artist).toBe(songData.artist);
      expect(result.lyricsEntry.lyrics).toBe(songData.lyrics);
    });

    test('should handle duplicate songs', async () => {
      const songData = {
        title: 'Test Song',
        artist: 'Test Artist',
        lyrics: 'These are test lyrics',
        trackId: '12345'
      };

      // הוספה ראשונה
      await addLyricsToDatabase(songData, testUser._id);

      // הוספה שנייה של אותו שיר
      const result = await addLyricsToDatabase(songData, testUser._id);

      expect(result.success).toBe(false);
      expect(result.message).toContain('already exists');
    });

    test('should require title and artist', async () => {
      const songData = {
        lyrics: 'These are test lyrics'
      };

      const result = await addLyricsToDatabase(songData, testUser._id);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Title and artist are required');
    });
  });

  describe('findLyricsInDatabase', () => {
    beforeEach(async () => {
      // הוספת שירים לבדיקה
      await addLyricsToDatabase({
        title: 'Test Song',
        artist: 'Test Artist',
        lyrics: 'These are test lyrics for the song',
        trackId: '12345'
      }, testUser._id);

      await addLyricsToDatabase({
        title: 'Another Song',
        artist: 'Another Artist',
        lyrics: 'Different lyrics for another song',
        trackId: '67890'
      }, testUser._id);
    });

    test('should find lyrics by exact title and artist match', async () => {
      const result = await findLyricsInDatabase('Test Song', 'Test Artist');

      expect(result.found).toBe(true);
      expect(result.lyrics).toBe('These are test lyrics for the song');
      expect(result.source).toBe('database');
    });

    test('should find lyrics by trackId', async () => {
      const result = await findLyricsInDatabase('Test Song', 'Test Artist', '12345');

      expect(result.found).toBe(true);
      expect(result.lyrics).toBe('These are test lyrics for the song');
      expect(result.trackId).toBe('12345');
    });

    test('should handle case insensitive search', async () => {
      const result = await findLyricsInDatabase('test song', 'test artist');

      expect(result.found).toBe(true);
      expect(result.lyrics).toBe('These are test lyrics for the song');
    });

    test('should return not found for non-existent song', async () => {
      const result = await findLyricsInDatabase('Non Existent Song', 'Non Existent Artist');

      expect(result.found).toBe(false);
      expect(result.lyrics).toBeNull();
    });

    test('should handle fuzzy matching for similar titles', async () => {
      const result = await findLyricsInDatabase('Test Songg', 'Test Artist'); // Typo in title

      expect(result.found).toBe(true);
      expect(result.lyrics).toBe('These are test lyrics for the song');
    });
  });

  describe('searchSongsInDatabase', () => {
    beforeEach(async () => {
      // הוספת שירים לבדיקה
      await addLyricsToDatabase({
        title: 'Love Song',
        artist: 'Romantic Artist',
        lyrics: 'Love is in the air tonight',
        trackId: '111'
      }, testUser._id);

      await addLyricsToDatabase({
        title: 'Rock Song',
        artist: 'Rock Band',
        lyrics: 'Rock and roll all night long',
        trackId: '222'
      }, testUser._id);

      await addLyricsToDatabase({
        title: 'Love Ballad',
        artist: 'Romantic Artist',
        lyrics: 'Another love song with romantic lyrics',
        trackId: '333'
      }, testUser._id);
    });

    test('should search songs by query', async () => {
      const result = await searchSongsInDatabase('love');

      expect(result.length).toBeGreaterThan(0);
      expect(result.some(song => song.title.toLowerCase().includes('love'))).toBe(true);
    });

    test('should search songs by artist', async () => {
      const result = await searchSongsInDatabase('Romantic Artist');

      expect(result.length).toBe(2);
      expect(result.every(song => song.artist === 'Romantic Artist')).toBe(true);
    });

    test('should limit search results', async () => {
      const result = await searchSongsInDatabase('love', 1);

      expect(result.length).toBe(1);
    });

    test('should return empty array for no matches', async () => {
      const result = await searchSongsInDatabase('nonexistent');

      expect(result).toEqual([]);
    });
  });

  describe('getPopularSongs', () => {
    beforeEach(async () => {
      // הוספת שירים עם שימושים שונים
      const song1 = await addLyricsToDatabase({
        title: 'Popular Song',
        artist: 'Popular Artist',
        lyrics: 'Very popular lyrics',
        trackId: '111'
      }, testUser._id);

      const song2 = await addLyricsToDatabase({
        title: 'Less Popular Song',
        artist: 'Less Popular Artist',
        lyrics: 'Less popular lyrics',
        trackId: '222'
      }, testUser._id);

      // עדכון מספר השימושים
      await LyricsDatabase.findByIdAndUpdate(song1.lyricsEntry._id, { usageCount: 10 });
      await LyricsDatabase.findByIdAndUpdate(song2.lyricsEntry._id, { usageCount: 5 });
    });

    test('should return popular songs sorted by usage', async () => {
      const result = await getPopularSongs(10);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].usageCount).toBeGreaterThanOrEqual(result[1].usageCount);
    });

    test('should limit number of results', async () => {
      const result = await getPopularSongs(1);

      expect(result.length).toBe(1);
    });
  });

  describe('getDatabaseStats', () => {
    beforeEach(async () => {
      // הוספת שירים לבדיקה
      await addLyricsToDatabase({
        title: 'Song 1',
        artist: 'Artist 1',
        lyrics: 'Lyrics 1',
        trackId: '111'
      }, testUser._id);

      await addLyricsToDatabase({
        title: 'Song 2',
        artist: 'Artist 2',
        lyrics: 'Lyrics 2',
        trackId: '222'
      }, testUser._id);
    });

    test('should return correct database statistics', async () => {
      const stats = await getDatabaseStats();

      expect(stats.totalSongs).toBe(2);
      expect(stats.totalArtists).toBe(2);
      expect(stats.songsWithLyrics).toBe(2);
      expect(stats.averageQualityRating).toBeDefined();
    });
  });

  describe('rateSongQuality', () => {
    let songId;

    beforeEach(async () => {
      const result = await addLyricsToDatabase({
        title: 'Song to Rate',
        artist: 'Artist to Rate',
        lyrics: 'Lyrics to rate',
        trackId: '111'
      }, testUser._id);
      
      songId = result.lyricsEntry._id;
    });

    test('should rate song quality', async () => {
      const result = await rateSongQuality(songId, 5, testUser._id);

      expect(result.success).toBe(true);
      expect(result.newRating).toBe(5);
      expect(result.ratingCount).toBe(1);
    });

    test('should validate rating range', async () => {
      const result = await rateSongQuality(songId, 6, testUser._id); // Invalid rating

      expect(result.success).toBe(false);
      expect(result.message).toContain('Rating must be between 1 and 5');
    });

    test('should handle non-existent song', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const result = await rateSongQuality(fakeId, 5, testUser._id);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Song not found');
    });
  });
});
