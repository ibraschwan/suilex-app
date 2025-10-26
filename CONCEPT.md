# 🏛️ SUILEX — The Law of Data

**Tagline**: *"Your data, your Lex."*

A decentralized AI data marketplace on Sui, where creators mint, license, and protect their knowledge using AI verification and on-chain proof of ownership.

---

## 🧠 What is Suilex?

Suilex is a Web3 platform that turns data and digital works — novels, documents, code, research — into **verifiable, ownable assets** on the Sui blockchain.

### Core Capabilities

**For Creators** 🧑‍🎓
- Upload data → verified by AI → minted as a **Data NFT** with clear license terms
- Monetize knowledge transparently with on-chain proof of ownership
- Set licensing terms and royalties

**For AI Companies** 🧠
- Browse, buy, and download verified datasets via **License NFTs**
- Proof of legal training rights
- Transparent provenance and quality scores

**For Verifiers** 🤖
- Detect data misuse using fingerprinting + canary phrases
- Generate transparent proof reports
- On-chain evidence anchoring

### Positioning

**Think of it as**: OpenSea + HuggingFace + Legal License Layer — powered by Sui

---

## ⚙️ System Architecture

```
 ┌───────────────────────────────────────────────────────┐
 │                FRONTEND (React/Next.js)               │
 │  - Creator Studio (upload/mint)                       │
 │  - Marketplace (browse/buy)                           │
 │  - Verifier Portal (detect misuse)                    │
 │  - My Dashboard (track NFTs, earnings)                │
 └───────────────┬───────────────────────────────────────┘
                 │
                 ▼
 ┌───────────────────────────────────────────────────────┐
 │              BACKEND (Node/Python)                    │
 │                                                        │
 │  AI Verification Engine                               │
 │  ├─ Quality scoring                                   │
 │  ├─ PII scrubbing                                     │
 │  ├─ Originality check (MinHash/SimHash)              │
 │  └─ Auto-tagging (domain classifier)                  │
 │                                                        │
 │  Fingerprint Service                                  │
 │  ├─ Generates and stores fingerprints                 │
 │  └─ Detects overlap / canary hits                     │
 │                                                        │
 │  IPFS Integration                                     │
 │  ├─ Uploads encrypted file, returns CID               │
 │  └─ Content-addressable storage                       │
 │                                                        │
 │  Evidence API                                         │
 │  └─ Generates JSON proof reports + IPFS link          │
 └───────────────┬───────────────────────────────────────┘
                 │
                 ▼
 ┌───────────────────────────────────────────────────────┐
 │          SUI SMART CONTRACTS (Move)                   │
 │                                                        │
 │  DataNFT                                              │
 │  ├─ Metadata + proof hash + license                   │
 │  ├─ IPFS CID reference                                │
 │  └─ Royalty configuration                             │
 │                                                        │
 │  LicenseNFT                                           │
 │  ├─ Ownership + rights + term                         │
 │  ├─ Reference to DataNFT                              │
 │  └─ Access logging                                    │
 │                                                        │
 │  Events                                               │
 │  ├─ Listed, Purchased, Accessed                       │
 │  └─ Verified, ProofAnchored                           │
 │                                                        │
 │  Features                                             │
 │  ├─ Royalty distribution logic                        │
 │  └─ Proof anchoring (commit fingerprint hashes)       │
 └───────────────┬───────────────────────────────────────┘
                 │
                 ▼
 ┌───────────────────────────────────────────────────────┐
 │       DECENTRALIZED STORAGE (IPFS/Arweave)            │
 │  - Stores dataset (encrypted if private)              │
 │  - Returns CID referenced in Data NFT metadata        │
 │  - Stores Evidence JSONs from verifier reports        │
 │  - Permanent, immutable, censorship-resistant         │
 └───────────────────────────────────────────────────────┘
```

---

## 🧩 Data Object Model (On-Chain Structs)

### DataNFT

```move
struct DataNFT has key, store {
    id: UID,
    owner: address,
    title: vector<u8>,
    cid: vector<u8>,               // IPFS hash
    tags: vector<vector<u8>>,      // ["Medical", "MRI", "Research"]
    ai_score: u8,                  // 0–100 quality score
    fp_commitment: vector<u8>,     // sha256(SimHash + MinHash blob)
    license_type: u8,              // 0=ViewOnly, 1=TrainAllowed
    price_sui: u64,                // Price in MIST (smallest SUI unit)
    royalties_bps: u16,            // Basis points (e.g., 250 = 2.5%)
    created_at: u64,               // Timestamp
    domain: vector<u8>,            // Auto-classified domain
}
```

### LicenseNFT

```move
struct LicenseNFT has key, store {
    id: UID,
    dataset: ID,                   // Reference to DataNFT
    buyer: address,
    rights: u8,                    // 0=View, 1=Train, 2=Distribute
    issue_time: u64,               // Unix timestamp
    term_days: u64,                // License duration (0 = perpetual)
    access_count: u64,             // Number of times accessed
}
```

### VerificationProof

```move
struct VerificationProof has key, store {
    id: UID,
    dataset: ID,
    score: u8,                     // 0-100
    originality: u8,               // % original
    pii_risk: u8,                  // 0=None, 1=Low, 2=Medium, 3=High
    proof_cid: vector<u8>,         // IPFS link to full report
    verified_at: u64,
    verifier: address,
}
```

### Core Contract Functions

```move
// DataNFT Management
public entry fun mint_data_nft(...)
public entry fun transfer_data_nft(nft: DataNFT, recipient: address)
public entry fun update_price(nft: &mut DataNFT, new_price: u64)
public entry fun delist(nft: DataNFT)

// Marketplace
public entry fun list_nft(nft: DataNFT, price: u64)
public entry fun buy_license(dataset_id: ID, payment: Coin<SUI>): LicenseNFT
public entry fun log_access(license: &mut LicenseNFT)

// Verification
public entry fun anchor_proof(dataset: ID, proof_hash: vector<u8>)
public entry fun verify_dataset(dataset: &mut DataNFT, score: u8)
```

---

## 💡 Infrastructure Components

| Layer | Technology | Description |
|-------|-----------|-------------|
| **Blockchain** | Sui Move Contracts | Immutable proof of ownership, licensing, and events |
| **Storage** | IPFS / Arweave | Stores encrypted datasets and proof reports |
| **Verification** | Python Microservice | AI-based quality, PII detection, originality checks |
| **Fingerprint** | SimHash + MinHash | Generates signatures for misuse detection |
| **Frontend** | React + Sui WalletKit | User interface for upload, buy, verify |
| **Payment** | SUI Tokens | Instant, low-fee transactions and royalties |
| **Analytics** | Supabase / Vercel | Track usage, earnings, marketplace metrics |

---

## 🧭 User Flows

### 👩‍🎨 Creator Flow

```
1. Connect Sui wallet
   ↓
2. Click "Create New Dataset"
   ↓
3. Upload file (TXT/PDF/CSV/JSON)
   ↓
4. AI verification runs
   ├─ "Originality: 92%"
   ├─ "Domain: Medical"
   ├─ "PII Risk: Low"
   └─ "Quality Score: 88/100"
   ↓
5. Set price + license type
   ├─ View Only: $50
   ├─ Train Allowed: $500
   └─ Royalties: 2.5%
   ↓
6. Click "Mint NFT"
   ↓
7. Wallet confirms transaction
   ↓
8. ✅ "Data NFT Minted on Sui"
   ↓
9. Dataset appears in marketplace instantly
```

### 🧠 Buyer Flow (AI Company/Researcher)

```
1. Browse marketplace
   ├─ Filter: "AI Verified"
   ├─ Filter: "Train Allowed"
   └─ Search: "medical imaging"
   ↓
2. Open dataset detail
   ├─ View preview
   ├─ See tags, price, license
   └─ Check verification score
   ↓
3. Click "Buy License"
   ↓
4. Choose license type
   ├─ View Only
   ├─ Train Allowed
   └─ Commercial Rights
   ↓
5. Confirm in wallet
   ↓
6. Suilex mints LicenseNFT
   ├─ Sends SUI to creator (minus platform fee)
   └─ Records transaction on-chain
   ↓
7. Buyer can now download
   ├─ Verified via wallet signature
   └─ Downloads from IPFS
   ↓
8. Each access logs "Accessed" event on-chain
```

### 🔍 Verifier Flow

```
1. Paste text sample
   ├─ From AI model output
   └─ From web/publication
   ↓
2. Backend runs comparison
   ├─ SimHash similarity check
   ├─ MinHash fingerprint match
   └─ Canary phrase detection
   ↓
3. Results returned
   ├─ If similarity > 0.3: "High Match"
   ├─ If canary hit: "Definite Match"
   └─ Show matching datasets
   ↓
4. Generate Evidence JSON
   {
     "dataset": "0x123...",
     "similarity": 0.84,
     "canary_hits": ["opal-tide paragraph eleven"],
     "timestamp": "2025-10-25T15:30Z"
   }
   ↓
5. Upload report to IPFS
   ↓
6. Anchor hash on-chain
   ↓
7. ✅ Transparent proof of misuse
```

---

## 🖼️ Frontend Views

| View | Description | Key Visual Elements |
|------|-------------|---------------------|
| **Home / Explore** | Grid of verified datasets | Clean cards with Sui-blue badges: "AI Verified 92%" |
| **Dataset Detail** | Full info + buy button | Sidebar: price, license, proof score, creator wallet |
| **Creator Studio** | Upload + verify + mint | Animated "AI Scanning…" + real-time tag display |
| **Dashboard** | My assets, earnings, downloads | Tabs: "My Datasets" / "My Licenses" / "Earnings" |
| **Verifier Tool** | Paste text → detect misuse | Gauge meter + similarity score + canary badges |
| **Proof Explorer** | Browse public proofs | Search by CID or dataset name, timeline view |

---

## 🎨 Design System

### Theme
- **Base**: Dark mode with Sui-blue gradients
- **Accent**: Neon/teal glow effects
- **Mood**: Professional, trustworthy, futuristic

### Typography
- **Primary**: Manrope or Poppins (modern clarity)
- **Code/Mono**: Fira Code (wallet addresses, IDs)
- **Sizes**:
  - H1: 48px (bold)
  - H2: 32px (bold)
  - Body: 16px (regular)
  - Small: 14px (medium)

### Colors

```css
/* Primary Palette */
--primary: #3A82F6;           /* Sui blue */
--primary-glow: #4F9FFF;      /* Bright blue */
--secondary: #8B5CF6;         /* Deep purple */
--success: #22C55E;           /* Verified green */

/* Backgrounds */
--bg-dark: #0D1117;           /* Main background */
--surface-dark: #161B22;      /* Card backgrounds */
--border-dark: #30363d;       /* Borders */

/* Text */
--text-primary: #E6EDF3;      /* White/off-white */
--text-secondary: #8B949E;    /* Gray */
--text-muted: #6E7681;        /* Subtle */
```

### UI Elements

**Primary Button**
- Background: Gradient `linear-gradient(135deg, #3A82F6, #8B5CF6)`
- Border-radius: 12px
- Padding: 12px 24px
- Font-weight: 600
- Glow effect on hover

**Card**
- Background: `#161B22`
- Border: 1px solid `#30363d`
- Border-radius: 16px
- Hover: Border changes to `#3A82F6` with subtle glow

**Badge (Verified)**
- Background: `rgba(34, 197, 94, 0.1)`
- Text: `#22C55E`
- Icon: Checkmark shield
- Border-radius: 20px (pill shape)

### Icons
- **Style**: Simple outline icons
- **Library**: Material Symbols Outlined
- **Key Icons**:
  - 📚 Book (datasets)
  - 🧠 Brain chip (AI verification)
  - 🔒 Lock (encryption)
  - ⚖️ Scales (Lex/law)
  - ✨ Sparkle (verification)
  - 🎯 Target (accuracy)

### Animations
- **Smooth fades**: 300ms ease-in-out for all transitions
- **Loading**: Pulsing skeleton loaders
- **Wallet confirm**: Slide-up modal with backdrop blur
- **AI check**: Progress bar with scanning effect
- **Success**: Checkmark animation + confetti (optional)

### Brand Motif
- **Primary**: ⚖️ Scales (representing "Lex" - law/rules)
- **Secondary**: Stylized "S" combining Sui droplet with legal symbol
- **Pattern**: Subtle geometric grid background suggesting data structure

---

## 🔐 Value Proposition

| Stakeholder | Value Delivered |
|-------------|-----------------|
| **Creators** | • Monetize data transparently<br>• Proof of ownership on-chain<br>• Automated royalties<br>• Control over licensing terms |
| **AI Companies** | • Access high-quality, rights-cleared data<br>• Proof of legal training rights<br>• Transparent provenance<br>• No legal ambiguity |
| **Sui Ecosystem** | • Becomes trusted data backbone for AI<br>• Attracts Web2 AI companies to Web3<br>• Real-world utility for blockchain |
| **Public/Users** | • Trust that AI models respect creator rights<br>• Transparency in AI training data<br>• Decentralized alternative to closed datasets |

---

## 🧩 Tech Stack Summary

### Smart Contracts
- **Language**: Move
- **Blockchain**: Sui
- **Development**: Sui CLI, Move Analyzer

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **State**: Zustand + React Query
- **Wallet**: @mysten/dapp-kit, WalletKit

### Backend
- **API**: FastAPI (Python) or Express (Node.js)
- **AI Services**:
  - HuggingFace Transformers (quality scoring)
  - OpenAI API (semantic analysis)
  - Custom ML models (domain classification)
- **Fingerprinting**:
  - SimHash (fuzzy matching)
  - MinHash (approximate similarity)
  - pylsh library

### Storage
- **Primary**: IPFS (via Web3.storage or Pinata)
- **Backup**: Arweave (permanent storage)
- **Database**: Supabase (PostgreSQL) for metadata cache

### DevOps
- **Hosting**: Vercel (frontend), AWS/GCP (backend services)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry, Vercel Analytics
- **RPC**: Sui RPC endpoints (testnet/mainnet)

---

## 🏁 Elevator Pitch

> **Suilex is the decentralized legal layer for AI data** — a Sui-based marketplace where creators mint verified datasets, buyers obtain on-chain licenses, and AI models can finally train on transparent, ethical data.
>
> Every dataset carries its own **Lex** — a proof of origin, ownership, and rights — backed by AI verification and cryptographic fingerprinting.
>
> We're building the future where data creators are compensated fairly, AI companies have legal clarity, and the entire ecosystem operates with transparency on the Sui blockchain.

### The Problem
- AI companies train on data without permission
- Creators can't prove ownership or get compensated
- No transparent way to verify data usage
- Legal gray area around training data rights

### The Solution
Suilex provides:
1. **Proof of Ownership**: DataNFTs on Sui blockchain
2. **Legal Clarity**: On-chain License NFTs with clear terms
3. **Verification**: AI-powered quality + fingerprinting for misuse detection
4. **Transparency**: All transactions, licenses, and proofs are public

### Why Sui?
- **Fast**: <1s finality for instant transactions
- **Cheap**: Low gas fees for micropayments
- **Scalable**: Parallel execution for high throughput
- **Safe**: Move language prevents common vulnerabilities

### Traction Potential
- **Target**: AI labs, research institutions, data aggregators
- **Market Size**: $200B+ AI training data market
- **Differentiation**: Only blockchain-native solution with proof of rights
- **Network Effect**: More datasets → more buyers → more creators

---

## 📐 Next Steps for Implementation

1. **Deploy MVP Smart Contracts** to Sui testnet
2. **Build AI Verification Microservice** (quality + fingerprinting)
3. **Implement Frontend Views** (Creator Studio, Marketplace, Verifier)
4. **Set up IPFS Integration** for dataset storage
5. **Create Demo Datasets** with real verification scores
6. **Launch Beta** with select creators and AI labs
7. **Gather Feedback** and iterate
8. **Mainnet Deploy** with audit

---

## 🎯 Success Metrics

### Technical KPIs
- NFT minting time: <5 seconds
- IPFS upload: <10s for 1GB
- Verification accuracy: >95%
- Uptime: 99.9%

### Business KPIs
- Datasets listed (Month 1): 100+
- Active creators: 50+
- License purchases: 20+
- Total GMV: $10,000+

### User Satisfaction
- Creator satisfaction: 4.5+/5
- Buyer NPS: 40+
- Platform trust score: 85%+

---

**Built with ❤️ on Sui**

*Suilex — Where Data Meets Its Lex*
