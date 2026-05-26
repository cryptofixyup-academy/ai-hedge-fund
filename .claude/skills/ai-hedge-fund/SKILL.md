```markdown
# ai-hedge-fund Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill covers the core development patterns and conventions used in the `ai-hedge-fund` TypeScript codebase. It documents file organization, import/export styles, commit message habits, and testing patterns to help contributors quickly align with the project's standards.

## Coding Conventions

### File Naming
- Use **kebab-case** for all file names.

  **Example:**
  ```
  portfolio-manager.ts
  trade-executor.test.ts
  ```

### Import Style
- Use **alias imports** to reference modules.

  **Example:**
  ```typescript
  import { PortfolioManager } from '@/managers/portfolio-manager';
  ```

### Export Style
- Use **named exports** for all modules.

  **Example:**
  ```typescript
  export const calculateRisk = (portfolio) => { ... };
  ```

### Commit Messages
- Freeform messages with no strict prefix.
- Average length: ~43 characters.

  **Example:**
  ```
  add new strategy for volatility analysis
  fix bug in trade executor logic
  ```

## Workflows

### Adding a New Feature
**Trigger:** When implementing a new capability or module  
**Command:** `/add-feature`

1. Create a new file using kebab-case (e.g., `new-feature.ts`).
2. Use alias imports for dependencies.
3. Export new functions or classes using named exports.
4. Write corresponding tests in a `.test.ts` file.
5. Commit changes with a clear, concise message.

### Writing and Running Tests
**Trigger:** When validating code functionality  
**Command:** `/run-tests`

1. Create a test file matching the pattern `*.test.ts`.
2. Implement tests for all exported functions/classes.
3. Run the test suite using the project's test runner (framework unknown; refer to project scripts).
4. Review and fix any failing tests.

### Refactoring Code
**Trigger:** When improving or restructuring existing code  
**Command:** `/refactor`

1. Identify code to refactor.
2. Rename files using kebab-case if necessary.
3. Update imports to use aliases.
4. Ensure all exports remain named.
5. Update or add tests as needed.
6. Commit with a descriptive message.

## Testing Patterns

- Test files follow the pattern `*.test.ts`.
- Each module should have a corresponding test file.
- The testing framework is not explicitly specified; check project documentation or scripts for details.

  **Example:**
  ```
  trade-executor.ts
  trade-executor.test.ts
  ```

## Commands
| Command       | Purpose                                   |
|---------------|-------------------------------------------|
| /add-feature  | Scaffold and implement a new feature      |
| /run-tests    | Run the test suite for the codebase       |
| /refactor     | Refactor code according to conventions    |
```
