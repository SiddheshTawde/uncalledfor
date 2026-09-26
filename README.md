# Uncalled For

*A journaling app with an attitude problem.*

Write your entry. Get unsolicited advice back — blunt, funny, occasionally too
accurate. Nobody asked for this. Everybody needs it.

---

## What it does

Uncalled For is a journal that talks back. Every entry you write gets a
short, banter-y, unsolicited response — never cruel, never a personal attack,
just the kind of honest nudge you'd get from a friend who's done being polite
about it. If an entry reads as genuinely heavy rather than everyday griping,
the app drops the bit and responds like an actual human would.

## Stack

- **Framework:** Next.js (App Router, Server Actions, authenticated API routes)
- **Mobile:** React Native with Expo Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Auth:** Clerk
- **Database:** Neon (serverless Postgres)
- **AI:** Groq (`openai/gpt-oss-120b`) for advice generation

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd uncalled-for
pnpm install
```

### 2. Set up environment variables

Create a `.env.local` file:

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Neon
DATABASE_URL=

# Groq
GROQ_API_KEY=
```

- Get Clerk keys from [clerk.com](https://clerk.com)
- Get a Neon connection string from [neon.tech](https://neon.tech)
- Get a free Groq API key (no card required) from [console.groq.com](https://console.groq.com)

### 3. Set up the database

Run this against your Neon database (via the Neon SQL editor or your client
of choice):

```sql
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  entry TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`.

### Mobile app

Copy `apps/mobile/.env.example` to `apps/mobile/.env` and set:

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_existing_clerk_publishable_key
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Use your computer's LAN IP instead of `localhost` when running on a physical
device. The mobile app uses the existing Clerk application and the authenticated
Next API at `/api/entries`; database and Groq credentials remain server-only.

Start the mobile app with:

```bash
pnpm --filter mobile start
```

The app supports Clerk sign-in, journal submission, AI comments, local Zustand
state backed by AsyncStorage, entry listing, and deletion. The web and mobile
clients share the domain types, store, date formatting, and API client packages.

## How the advice engine works

Each entry is sent to Groq along with a system prompt that defines the app's
voice: funny, blunt, self-deprecating — but always aimed at the situation or
behavior, never at the person's character. A built-in escape hatch detects
genuine distress and drops the humor entirely in favor of a plain, supportive
response. The prompt lives in its own file so the tone can be tuned without
touching application code.

## Roadmap / ideas

- [x] Mobile app (React Native/Expo), reusing the same advice-engine API
- [ ] Mood tagging per entry
- [ ] Entry search and filtering
- [ ] Export entries

## License

[MIT](LICENSE) — do whatever you want with it, no advice needed (for once).