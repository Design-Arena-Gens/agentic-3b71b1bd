# Can I Upload a Pic Here?

A small Next.js app that answers the question “can I upload a pic here?” with an interactive drag-and-drop demo. Files never leave the browser—this is a client-side preview that demonstrates what an upload experience could look like.

## Stack

- Next.js 14 (App Router)
- React 18
- Vanilla CSS

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser to test drag-and-drop uploads locally.

## Scripts

- `npm run dev` – start the development server
- `npm run build` – create an optimized production build
- `npm start` – serve the production build
- `npm run lint` – run ESLint with Next.js defaults

## Deploy

This project is ready for Vercel. Build locally first (`npm run build`) and then run:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-3b71b1bd
```

Once DNS propagates, the site will be available at https://agentic-3b71b1bd.vercel.app.
