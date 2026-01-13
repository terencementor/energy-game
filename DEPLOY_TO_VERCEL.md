# Energy Game - Deploy to Vercel (Free Cloud Hosting)

## Quick Start (Fastest Method)

### Option A: GitHub + Vercel (Recommended - 3 minutes)

1. **Push to GitHub**
   - Create a new GitHub repository (free at github.com)
   - Push this project to GitHub:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/YOUR-USERNAME/energy-game.git
     git push -u origin main
     ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your `energy-game` repository
   - Click "Deploy"
   - **Done!** Your game has a live URL in ~2 minutes

### Option B: Manual Vercel Deploy (5 minutes)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd c:\Users\User\Desktop\energy game
   vercel
   ```
   - Follow the prompts
   - Choose "production" deployment
   - **Done!**

## What Happens After Deployment

✅ Your game is live at: `https://your-project.vercel.app`
✅ Share the URL with your team - they just click it
✅ No setup needed for anyone
✅ Works on any device with a browser
✅ 24/7 uptime

## Features of This Deployment

- **Free hosting** - No credit card needed
- **Auto-scaling** - Handles any number of players
- **Global CDN** - Fast from anywhere
- **Automatic deployments** - Push to GitHub → Auto-updates
- **Custom domain** - Optional (yourcompany.com)

## Sharing With Your Team

Just send them one URL:
```
https://your-project.vercel.app
```

They click it, play immediately. No installation, no setup, no Node.js needed!

## Troubleshooting

**"Cannot find module"**
- Wait 5 minutes for the build to complete

**"Port already in use"**
- Vercel automatically handles this

**"Frontend not loading"**
- The build script copies frontend/dist to backend/dist/public
- Check that both `npm run build-backend` and `npm run build-frontend` complete without errors

## Updating Your Game

**With GitHub:**
1. Make changes locally
2. `git add .` → `git commit -m "changes"` → `git push`
3. Vercel auto-deploys in ~2 minutes

**Manual:**
1. Make changes
2. Run `vercel --prod` to redeploy

## Cost

**$0/month** - Vercel's free tier includes:
- 1000 API calls/day (plenty for a team)
- 100GB bandwidth/month
- Unlimited builds/deployments
- Always-on hosting

Perfect for internal team games!
