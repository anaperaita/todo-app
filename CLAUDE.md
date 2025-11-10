# Task Manager TODO App - Development Guide

A React + TypeScript TODO list application following MVVM architecture with WCAG AA accessibility compliance.

## Repository Structure

```
src/
  components/
    TodoApp/              - Main container orchestrating all TODO operations
      useTodoAppViewModel.ts
      TodoApp.tsx
      index.ts
    TodoForm/             - Add new tasks form
      useTodoFormViewModel.ts
      TodoForm.tsx
      index.ts
    TodoItem/             - Individual task with inline edit mode
      useTodoItemViewModel.ts
      TodoItem.tsx
      TodoItem.module.css
      index.ts
    TodoList/             - Task list with filtering and sorting
      useTodoListViewModel.ts
      TodoList.tsx
      TodoList.module.css
      index.ts
    TodoFilters/          - Filter and sort controls
      useTodoFiltersViewModel.ts
      TodoFilters.tsx
      index.ts
    TodoStats/            - Real-time completion statistics
      useTodoStatsViewModel.ts
      TodoStats.tsx
      index.ts
    KanbanBoard/          - Kanban board view (drag-drop)
      components/
    SlideInPanel/         - Reusable slide-in panel component
      SlideInPanel.tsx
      index.ts
    index.ts              - Barrel export for all components
  hooks/
    useTodoStorage.ts     - localStorage persistence (API-ready)
    useTodoStorage.test.ts
    index.ts
  types/
    todo.types.ts         - All TypeScript interfaces and enums
    index.ts
  utils/
    dateUtils.ts          - Date formatting utilities
    index.ts              - Barrel export for utilities
  App.tsx                 - Root application component
  App.css                 - Global styles
  index.tsx               - React app entry point
public/                   - Static assets (index.html, icons)
build/                    - Production build output (gitignored)
```

**Key Directories:**
- `src/components/` - All UI components organized by feature
- `src/hooks/` - Shared custom hooks (currently useTodoStorage)
- `src/types/` - Centralized TypeScript type definitions
- `src/utils/` - Shared utility functions (date formatting, etc.)

**File Naming:**
- Components: PascalCase (TodoApp.tsx, TodoItem.tsx)
- ViewModels: camelCase with pattern `use*ViewModel.ts`
- Hooks: camelCase with `use` prefix (useTodoStorage.ts)
- Types: camelCase with `.types.ts` suffix (todo.types.ts)
- Tests: `[filename].test.ts` or `[filename].test.tsx`
- Styles: Component.module.css for component-scoped CSS

## MVVM Architecture Pattern

This project strictly follows the Model-View-ViewModel pattern for clear separation of concerns:

**Model** (src/types/):
- TypeScript interfaces and enums defining data structure
- Examples: Todo, Priority, FilterStatus, SortOption

**ViewModel** (use*ViewModel.ts):
- Custom hooks managing state and business logic
- Coordinate between Model and View
- Handle user interactions and state transformations
- Pattern: Each component has a corresponding `use[ComponentName]ViewModel.ts` hook

**View** (*.tsx):
- React components for presentation only
- Consume ViewModel hooks
- No business logic - focus on rendering and user interaction

**Example Structure:**
```
TodoForm/
  TodoForm.tsx              - View: Renders form UI
  useTodoFormViewModel.ts   - ViewModel: Handles form state, validation
  index.ts                  - Barrel export
```

**Why MVVM:**
- Clear separation between UI and logic improves testability
- ViewModels can be tested independently without rendering
- Business logic is reusable across different views
- Makes it easy to swap data sources (e.g., replace useTodoStorage with API calls)

## Core Utilities & Shared Code

**Types (src/types/todo.types.ts):**
- `Todo` - Main todo item interface with id, text, completed, status, priority, category, dueDate, timestamps
- `Priority` - Enum: LOW, MEDIUM, HIGH
- `FilterStatus` - Enum: ALL, ACTIVE, COMPLETED
- `SortOption` - Enum: DATE_ADDED, DATE_ADDED_DESC, DUE_DATE, DUE_DATE_DESC, PRIORITY, ALPHABETICAL
- `KanbanStatus` - Enum: TODO, IN_PROGRESS, DONE
- `ViewMode` - Enum: LIST, KANBAN
- `TodoFilters` - Interface for filtering state
- `CreateTodoInput` - Type for creating new todos (Omit id, completed, timestamps)
- `UpdateTodoInput` - Type for updating todos (Partial updates)

**Hooks (src/hooks/useTodoStorage.ts):**
- `useTodoStorage()` - Custom hook managing todo CRUD operations with localStorage
  - Returns: { todos, addTodo, updateTodo, deleteTodo, toggleTodo }
  - Automatically syncs with localStorage using the key 'todos'
  - Designed to be easily replaceable with API calls in the future
  - All operations use immutable state updates

**Component Exports (src/components/index.ts):**
- Barrel exports for all major components (TodoApp, TodoForm, TodoItem, etc.)
- Use: `import { TodoApp, TodoForm } from './components'`

**Utilities (src/utils/dateUtils.ts):**
- `formatDueDate(dateString)` - Formats ISO date strings to localized short format (e.g., "Dec 31, 2025")
  - Returns empty string if dateString is null or invalid
  - Uses 'en-US' locale with short month, numeric day and year

## Bash Commands

- `npm start` - Start development server (http://localhost:3000)
- `npm test` - Run Jest test suite in watch mode
- `npm run build` - Create production build in build/ directory
- `npm run eject` - Eject from create-react-app (irreversible)

## Code Style - TypeScript

**Strict Mode:**
- Always use TypeScript strict mode (enabled in tsconfig.json)
- No `any` types allowed - use `unknown` for truly dynamic types
- Enable all strict checking options for maximum type safety

**Naming Conventions:**
- Variables/functions: camelCase (`getUserData`, `todoItems`)
- Constants: UPPER_CASE for true constants (`STORAGE_KEY = 'todos'`)
- Classes/Interfaces/Types: PascalCase (`Todo`, `TodoFilters`, `Priority`)
- Enums: PascalCase with UPPER_CASE values (`Priority.HIGH`)
- Type parameters: Single uppercase letter or PascalCase (`T`, `TData`)
- Never use `_` as prefix/suffix

**File Organization:**
- Use barrel exports (index.ts) for cleaner imports
- Co-locate related files (component + viewmodel + styles in same folder)
- One component per file, named exports preferred for components

**Type Safety:**
- Prefer interfaces over types for object shapes
- Use utility types: `Partial<T>`, `Omit<T, K>`, `Pick<T, K>`
- Avoid type assertions (`as`) unless absolutely necessary
- Use discriminated unions for state management

**Example:**
```typescript
// Good: Descriptive names with proper types
const userAuthToken: string = generateToken(userId);
const MAX_RETRY_ATTEMPTS = 3;

// Bad: Abbreviated names, any type
const uat: any = genTok(uid);
```

## Clean Code Principles

**Single Responsibility:**
- Each component should do one thing well
- Components max 200 lines - extract smaller components if larger
- Functions max 20 lines - extract helpers for complex logic
- ViewModels should focus on a single concern

**Meaningful Names:**
- Use descriptive names that reveal intent
- Functions should be verbs: `handleAddTodo`, `toggleTodo`, `updateFilters`
- Booleans should be questions: `isCompleted`, `hasError`, `canEdit`
- Avoid abbreviations: use `userAuthentication` not `userAuth`

**Function Signatures:**
- Maximum 3 parameters - use object parameter for more
- Prefer named parameters for clarity
```typescript
// Good: Object parameter for multiple values
interface CreateTodoInput {
  text: string;
  priority: Priority;
  category: string;
  dueDate: string | null;
}
function addTodo(input: CreateTodoInput): void { }

// Bad: Too many positional parameters
function addTodo(text: string, priority: Priority, category: string, dueDate: string | null): void { }
```

**Immutable State:**
- Always use immutable updates in React
- Spread operators for objects/arrays: `{ ...todo, completed: true }`
- Array methods: `.map()`, `.filter()` instead of `.push()`, `.splice()`

**Component Composition:**
- Favor composition over prop drilling
- Extract reusable UI into shared components
- Use children prop for flexible layouts
- Keep props interfaces simple and focused

**DRY Principle:**
- Extract repeated logic into custom hooks
- Create shared utility functions
- Use component composition to avoid duplication
- Don't abstract too early - wait for 3rd repetition (Rule of Three)

**Avoid:**
- Nested ternaries (extract to variables or early returns)
- Boolean props (`variant="primary"` instead of `isPrimary={true}`)
- Magic numbers (use named constants)
- Deep nesting (max 3 levels, extract functions)

## React 18 Best Practices

**Functional Components:**
- Always use functional components with hooks
- No class components in new code

**Custom Hooks:**
- Extract stateful logic into custom hooks when logic appears in 2+ places
- Prefix all custom hooks with `use` (enforced by ESLint)
- Custom hooks can call other hooks
- Examples in this project: `useTodoStorage`, `useTodoAppViewModel`

**Hooks Rules:**
- Only call hooks at top level (never in loops, conditions, or nested functions)
- Only call hooks from React functions (components or custom hooks)
- Use ESLint plugin to enforce rules: `react-hooks/rules-of-hooks`

**Performance Optimization:**
- Use `useCallback` for event handlers passed to child components
- Use `useMemo` for expensive computations
- Don't optimize prematurely - profile first
- Avoid inline object/array literals in JSX props

**State Management:**
- Use `useState` for local component state
- Use custom hooks for shared logic (like `useTodoStorage`)
- Consider Context API for deeply nested prop drilling
- Keep state as close to where it's used as possible

**Effects:**
- Use `useEffect` sparingly - prefer deriving state
- Always specify dependency arrays
- Clean up side effects (return cleanup function)
- Separate concerns into multiple `useEffect` calls

## Accessibility Guidelines (WCAG AA)

**Semantic HTML:**
- Use semantic elements: `<button>`, `<nav>`, `<main>`, `<article>`
- Never use `<div>` for interactive elements
- Proper heading hierarchy: h1 → h2 → h3 (no skipping levels)

**ARIA Labels:**
- Add `aria-label` for icon buttons
- Use `aria-describedby` for form field help text
- Use `aria-live` for dynamic content updates (e.g., todo count)
- Avoid ARIA when semantic HTML is sufficient

**Keyboard Navigation:**
- All interactive elements must be keyboard accessible
- Test with Tab, Enter, Space, Arrow keys
- Visible focus indicators (outline or focus ring)
- Logical tab order matches visual layout

**Color Contrast:**
- Minimum 4.5:1 ratio for normal text (WCAG AA)
- 3:1 for large text (18pt+ or 14pt+ bold)
- Don't rely on color alone to convey information
- Test with browser DevTools or axe DevTools

**Form Accessibility:**
- Labels properly associated with inputs
- Error messages linked via `aria-describedby`
- Required fields indicated visually and programmatically
- Focus management after form submission

**Screen Reader Support:**
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Provide text alternatives for icons
- Announce state changes (e.g., "3 items remaining")

## Testing Strategy

**Test Philosophy:**
- Test behavior, not implementation details
- Focus on user interactions and accessibility
- Aim for high confidence, not 100% coverage

**Unit Tests:**
- Test custom hooks in isolation (use `@testing-library/react-hooks`)
- Test ViewModels separately from Views
- Example: src/hooks/useTodoStorage.test.ts

**Component Tests:**
- Use React Testing Library (not Enzyme)
- Query by role, label, or text - avoid test IDs
- Simulate user interactions with `userEvent` (not `fireEvent`)
- Test accessibility with axe-core integration

**Query Priority (React Testing Library):**
1. `getByRole` - Most accessible (preferred)
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Forms (less accessible)
4. `getByText` - Non-interactive content
5. `getByTestId` - Last resort only

**Example Good Test:**
```typescript
test('adds new todo when form submitted', async () => {
  render(<TodoApp />);
  const user = userEvent.setup();

  const input = screen.getByRole('textbox', { name: /todo text/i });
  await user.type(input, 'Buy groceries');

  const button = screen.getByRole('button', { name: /add todo/i });
  await user.click(button);

  expect(screen.getByText('Buy groceries')).toBeInTheDocument();
});
```

**Accessibility Testing:**
- Use jest-axe for automated accessibility checks
- Add axe tests to all component tests
- Manual testing still required for full compliance

**Test Organization:**
- Test files co-located with components: `TodoApp.test.tsx`
- Use `describe` blocks for grouping related tests
- Clear test names describing behavior

**Coverage Goals:**
- Aim for 80%+ coverage on business logic (hooks, ViewModels)
- Focus on critical paths (CRUD operations, filtering, sorting)
- UI components need behavior tests, not snapshot tests

## Architecture Decision Records

**Why MVVM instead of other patterns?**
- Clear separation of concerns improves testability
- Easy to replace data layer (localStorage → API)
- ViewModels are reusable across different views
- Aligns well with React hooks architecture

**Why localStorage instead of state management library?**
- Sufficient for this app's scope (no complex state sharing)
- Architecture allows easy migration to Redux/Zustand if needed
- Keeps dependencies minimal
- Demonstrates data abstraction through `useTodoStorage` hook

**Why component folders instead of feature folders?**
- Each component is self-contained withViewModel + styles
- Easier to navigate in small/medium projects
- Natural barrel exports for clean imports
- For larger apps, consider feature-based structure

**Why CSS Modules instead of styled-components?**
- Simpler mental model
- Better performance (no runtime CSS generation)
- Standard CSS with scoping benefits
- Some components use CSS Modules, others use global styles

## Future Enhancement Readiness

The architecture is designed for easy extension:

**API Integration:**
- Replace `useTodoStorage` hook with `useTodoAPI` hook
- Keep same interface (todos, addTodo, updateTodo, etc.)
- No changes needed to ViewModels or Views

**Authentication:**
- Add `useAuth` hook for user management
- Wrap App with AuthProvider context
- Protect routes with authentication checks

**Shared Lists:**
- Extend Todo interface with `userId`, `sharedWith` fields
- Add collaboration features in API layer
- UI already supports multiple todos, no changes needed

**Dark Mode:**
- Add theme context/provider
- Update CSS with CSS variables
- Toggle saved to localStorage via custom hook

**Drag and Drop:**
- Already implemented with @dnd-kit in KanbanBoard
- Extend to TodoList if needed

## Common Patterns

**Creating a New Component:**
1. Create folder: `src/components/NewComponent/`
2. Create ViewModel: `useNewComponentViewModel.ts`
3. Create View: `NewComponent.tsx` (imports and uses ViewModel)
4. Create barrel export: `index.ts`
5. Add export to `src/components/index.ts`
6. Create test: `NewComponent.test.tsx`

**Adding a New Todo Property:**
1. Update `Todo` interface in `src/types/todo.types.ts`
2. Update `CreateTodoInput` and/or `UpdateTodoInput` types
3. Update `useTodoStorage` hook to handle new property
4. Update TodoForm to capture the new field
5. Update TodoItem to display the new property
6. Add tests for the new behavior

**Replacing localStorage with API:**
1. Create `src/hooks/useTodoAPI.ts`
2. Implement same interface as `useTodoStorage`
3. Replace import in `useTodoAppViewModel.ts`
4. Handle loading states and errors in ViewModel
5. Update tests to mock API calls

## Code Review Checklist

Before submitting code:
- [ ] TypeScript strict mode passes with no errors
- [ ] No `any` types (use `unknown` if needed)
- [ ] Components follow MVVM pattern (logic in ViewModel)
- [ ] Functions are small and focused (max 20 lines)
- [ ] Meaningful names that reveal intent
- [ ] Tests written and passing (behavior-focused)
- [ ] Accessibility: semantic HTML, ARIA labels, keyboard navigation
- [ ] No console.log statements (use proper error handling)
- [ ] Immutable state updates (no mutations)
- [ ] ESLint passes with no warnings

## Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React 18 Documentation](https://react.dev/)
- [React Testing Library](https://testing-library.com/react)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
