# StoryNest Frontend

React-based frontend for the StoryNest blogging platform.

## Tech Stack

- React 18
- TypeScript
- TailwindCSS
- Vite
- React Router DOM
- React Hook Form
- React Query
- React Hot Toast
- Lucide React (Icons)

## Project Structure

```
src/
├── components/      # Reusable UI components
├── contexts/        # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API service functions
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your values:

```
VITE_API_URL=http://localhost:3001
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

3. Run development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Components

The UI is built with custom components using TailwindCSS for styling. Key components include:

- Button
- Card
- Input
- TextArea
- RichTextEditor
- Modal
- Avatar
