# CertifyPro — Aesthetic Edition (Deployable)

A polished SaaS-style bulk certificate generator.
- Modern landing/login hero (matches the provided aesthetic)
- Guided generation flow (upload → details → generate)
- Professional PDF certificates (cream + gold, proper spacing)
- Preview & download table
  # 🪪 CertifyPro - Online Certificate Generator

**CertifyPro** is a full-stack web application that allows users to upload Excel sheets, generate personalized certificates (with QR codes), and manage all generated certificates in a database.  
It also includes a simple admin login system.

---

## 🚀 Tech Stack

**Frontend:** React.js, HTML, CSS, JavaScript  
**Backend:** Node.js, Express.js  
**Database:** MySQL  
**Other Tools:** PDFKit, QRCode, Multer, XLSX, dotenv

---

## 📂 Project Structure



## Dev
```bash
# server
cd server
npm install
npm start

# client
cd ../client
npm install
npm run dev
```
Proxy is set so the client calls `/api/*` to `http://localhost:5050`.

## Deploy (single origin)
```bash
cd server
npm run build-client   # builds ../client to dist
npm start              # serves API + static client
```

## Excel Format
Columns: `name`, `skills` (comma-separated).

## Logos
Replace PNGs in `server/assets` and `client/public` to use official icons.
