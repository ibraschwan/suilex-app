# 🖼️ Suilex UI/UX Wireframes & Specifications

Complete visual and interaction specifications for all Suilex views.

---

## Table of Contents

1. [Home / Explore Page](#1-home--explore-page)
2. [Dataset Detail Page](#2-dataset-detail-page)
3. [Creator Studio](#3-creator-studio)
4. [Dashboard (My Assets)](#4-dashboard-my-assets)
5. [Verifier Tool](#5-verifier-tool)
6. [Proof Explorer](#6-proof-explorer-optional)
7. [Component Library](#7-component-library)
8. [Responsive Behavior](#8-responsive-behavior)
9. [Interaction Patterns](#9-interaction-patterns)

---

## 1. Home / Explore Page

**Route**: `/` or `/explore`
**Purpose**: Landing page + marketplace browser

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [ Logo ]     Explore   Create   Verify     [ Connect ⚡ ]   │ ← Header (80px)
├─────────────────────────────────────────────────────────────┤
│                                                               │
│         🏛️ Suilex                                            │
│         The Law of Data                                       │
│                                                               │
│         [ Your data, your Lex. Mint verified datasets        │
│           as NFTs on Sui. ]                                   │
│                                                               │
│         [ Browse Datasets ]  [ Upload Data ]                  │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ⚡ Featured Datasets                            [View All→]  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ 🧬       │ │ 💰       │ │ 🚗       │ │ 📊       │       │
│  │ Medical  │ │ Finance  │ │ Auto     │ │ Legal    │       │
│  │ Imaging  │ │ Txn Logs │ │ Sensor   │ │ Cases    │       │
│  │          │ │          │ │ Data     │ │          │       │
│  │ ✓ 92%    │ │ ✓ 88%    │ │ ✓ 95%    │ │ ⏳ Pending│       │
│  │ 500 SUI  │ │ 250 SUI  │ │ 1200 SUI │ │ 150 SUI  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🔍 Search & Filter                                           │
│  [ Search datasets... ]                    🔽 Category  Price│
│                                                               │
│  📚 All Datasets (247)                        [ Grid ] List   │
│                                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Dataset  │ │ Dataset  │ │ Dataset  │ │ Dataset  │       │
│  │ Card     │ │ Card     │ │ Card     │ │ Card     │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ... (paginated grid continues)                               │
│                                                               │
│  [ ← ] [ 1 ] [ 2 ] [ 3 ] ... [ 10 ] [ → ]                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
│  About · FAQ · Docs · Twitter · Discord         Built on Sui │
└─────────────────────────────────────────────────────────────┘
```

### Hero Section
- **Height**: 600px (viewport height on mobile)
- **Background**: Dark gradient (#0D1117 → #1A1F2E)
- **Logo**: Scales icon + "Suilex" wordmark
- **Tagline**: "Your data, your Lex" (36px, light weight)
- **Subheading**: Value proposition (18px)
- **CTA Buttons**:
  - Primary: "Browse Datasets" (blue gradient)
  - Secondary: "Upload Data" (outline)

### Featured Datasets
- **Layout**: Horizontal scroll (mobile), 4-column grid (desktop)
- **Card Size**: 280px × 320px
- **Spacing**: 16px gap
- **Hover Effect**: Lift + glow border

### Search & Filter Bar
- **Search Input**: Full-width with icon
- **Filters**:
  - Category dropdown (Medical, Finance, Code, etc.)
  - Price range slider
  - Verification toggle (AI-verified only)
  - Sort: (Recent, Popular, Price: Low→High)

### Dataset Grid
- **Layout**: Responsive grid
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3-4 columns
- **Card Design**: See [Component Library](#7-component-library)

---

## 2. Dataset Detail Page

**Route**: `/dataset/[id]`
**Purpose**: Full dataset information + purchase flow

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [ ← Back ]                                  [ Connect ⚡ ]   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────┬──────────────────────────┐  │
│  │                            │  ┌────────────────────┐  │  │
│  │  📄 Medical Imaging MRI     │  │  500 SUI           │  │  │
│  │  Dataset                    │  │  (≈ $1,850 USD)    │  │  │
│  │                            │  │                     │  │  │
│  │  ✓ AI Verified (92/100)    │  │  [ Buy License ]   │  │  │
│  │  👤 0x1a2b...c3d4 (Owner)   │  │                     │  │  │
│  │  🏷️ Medical · MRI · Research│  │  License Options:   │  │  │
│  │                            │  │  ○ View Only        │  │  │
│  │  Description:               │  │  ● Train Allowed   │  │  │
│  │  A comprehensive...         │  │  ○ Commercial Use  │  │  │
│  │  [Read more]                │  │                     │  │  │
│  │                            │  │  ⚡ Instant download │  │  │
│  │  ┌─────────────────────┐   │  │  ✓ Verified quality │  │  │
│  │  │  Sample Preview     │   │  │  🔒 Secure transfer │  │  │
│  │  │  [ View first 10    │   │  │                     │  │  │
│  │  │    rows → ]         │   │  │  [ ♡ Wishlist ]    │  │  │
│  │  └─────────────────────┘   │  └────────────────────┘  │  │
│  │                            │                          │  │
│  │  📊 Details                 │                          │  │
│  │  • Size: 25 GB              │                          │  │
│  │  • Records: 5,000 images    │                          │  │
│  │  • Format: DICOM + JSON     │                          │  │
│  │  • License: Commercial OK   │                          │  │
│  │  • Created: 2 weeks ago     │                          │  │
│  │                            │                          │  │
│  │  🔬 Verification Report     │                          │  │
│  │  • Originality: 92%         │                          │  │
│  │  • Quality Score: 88/100    │                          │  │
│  │  • PII Risk: Low            │                          │  │
│  │  • Domain: Medical          │                          │  │
│  │  [ View Full Report → ]     │                          │  │
│  │                            │                          │  │
│  │  💬 Reviews (3)              │                          │  │
│  │  ★★★★★ 5.0                 │                          │  │
│  │  [Show reviews]             │                          │  │
│  │                            │                          │  │
│  └────────────────────────────┴──────────────────────────┘  │
│                                                               │
│  🔗 Similar Datasets                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │ ...      │ │ ...      │ │ ...      │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Key Sections

**Header**
- Back button (returns to browse)
- Wallet status indicator

**Main Content (Left)**
- Title (32px, bold)
- Verification badge (prominent)
- Owner address (truncated, clickable)
- Tags (pills with colors)
- Description (expandable)
- Sample preview (first N rows/lines)
- Details accordion
- Verification report expandable
- Reviews section

**Sidebar (Right, Sticky)**
- Price (large, 48px)
- USD equivalent (gray, 16px)
- Buy License button (primary CTA)
- License type radio buttons
- Feature bullets (instant download, verified, secure)
- Wishlist button (heart icon)

**Bottom Section**
- Similar/Recommended datasets (3-4 cards)

### Interaction Flow

```
User clicks dataset card
  ↓
Detail page loads with metadata
  ↓
User reviews content
  ↓
Selects license type
  ↓
Clicks "Buy License"
  ↓
Wallet modal appears
  ├─ Shows price + gas fee
  ├─ User confirms
  └─ Transaction submitted
  ↓
Loading state (spinner)
  ↓
Success! License NFT minted
  ↓
Download button appears
  ↓
User downloads from IPFS
```

---

## 3. Creator Studio

**Route**: `/create` or `/upload`
**Purpose**: Multi-step dataset upload and minting

### Step 1: Upload File

```
┌─────────────────────────────────────────────────────────────┐
│  Create New Dataset                               [ Step 1/4 ]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ○━━━●━━━○━━━○   Upload → Verify → Details → Publish        │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │              📁 Drag & drop your file here              │  │
│  │                  or [ Browse Files ]                    │  │
│  │                                                         │  │
│  │  Supported: CSV, JSON, TXT, PDF, ZIP                   │  │
│  │  Max size: 10 GB                                       │  │
│  │                                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  Or upload from:                                              │
│  [ 🔗 IPFS CID ] [ ☁️ Google Drive ] [ 💾 Dropbox ]          │
│                                                               │
│  Recent uploads:                                              │
│  • medical-data.csv (25 MB) - 2 hours ago                    │
│  • research-notes.pdf (5 MB) - 1 day ago                     │
│                                                               │
│                                  [ Cancel ]    [ Next → ]     │
└─────────────────────────────────────────────────────────────┘
```

### Step 2: AI Verification

```
┌─────────────────────────────────────────────────────────────┐
│  Create New Dataset                               [ Step 2/4 ]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ○━━━○━━━●━━━○   Upload → Verify → Details → Publish        │
│                                                               │
│  🔄 Analyzing your dataset...                                 │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Verification in Progress                              │  │
│  │                                                         │  │
│  │  ✓ File uploaded to IPFS           [████████] 100%    │  │
│  │  🔍 Checking data quality           [████████] 100%    │  │
│  │  🏷️ Classifying domain               [███████░] 85%     │  │
│  │  🔒 Scanning for PII                [█████░░░] 60%     │  │
│  │  📊 Calculating originality         [███░░░░░] 40%     │  │
│  │  🔑 Generating fingerprint          [██░░░░░░] 25%     │  │
│  │                                                         │  │
│  │  Estimated time: ~2 minutes                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ℹ️ What we're checking:                                      │
│  • Data structure and completeness                            │
│  • Presence of sensitive information (PII)                    │
│  • Similarity to existing datasets                            │
│  • Auto-classification by content domain                      │
│                                                               │
│  [ Learn More About Verification ]                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Step 2b: Verification Results

```
┌─────────────────────────────────────────────────────────────┐
│  Create New Dataset                               [ Step 2/4 ]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ✨ Verification Complete!                                     │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Overall Score:  88 / 100       ★★★★☆ Excellent       │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                         │  │
│  │  📊 Quality Score:        88/100  ████████░░           │  │
│  │  🔍 Originality:          92%     █████████░           │  │
│  │  🔒 PII Risk:             Low     ✓ Safe               │  │
│  │  🏷️ Auto-Tagged Domain:   Medical                       │  │
│  │                                                         │  │
│  │  Suggested Tags:                                        │  │
│  │  [ Medical ] [ MRI ] [ Research ] [ Imaging ]          │  │
│  │  [ + Add custom tag ]                                   │  │
│  │                                                         │  │
│  │  [ View Full Verification Report → ]                    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ⚠️ Recommendations:                                          │
│  • Consider removing personally identifiable information      │
│  • Add more descriptive metadata for discoverability          │
│                                                               │
│                           [ ← Back ]    [ Continue → ]        │
└─────────────────────────────────────────────────────────────┘
```

### Step 3: Dataset Details

```
┌─────────────────────────────────────────────────────────────┐
│  Create New Dataset                               [ Step 3/4 ]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ○━━━○━━━○━━━●   Upload → Verify → Details → Publish        │
│                                                               │
│  📝 Dataset Information                                       │
│                                                               │
│  Title *                                                      │
│  [ Medical Imaging MRI Dataset                            ]  │
│                                                               │
│  Description *                                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ A comprehensive collection of 5,000 anonymized MRI    │  │
│  │ scans for cancer research and AI model training...    │  │
│  │                                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│  [ AI-generated description ] [ Import from README ]         │
│                                                               │
│  Category *                                                   │
│  [ Medical ▼ ]                                                │
│                                                               │
│  Tags                                                         │
│  [ Medical ] [ MRI ] [ Research ] [ Imaging ] [ + Add ]      │
│                                                               │
│  License Type *                                               │
│  ○ View Only              (Buyers can view but not train)    │
│  ● Training Allowed       (Buyers can use to train AI models)│
│  ○ Commercial Use         (Full commercial rights)           │
│                                                               │
│  Custom License Terms (Optional)                              │
│  [ Specify additional terms... ]                              │
│                                                               │
│                           [ ← Back ]    [ Next → ]            │
└─────────────────────────────────────────────────────────────┘
```

### Step 4: Pricing & Publish

```
┌─────────────────────────────────────────────────────────────┐
│  Create New Dataset                               [ Step 4/4 ]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ○━━━○━━━○━━━○   Upload → Verify → Details → Publish        │
│                                                               │
│  💰 Set Your Price                                            │
│                                                               │
│  Price in SUI *                                               │
│  [ 500 ] SUI  (≈ $1,850 USD)                                 │
│                                                               │
│  Platform Fee: 2.5%  │  You'll receive: ~488 SUI             │
│                                                               │
│  💡 Pricing Recommendations:                                  │
│  • Similar datasets in Medical category: 300-800 SUI         │
│  • Average for 25GB datasets: 450 SUI                        │
│  • Your quality score (88%) suggests: 400-600 SUI            │
│                                                               │
│  Royalty on Resales (Optional)                               │
│  [ 2.5 ] %   (Earn from secondary sales)                     │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  📋 Review Before Publishing                                  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Title:        Medical Imaging MRI Dataset            │  │
│  │  Category:     Medical                                 │  │
│  │  Size:         25 GB                                   │  │
│  │  Quality:      88/100 ★★★★☆                           │  │
│  │  License:      Training Allowed                        │  │
│  │  Price:        500 SUI                                 │  │
│  │  Royalty:      2.5%                                    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ☑️ I confirm that I own the rights to this data and it      │
│     does not contain sensitive personal information          │
│                                                               │
│                  [ ← Back ]    [ 🚀 Mint NFT & Publish ]      │
└─────────────────────────────────────────────────────────────┘
```

### Step 5: Success

```
┌─────────────────────────────────────────────────────────────┐
│  Dataset Published!                              ✨ Success    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                         ✓                                     │
│                                                               │
│           Data NFT Minted on Sui!                             │
│                                                               │
│  Your dataset is now live on the marketplace.                │
│                                                               │
│  Transaction ID: 0x7f8e9d...a3b2c1                           │
│  NFT ID: 0x1a2b3c...4d5e6f                                   │
│                                                               │
│  [ View on Explorer ] [ Share ] [ View Listing ]             │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  What's Next?                                                 │
│  • Share your listing on social media                        │
│  • Monitor views and purchases in your dashboard             │
│  • Update pricing anytime                                    │
│                                                               │
│  [ Go to Dashboard ] [ Create Another ]                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Dashboard (My Assets)

**Route**: `/dashboard`
**Purpose**: Manage datasets, licenses, and earnings

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Suilex                                          [ 0x123...abcd ]│
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│ 👤 Profile    │  📊 My Dashboard                              │
│ 📦 My Datasets│                                              │
│ 🎫 My Licenses│  ┌─────────────┬─────────────┬──────────────┐│
│ 💰 Earnings   │  │ Total Earned│  Datasets   │ Licenses     ││
│ ⚙️ Settings   │  │  5,200 SUI  │  Owned: 8   │ Bought: 12   ││
│              │  │  +12.5% ↑   │  Listed: 8  │ Active: 12   ││
│              │  └─────────────┴─────────────┴──────────────┘│
│              │                                              │
│              │  📦 My Datasets                  [ + Upload ]  │
│              │  ┌──────────┬──────────┬──────────┐         │
│              │  │ Medical  │ Finance  │ Research │         │
│              │  │ Imaging  │ Txn Logs │ Notes    │         │
│              │  │ 500 SUI  │ 250 SUI  │ 150 SUI  │         │
│              │  │ 3 sales  │ 7 sales  │ 1 sale   │         │
│              │  │ [Edit]   │ [Edit]   │ [Edit]   │         │
│              │  └──────────┴──────────┴──────────┘         │
│              │  ... more datasets ...                       │
│              │                                              │
│              │  💰 Recent Earnings                           │
│              │  ┌───────────────────────────────────────┐   │
│              │  │ 📈 Chart showing earnings over time   │   │
│              │  │    (interactive line/bar chart)       │   │
│              │  └───────────────────────────────────────┘   │
│              │                                              │
│              │  Transaction History:                         │
│              │  • E-commerce Txns - 250 SUI (2 days ago)    │
│              │  • Social Sentiment - 300 SUI (4 days ago)   │
│              │  • Customer Churn - 150 SUI (1 week ago)     │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

### Sidebar Navigation
- Profile (avatar + address)
- My Datasets
- My Licenses (purchased)
- Earnings
- Settings

### Stats Cards (Top)
- Total Earned (SUI + USD)
- Datasets Owned/Listed
- Licenses Bought/Active

### My Datasets Section
- Grid of owned datasets
- Quick actions: Edit Price, Delist, Share
- Status indicators: Active, Pending, Sold Out

### Earnings Chart
- Interactive line/bar chart
- Time range selector: 7D, 30D, 90D, All
- Revenue breakdown by dataset

### Transaction History
- List of recent sales
- Filterable and searchable
- Export to CSV

---

## 5. Verifier Tool

**Route**: `/verify`
**Purpose**: Detect dataset misuse via fingerprinting

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  🔍 Verify Data Usage                         [ Connect ⚡ ]   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Detect if your data has been used without permission.       │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Paste text sample or upload file                     │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ The patient underwent MRI imaging which revealed │  │  │
│  │  │ abnormal tissue growth in the frontal lobe...    │  │  │
│  │  │                                                   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  Or: [ 📁 Upload File ] [ 🔗 Enter URL ]                │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  [ Analyze Text ]                                             │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  Results:                                                     │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🎯 Match Detected!                                     │  │
│  │                                                         │  │
│  │  Similarity Score:    84%      ██████████████████░░    │  │
│  │  Confidence:          High     ★★★★★                   │  │
│  │                                                         │  │
│  │  Matching Dataset:                                      │  │
│  │  📄 Medical Imaging MRI Dataset                         │  │
│  │  👤 Owner: 0x1a2b...c3d4                                │  │
│  │  🔗 [View Dataset →]                                    │  │
│  │                                                         │  │
│  │  Canary Phrases Detected:                               │  │
│  │  • "opal-tide paragraph eleven" (Line 47)              │  │
│  │  • "azure cascade mention" (Line 103)                  │  │
│  │                                                         │  │
│  │  ⚠️ This content likely derived from copyrighted data.  │  │
│  │                                                         │  │
│  │  [ Generate Proof Report ] [ Contact Owner ]           │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  What This Means:                                             │
│  • The analyzed text has high similarity to a registered     │
│    dataset on Suilex                                          │
│  • Canary phrases (hidden markers) were detected             │
│  • You can generate a proof report for legal purposes        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Components

**Input Section**
- Large textarea for paste
- File upload button
- URL input option

**Analysis Button**
- Primary CTA
- Shows loading spinner during analysis

**Results Panel**
- Similarity gauge (visual meter)
- Confidence rating (stars)
- Matching dataset card
- Canary phrase highlights
- Actions: Generate report, Contact owner

---

## 6. Proof Explorer (Optional)

**Route**: `/proofs`
**Purpose**: Browse public verification proofs

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  📜 Proof Explorer                            [ Connect ⚡ ]   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Browse public verification and evidence reports              │
│                                                               │
│  🔍 [ Search by dataset name or CID... ]                      │
│                                                               │
│  Filter: [ All ] [ Verification ] [ Evidence ] [ Disputes ]  │
│  Sort: [ Recent ] [ Relevance ] [ Score ]                    │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🔬 Verification Proof #12345                           │  │
│  │  Dataset: Medical Imaging MRI                           │  │
│  │  Score: 88/100  │  Date: Oct 20, 2025                   │  │
│  │  [ View Report → ]                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🎯 Evidence Report #67890                              │  │
│  │  Detected: Finance Transaction Dataset                  │  │
│  │  Similarity: 92%  │  Date: Oct 18, 2025                 │  │
│  │  [ View Report → ]                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ... more proofs ...                                          │
│                                                               │
│  [ Load More ]                                                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Component Library

### Dataset Card

```
┌──────────────────────────┐
│ 🧬 Medical Imaging      │
│                          │
│ High-res MRI scans for   │
│ cancer research...       │
│                          │
│ ✓ AI Verified (92%)     │
│ 🏷️ Medical · MRI         │
│ 📦 25 GB · 5K records    │
│                          │
│ 500 SUI                  │
│ 👤 0x1a2b...c3d4         │
│                          │
│ [ View Details ]         │
└──────────────────────────┘
```

**Specs**:
- Width: 280px (flexible in grid)
- Padding: 16px
- Border: 1px solid #30363d
- Border-radius: 16px
- Hover: Lift (translateY(-4px)) + border glow

### Button Variants

**Primary**
```css
background: linear-gradient(135deg, #3A82F6, #8B5CF6);
color: #FFFFFF;
border-radius: 12px;
padding: 12px 24px;
font-weight: 600;
transition: all 0.3s ease;

&:hover {
  box-shadow: 0 8px 16px rgba(58, 130, 246, 0.3);
  transform: translateY(-2px);
}
```

**Secondary**
```css
background: transparent;
color: #3A82F6;
border: 2px solid #3A82F6;
border-radius: 12px;
padding: 12px 24px;
font-weight: 600;

&:hover {
  background: rgba(58, 130, 246, 0.1);
}
```

### Badge (Verified)

```
┌────────────────┐
│ ✓ AI Verified  │
└────────────────┘
```

**Specs**:
- Background: rgba(34, 197, 94, 0.1)
- Color: #22C55E
- Border-radius: 20px (pill)
- Padding: 4px 12px
- Font-size: 12px
- Icon + text

### Progress Bar

```
[ ████████████████░░░░ ] 80%
```

**Specs**:
- Height: 8px
- Background: #30363d
- Fill: linear-gradient(90deg, #3A82F6, #8B5CF6)
- Border-radius: 4px
- Animated progress

---

## 8. Responsive Behavior

### Breakpoints

```
Mobile:    < 640px
Tablet:    640px - 1024px
Desktop:   > 1024px
```

### Mobile Adaptations

**Home Page**
- Hero: Stack vertically
- Featured: Horizontal scroll
- Grid: 1 column

**Dataset Detail**
- Sidebar becomes bottom fixed bar
- Tabs for sections (Details, Verification, Reviews)

**Creator Studio**
- Full-screen steps
- Simplified progress indicator

**Dashboard**
- Sidebar becomes bottom nav bar
- Stats cards stack vertically

---

## 9. Interaction Patterns

### Wallet Connection

```
User clicks "Connect"
  ↓
Modal slides up from bottom
  ↓
Shows wallet options:
  - Sui Wallet
  - Suiet
  - Ethos
  ↓
User selects wallet
  ↓
Wallet extension opens
  ↓
User approves connection
  ↓
Modal closes
  ↓
Header shows: [0x123...abcd ▼]
```

### Purchase Flow

```
Click "Buy License"
  ↓
Modal appears with summary
  ├─ Dataset: Medical Imaging
  ├─ License: Train Allowed
  ├─ Price: 500 SUI
  └─ Gas: ~0.01 SUI
  ↓
User clicks "Confirm Purchase"
  ↓
Wallet opens for signature
  ↓
User signs transaction
  ↓
Loading state (spinner + "Processing...")
  ↓
Success! Confetti animation
  ↓
"License NFT minted!"
  ↓
Show download button
```

### Verification Animation

```
Upload file
  ↓
Progress bar appears
  ↓
Each check animates:
  ✓ File uploaded     [████████] 100%
  🔍 Quality check    [███████░] 85%
  🏷️ Classification   [█████░░░] 65%
  ...
  ↓
Final score reveals with count-up animation
  ↓
Tags appear one by one (stagger)
```

---

## Design Tokens Quick Reference

```css
/* Colors */
--primary: #3A82F6;
--success: #22C55E;
--warning: #F59E0B;
--error: #EF4444;

/* Spacing */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-glow: 0 0 20px rgba(58, 130, 246, 0.3);

/* Border Radius */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-full: 9999px;
```

---

**Ready for implementation! 🚀**
