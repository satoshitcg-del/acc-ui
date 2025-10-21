# Test Documentation

This directory contains comprehensive test cases for the Accounting UI application.

## Test Structure

```
test/
├── setup.ts                    # Test setup configuration
├── integration/                 # Integration tests
│   ├── auth.test.tsx          # Authentication flow tests
│   ├── customer.test.tsx       # Customer management tests
│   ├── billing.test.tsx       # Billing system tests
│   └── task.test.tsx          # Task management tests
└── README.md                   # This file
```

## Test Categories

### 1. Unit Tests
- **Core utilities**: Error handling, date utilities
- **Services**: API service functions
- **Components**: Individual React components

### 2. Integration Tests
- **Authentication flow**: Login, password setting, 2FA
- **Customer management**: CRUD operations, search, filtering
- **Billing system**: Invoice generation, status updates, PDF creation
- **Task management**: Task creation, assignment, status tracking

### 3. Service Tests
- **UserService**: Authentication, password management, 2FA
- **CustomerService**: Customer CRUD operations
- **ProductService**: Product and sub-product management
- **BillingService**: Billing note operations, PDF generation
- **TaskManagementService**: Task CRUD operations
- **DirectApiService**: Direct API integration

## Running Tests

### Run all tests
```bash
yarn test
```

### Run tests with coverage
```bash
yarn test --coverage
```

### Run specific test files
```bash
yarn test core/error.test.ts
yarn test services/UserService.test.ts
yarn test integration/auth.test.tsx
```

### Run tests in watch mode
```bash
yarn test --watch
```

## Test Configuration

The tests are configured using Vitest with the following setup:

- **Environment**: happy-dom (lightweight DOM implementation)
- **Coverage**: v8 provider with HTML, JSON, and text reports
- **Setup**: Custom setup file with DOM matchers and mocks
- **Aliases**: Path aliases for clean imports

## Test Coverage

The test suite covers:

1. **Error Handling**: All error codes and edge cases
2. **Authentication**: Complete auth flow including 2FA
3. **Customer Management**: CRUD operations, search, filtering
4. **Product Management**: Product and sub-product operations
5. **Billing System**: Invoice generation, status updates, PDF creation
6. **Task Management**: Task lifecycle, assignment, status tracking
7. **API Integration**: All service endpoints and error handling

## Mocking Strategy

- **Services**: Mocked API calls with realistic responses
- **Components**: Mocked child components for isolation
- **Router**: Mocked navigation and routing
- **DOM APIs**: Mocked browser APIs (matchMedia, IntersectionObserver, etc.)

## Best Practices

1. **Isolation**: Each test is independent and doesn't affect others
2. **Mocking**: External dependencies are properly mocked
3. **Coverage**: All critical paths are tested
4. **Error Scenarios**: Both success and failure cases are covered
5. **User Interactions**: User actions are properly simulated
6. **Async Operations**: Proper handling of async operations with waitFor

## Adding New Tests

When adding new functionality:

1. Create unit tests for new utilities and services
2. Add integration tests for new user flows
3. Update existing tests if interfaces change
4. Ensure proper mocking of new dependencies
5. Add error scenarios and edge cases

## Test Data

Test data is generated dynamically to avoid hardcoded values:

- **Mock responses**: Realistic API response structures
- **User data**: Sample customer, product, and billing data
- **Error scenarios**: Various error conditions and edge cases
- **Form data**: Valid and invalid form inputs

## Continuous Integration

Tests are designed to run in CI/CD environments:

- **Headless**: No browser required
- **Fast**: Optimized for quick feedback
- **Reliable**: Deterministic results
- **Coverage**: Comprehensive coverage reporting