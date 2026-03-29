# KitWise Deployment Guide

## Vercel Deployment (Recommended)

Vercel is the optimal deployment platform for Next.js applications.

### Step 1: Prepare Your Code

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub account
3. Authorize Vercel to access your repositories

### Step 3: Import Project

1. In Vercel Dashboard, click "Add New..." → "Project"
2. Select your GitHub repository
3. Framework Preset: Select "Next.js"
4. Click "Import"

### Step 4: Configure Environment Variables

1. In project settings, go to "Environment Variables"
2. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL: https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY: your-anon-key-here
```

3. Click "Save"

### Step 5: Deploy

Click "Deploy" button. Vercel will:
- Clone your repository
- Install dependencies
- Build the project
- Deploy to production

Your app will be live at: `https://kitwise.vercel.app`

### Step 6: Custom Domain (Optional)

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records at your domain registrar
4. Verify domain ownership

---

## Manual Deployment

### Option A: Heroku

```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create kitwise-app

# Add environment variables
heroku config:set NEXT_PUBLIC_SUPABASE_URL=https://...
heroku config:set NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Deploy
git push heroku main
```

### Option B: Railway

1. Go to https://railway.app
2. Connect GitHub account
3. Create new project
4. Select repository
5. Add environment variables
6. Deploy

### Option C: Docker on Any VPS

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]
```

Create `.dockerignore`:

```
node_modules
.git
.next
```

Build and deploy:

```bash
docker build -t kitwise:latest .
docker push your-registry/kitwise:latest
```

---

## Production Checklist

- [ ] Environment variables configured
- [ ] Database tables created in Supabase
- [ ] CORS properly configured
- [ ] SSL/TLS enabled
- [ ] Monitoring/logging set up
- [ ] Backup strategy in place
- [ ] Domain configured
- [ ] Email notifications configured

## Environment Variables Reference

```env
# Required for all environments
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key

# Optional for advanced features
NEXT_PUBLIC_APP_URL=https://kitwise.app
```

## Performance Optimization

### Build Optimization

- ✓ Image optimization enabled
- ✓ CSS minification
- ✓ JavaScript minification
- ✓ Automatic code splitting

### Caching Strategy

- Static assets: 1 year
- API responses: 5 minutes
- Homepage: 1 hour

### Monitoring

1. Set up application monitoring (Sentry, DataDog, etc.)
2. Configure error tracking
3. Set up performance monitoring
4. Create alerts for critical errors

## Troubleshooting Production Issues

### Slow Performance

1. Check database query performance
2. Enable caching
3. Optimize images
4. Use CDN for static assets

### 500 Errors

1. Check server logs in Vercel dashboard
2. Verify environment variables
3. Check database connectivity
4. Review error messages in console

### Build Failures

1. Check build logs
2. Ensure all dependencies are in package.json
3. Verify TypeScript types
4. Test build locally: `npm run build`

## Rollback Procedure

### Vercel

1. Go to Deployments tab
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Manual Rollback

```bash
git revert HEAD
git push origin main
# Redeploy
```

## Database Backup

### Supabase Backup

1. Go to Supabase dashboard
2. Database → Backups
3. Configure automatic backups
4. Set retention policy (7+ days recommended)

### Manual Backup

```bash
# Export data from Supabase
pg_dump --url postgres://user:password@host/db > backup.sql

# Keep secure and versioned
```

## Scaling Considerations

For high traffic:

1. Enable database read replicas
2. Implement caching layer (Redis)
3. Use CDN for static content
4. Scale backend resources
5. Implement rate limiting

## Post-Deployment

1. Test all features in production
2. Monitor analytics
3. Set up alerts
4. Create monitoring dashboard
5. Document procedures

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Community: https://github.com/vercel/next.js/discussions
