# Rejil Raj PR — Portfolio

Dark, animated single-page portfolio. Next.js 16 (App Router) + Tailwind v4 + Motion.

Everything below is free, with no credit card and no paid tier.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## 1. Connect the contact form (2 minutes, free)

The form posts to [Web3Forms](https://web3forms.com): 250 submissions/month free,
forever, and no account to create.

1. Go to <https://web3forms.com>
2. Type the email you want messages delivered to, press **Create Access Key**
3. Check that inbox for a key like `1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p`
4. Open `src/lib/content.ts` and replace `PASTE_YOUR_KEY_HERE`:

```ts
export const WEB3FORMS_KEY = "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p";
```

That key is safe to commit. It only allows *sending* a message to your inbox,
and it keeps your email address out of the page source so scrapers cannot read
it. Until you set it, the form tells visitors to email you directly instead of
pretending the message went through.

The form already handles validation, submitting, success and error states, and
carries a honeypot field to absorb bot spam.

## 2. Put it online (free, on Vercel)

Vercel's Hobby tier is free and made by the Next.js team, so this deploys with
no configuration.

**Push to GitHub**

```bash
# this folder is already a git repo with one commit
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Create the empty repo first at <https://github.com/new> — no README, no
.gitignore, since this folder already has both.

**Deploy**

1. Go to <https://vercel.com/new> and sign in with GitHub
2. Import the repository you just pushed
3. Leave every setting at its default and press **Deploy**

You get `https://<repo-name>.vercel.app` with free HTTPS. Every later
`git push` redeploys automatically.

To use your own domain later, add it under Project → Settings → Domains. The
domain itself costs money; Vercel does not charge to connect it.

## Editing the site

Almost all copy lives in one file, `src/lib/content.ts`: the headline, bio,
stats, experience, projects, skills, and links.

- `src/app/globals.css` — theme tokens, one accent (electric cyan), and the
  CSS scroll-driven reveal system
- `src/components/` — one file per section

### Your photo

The hero layers `public/rejil.png` between the two lines of display type, so a
background-removed cut-out works best. To reframe it, adjust `top-[...]` and the
width/height clamps on the portrait wrapper in `src/components/Hero.tsx`.

### Motion

Two systems, kept deliberately separate:

- **Content reveals are CSS** (`.reveal`, `.fade-up`, `.split-mount` in
  `globals.css`). They work with no JavaScript, so text can never be stranded
  invisible by a script failure. Verified: zero hidden elements in the server
  HTML.
- **Motion (JS) is only used where it cannot hide anything**: hero parallax,
  card tilt, the timeline rail, the scroll progress bar, magnetic buttons.

Everything honours `prefers-reduced-motion`.
