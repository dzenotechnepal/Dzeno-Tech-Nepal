# Dzeno Tech Nepal

The official website for **Dzeno Tech Nepal Pvt. Ltd.**, a technology partner providing software development, IT services, and practical IT training.

## Tech Stack

- React 19
- TanStack Start and TanStack Router
- TypeScript
- Vite
- Tailwind CSS
- Radix UI and Lucide React

## Getting Started

Requirements: Node.js and Bun.

```bash
bun install
bun run dev
```

The development server runs at `http://localhost:3000`.

## Scripts

```bash
bun run dev       # Start the development server
bun run build     # Create a production build
bun run preview   # Preview the production build
bun run lint      # Run ESLint
bun run format    # Format the project with Prettier
```

## Routes

| Page | URL |
| --- | --- |
| Home | `/` |
| About | `/about` |
| Services | `/services` |
| Team | `/team` |
| Careers | `/careers` |
| Contact | `/contact` |
| Privacy Policy | `/privacy` |
| Terms | `/terms` |

## Project Structure

```text
src/
├── components/   # Shared site and UI components
├── routes/       # File-based TanStack routes
├── assets/       # Images and other static assets
└── styles.css    # Global styles
```

Route files are managed by TanStack Router. `src/routeTree.gen.ts` is generated automatically and should not be edited by hand.
