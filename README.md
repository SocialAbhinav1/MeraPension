<div align="center">

# मेरा Pension — MeraPension

### Bihar Pension Status Tracker

**A free, open-source tool helping Bihar's senior citizens, widows, and disabled citizens check their pension status instantly.**

[![MIT License](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red)](https://github.com/SocialAbhinav1/MeraPension)

[**🌐 Live App**](https://merapension.vercel.app) · [**📋 Report a Bug**](https://github.com/SocialAbhinav1/MeraPension/issues) · [**💡 Request a Feature**](https://github.com/SocialAbhinav1/MeraPension/issues)

</div>

---

## 🪷 About

**मेरा Pension** is a welfare-focused, open-source web application that helps pensioners of Bihar check their pension and payment status without navigating the complex government portal directly.

It reads **publicly available** data from [elabharthi.bihar.gov.in](https://elabharthi.bihar.gov.in) and presents it in a clean, accessible, and Hindi-friendly interface — optimized for elderly users and mobile devices.

> ⚠️ **Disclaimer:** This is an **unofficial** helper tool. It is not affiliated with, endorsed by, or connected to the Bihar Government. For official information, always visit [elabharthi.bihar.gov.in](https://elabharthi.bihar.gov.in).

---

## ✨ Features

- 🔍 **Search by** Aadhaar Number, Beneficiary ID, or Bank Account Number
- 📊 **Pension Status** — current status with last update date
- 🌿 **eKYC / Jeevan Praman** — verification and authentication date
- 🔗 **Aadhaar Seeding Status** — linked or not
- 💰 **Payment History** — full table sorted newest first, in Hindi months
- 📍 **Location Details** — district, block, panchayat, village
- 🖨️ **Print-Ready** — clean print view, no nav or buttons
- 📱 **Mobile Optimized** — large touch targets for elderly users
- 🌐 **Bilingual** — Hindi + English throughout

---

## 🔒 Privacy & Safety

| Concern | Status |
|---|---|
| Your Aadhaar / data stored on any server | ❌ Never stored |
| Login or account required | ❌ Not required |
| Harmful to the government portal | ❌ No — reads same as a normal browser |
| Data modified or fabricated | ❌ Displayed exactly as received |
| Ads or tracking | ❌ None |
| Free to use | ✅ Always |

**All searches go directly from Vercel's server to Bihar's official portal. No data is logged, saved, or shared.**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | [TypeScript 5](https://typescriptlang.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Parsing | [Cheerio](https://cheerio.js.org) (server-side HTML scraping) |
| Icons | [Lucide React](https://lucide.dev) |
| Fonts | Inter (Latin) + Noto Sans Devanagari (Hindi) |
| Deployment | [Vercel](https://vercel.com) |
| Data Source | [eLabharthi Bihar Portal](https://elabharthi.bihar.gov.in) |

---

## 🏗️ Architecture

```
Browser (React Client)
      │
      │  POST /api/pension-status
      ▼
Vercel Node.js Serverless Function
      ├─ Validates & sanitizes input (digits only, max 1KB)
      ├─ GET  elabharthi.bihar.gov.in  → fetch ASP.NET ViewState tokens
      ├─ POST elabharthi.bihar.gov.in  → submit search form
      └─ cheerio parses HTML → returns structured JSON

      POST /api/aadhaar-seeding  (parallel, non-fatal)
      ├─ GET  AadhaarSeedingSearch.aspx
      └─ POST AadhaarSeedingSearch.aspx → seeding status JSON

page.tsx merges both responses → renders full pension dashboard
```

**No database. No backend server. No secrets. No environment variables.**

---

## 🚀 Run Locally

**Prerequisites:** Node.js 18+, npm

```bash
# 1. Clone the repository
git clone https://github.com/SocialAbhinav1/MeraPension.git
cd MeraPension

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**No `.env` file needed** — this app has zero secrets or API keys.

---

## 📁 Project Structure

```
MeraPension/
├── app/
│   ├── api/
│   │   ├── pension-status/route.ts     # Main scraping API route
│   │   └── aadhaar-seeding/route.ts    # Aadhaar seeding API route
│   ├── globals.css                     # Theme, badges, print styles
│   ├── layout.tsx                      # Root layout + SEO metadata
│   └── page.tsx                        # Main page (all UI + state)
├── components/
│   ├── BeneficiaryCard.tsx             # Identity + scheme card
│   ├── ErrorState.tsx                  # Error UI with suggestions
│   ├── LoadingState.tsx                # Skeleton loading state
│   ├── LocationCard.tsx                # District/block/village info
│   ├── PaymentHistory.tsx              # Payment summary + history table
│   ├── SearchForm.tsx                  # Search form with glow effect
│   └── StatusTiles.tsx                 # Pension/eKYC/Seeding tiles
├── lib/
│   ├── scraper.ts                      # All HTML parsing logic
│   └── types.ts                        # TypeScript type definitions
├── next.config.ts                      # Security headers + cheerio config
└── LICENSE                             # MIT License
```

---

## 🔐 Security

- **Input sanitization:** All user input is stripped to digits only, max 20 characters, before reaching the Bihar portal
- **Payload limit:** API routes reject requests larger than 1KB
- **Security headers:** `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`
- **No client error leaks:** Error details only appear in Vercel server logs, never in HTTP responses
- **No caching:** All API responses have `Cache-Control: no-store`

---

## 🌍 Deploy Your Own

This app deploys to Vercel in one click — no environment variables needed:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SocialAbhinav1/MeraPension)

Or manually:
1. Fork this repository
2. Go to [vercel.com](https://vercel.com) → New Project → Import your fork
3. Click **Deploy** — done!

---

## 🤝 Contributing

Contributions are welcome! This is a welfare project — improvements that help Bihar's citizens are especially appreciated.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

**Areas that need help:**
- Supporting other state pension portals
- Offline / PWA support
- Automated tests for the parser
- Accessibility improvements

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

<table>
  <tr>
    <td align="center">
      <strong>Abhinav Kumar</strong><br/>
      <sub>Developer & Creator</sub><br/>
      <a href="https://github.com/SocialAbhinav1">@SocialAbhinav1</a>
    </td>
  </tr>
</table>

---

<div align="center">

**Built with ❤️ for the citizens of Bihar**

*If this tool helped you or someone you know, please ⭐ star this repository.*

</div>
