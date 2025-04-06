# Boom Landing Page

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


## Testing

This directory contains tests for the Boom Landing Page application.

### Test Structure

- `unit/`: Contains unit tests for individual components and modules
  - `stacksConnect.spec.ts`: Tests for the Stacks wallet connection functionality

### Running Tests

You can run the tests using the following npm scripts:

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:unit

# Run tests with coverage
pnpm test:coverage
```

### Test Guidelines

1. **Unit Tests**: Test individual functions and components in isolation.
2. **Mocking**: External dependencies should be mocked.
3. **Coverage**: Aim for high test coverage, especially for critical functionality.

### Adding New Tests

When adding new tests:

1. Create a new test file in the appropriate directory with the `.spec.ts` extension.
2. Import Vitest utilities and the code to be tested.
3. Organize tests using `describe` and `it` blocks.
4. Use assertions with `expect`.

### Testing Tools

- [Vitest](https://vitest.dev/) - Test runner and framework
- [Vue Test Utils](https://test-utils.vuejs.org/) - Vue component testing utilities
- [Happy DOM](https://github.com/capricorn86/happy-dom) - DOM implementation for testing