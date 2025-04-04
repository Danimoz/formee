# Formee - AI-Powered Form Builder

Formee is a modern, AI-powered form builder application built with Next.js 15, featuring dynamic form generation, real-time AI assistance, and a robust authentication system.

## Key Features

- 🤖 AI-Powered Form Generation
- 🔐 Secure Authentication (Email, OAuth)
- 📝 Dynamic Form Builder Interface
- 💬 AI-Assisted Form Creation
- 📊 Form Response Management
- 🌙 Dark/Light Mode Support
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **UI Components**: ShadCN
- **Styling**: Tailwind CSS
- **State Management**: React Hook Form, SWR
- **AI Integration**: Ollama AI Provider

## Getting Started

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```env
DATABASE_URL="your_postgresql_connection_string"
# Auth related environment variables
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
# Add any additional provider secrets if using OAuth
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable UI components
- `/prisma` - Database schema and migrations
- `/src/lib` - Utility functions and configurations
- `/src/hooks` - Custom React hooks

## Features in Detail

### AI Form Generation
Leverage AI to automatically generate forms based on natural language descriptions. The system uses Ollama AI provider for intelligent form field suggestions and validations.

### Authentication System
Robust authentication system built with NextAuth.js v5, supporting:
- Email/Password authentication
- OAuth providers (configurable)
- Session management
- User profile management

### Form Builder Interface
- Drag-and-drop form builder
- Real-time preview
- Multiple field types support
- Form response collection and management

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
