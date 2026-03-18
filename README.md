# Skill Builder — v_selfserve

A self-service web app where users describe their industry or company, define available data, and build skills (AI agents). **Sign-in required** (Google); the Claude API key stays on the server so only your signed-in users can use your tokens.

## Run locally

1. **Set up Firebase (Google Sign-In)**  
   - Go to [Firebase Console](https://console.firebase.google.com/), create a project (or use existing).  
   - Enable **Authentication** → **Sign-in method** → **Google** (turn on, set support email, save).  
   - In **Project settings** → **General** → **Your apps**, add a web app if needed, and copy the config (apiKey, authDomain, projectId).

2. **Configure env**  
   Copy `.env.example` to `.env` and set:
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID` (from Firebase config).  
   - `LLM_API_KEY` — your [Anthropic API key](https://console.anthropic.com/).  
   - `FIREBASE_API_KEY` — same as `VITE_FIREBASE_API_KEY` (used by the server to verify tokens).

3. **Start the API server and the app** (two terminals):

   ```bash
   npm install
   npm run dev:server    # Terminal 1: API on http://localhost:3001
   npm run dev           # Terminal 2: App on http://localhost:5173
   ```

   Open http://localhost:5173. You’ll see a sign-in screen; after signing in with Google, only you (or whoever you allow) can use the app and your Claude tokens.

## Code structure (separation of concerns)

- **`src/domain/`** — Pure conversation logic: id generation, factory, title derivation, data-item factory. No I/O, no React.
- **`src/api/`** — HTTP client for the skill backend (recommendations, generate skill). Auth token is passed in by the caller.
- **`src/repositories/`** — Conversation persistence (localStorage). Single responsibility; no domain or API logic.
- **`src/hooks/`** — Application orchestration: `useConversations` (list, current, persist, add/remove data) and `useSkillActions` (get recommendations, generate skill + loading). Use domain + repository + api; no UI.
- **`src/contexts/`** — Auth state and methods (e.g. Firebase).
- **`src/components/`** — Presentational UI; receive props and callbacks only.
- **`App.tsx`** — Composition only: providers, auth gate, and layout that wires hooks to components.

## Layout

- **Left nav:** Search + conversation history, **Sign out** and email at the bottom.  
- **Panel 1:** “Tell me about your industry or company” — baseline context.  
- **Panel 2:** What data is available; **Get recommendations** uses Claude.  
- **Panel 3:** Generated skill; **Generate skill** uses Claude; **Download** / **Copy** for the result.

## Security

- The **Claude API key** is only on the server (`server/index.js`). The browser never sees it.  
- Every request to `/api/recommend-data` and `/api/generate-skill` must send a valid Firebase ID token (`Authorization: Bearer <token>`). The server verifies the token with Firebase before calling Claude.  
- Only users who can sign in with Google (and any restrictions you add later) can use the app.

## Persistence

Conversations are stored in **localStorage** per browser. No backend is required for that.

## Build and production

- **Build frontend:** `npm run build` → `dist/`.  
- **Run API server:** set `PORT`, `LLM_API_KEY`, and `FIREBASE_API_KEY`, then `node server/index.js`.  
- If the API is on another origin, set `VITE_API_URL` in `.env` (e.g. `https://api.yoursite.com`) so the frontend calls the right host.

## Deploy to GitHub Pages

**Yes, the app can run on GitHub Pages**, with one requirement: **the API server cannot run on GitHub Pages** (it only serves static files). So you deploy two parts:

1. **Frontend (static)** → GitHub Pages  
   - Build with `VITE_API_URL` set to your hosted API (see below).  
   - For a **project site** (`https://<user>.github.io/<repo>/`), build with a base path:
     ```bash
     BASE_PATH=/v_selfserve/ npm run build
     ```
     (Use your repo name instead of `v_selfserve` if different.)  
   - In the repo: **Settings → Pages → Source**: deploy from the branch that contains the built files (e.g. `gh-pages` with `dist/` at the root), or use the **Actions** tab with a workflow that runs `npm run build` and uploads `dist/`.

2. **API server** → host elsewhere  
   - Deploy `server/index.js` to a Node host (e.g. [Render](https://render.com), [Railway](https://railway.app), [Fly.io](https://fly.io), or [Vercel](https://vercel.com) with a serverless function adapter).  
   - Set `LLM_API_KEY` and `FIREBASE_API_KEY` in that host’s environment.  
   - Enable CORS for your GitHub Pages origin (e.g. `https://<user>.github.io`).

3. **Firebase**  
   - In Firebase Console → **Authentication** → **Settings** → **Authorized domains**, add your GitHub Pages domain (e.g. `yourusername.github.io`).

Then when building the frontend for production, set:

```bash
VITE_API_URL=https://your-api-host.example.com
BASE_PATH=/your-repo-name/   # only for GitHub project pages
npm run build
```

After deploy, the site on GitHub Pages will load, sign-in will work, and “Get recommendations” / “Generate skill” will call your hosted API.
