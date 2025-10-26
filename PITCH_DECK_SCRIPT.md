## Suilex — Pitch Deck Script (Tailored, Slide-by-Slide)

Use this script to present Suilex in 10–12 minutes. It is fully filled with details from your concept and hackathon docs, avoids speculative numbers, and keeps claims tied to what exists or is explicitly on your roadmap.

---

### 1) Title and one-liner
- You say:
  - “I’m [Name], founder of Suilex. We’re the decentralized legal layer for AI training data on Sui — ‘Your data, your Lex.’”
  - “We let creators mint verified datasets as Data NFTs, and let AI companies buy on-chain licenses with legal clarity and transparent provenance.”
- Visuals:
  - Suilex logo, tagline, hero UI screenshot from homepage/marketplace.
- Proof points to show on the slide:

  - Built on Sui (fast finality, low fees, Move safety)
  - Decentralized storage via Walrus

---

### 2) Problem and urgency
- You say:
  - “AI companies routinely train on data without permission; creators have no effective proof of ownership and don’t get paid.”
  - “There’s no transparent way to verify data usage or rights for training — it’s a legal gray area with real compliance risk.”
  - “Centralized platforms create single points of failure and censorship risk.”
- Visuals:
  - ‘Current state’ workflow: Creator → uploads to web → gets copied → AI training → no attribution/compensation.
- Evidence you can reference (from your docs):
  - Clear articulation of harms: no permission, no proof, legal ambiguity, centralization.
  - Target market context: AI training data is a very large market; rights clarity is becoming essential.

---

### 3) Why now (market shift)
- You say:
  - “Three shifts make this solvable now: (1) Sui’s performance and Move safety enable fast, low-cost, secure licensing on-chain; (2) decentralized storage like Walrus is production-ready for large assets; (3) AI industry pressure for rights-cleared, provenance-rich datasets is accelerating.”
- Visuals:
  - Three tiles: Sui (sub-second finality/low fees), Walrus (content-addressed permanent storage), AI governance/regulatory pressure for data rights.

---

### 4) Solution overview (value, not features)
- You say:
  - “Suilex turns datasets into verifiable, ownable assets on Sui. Creators mint Data NFTs with license terms and proofs; buyers purchase License NFTs to obtain training rights with transparent provenance.”
  - “Value: creators monetize with automatic royalties and proof of ownership; buyers get legal clarity, provenance, and trust.”
- Visuals:
  - Before/after diagram: opaque data sourcing → Suilex verifiable marketplace with on-chain rights.

---

### 5) Product (short demo storyboard)
- You say (3-step narrative):
  - “Creator uploads dataset → AI verification (quality, PII risk, originality) → mints Data NFT with license and price.”
  - “Buyer browses marketplace → buys License NFT → downloads from Walrus; access is logged on-chain.”
  - “Verifier pastes suspect text → fingerprint/canary detection → anchors proof on-chain.”
- Visuals:
  - 3–5 annotated screenshots from: Upload flow, Dataset detail, Purchase modal, Dashboard earnings, Verifier tool.
- Quant/UX (non-speculative):
  - Sui benefits (fast, low-cost), on-chain events (‘Listed’, ‘Purchased’, ‘Accessed’, ‘Verified’).

---

### 6) Ideal customer profile and use cases
- You say:
  - “ICP: (a) data creators — researchers, authors, developers with valuable datasets or digital works; (b) AI labs/companies seeking rights-cleared training data; (c) verifiers detecting misuse.”
  - “Use cases: monetize datasets with royalties; buy rights-clear training data; generate public proof of misuse via fingerprinting/canaries.”
- Visuals:
  - Three ICP tiles with a specific job-to-be-done each.

---

### 7) Market sizing (grounded framing)
- You say:
  - “The AI training data space is very large, and rights-cleared datasets are becoming a necessity. Our initial serviceable market focuses on creators and AI teams who need provable licenses and provenance.”
  - “We start within the Sui and Web3 ecosystem and expand to Web2 AI labs as compliance pressure grows.”
- Visuals:
  - TAM/SAM/SOM rings labeled qualitatively (rights-cleared AI data; creators and AI labs; Sui-first beachhead), without speculative numbers.

---

### 8) Business model and pricing
- You say:
  - “Marketplace take rate: 2.5% platform fee; creators keep 97.5% — transparent and on-chain.”
  - “Creators set price and license; buyers receive a License NFT as on-chain proof of training rights.”
  - “Roadmap includes enterprise/private marketplaces and potential subscriptions for value-added services.”
- Visuals:
  - Payment split schematic (Buyer → Smart contract → 97.5% Creator, 2.5% Platform; License NFT minted).

---

### 9) Traction and proof (current status)
- You say:
  - “MVP status: ~90% complete. Smart contracts implemented (Profile, DataNFT, Marketplace). Walrus client integrated. Contract TypeScript utilities ready. Profile system and core UI built (Header/Footer/Layout, Homepage, Dashboard, Settings).”
  - “Remaining: Upload flow integration, marketplace queries, dataset detail, purchase, download; then deploy to Sui testnet/mainnet and Vercel.”
- Visuals:
  - Checklist from your status section; architecture snapshot.

---

### 10) Go-to-market strategy
- You say:
  - “Phase 1: Sui-first launch — onboard initial creators through hackathons, crypto-native researchers, and the Sui community; founder-led outreach; social channels.”
  - “Phase 2: Partner with AI labs and research institutions for rights-cleared pilot datasets; verifiable proof benefits for compliance.”
  - “Phase 3: Integrations (Kaggle/HuggingFace import), enterprise/private marketplaces, and API access for purchased datasets.”
- Visuals:
  - Funnel: creators onboarded → quality datasets → buyers convert → verifiers generate proofs → network effects.

---

### 11) Competition and positioning
- You say:
  - “Alternatives: centralized data platforms, open hubs (e.g., general-purpose model hubs), data brokers, or in-house legal workflows.”
  - “Suilex wedge: on-chain ownership and licensing with Data/License NFTs, decentralized storage (Walrus) instead of centralized servers, transparent royalties (97.5% to creators), and verifiable misuse proofs anchored on-chain.”
- Visuals:
  - Value matrix: Criteria (rights proof, provenance, decentralization, royalties, misuse detection) vs Alternatives vs Suilex.

---

### 12) Moat and defensibility
- You say:
  - “Data network effects: more creators list datasets → more buyers seek rights-cleared data → more verifiers detect misuse → stronger provenance/rights ledger attracts more participants.”
  - “On-chain history, fingerprints, and proof anchoring create switching costs and trust that compounds.”
  - “Move and Sui primitives plus Walrus storage produce a secure, low-cost substrate for durable licensing.”
- Visuals:
  - Flywheel: supply → demand → proofs → trust → growth.

---

### 13) Unit economics (pre-revenue posture)
- You say:
  - “Monetization primarily via a transparent 2.5% take rate on marketplace transactions.”
  - “Decentralized storage reduces centralized infra costs and aligns with long-term asset durability.”
  - “As a marketplace with on-chain settlement and royalties, we target healthy gross margins while minimizing custodial risk.”
- Visuals:
  - Simple economics diagram (no speculative % or $ beyond the 2.5% fee already defined).

---

### 14) Product roadmap and milestones
- You say (aligned to your docs):
  - “Next: deploy Move contracts to Sui testnet → ship upload/purchase/download flows → end-to-end testing → deploy frontend to Vercel.”
  - “Feature expansion: AI verification scoring; dataset previews; reviews/ratings; subscriptions; import integrations (Kaggle/HuggingFace); enterprise/private marketplaces; API access; creator analytics.”
- Visuals:
  - Quarter-by-quarter timeline with these milestones.

---

### 15) Team (fit-for-purpose)
- You say:
  - “Core capabilities: Move smart contracts on Sui, decentralized storage integration (Walrus), Next.js/TypeScript frontend, and AI verification/fingerprinting services.”
  - “Near-term hires/roles: security/audit support, protocol integrations, and GTM.”
- Visuals:
  - Roles and responsibilities; keep personal details to a single line per person in the deck.

---

### 16) The ask (non-speculative)
- You say (pick what fits your stage):
  - “Design partners: AI labs and research groups willing to pilot rights-cleared datasets and verification tooling.”
  - “Creator onboarding: early dataset creators across medical, research, code, and text corpora.”
  - “Community: contributors for Move audits, Walrus ecosystem coordination, and integrations.”
- Visuals:
  - 3 CTA tiles (Design partners, Creators, Contributors) with a contact.

---

### 17) Use of funds (when raising)
- You say:
  - “Allocation priorities when we raise: security audits and core R&D, GTM creator onboarding, and enterprise integrations/compliance.”
  - “We will tie spend to milestones (contracts audit, private marketplace pilots, and verification service maturity).”
- Visuals:
  - Category list (no fabricated %).

---

### 18) Risks and mitigations
- You say:
  - “Technical: ensuring robust fingerprinting/originality checks → mitigate with multiple algorithms (SimHash/MinHash), canary phrases, and public proofs.”
  - “GTM: bootstrapping two-sided marketplace → mitigate by Sui-first creator onboarding and targeted AI lab pilots.”
  - “Regulatory/legal: evolving AI/data policy → mitigate via clear on-chain licenses and transparent provenance.”
  - “Storage/availability: decentralized storage reliability → mitigate via Walrus replication and immutable content addressing.”
- Visuals:
  - Two-column Risk → Mitigation table.

---

### 19) Closing and call-to-action
- You say:
  - “Suilex brings law to data — creators get paid and recognized; AI buyers gain legal clarity and provenance. Contracts and UI are close to complete; we’re preparing end-to-end launch.”
  - “If you’re an AI lab, creator, or verifier, we’d love to onboard you and set up pilot workflows.”
- Visuals:
  - One-line recap, contact, and optional QR linking to demo or docs (when ready).

---

## Appendix (for Q&A)

### A1) Technical architecture (from your docs)
- Frontend (Next.js/TypeScript): Creator Studio, Marketplace, Verifier, Dashboard.
- Backend services: AI verification (quality scoring, PII scrubbing, originality via SimHash/MinHash), fingerprint service, Evidence API.
- Smart contracts (Sui Move): DataNFT (metadata, license, price, royalties), LicenseNFT (rights/term/access log), Marketplace events (Listed/Purchased/Accessed/Verified/ProofAnchored), royalty distribution, proof anchoring.
- Storage: Walrus (decentralized, content-addressed, redundant) and/or IPFS/Arweave in concept doc.

### A2) Data object model (on-chain structs)
- DataNFT: owner, title, CID, tags, AI score, fingerprint commitment, license type, price, royalties, timestamps, domain.
- LicenseNFT: dataset ref, buyer, rights, issue time, term days, access count.
- VerificationProof: dataset, score, originality, PII risk, proof CID, verified_at, verifier.

### A3) User flows (from your docs)
- Creator: connect wallet → upload → AI verification → set price/license → mint → list.
- Buyer: browse → dataset detail → buy → get LicenseNFT → download via Walrus → on-chain access logs.
- Verifier: paste text → similarity/canary check → generate evidence JSON → upload to storage → anchor hash on-chain.

### A4) Security, privacy, compliance posture
- On-chain licensing and access logs; immutable provenance.
- PII scrubbing in verification pipeline; auditability via Evidence JSONs.
- Future certifications and enterprise requirements tracked in roadmap.

### A5) Roadmap details
- Near-term: testnet/mainnet deploys, end-to-end flows, verification scoring, previews.
- Mid-term: reviews/ratings, subscriptions, imports (Kaggle/HuggingFace), API access.
- Longer-term: private/enterprise marketplaces, data pools, DAO governance.

---

## Presenter notes (delivery tips)
- Keep slides outcome-first; one message per slide with large, readable text.
- Tie every claim to an implemented module, an on-chain primitive, or a roadmap item you’ve already scoped.
- When asked about numbers, stick to your known fees (2.5% platform; 97.5% creator) and current status; avoid speculative metrics until measured.


