# Coding Conventions

## File Structure & Organization
- Use file-based routing with Expo Router
- Group related screens in folders with parentheses: `(tabs)`
- Dynamic routes use square brackets: `[component].tsx`
- Components organized by category in `/components` folder
- Shared utilities in `/hooks`, `/constants`, `/types` folders

## TypeScript Conventions
- Always use TypeScript with strict mode
- Define interfaces for component props and data structures
- Use type annotations for function parameters and return types
- Leverage path aliases (`@/*`) for clean imports
- Export types alongside components when needed

## Component Patterns
- Use functional components with hooks
- Implement themed components with `useThemeColor` hook
- Follow consistent prop interface naming: `ComponentNameProps`
- Use destructuring for props with default values
- Implement proper TypeScript generics for reusable components

## Styling Guidelines
- Use StyleSheet.create() for component styles
- Implement responsive design with Platform.select()
- Support both light and dark themes
- Use consistent spacing and sizing patterns
- Leverage theme colors from Colors constant

## State Management
- Use React hooks (useState, useEffect) for local state
- Implement custom hooks for shared logic
- Use context providers for global state when needed
- Follow React best practices for state updates

## Navigation & Routing
- Use Expo Router for navigation
- Implement typed routes for better development experience
- Pass parameters through router.push() with proper typing
- Configure stack and tab navigators appropriately

## Internationalization
- Support Chinese language interface
- Use descriptive text for user-facing content
- Implement consistent terminology across the app

## Code Quality
- Follow ESLint rules with Expo configuration
- Use meaningful variable and function names
- Add comments for complex logic
- Implement proper error handling
- Write clean, readable code with consistent formatting

## Testing & Development
- Organize test components by category
- Use descriptive titles and descriptions for demos
- Implement proper navigation between test screens
- Follow consistent patterns for demo implementations