# Backend Tests Documentation

This directory contains comprehensive Jest tests for the Guessify backend application.

## Test Structure

```
__tests__/
├── controllers/          # API endpoint tests
├── middlewares/          # Middleware function tests
├── models/              # Database model tests
├── services/            # Business logic service tests
├── sockets/             # Socket.IO event tests
├── utils/               # Utility function tests
├── setup.js             # Test setup and global utilities
└── README.md            # This file
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with custom runner
npm run test:run

# Run tests with coverage using custom runner
npm run test:run:coverage
```

### Category-Specific Tests

```bash
# Run only model tests
npm run test:models

# Run only controller tests
npm run test:controllers

# Run only service tests
npm run test:services

# Run only utility tests
npm run test:utils

# Run only middleware tests
npm run test:middlewares

# Run only socket tests
npm run test:sockets
```

### Specific Test Files

```bash
# Run specific test file
npm test userModel.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="User Model"

# Run tests for a specific function
npm test -- --testNamePattern="analyzeAnswer"
```

## Test Categories

### 1. Models (`__tests__/models/`)

Tests for MongoDB models and schemas:

- **userModel.test.js**: User model validation, password hashing, authentication methods
- **Game.test.js**: Game model validation, song schema, enum validations

### 2. Controllers (`__tests__/controllers/`)

Tests for API endpoints and request handling:

- **gameController.test.js**: Game CRUD operations, authentication, validation

### 3. Services (`__tests__/services/`)

Tests for business logic and external service integrations:

- **lyricsDatabaseService.test.js**: Lyrics database operations, search functionality, statistics

### 4. Utils (`__tests__/utils/`)

Tests for utility functions:

- **generateRoomCode.test.js**: Room code generation validation
- **answerMatching.test.js**: Answer analysis, scoring, fuzzy matching

### 5. Middlewares (`__tests__/middlewares/`)

Tests for Express middleware functions:

- **authMiddleware.test.js**: JWT authentication, token validation
- **errorMiddleware.test.js**: Error handling, status codes, error formatting

### 6. Sockets (`__tests__/sockets/`)

Tests for real-time Socket.IO functionality:

- **gameEvents.test.js**: Game flow, player interactions, disconnection handling

## Test Environment

### Environment Variables

Tests use a separate test environment with the following variables:

```env
NODE_ENV=test
JWT_SECRET=testsecret123
MONGO_URI_TEST=mongodb://localhost:27017/guessify_test
DISABLE_EXTERNAL_APIS=true
TEST_TIMEOUT=30000
```

### Database

- Tests use a separate MongoDB database (`guessify_test`)
- Database is automatically cleaned before each test
- Database is dropped after all tests complete

### Global Test Utilities

The `setup.js` file provides global utilities available in all tests:

```javascript
// Create test user data
const userData = global.testUtils.createTestUserData({
  email: 'custom@example.com'
});

// Create test game data
const gameData = global.testUtils.createTestGameData(userId, {
  title: 'Custom Game'
});

// Create test song data
const songData = global.testUtils.createTestSongData({
  title: 'Custom Song'
});

// Utility functions
await global.testUtils.wait(1000); // Wait 1 second
const randomStr = global.testUtils.randomString(10);
const randomEmail = global.testUtils.randomEmail();
```

## Test Patterns

### Model Tests

```javascript
describe('Model Name', () => {
  beforeEach(async () => {
    await Model.deleteMany({});
  });

  test('should create with valid data', async () => {
    const data = { /* valid data */ };
    const instance = new Model(data);
    const saved = await instance.save();
    
    expect(saved._id).toBeDefined();
    expect(saved.field).toBe(data.field);
  });

  test('should require field', async () => {
    const data = { /* missing required field */ };
    const instance = new Model(data);
    
    await expect(instance.save()).rejects.toThrow();
  });
});
```

### Controller Tests

```javascript
describe('Controller Endpoint', () => {
  test('should handle valid request', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .set('Authorization', `Bearer ${token}`)
      .send(validData)
      .expect(201);

    expect(response.body.field).toBe(expectedValue);
  });

  test('should require authentication', async () => {
    await request(app)
      .post('/api/endpoint')
      .send(validData)
      .expect(401);
  });
});
```

### Service Tests

```javascript
describe('Service Function', () => {
  test('should process data correctly', async () => {
    const result = await serviceFunction(inputData);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  test('should handle errors gracefully', async () => {
    const result = await serviceFunction(invalidData);
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('error');
  });
});
```

### Socket Tests

```javascript
describe('Socket Event', () => {
  test('should handle event correctly', (done) => {
    clientSocket.on('response', (data) => {
      expect(data.field).toBe(expectedValue);
      done();
    });

    clientSocket.emit('event', eventData);
  });
});
```

## Coverage

The test suite aims for high coverage across all critical paths:

- **Models**: 100% coverage of validation and methods
- **Controllers**: 90%+ coverage of endpoints and error cases
- **Services**: 90%+ coverage of business logic
- **Utils**: 100% coverage of utility functions
- **Middlewares**: 100% coverage of middleware logic

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Cleanup**: Database is cleaned before each test
3. **Mocking**: External APIs and services are mocked in tests
4. **Descriptive Names**: Test names clearly describe what is being tested
5. **Edge Cases**: Tests cover both happy path and error scenarios
6. **Async Handling**: Proper async/await usage for database operations

## Debugging Tests

### Running Individual Tests

```bash
# Run single test file with verbose output
npm test userModel.test.js -- --verbose

# Run specific test case
npm test -- --testNamePattern="should create user"
```

### Debug Mode

```bash
# Run tests with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Run with increased timeout for debugging
npm test -- --testTimeout=60000
```

### Common Issues

1. **Database Connection**: Ensure MongoDB is running locally
2. **Port Conflicts**: Socket.IO tests may conflict if ports are in use
3. **Async Issues**: Use proper async/await or done callbacks
4. **Memory Leaks**: Ensure proper cleanup in afterEach/afterAll hooks

## Contributing

When adding new tests:

1. Follow the existing test structure and naming conventions
2. Add tests for both success and failure scenarios
3. Update this README if adding new test categories
4. Ensure tests are isolated and don't depend on external state
5. Add appropriate setup and cleanup for new test types
