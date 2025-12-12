# Employee Dashboard — Frontend

A small frontend application built with React and Vite to manage and view employee data.

Prerequisites
- Node.js 18+ (or LTS) and npm/yarn/pnpm
- An API backend running (see repo root or backend README)

Tech stack
- React (hooks)
- Vite (dev server & build)
- ESLint (code quality)
- (Optional) Tailwind CSS or your preferred styling library

Quick setup
1. Clone the repository:
   git clone https://github.com/perera99-msd/Employee-Dashboard.git
2. Change into the frontend directory:
   cd Employee-Dashboard/frontend
3. Install dependencies:
   npm install
   # or
   yarn install
   # or
   pnpm install
4. Create a .env file (see Environment variables below)
5. Start the development server:
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
6. Build for production:
   npm run build
7. Preview the production build locally:
   npm run preview

Environment variables
- VITE_API_BASE_URL - Base URL of the backend API (e.g. http://localhost:5000/api)

Notes
- This frontend uses Vite's fast refresh and HMR during development.
- If ESLint or TypeScript config is present, follow the project's lint and type rules before committing.
- Adjust the API base URL in .env to point to your running backend.

Contributing
- Open issues or PRs for bugs and enhancements. Keep changes small and focused.

License
- Check the repository root for license information.

---

If you want different wording, extra sections (tests, CI, usage examples), or want me to update the root README too, tell me and I'll make the changes.
