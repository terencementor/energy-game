# 📋 Energy Game - Complete Deployment Commands

Copy and paste these commands in order to deploy your game.

---

## ✅ STEP 1: Prepare for Deployment (1 minute)

Before you start, you need:
1. GitHub account (free): https://github.com/signup
2. Your GitHub username
3. A new empty repository: https://github.com/new

**Create Repository on GitHub:**
1. Go to https://github.com/new
2. Name: `energy-game`
3. Visibility: Public
4. **Don't** initialize with README
5. Click Create
6. Copy the HTTPS URL shown (looks like: `https://github.com/YOUR-USERNAME/energy-game.git`)

---

## 📤 STEP 2: Push Code to GitHub (3 minutes)

Open PowerShell or Terminal in the energy-game folder:

```powershell
cd "c:\Users\User\Desktop\energy game"
```

Then run these commands one at a time:

### Initialize Git
```powershell
git init
```

### Configure Git (first time only)
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"
```

### Stage All Files
```powershell
git add .
```

### Commit Files
```powershell
git commit -m "Initial commit: Energy Game complete and ready for deployment"
```

### Rename Branch
```powershell
git branch -M main
```

### Add GitHub Repository
**Replace YOUR-USERNAME with your actual GitHub username:**
```powershell
git remote add origin https://github.com/YOUR-USERNAME/energy-game.git
```

### Push to GitHub
```powershell
git push -u origin main
```

**If you get authentication errors:**
1. Go to https://github.com/settings/tokens
2. Generate new Personal Access Token
3. Check "repo" scope
4. Copy the token
5. When git asks for password, paste the token instead

---

## ✅ Verify on GitHub

Go to: `https://github.com/YOUR-USERNAME/energy-game`

You should see all your files there! ✅

---

## 🚀 STEP 3: Deploy to Vercel (2 minutes)

### Option A: GitHub + Vercel (Easiest)

1. Go to https://vercel.com/signup
2. Click **"Sign up with GitHub"**
3. Authorize Vercel to access your GitHub
4. Go to https://vercel.com/dashboard
5. Click **"New Project"**
6. Find and click on `energy-game` repository
7. Click **"Deploy"**
8. **Wait 2-3 minutes for deployment to complete**

When done, you'll see:
```
Deployment completed
https://energy-game-abc123.vercel.app
```

**That's your live game URL!** 🎮

### Option B: Vercel CLI (If You Prefer)

```powershell
npm install -g vercel
cd "c:\Users\User\Desktop\energy game"
vercel
```

Follow the prompts. Takes ~3 minutes.

---

## 🎉 STEP 4: Share Your Game!

Get your Vercel URL (from Step 3), it looks like:
```
https://energy-game-abc123.vercel.app
```

**Send this to your team!** They click it and play immediately. ✅

---

## 🔄 Future Updates (After Initial Deployment)

Every time you make changes:

```powershell
cd "c:\Users\User\Desktop\energy game"
git add .
git commit -m "Your change description here"
git push
```

Vercel automatically redeploys in 1-2 minutes! ⚡

---

## ⚡ Quick Reference

### All Commands in Order
```powershell
# 1. Navigate to project
cd "c:\Users\User\Desktop\energy game"

# 2. Initialize git
git init
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"

# 3. Commit everything
git add .
git commit -m "Initial commit: Energy Game complete"
git branch -M main

# 4. Add GitHub (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/energy-game.git

# 5. Push to GitHub
git push -u origin main

# 6. Deploy with Vercel:
#    a) Go to https://vercel.com/signup
#    b) Sign up with GitHub
#    c) Click New Project
#    d) Select energy-game
#    e) Click Deploy
#    f) Wait 2-3 minutes
#    g) Copy URL and share!
```

---

## 🧪 Test Locally First (Optional)

Want to test before deploying?

```powershell
cd "c:\Users\User\Desktop\energy game"
npm install
npm --prefix backend install
npm --prefix frontend install
npm run build-vercel
npm start
```

Visit: http://localhost:3000

Works? Ready to deploy! ✅

---

## 🆘 Common Issues

### "git: The term 'git' is not recognized"
- Install Git: https://git-scm.com/
- Restart PowerShell after installing

### "fatal: not a git repository"
- Run `git init` first

### "authentication failed"
- Use GitHub Personal Access Token (not password)
- Go to https://github.com/settings/tokens
- Generate token, use it as password

### "Vercel deployment failed"
- Check Vercel logs for error
- Run `npm run build-vercel` locally to debug
- Make sure all files are committed to git

### "Game shows blank after deploying"
- Wait 30 seconds for load
- Hard refresh: Ctrl+Shift+R
- Check browser console (F12) for errors

---

## ✨ What Happens After Deploy

- ✅ Your game is live at a public URL
- ✅ Anyone can visit and play (no setup needed)
- ✅ 24/7 uptime guaranteed
- ✅ Auto-updates on every git push
- ✅ Free forever (Vercel free tier)
- ✅ Global CDN (fast worldwide)

---

## 📝 Checklist

- [ ] Created GitHub account
- [ ] Created GitHub repository
- [ ] Copied GitHub repository URL
- [ ] `git init` in project folder
- [ ] `git add .` and `git commit`
- [ ] `git remote add origin` with your URL
- [ ] `git push -u origin main`
- [ ] Verified files appear on GitHub
- [ ] Created Vercel account (sign up with GitHub)
- [ ] Created new Vercel project
- [ ] Selected energy-game repository
- [ ] Clicked Deploy
- [ ] Waited for deployment to complete
- [ ] Copied Vercel URL
- [ ] Tested Vercel URL in browser
- [ ] Shared URL with team

---

## 🎯 You're All Set!

Your game is ready to deploy. Just run the commands above and you'll have a live URL in 5 minutes.

**The fastest path:**
1. Run the commands in STEP 2 (git push)
2. Sign up on Vercel with GitHub
3. Deploy in 2 clicks
4. Share URL with team
5. Done! 🚀

---

Questions? See the detailed guides:
- **Quick Start**: [QUICK_START.md](QUICK_START.md)
- **GitHub Setup**: [GITHUB_SETUP.md](GITHUB_SETUP.md)
- **Game Docs**: [README.md](README.md)

**Let's go!** 🚀🎮
