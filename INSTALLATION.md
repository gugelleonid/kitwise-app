# KitWise Installation Guide

## Prerequisites

- Node.js 18+ (https://nodejs.org/)
- npm or yarn package manager

## Quick Start

### 1. Clone or Navigate to Project

```bash
cd kitwise
```

### 2. Install Dependencies

```bash
npm install
```

If you encounter npm registry issues, try:

```bash
npm install --legacy-peer-deps
```

Or use yarn:

```bash
yarn install
```

### 3. Environment Setup

The `.env.local` file is already configured with demo credentials.

For production, update with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm run start
```

## Troubleshooting

### npm Registry Issues

If you get 403 errors from npm registry:

```bash
npm config set registry https://registry.npmjs.org/
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

If port 3000 is in use:

```bash
npm run dev -- -p 3001
```

### TypeScript Errors

Clear Next.js cache:

```bash
rm -rf .next
npm run build
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel Dashboard
3. Add environment variables
4. Deploy

```bash
npm i -g vercel
vercel
```

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Build and run:

```bash
docker build -t kitwise .
docker run -p 3000:3000 kitwise
```

## Demo Mode

The application works in **demo mode** without external dependencies:

- Loads from `localStorage` for user data
- Uses mock data for equipment and recommendations
- No Supabase connection required for testing

To use live Supabase:

1. Update `.env.local` with your credentials
2. Ensure Supabase tables exist
3. The app will automatically try to load from Supabase

## Project Structure

```
kitwise/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable React components
│   ├── lib/              # Utilities, types, mock data
├── public/               # Static assets
├── .env.local            # Environment variables (demo)
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind CSS config
├── next.config.mjs       # Next.js config
└── README.md             # Documentation
```

## Available Scripts

- `npm run dev` - Start development server (hot reload)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter (if configured)

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

1. Use production build for deployment
2. Enable image optimization
3. Configure CDN for static assets
4. Use Vercel for automatic optimization

## Support & Documentation

- Read `/src/lib/types.ts` for data structure
- Check `/src/lib/mockData.ts` for sample data
- Review component files for implementation details

## License

MIT - See repository for details
