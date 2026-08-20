# 🤝 Contributing to RescueAI

Thank you for helping build **RescueAI** — the offline-first AI emergency response and disaster coordination platform!

Follow this step-by-step guide for open-source contributors to fork the repo, commit changes, and submit Pull Requests to the main repository.

---

## 🚀 Quick Step-by-Step Workflow for Contributors

### Step 1: Fork the Main Repository
1. Go to the main repository: [https://github.com/theadhi/rescue-ai](https://github.com/theadhi/rescue-ai) (or [https://github.com/rootnode-rebels/rescue-ai](https://github.com/rootnode-rebels/rescue-ai)).
2. Click the **Fork** button in the top-right corner to create your personal copy under `https://github.com/YOUR_GITHUB_USERNAME/rescue-ai`.

---

### Step 2: Clone Your Fork to Your Laptop
Open your terminal and run:
```bash
# Clone your personal fork
git clone https://github.com/YOUR_GITHUB_USERNAME/rescue-ai.git
cd rescue-ai

# Set upstream remote to the main repository
git remote add upstream https://github.com/theadhi/rescue-ai.git
git fetch upstream
```

---

### Step 3: Create a Feature Branch
Always create a fresh feature branch off `upstream/main`:
```bash
git checkout -b feature/my-awesome-feature upstream/main
```

---

### Step 4: Make Your Changes & Commit
Make your code changes, test locally (`npm run dev`), and commit:
```bash
git add .
git commit -m "feat: clear description of what you built or fixed"
```

---

### Step 5: Push Branch to Your Fork
Push your feature branch to your GitHub fork:
```bash
git push -u origin feature/my-awesome-feature
```

---

### Step 6: Create the Pull Request on GitHub
1. Open your browser and go to your fork: `https://github.com/YOUR_GITHUB_USERNAME/rescue-ai`
2. You will see a green banner: **"Compare & pull request"**. Click it!
3. Ensure the comparison settings are:
   - **Base Repository**: `theadhi/rescue-ai` (or `rootnode-rebels/rescue-ai`)
   - **Base Branch**: `main`
   - **Head Repository**: `YOUR_GITHUB_USERNAME/rescue-ai`
   - **Compare Branch**: `feature/my-awesome-feature`
4. Add a clear title and description, then click **Create Pull Request**! 🎉

---

## ⚡ Automated 1-Click PR Script for Contributors

If you have a GitHub Personal Access Token (PAT), you can run our automated helper script in PowerShell:

```powershell
# Run PR script
.\scripts\create-pr.ps1 -GithubUser "YOUR_USERNAME" -Token "YOUR_PAT_TOKEN" -Branch "feature/my-feature" -Title "feat: my new feature" -Body "Description of changes"
```

---

## 🛡️ Git Best Practices
- **Never push secrets**: Make sure `.env` and `.env.local` files are ignored.
- **Test before PR**: Always run `npm run dev` and ensure there are no build errors.
- **Keep PRs focused**: Each Pull Request should address a specific issue or feature.
