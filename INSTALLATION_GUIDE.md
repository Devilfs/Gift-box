
# Installation Guide - Digital Gift Box Generator

## Problem: npm not recognized

This means Node.js is not installed or not in your system PATH.

---

## Solution: Install Node.js

### Option 1: Download from website (Recommended)

1. Go to: https://nodejs.org
2. Download the **LTS (Long Term Support)** version
3. Run the installer
4. Restart your terminal/command prompt
5. Verify installation:
   ```
   node --version
   npm --version
   ```

### Option 2: Using Windows Package Manager (if you have winget)

Run in PowerShell or Command Prompt:
```powershell
winget install OpenJS.NodeJS.LTS
```

### Option 3: Using Chocolatey (if installed)

```powershell
choco install nodejs-lts
```

---

## After Installing Node.js

### Step 1: Navigate to the project

Open Command Prompt and run:
```
cd e:\gift_box
```

### Step 2: Install dependencies

```
npm install
```

This will create a `node_modules` folder and install all packages.

### Step 3: Configure environment

Edit `.env.local` file with your credentials (see `.env.example`)

### Step 4: Set up database

1. Create free account at https://supabase.com
2. Create new project
3. Copy SQL from `supabase/schema.sql`
4. Run in Supabase SQL Editor

### Step 5: Start the app

```
npm run dev
```

### Step 6: Open in browser

Go to: http://localhost:3000

---

## Troubleshooting

### "npm is not recognized" after install

- Restart your computer
- Or restart your terminal
- Check Node.js installed in: `C:\Program Files\nodejs`

### Port 3000 already in use

Change port in package.json or run:
```
npm run dev -- -p 3001
```

### Supabase connection errors

- Verify `.env.local` has correct URL and keys
- Check Supabase project is active

---

## Quick Test
