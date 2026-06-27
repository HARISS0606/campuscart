# CampusCart — Buy, Sell, Reuse

A secondhand marketplace built for students to buy and sell textbooks,
cycles, furniture, and other items within their own campus community.

## Why this project

Every semester, students throw away or stockpile items (books, cycles,
furniture) that the next batch of students need. CampusCart connects
sellers and buyers within the same campus, reduces waste, and saves
money on both sides.

## Features

- College-email sign-in (Google auth, restricted to verified students in production)
- Post listings with photo, category, price, and condition
- Browse, search, and filter by category (Books, Cycles, Furniture, Electronics, Other)
- Wishlist / save items for later
- "Message seller" placeholder for in-app chat
- Mark items as sold
- Demo mode: runs with mock data out of the box, no setup required
- Firestore security rules so only the original seller can edit/delete their own listing

### Planned / stretch features
- AI-suggested fair price based on similar past listings
- Course-code based textbook matching (seniors → juniors)
- Sustainability counter (items reused, estimated waste saved)
- Meetup point suggestion via campus map
- Escrow-style "confirm receipt" flow for higher-value items

## Tech stack

| Layer | Tool |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Firebase (Auth, Firestore, Storage) |
| Hosting | Vercel / Netlify / Firebase Hosting |

## Getting started

```bash
npm install
npm run dev
```

The app runs immediately in **demo mode** with mock data — no Firebase
setup needed to try it out.

## Connecting Firebase (for real accounts + persistence)

1. Go to the [Firebase console](https://console.firebase.google.com) and create a project.
2. Enable **Authentication** (Google sign-in), **Firestore Database**, and **Storage**.
3. Copy `.env.example` to `.env` and fill in your Firebase project's config values.
4. Deploy the included security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
5. Restart the dev server: `npm run dev`

## Project structure

```
campuscart/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── FilterBar.jsx
│   │   ├── ItemCard.jsx
│   │   └── PostItemModal.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── firebase.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── firestore.rules
├── .env.example
├── package.json
└── vite.config.js
```

## Deploying

```bash
npm run build
```
Deploy the `dist/` folder to Vercel, Netlify, or Firebase Hosting.

## License

MIT — free to use and modify for hackathons and coursework.
