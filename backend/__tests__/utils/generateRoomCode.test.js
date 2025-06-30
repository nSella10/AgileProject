import { generateRoomCode } from '../../utils/generateRoomCode.js';

describe('generateRoomCode', () => {
  test('should generate a 5-digit string', () => {
    const roomCode = generateRoomCode();
    expect(roomCode).toMatch(/^\d{5}$/);
    expect(roomCode.length).toBe(5);
  });

  test('should generate different codes on multiple calls', () => {
    const codes = new Set();
    for (let i = 0; i < 100; i++) {
      codes.add(generateRoomCode());
    }
    // Should generate at least 90 unique codes out of 100 (allowing for some collisions)
    expect(codes.size).toBeGreaterThan(90);
  });

  test('should generate codes within valid range (10000-99999)', () => {
    for (let i = 0; i < 50; i++) {
      const roomCode = generateRoomCode();
      const codeNumber = parseInt(roomCode);
      expect(codeNumber).toBeGreaterThanOrEqual(10000);
      expect(codeNumber).toBeLessThanOrEqual(99999);
    }
  });

  test('should always return a string', () => {
    const roomCode = generateRoomCode();
    expect(typeof roomCode).toBe('string');
  });
});
