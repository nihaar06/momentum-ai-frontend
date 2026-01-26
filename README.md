# Momentum-AI Frontend

AI-powered learning roadmap generator and progress tracker.

## Live Demo

Visit the deployed application on Vercel: [https://momentum-ai-frontend.vercel.app](https://momentum-ai-frontend.vercel.app)

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Component Library**: [Radix UI](https://www.radix-ui.com)
- **Authentication**: [Supabase Auth](https://supabase.com) (Google OAuth + Magic Link)
- **Form Handling**: [React Hook Form](https://react-hook-form.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Hosting**: [Vercel](https://vercel.com)
- **Backend**: FastAPI (REST API)

## Key Features

### Authentication
- **Google OAuth** sign-in integration via Supabase
- **Magic Link** email sign-in option
- Session-based authentication with automatic redirect to dashboard

### Dashboard
- Overview of all active learning roadmaps
- Daily task prioritization showing top 5 upcoming tasks
- Progress tracking with completion statistics
- Streak counter for consecutive days of task completion
- Real-time progress percentage per roadmap (depends on backend)

### Roadmap Generation
- **AI-powered roadmap creation** with customizable parameters:
  - Learning goal or topic
  - Duration (in weeks)
  - Daily time commitment (hours)
  - Skill level (beginner, intermediate, advanced)
- Automatic navigation to dashboard post-generation (backend generates tasks)

### Roadmap Progress Tracking
- Weekly breakdown view of learning roadmaps
- Weekly goals and progress visualization
- Progress bars showing completion percentage per week
- Week-by-week task completion status

### Task Management
- Week and day-level task organization
- Individual task completion tracking
- Task completion timestamps

### AI Assistant
- Context-aware question answering about roadmap content
- Ability to ask questions about specific weeks/days of a roadmap
- Integration with user's roadmap data (depends on backend)

## Pages / Screens

| Page | Route | Purpose |
|------|-------|---------|
| **Authentication Redirect** | `/` | Checks auth status and redirects to login or dashboard |
| **Login** | `/login` | Google OAuth and Magic Link sign-in |
| **Dashboard** | `/dashboard` | Home page with roadmap overview and daily tasks |
| **Generate Roadmap** | `/generate` | Form to create a new AI-generated learning roadmap |
| **Roadmap Weeks** | `/roadmap/[id]/weeks` | Weekly progress view of a specific roadmap |
| **Week Details** | `/roadmap/[id]/week/[week]` | Detailed tasks for a specific week |
| **AI Assistant** | `/assistant` | Ask questions about roadmap content |

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_API_URL=<backend-fastapi-url>
```

### Variables Explained

- **`NEXT_PUBLIC_SUPABASE_URL`**: Your Supabase project URL (found in Supabase settings)
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Supabase anonymous API key for client-side auth
- **`NEXT_PUBLIC_API_URL`**: Base URL of the FastAPI backend (e.g., `http://localhost:8000` for local development or the deployed backend URL)

All `NEXT_PUBLIC_*` variables are exposed to the browser and safe for public use.

## Local Development Setup

### Prerequisites
- Node.js 18+ (recommended 20+)
- npm or yarn
- A Supabase account with a configured project
- Access to the FastAPI backend (running locally or deployed)

### Installation & Setup

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd momentum-ai-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy or create a `.env.local` file in the project root
   - Add the variables listed in the [Environment Variables](#environment-variables) section
   - Example:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   The application will be available at [http://localhost:3000](http://localhost:3000)

5. **Open the application**:
   - Open your browser and navigate to `http://localhost:3000`
   - You'll be redirected to login if not authenticated

### Development Commands

```bash
# Run development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Screenshots

### Authentication
- Login page with Google OAuth and Magic Link options
- *[Screenshot placeholder: /login page]*

### Dashboard
- Roadmap list with progress indicators
- Daily task queue
- Streak and completion statistics
- *[Screenshot placeholder: /dashboard page]*

### Generate Roadmap
- Form to create personalized learning roadmaps
- Goal, duration, hours, and skill level inputs
- *[Screenshot placeholder: /generate page]*

### Roadmap Progress
- Weekly breakdown with goals and progress bars
- Week-by-week task completion view
- *[Screenshot placeholder: /roadmap/[id]/weeks page]*

### AI Assistant
- Question form with roadmap context
- AI-generated responses about learning content
- *[Screenshot placeholder: /assistant page]*

## Notes & Limitations

### Current Scope (Frontend Only)
- This repository contains only the **frontend application**
- Backend service (FastAPI) is required for full functionality
- Roadmap generation, task creation, and question answering are handled by the backend

### Dependencies on Backend
The following features depend on a running FastAPI backend:
- Roadmap generation and persistence
- Task creation and management
- Weekly summaries and goals
- AI assistant responses
- User progress analytics

### Session Management
- Authentication is handled by Supabase
- Sessions are managed client-side via Supabase SDK
- Users are automatically redirected to login if session expires

### Styling
- Uses Tailwind CSS with custom design tokens
- Responsive design for mobile, tablet, and desktop
- Dark theme with zinc and blue color palette

### Browser Support
- Modern browsers with ES2020+ support required
- Recommended: Chrome, Firefox, Safari, Edge (latest versions)

## Deployment

The frontend is deployed on [Vercel](https://vercel.com) and automatically updates on push to the main branch. For custom deployment instructions, refer to [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Related Repositories

- **Backend (FastAPI)**: See the backend repository for API documentation and setup instructions

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
