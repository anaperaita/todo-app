# Task Manager - TODO List Application

A beautiful, accessible TODO list application built with React, TypeScript, and MVVM architecture.

## Features

- ✅ **Full CRUD Operations**: Add, edit, delete, and toggle TODO items
- 🎯 **Priority Levels**: High, Medium, Low priority for tasks
- 🏷️ **Categories**: Organize tasks with custom categories
- 📅 **Due Dates**: Set deadlines for your tasks
- 🔍 **Advanced Filtering**: Filter by status and search by text
- 📊 **Sorting Options**: Sort by date, priority, due date, or alphabetically
- 📈 **Statistics**: Real-time task completion tracking
- 💾 **Persistent Storage**: localStorage with architecture ready for backend API
- ♿ **WCAG AA Compliant**: Fully accessible with keyboard navigation
- 🎨 **Distinctive Design**: Warm, natural color palette with thoughtful animations

## Architecture

### MVVM Pattern

Each component follows the Model-View-ViewModel pattern:

- **Model**: TypeScript interfaces and types (`src/types/`)
- **ViewModel**: Custom hooks managing state and business logic (`use*ViewModel.ts`)
- **View**: React components for presentation (`*.tsx`)

### Component Structure

```
src/
├── types/              # Shared TypeScript types
├── hooks/              # Custom hooks (useTodoStorage)
└── components/
    ├── TodoApp/        # Main container
    ├── TodoForm/       # Add new tasks
    ├── TodoItem/       # Individual task with edit mode
    ├── TodoList/       # List container with filtering/sorting
    ├── TodoFilters/    # Filter and sort controls
    └── TodoStats/      # Statistics display
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Design Principles

### Accessibility (WCAG AA)

- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- 4.5:1 color contrast ratio
- Screen reader friendly

### Aesthetic

- **Typography**: Crimson Pro (headings) + DM Sans (body)
- **Color Palette**: Warm, earthy tones (terracotta, sage, warm browns)
- **Motion**: Purposeful animations with `prefers-reduced-motion` support
- **Background**: Subtle gradients with texture overlay

### Code Quality

- TypeScript strict mode
- Test-Driven Development (TDD)
- Clean Code principles
- Component composition over prop drilling
- Immutable state updates

## Future Enhancements

The app is architected to easily support:

- Backend API integration (replace `useTodoStorage` hook)
- User authentication
- Shared task lists
- Recurring tasks
- Task attachments
- Dark mode toggle

## Testing

All components have comprehensive test coverage including:

- Accessibility tests
- User interaction tests
- Edge case handling
- Integration tests

Run tests with:

```bash
npm test
```

## License

MIT

## Author

Built with care for productivity 🌿
