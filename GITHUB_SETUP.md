# GitHub & Vercel Deployment Guide

Complete step-by-step guide to get your Energy Game live with a shareable URL in 10 minutes.

## ✅ Prerequisites

- Git installed (https://git-scm.com/)
- GitHub account (free at https://github.com) - takes 2 minutes to create
- Vercel account (free at https://vercel.com) - can sign up with GitHub

## 📋 Step 1: Create GitHub Repository (2 minutes)

### A. Create Account (skip if you have one)

1. Go to https://github.com/signup
2. Enter email, password, username
3. Complete verification
4. You're done!

### B. Create New Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `energy-game` (or any name you like)
   - **Description**: `30-day energy management simulation game`
   - **Visibility**: Public (so you can deploy to Vercel free)
3. Click "Create repository"
4. Don't initialize with README (we already have one)
5. You'll see a page with instructions - **copy the HTTPS URL** (you'll need it in Step 2)

Example URL: `https://github.com/YOUR-USERNAME/energy-game.git`

## 🔧 Step 2: Push Code to GitHub (2 minutes)

Open terminal/PowerShell in the energy-game folder:

```bash
cd "c:\Users\User\Desktop\energy game"
```

### Initialize Git

```bash
git init
git add .
git commit -m "Initial commit: Energy Game complete"
git branch -M main
```

### Connect to GitHub (Replace YOUR-USERNAME)

```bash
git remote add origin https://github.com/YOUR-USERNAME/energy-game.git
git push -u origin main
```

**What to do if you get an authentication error:**
1. GitHub now requires Personal Access Tokens instead of passwords
2. Generate one:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token"
   - Check "repo" box
   - Click "Generate"
   - Copy the token (save it somewhere safe)
3. Try push again, use the token as your password

**Or use GitHub Desktop (easier):**
- Download at https://desktop.github.com
- Much simpler UI than command line

## ✅ Verify on GitHub

Go to https://github.com/YOUR-USERNAME/energy-game

You should see your code there! ✨

## 🚀 Step 3: Deploy to Vercel (3 minutes)

### A. Create Vercel Account

1. Go to https://vercel.com/signup
2. **Sign up with GitHub** (easiest method)
3. Authorize Vercel to access your GitHub account
4. You're logged in!

### B. Deploy Your Game

1. Go to https://vercel.com/dashboard
2. Click **"New Project"**
3. Under "Import Git Repository", find `energy-game`
4. Click on it to select
5. Click **"Deploy"**
6. **Wait 2-3 minutes**...

### C. Get Your Live URL

When deployment completes, Vercel shows a URL like:
```
https://energy-game-abc123.vercel.app
```

**That's your game!** 🎮

## 📤 Step 4: Share with Team (1 minute)

Just send them:
```
https://energy-game-abc123.vercel.app
```

They click it, game loads in browser. No installation needed!

### Optional: Get Custom Domain

Vercel lets you use a custom domain (free for .vercel.app, paid for other domains):

1. Go to https://vercel.com/dashboard
2. Click on your "energy-game" project
3. Go to "Settings" → "Domains"
4. Add your custom domain

## 🔄 Making Updates (After Initial Deploy)

Every time you update code:

```bash
git add .
git commit -m "Your change description"
git push
```

Vercel automatically redeploys in 1-2 minutes!

## 📋 Checklist

- [ ] GitHub account created
- [ ] Repository created at github.com
- [ ] Code pushed to GitHub (`git push` successful)
- [ ] Repository shows up at github.com/YOUR-USERNAME/energy-game
- [ ] Vercel account created (signed up with GitHub)
- [ ] New Project created in Vercel
- [ ] Deployment completed (shows "Ready")
- [ ] Game loads at vercel URL
- [ ] Shared URL with team members

## 🆘 Troubleshooting

### "Git: command not found"
- Install Git from https://git-scm.com/
- Restart terminal after installing

### "Authentication failed"
- Use GitHub Personal Access Token (see Step 2)
- Or use GitHub Desktop GUI

### Vercel deployment failed
- Check Vercel build logs for error messages
- Most common: Missing dependencies
  - Solution: `npm install && npm --prefix backend install && npm --prefix frontend install` locally first
  - Then commit and push

### Deployed but game shows blank
- Wait 30 seconds for page to fully load
- Hard refresh: Ctrl+Shift+R (Windows)
- Check browser console (F12) for errors

### Need to deploy without GitHub
Use Vercel CLI:
```bash
npm install -g vercel
cd "c:\Users\User\Desktop\energy game"
vercel
```

## 💡 Pro Tips

1. **Custom Domain**: Add any domain in Vercel settings
2. **Environment Variables**: Set in Vercel dashboard if needed
3. **Rollback**: Vercel keeps deployment history - click "Deployments" to switch versions
4. **Analytics**: Vercel dashboard shows who's playing
5. **Analytics Alerts**: Get notified if game goes down

## 📞 Support

- **GitHub Issues**: Create issues in your repository if problems occur
- **Vercel Support**: https://vercel.com/support
- **Game Issues**: Check browser console (F12) for JavaScript errors

## 🎉 You're Done!

Your game is now live on the internet!

Share the URL with anyone:
```
https://energy-game-abc123.vercel.app
```

They play instantly. No setup needed on their end.

---

**Next Steps:**
1. Test the game at your Vercel URL
2. Send link to team members
3. Share feedback
4. Make updates locally → `git push` → Vercel auto-deploys

**Questions?** See main [README.md](README.md) for more info.
