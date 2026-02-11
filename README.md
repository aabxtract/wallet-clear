# WalletClear

**Understand your crypto wallet in plain English.**

WalletClear fetches your on-chain transaction history using the Etherscan V2 API, categorises each transaction (transfers, swaps, approvals, NFTs), flags spam tokens and address-poisoning attempts, and lets you chat with an AI assistant that explains everything in plain English.

## Features

- 🔍 **Human-readable transactions** — no more decoding hex
- 🛡️ **Scam detection** — automatic spam flagging & address poisoning warnings
- ⛓️ **Multi-chain** — Ethereum, BNB Chain, Polygon (one API key for all)
- 🤖 **AI Chat** — ask questions about your wallet powered by Gemini

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your API keys:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
# One key covers all EVM chains via Etherscan V2
ETHERSCAN_API_KEY=your_etherscan_key

# AI chat (server-side only)
GEMINI_API_KEY=your_gemini_key

# Optional — free tier works without a key
COINGECKO_API_KEY=
```

### Where to get API keys

| Key                 | Source                                | Link                                                             |
| ------------------- | ------------------------------------- | ---------------------------------------------------------------- |
| `ETHERSCAN_API_KEY` | Etherscan V2 (one key for all chains) | [etherscan.io/apis](https://etherscan.io/apis)                   |
| `GEMINI_API_KEY`    | Google AI Studio                      | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `COINGECKO_API_KEY` | CoinGecko (free tier needs no key)    | [coingecko.com](https://www.coingecko.com/en/api)                |

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Vercel

### Quick deploy

```bash
npx vercel
```

### Set environment variables

Add your API keys in the Vercel dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add `ETHERSCAN_API_KEY` and `GEMINI_API_KEY`
3. Set them for **Production**, **Preview**, and **Development**

### Deploy to production

```bash
npx vercel --prod
```

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 1.5 Flash
- **APIs**: Etherscan V2 (all chains), CoinGecko

## Project Structure

```
app/
  page.tsx              # Landing page
  [address]/page.tsx    # Wallet analysis page
  api/
    chat/route.ts       # AI chat endpoint
    transactions/route.ts # Transaction fetching endpoint
components/             # React components
lib/                    # Data fetching, parsing, spam detection
constants/              # Chain configurations
types/                  # TypeScript type definitions
```

## Security Notes

- **Read-only** — never asks for private keys or seed phrases
- All API keys are **server-side only** — used only in `app/api/` routes
- No keys are prefixed with `NEXT_PUBLIC_` or exposed to the browser
- `next.config.js` does not forward any keys to the client bundle
