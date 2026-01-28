

# TRACKER - Personal Finance Command Center

## Overview
A premium personal finance and investment tracking app with deep glassmorphism design, AI-powered invoice analysis, and real-time portfolio visualization.

---

## Design System
- **Aesthetic**: Minimalist Apple-inspired with deep glassmorphism
- **Corners**: 24px rounded corners throughout
- **Glows**: Subtle neon purple-to-blue gradient glows on cards and CTAs
- **Dark Mode**: Primary experience with glassmorphic transparency effects
- **Typography**: Clean, modern sans-serif hierarchy

---

## Core Pages & Features

### 1. Home Page ("Dashboard")

**Net Worth Hero Section**
- Large animated total balance with counting animation
- Interactive Recharts area graph showing portfolio growth over time (1W, 1M, 3M, 1Y, ALL toggles)
- Glassmorphic card with gradient border glow

**Monthly Pulse Card**
- Cash flow comparison vs. previous month
- Green percentage indicator for positive, red for negative
- Animated progress indicator

**WhatsApp Inbox Feed**
- Scrolling list of recently received/uploaded invoices
- Each card displays: thumbnail image, AI-extracted Amount, Merchant, Category
- Status badges: Pulsing gray "Pending" (unconfirmed) or solid green "Confirmed"
- Tap to open full-size slide-over modal

### 2. Transactions Page
- Complete transaction history with search and filters
- Category-based organization
- Date range filtering
- Manual transaction entry form
- Bulk actions for categorization

### 3. Portfolio Page ("Investments")

**Holdings Table**
- High-performance table with stock/asset names
- Live-style price sparklines (mini line charts per row)
- Current value, cost basis, gain/loss columns
- Color-coded performance indicators

**Buy/Sell History Log**
- Chronological trade history
- Transaction type, quantity, price, date

**Asset Distribution Treemap**
- Visual treemap chart showing asset allocation
- Color-coded by asset type (stocks, crypto, cash, etc.)
- Interactive hover states with details

---

## Slide-Over Transaction Modal
- Opens when any transaction/invoice is tapped
- Full-sized original invoice image viewer with zoom
- AI-generated spending insight panel
- Edit/confirm/delete actions
- Category reassignment option

---

## Navigation
- **Mobile**: Bottom navigation bar with Home, Transactions, Portfolio icons
- **Desktop**: Clean sidebar navigation

---

## Backend Infrastructure

**User Authentication**
- Email/password sign-up and login
- Secure session management

**Database Tables**
- Users, Transactions, Invoices, Holdings, Trade History
- Proper relationships and indexing

**AI Integration**
- Edge function calling Lovable AI for invoice analysis
- Extracts: Amount, Merchant, Date, Category from images
- Generates spending insights based on transaction patterns

**WhatsApp Webhook Ready**
- Webhook endpoint to receive forwarded invoice images
- Queue system for AI processing
- Status tracking (Pending → Processing → Confirmed)

**File Storage**
- Secure storage for uploaded invoice images
- Optimized image thumbnails

---

## Responsive Design
- Mobile-first approach
- Fluid layouts that adapt to tablet and desktop
- Touch-optimized interactions for mobile

