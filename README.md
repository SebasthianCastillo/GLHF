# GLHF Inventory App

Mobile application for personal chef usage to control inventory management with a Node.js and MongoDB backend. Developed using React Native and Expo.

---

## 📦 Versions and Changes

### ✅ v1.0 DONE

- a. Edit/Delete category or product by holding down (with confirmation)
- b. Display available products in the product detail view (DIV)

### ✅ v1.0.1 (minor improvements to v1) DONE

- a. Replaced DownPicker with a modal for selecting product formats

### 🚀👷 v1.1 (in development c:)

- a. Category button color change when long-pressed ✅
- b. Product search by category 👷 _[In progress]_
- c. Pull to refresh products ✅
- d. Performance: Improved add/subtract units (save after a few seconds, not on every increment) 🔜 _[Planned]_
- e. Fix: prevent app from closing when long-clicking two products consecutively
- f. Feat: PDF download by chef inventory quantity requirements

---

## 🧪 Commit Conventions

This project follows the commit conventions proposed in the following article:

🔗 [Conventional Git Commits - Best Practices](https://dev.to/anikakash/conventional-git-commits-with-best-practices-4d2)

---

## 🌐 Backend Deployment (Render)

Main server file: `~/Desktop/INVS/glhf/api/server.mjs`

### Project structure:

INVS/
└── glhf/
└── api/
└── server.mjs

yaml
Copy code

### Render configuration:

- **Root Directory:** `glhf/api`
- **Build Command:** `npm install` _(if there's a `package.json`)_
- **Start Command:** `node server.mjs`

---

## 📱 Generate APK / AAB for Android (Expo + EAS)

### 1. Install EAS CLI

```bash
npm install -g eas-cli
2. Log in to Expo


eas login
3. Configure EAS in the project


eas build:configure
4. Generate build
APK:



eas build -p android --profile preview
AAB (Play Store):


eas build --platform android --profile preview
Debug Configuration (VS Code / Cursor)
npx expo start

Start the backend:
node server.mjs
Configure launch.json inside .vscode:


{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Node Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/api/server.mjs",
      "cwd": "${workspaceFolder}/api",
      "runtimeArgs": ["--experimental-modules"]
    },
    {
      "name": "Attach to Hermes application",
      "request": "attach",
      "type": "reactnativedirect",
      "cwd": "${workspaceFolder}"
    }
  ]
}
```
