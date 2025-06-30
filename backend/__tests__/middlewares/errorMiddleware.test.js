import { notFound, errorHandler } from '../../middlewares/errorMiddleware.js';

describe('Error Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      originalUrl: '/api/test',
      method: 'GET'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('notFound middleware', () => {
    test('should create 404 error for non-existent route', () => {
      notFound(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Not Found - /api/test',
          statusCode: 404
        })
      );
    });

    test('should handle different URLs', () => {
      req.originalUrl = '/api/games/nonexistent';
      
      notFound(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Not Found - /api/games/nonexistent',
          statusCode: 404
        })
      );
    });

    test('should handle root URL', () => {
      req.originalUrl = '/';
      
      notFound(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Not Found - /',
          statusCode: 404
        })
      );
    });
  });

  describe('errorHandler middleware', () => {
    test('should handle generic error in development', () => {
      process.env.NODE_ENV = 'development';
      
      const error = new Error('Test error');
      error.stack = 'Error stack trace';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Test error',
        stack: 'Error stack trace'
      });
    });

    test('should handle generic error in production', () => {
      process.env.NODE_ENV = 'production';
      
      const error = new Error('Test error');
      error.stack = 'Error stack trace';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Test error'
      });
      // Stack should not be included in production
      expect(res.json).not.toHaveBeenCalledWith(
        expect.objectContaining({ stack: expect.any(String) })
      );
    });

    test('should handle error with custom status code', () => {
      const error = new Error('Custom error');
      error.statusCode = 400;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Custom error'
      });
    });

    test('should handle MongoDB CastError', () => {
      const error = new Error('Cast to ObjectId failed');
      error.name = 'CastError';
      error.kind = 'ObjectId';
      error.value = 'invalid-id';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Resource not found'
      });
    });

    test('should handle MongoDB duplicate key error', () => {
      const error = new Error('Duplicate key error');
      error.code = 11000;
      error.keyValue = { email: 'test@example.com' };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Duplicate field value entered'
      });
    });

    test('should handle MongoDB validation error', () => {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.errors = {
        email: { message: 'Email is required' },
        password: { message: 'Password is required' }
      };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email is required, Password is required'
      });
    });

    test('should handle JWT errors', () => {
      const error = new Error('jwt malformed');
      error.name = 'JsonWebTokenError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, token failed'
      });
    });

    test('should handle JWT expired error', () => {
      const error = new Error('jwt expired');
      error.name = 'TokenExpiredError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, token expired'
      });
    });

    test('should handle error without message', () => {
      const error = new Error();

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server Error'
      });
    });

    test('should handle null error', () => {
      const error = null;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server Error'
      });
    });

    test('should handle error with status 200 (should change to 500)', () => {
      res.statusCode = 200;
      const error = new Error('Test error');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    test('should preserve non-200 status codes', () => {
      res.statusCode = 404;
      const error = new Error('Not found');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('should handle complex validation error', () => {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.errors = {
        'songs.0.title': { message: 'Song title is required' },
        'songs.1.artist': { message: 'Artist name is required' },
        guessTimeLimit: { message: 'Guess time limit must be a valid option' }
      };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Song title is required, Artist name is required, Guess time limit must be a valid option'
      });
    });
  });

  afterEach(() => {
    // Reset NODE_ENV after each test
    process.env.NODE_ENV = 'test';
  });
});
