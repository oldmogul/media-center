# Media Center

Uganda Media Centre website — Command Centre, Press Room, Ministries, Languages Desk, Radio and Engagement.

Source is TypeScript in `src/`. Compiled JavaScript in `js/` is what the pages load.

Typography matches [mediacentre.go.ug](https://mediacentre.go.ug/): **Inter**.

## Run locally

```bash
npm install
npm run build
python -m http.server 5173
```

Or `npm start` (compiles, then serves on port 5173).

Open http://localhost:5173

## Scripts

| Command | What it does |
|---|---|
| `npm run build` | Compile `src/*.ts` → `js/*.js` |
| `npm run watch` | Rebuild on TypeScript changes |
| `npm start` | Compile and serve on :5173 |
