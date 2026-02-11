# WalletClear

**Understand your crypto wallet in plain English.**

WalletClear fetches your on-chain transaction history using block explorer APIs, categorises each transaction (transfers, swaps, approvals, NFTs), flags spam tokens and address-poisoning attempts, and lets you chat with an AI assistant that explains everything in plain English.

## Features

- 🔍 **Human-readable transactions** — no more decoding hex
- 🛡️ **Scam detection** — automatic spam flagging & address poisoning warnings
- ⛓️ **Multi-chain** — Ethereum, BNB Chain, Polygon
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
# Block explorer keys
ETHERSCAN_API_KEY=your_etherscan_key
BSCSCAN_API_KEY=your_bscscan_key
POLYGONSCAN_API_KEY=your_polygonscan_key

# AI chat (server-side only)
GEMINI_API_KEY=your_gemini_key
```

### Where to get API keys

| Key                   | Source           | Link                                                             |
| --------------------- | ---------------- | ---------------------------------------------------------------- |
| `ETHERSCAN_API_KEY`   | Etherscan        | [etherscan.io/apis](https://etherscan.io/apis)                   |
| `BSCSCAN_API_KEY`     | BscScan          | [bscscan.com/apis](https://bscscan.com/apis)                     |
| `POLYGONSCAN_API_KEY` | PolygonScan      | [polygonscan.com/apis](https://polygonscan.com/apis)             |
| `GEMINI_API_KEY`      | Google AI Studio | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

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

Add all four API keys in the Vercel dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add each key from `.env.example`
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
- **APIs**: Etherscan, BscScan, PolygonScan, CoinGecko

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
- `GEMINI_API_KEY` is **server-side only** — never exposed to the browser
- Block explorer keys are safe to expose (they are public API rate-limit keys)
