# Smart Bookmark Manager

A simple, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Users can sign up/login via Google OAuth, add private bookmarks (title + URL), view them in real-time across devices, and delete selected ones. Bookmarks are user-specific and update instantly without page refreshes.

## Features
- **Google OAuth Login**: Secure sign-up and login using Google (no email/password required).
- **Add Bookmarks**: Input a title and URL to save personal bookmarks.
- **Private Bookmarks**: Each user's bookmarks are isolated (User A can't see User B's).
- **Real-Time Updates**: Changes sync instantly across tabs/devices using Supabase Realtime.
- **Delete Bookmarks**: Select and delete multiple bookmarks at once.
- **Responsive UI**: Clean, animated interface with sliding backgrounds and particles.

## Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend/Auth/Database**: Supabase (Auth, PostgreSQL, Realtime)
- **Deployment**: Vercel

## Live Demo
[View the live app on Vercel](https://smart-bookmark-manager-eight.vercel.app)   

## Setup (Optional - For Local Development)
1. Clone the repo: `git clone https://github.com/varshini2814/smart-bookmark-manager.git`
2. Install dependencies: `npm install`
3. Set up Supabase: Create a project at [supabase.com](https://supabase.com), enable Google OAuth, and create a `bookmarks` table with columns: `id` (uuid, primary), `title` (text), `url` (text), `user_id` (uuid, foreign key to auth.users), `created_at` (timestamp).
4. Add environment variables: Create a `.env.local` file with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Run locally: `npm run dev`

## Problems and Solutions
During development, I encountered several issues and resolved them as follows:
- **TypeScript Error in Real-Time useEffect**: The `useEffect` for Supabase real-time subscriptions caused TypeScript errors due to improper channel cleanup and unstable dependencies. **Solution**: Wrapped `fetchBookmarks` in `useCallback` to stabilize it, added proper cleanup with `supabase.removeChannel(channel)`, and included `fetchBookmarks` in the dependency array. This prevented memory leaks and ensured reliable real-time updates.
- **Bookmarks Not Fetching Immediately After Adding**: After clicking "Add Bookmark," the UI required a page refresh to show the new bookmark, even with real-time enabled. **Solution**: Added an immediate `fetchBookmarks()` call right after the Supabase insert in the `addBookmark` function. This acts as a fallback, ensuring instant UI updates while real-time handles cross-tab sync.
- **Git Commit/Push Issues**: Initial pushes failed due to unstaged changes or auth problems. **Solution**: Ensured files were saved in VS Code, used `git status` to check, staged with `git add`, committed with descriptive messages, and used a GitHub personal access token for authentication.
- **Vercel Deployment Delays**: Builds took time or failed due to missing env vars. **Solution**: Added Supabase keys in Vercel Project Settings > Environment Variables, ensured the GitHub repo was public, and triggered redeploys manually if needed.
- **UI Responsiveness and Animations**: Sliding backgrounds and particles caused performance issues on slower devices. **Solution**: Optimized with `useCallback` for particle generation and used CSS animations for smooth, lightweight effects.

## Contributing
Feel free to fork and submit PRs!
