This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Formulaire de contact — Email via Nodemailer + Gmail

Cette app inclut une route API `src/app/api/contact/route.ts` qui envoie un email via Gmail grâce à Nodemailer.

### Variables d'environnement requises

Ajoutez ces variables dans un fichier `.env.local` à la racine (non versionné) ou dans la configuration d'environnement de votre plateforme (ex: Vercel):

```
GMAIL_USER=adresse@gmail.com
GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
CONTACT_TO=destinataire@domaine.com
```

- `GMAIL_USER`: votre adresse Gmail expéditrice.
- `GMAIL_APP_PASSWORD`: un mot de passe d'application Google (voir ci-dessous).
- `CONTACT_TO`: l'adresse qui recevra les messages (par défaut, `GMAIL_USER`).

### Créer un mot de passe d'application Gmail

1. Activez la validation en 2 étapes sur votre compte Google.
2. Allez sur Mon compte Google → Sécurité → Mots de passe d'application.
3. Créez un mot de passe pour "Mail" et l'appareil "Autre" (ex: "Nodemailer").
4. Copiez le mot de passe généré et placez-le dans `GMAIL_APP_PASSWORD`.

### Installation

Installez la dépendance:

```bash
npm install nodemailer
```

### Développement local

1. Créez `.env.local` avec les variables ci-dessus.
2. Lancez le serveur: `npm run dev`.
3. Ouvrez la page `http://localhost:3000/contact` et envoyez un message.

### Déploiement

- Déclarez les mêmes variables d'environnement sur votre plateforme (ex: Vercel → Project Settings → Environment Variables).
- Le service Gmail + mot de passe d'application fonctionne en production sans configuration SMTP avancée.
