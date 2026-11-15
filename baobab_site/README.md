# Baobab

Site vitrine React + Vite de Baobab, agence technologique qui conçoit des solutions numériques pour tous les secteurs.
Il est déployé sur Cloudflare Workers (assets statiques) : https://baobab.strart.workers.dev

## Structure

```
.
├── index.html          # page d'entrée Vite (#root + /src/main.tsx)
├── src/                # composants React, styles, contenus, assets
│   ├── components/
│   └── assets/
├── public/             # fichiers copiés tels quels (favicon, _headers…)
├── dist/               # build Vite (généré, ignoré par git)
├── wrangler.jsonc      # configuration Cloudflare Workers (assets → ./dist)
└── package.json        # scripts dev / build / preview / deploy
```

## Lancer en local

```sh
npm install
npm run dev
```

## Vérifier et compiler

```sh
npx tsc --noEmit
npm run build
```

## Déployer

```sh
npm run deploy
```

La commande compile puis publie `dist/` sur Cloudflare Workers. Elle suppose d'être connecté (`npx wrangler login`) ; rien d'autre à configurer.
