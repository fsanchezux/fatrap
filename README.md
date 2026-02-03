# Fatrap Explorer

A modern file explorer web application built with Next.js, TailwindCSS, and PostgreSQL.

![Fatrap Explorer](https://via.placeholder.com/800x450?text=Fatrap+Explorer)

## Features

- macOS-style file explorer interface
- Dynamic sidebar with sections loaded from database
- Grid and list view modes
- Search functionality
- Responsive design
- PostgreSQL database with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: Next.js API Routes, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or use Vercel Postgres)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/fatrap-explorer.git
cd fatrap-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/fatrap_explorer"
```

4. Push the database schema:
```bash
npm run db:push
```

5. Seed the database with sample data:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `DATABASE_URL` environment variable in Vercel
4. Deploy!

### Using Vercel Postgres

1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Connect it to your project
4. The `DATABASE_URL` will be automatically added

## API Endpoints

### Sidebar Options
- `GET /api/sidebar-options` - Get all sidebar sections and options
- `POST /api/sidebar-options` - Create a new sidebar option
- `GET /api/sidebar-options/[id]` - Get a specific option
- `PUT /api/sidebar-options/[id]` - Update an option
- `DELETE /api/sidebar-options/[id]` - Delete an option

### Files
- `GET /api/files` - Get all files

## License

MIT
