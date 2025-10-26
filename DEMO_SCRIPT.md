# 🎬 Suilex Demo Script (5 Minutes)

**Use this as a reference during your hackathon presentation**

---

## 🎯 Opening Hook (30 seconds)

> "AI companies train on data scraped from the internet without permission. Creators get nothing. There's no proof of ownership. This is a $200B problem."
>
> "We built **Suilex** - the first truly decentralized marketplace for AI training data on Sui blockchain and Walrus storage."

**Show slide/intro screen with problem → solution**

---

## 📖 Story Flow (4 minutes)

### **Act 1: The Creator (1.5 min)**

**Character**: Alice, a medical researcher

**Demo**:

1. **Open browser** → `suilex.io`
   - "Alice has a unique medical imaging dataset"

2. **Connect Wallet**
   - Click "Connect Wallet"
   - Select Sui Wallet
   - "Wallet connection in 2 seconds - no email, no signup"

3. **Create Profile** (if first time)
   - Navigate to Settings
   - Username: `@alice_research`
   - Upload avatar → **show Walrus upload**
   - "Avatar stored on decentralized Walrus, not AWS"
   - Click "Create Profile" → wallet approves
   - "Profile minted as NFT on Sui blockchain"

4. **Upload Dataset**
   - Navigate to Upload page
   - Drop file: `brain_mri_scans.zip`
   - Fill details:
     - Title: "Brain MRI Tumor Dataset"
     - Description: "5,000 annotated scans for AI research"
     - Category: Medical
     - Price: **100 SUI**
   
5. **Mint NFT**
   - Click "Publish to Marketplace"
   - **Show console logs**:
     ```
     ✓ Uploading to Walrus... blob_id: AgB7xK...
     ✓ Minting NFT on Sui... tx: 0xabc123...
     ✓ Success in 2.5 seconds!
     ```
   - "File lives on Walrus forever. NFT on Sui proves ownership."

**Key Points**:
- ✅ Decentralized storage (Walrus)
- ✅ Immutable ownership proof (Sui NFT)
- ✅ Fast (2-3 second finality)
- ✅ Cheap (< $0.01 gas fee)

---

### **Act 2: The Marketplace (1 min)**

1. **Navigate to Marketplace**
   - "Real-time listings from blockchain"
   - Search: "brain MRI"
   - Filter: Medical category
   - "All data fetched on-chain - no centralized database"

2. **Show Dataset Card**
   - Title, price, category
   - [AI Verified] badge
   - Seller profile link

3. **Click into Dataset Detail**
   - Full metadata
   - Download size
   - Seller information
   - "All immutable, all transparent"

**Key Points**:
- ✅ No centralized server
- ✅ Search & filter on blockchain data
- ✅ Transparent pricing

---

### **Act 3: The Purchase (1.5 min)**

**Character**: Bob, an AI startup founder

**Demo**:

1. **Switch Wallet** (different account as Bob)
   - Disconnect Alice's wallet
   - Connect Bob's wallet
   - "Bob needs training data for his medical AI model"

2. **Purchase Dataset**
   - On dataset detail page
   - Click "Purchase Dataset"
   - Modal shows:
     ```
     You pay: 100 SUI
     Seller receives: 97.5 SUI (97.5%)
     Platform fee: 2.5 SUI (2.5%)
     ```
   - Click "Confirm Purchase"
   - Wallet prompts transaction
   - **Show smart contract execution**:
     ```
     ✓ Payment split automatically
     ✓ DataAccessCap NFT minted to Bob
     ✓ Alice paid instantly
     ```

3. **Show Success**
   - "Purchase complete in 2 seconds!"
   - Download button appears
   - "Bob now owns DataAccessCap - proof of legal rights"

4. **Download from Walrus**
   - Click Download
   - **Show Walrus URL**: `aggregator/v1/{blob_id}`
   - "Direct download from decentralized storage"
   - "Bob can re-download anytime - he owns the AccessCap"

5. **Show Alice's Dashboard**
   - Switch back to Alice's wallet
   - Navigate to Dashboard
   - **Stats updated**:
     - Total Sales: 1
     - Revenue: 97.5 SUI
     - "Automatic, instant settlement"

**Key Points**:
- ✅ Smart contract handles payment splitting
- ✅ DataAccessCap proves ownership
- ✅ Instant settlement (no escrow delays)
- ✅ Transparent fees (2.5%)
- ✅ Perpetual access (download anytime)

---

## 🎤 Closing (30 seconds)

> "That's Suilex - the decentralized data marketplace."
>
> **What makes us different:**
> - 🔷 Built on Sui - fast finality, low cost
> - 🐋 Walrus storage - truly decentralized
> - 📜 Smart contracts - transparent royalties
> - 🎫 DataAccessCap NFTs - proof of legal ownership
>
> "Creators get paid. Buyers get proof. AI companies can train legally."
>
> **Thank you! Questions?**

---

## 🎥 Alternative Demo Paths

### **If Upload Fails**
- Skip to pre-minted NFT
- Focus on marketplace + purchase flow
- Show transaction on Sui Explorer instead

### **If Time is Short (3 min)**
1. Quick intro (20 sec)
2. Show marketplace with existing NFTs (40 sec)
3. Purchase flow (1 min 20 sec)
4. Show transaction details (40 sec)

### **If Time is Long (7 min)**
- Add profile creation flow
- Show Sui Explorer transactions
- Explain Move contract architecture
- Demo Walrus storage browser
- Show dashboard analytics

---

## 📊 Backup Slides/Screens

Have these ready to switch to if demo breaks:

1. **Architecture Diagram**
   - Frontend (Next.js) → Sui Blockchain → Walrus Storage
   - Show data flow

2. **Sui Explorer Screenshot**
   - Real transaction showing:
     - NFT mint event
     - Payment split
     - DataAccessCap grant

3. **Walrus Explorer**
   - Show blob storage
   - Redundancy and decentralization

4. **Code Snippet**
   - Smart contract: `marketplace::buy_nft()`
   - Show payment splitting logic

---

## 💬 Key Talking Points

### **Problem Statement**
- AI training data market: $200B+
- Creators have no proof of ownership
- AI companies face legal uncertainty
- No transparent licensing

### **Solution Highlights**
- **Sui blockchain** = fast, cheap, safe (Move language)
- **Walrus storage** = decentralized, cost-effective, permanent
- **Smart contracts** = automated royalties, transparent fees
- **DataAccessCap NFTs** = cryptographic proof of purchase

### **Business Model**
- 2.5% platform fee (transparent on-chain)
- Creators keep 97.5% of sales
- Instant settlement (no escrow)
- Sustainable revenue stream

### **Technical Innovation**
- First to use Walrus for dataset storage
- Novel DataAccessCap NFT design
- Three interconnected Move contracts
- Real-time blockchain queries

### **Market Opportunity**
- **Target users**: AI researchers, data scientists, ML engineers
- **TAM**: $200B+ AI training data market
- **Network effects**: More datasets → more buyers → more creators

---

## 🐛 Troubleshooting Tips

### **Wallet won't connect**
- Check browser extension is installed
- Refresh page
- Try different wallet (Suiet, Ethos)

### **Transaction fails**
- Check testnet SUI balance
- Increase gas budget
- Show error message to judges (be transparent!)

### **Walrus upload slow**
- Use smaller test file (< 10MB)
- Show progress indicator
- Explain: "Production would use chunked uploads"

### **Page won't load**
- Have backup: show Sui Explorer instead
- Explain what SHOULD happen
- Show code/contracts as fallback

---

## 🎯 Judge Q&A Prep

### **Expected Questions**

**Q: How is this different from IPFS?**
- A: Walrus has built-in redundancy, lower costs, and better integration with Sui. IPFS requires separate pinning services.

**Q: What prevents someone from downloading and re-sharing?**
- A: Technical solution: watermarking, fingerprinting. Legal solution: DataAccessCap provides proof of authorized use for courts.

**Q: How do you verify data quality?**
- A: Phase 1: Manual seller reputation. Phase 2: AI-powered quality scoring. Phase 3: Community verification DAO.

**Q: What's your business model?**
- A: 2.5% platform fee on all sales. Transparent, sustainable, fair.

**Q: Why Sui over Ethereum/Solana?**
- A: Fast finality (400ms), low gas costs (<$0.01), Move language safety, native integration with Walrus.

**Q: What about privacy/PII?**
- A: Sellers must confirm data is anonymized. Phase 2: Automatic PII detection. Phase 3: Zero-knowledge proofs for private datasets.

**Q: How do you scale?**
- A: Sui: 100k+ TPS theoretical. Walrus: petabyte-scale storage. No database bottlenecks.

**Q: What's your go-to-market?**
- A: Partner with AI research labs, sponsor Kaggle competitions, integrate with HuggingFace Hub.

---

## 📸 Screenshot Checklist

Take these before demo:

- [ ] Homepage (clean, beautiful)
- [ ] Marketplace (with multiple datasets)
- [ ] Dataset detail page
- [ ] Upload flow (all 4 steps)
- [ ] Transaction success modal
- [ ] Dashboard with stats
- [ ] Sui Explorer (transaction)
- [ ] Walrus Explorer (blob)

---

## 🚀 Pre-Demo Checklist

- [ ] Testnet SUI in both wallets (Alice & Bob)
- [ ] Test file ready (< 10MB for speed)
- [ ] Browser tabs pre-open:
  - [ ] Suilex homepage
  - [ ] Sui Explorer
  - [ ] Walrus Explorer (optional)
- [ ] Wallets installed and logged in
- [ ] Internet connection stable
- [ ] Laptop plugged in (battery full)
- [ ] Screen recording started (backup)
- [ ] Close all distracting apps
- [ ] Turn off notifications
- [ ] Increase font sizes for projector

---

## 🎬 Final Tips

1. **Speak slowly and clearly** - judges are taking notes
2. **Show, don't tell** - let the demo do the work
3. **Be enthusiastic** - energy is contagious
4. **If it breaks, stay calm** - explain what should happen
5. **End strong** - emphasize impact and innovation
6. **Practice 3-5 times** - muscle memory is real

**You've got this! 🚀**

---

**Prepared by: Suilex Team**
**Last Updated: [Date]**

