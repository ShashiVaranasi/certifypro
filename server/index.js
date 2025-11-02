const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql2");
require("dotenv").config();
dotenv.config(); 
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// ============================
// 🔗 MySQL CONNECTION
// ============================
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "1234",
  database: process.env.DB_NAME || "certifypro",
  port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
  if (err) console.error("❌ MySQL connection error:", err);
  else console.log("✅ Connected to MySQL Database");
});

// ============================
// 🔐 LOGIN API
// ============================
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@certifypro.io" && password === "admin123") {
    return res.json({ success: true, message: "Login successful" });
  }
  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

// ============================
// 📂 UPLOAD EXCEL API
// ============================
app.post("/upload-excel", upload.single("file"), (req, res) => {
  const filePath = req.file.path;
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = xlsx.utils.sheet_to_json(sheet);

  const data = json.map((row) => ({
    name: row.Name || "",
    skills: row.Skills || "",
  }));

  fs.unlinkSync(filePath); // remove uploaded Excel
  res.json(data);
});

// ============================
// 📝 SAVE STUDENT INTO DATABASE WITHOUT GENERATING PDF
// ============================
app.post("/generate-db", (req, res) => {
  const { name, skills, organisation, course } = req.body;
  const certificateID = uuidv4().split("-")[0].toUpperCase();

  const sql = `
    INSERT INTO certificates
    (name, skills, organisation, course, certificate_id, date_issued)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [name, skills, organisation, course, certificateID, new Date()];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ DB insert error:", err);
      return res.status(500).json({ success: false, message: "DB insert failed" });
    }
    console.log(`✅ Certificate saved for ${name}`);
    res.json({ success: true });
  });
});

// ============================
// 🧾 GENERATE CERTIFICATE AND DOWNLOAD PDF
// ============================
app.post("/generate", async (req, res) => {
  const { name, skills } = req.body;
  const organisation = req.body.organisation || "CertifyPro";
  const course = req.body.course || "N/A";

  const certificateID = uuidv4().split("-")[0].toUpperCase();
  const qrData = `Name: ${name}\nCourse: ${course}\nOrganisation: ${organisation}\nCertificate ID: ${certificateID}`;
  const qrImage = await QRCode.toDataURL(qrData);

  // === PDF Generation ===
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  let buffers = [];
  doc.on("data", (chunk) => buffers.push(chunk));
  doc.on("end", () => {
    const pdfData = Buffer.concat(buffers);
    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}-certificate.pdf"`,
      "Content-Length": pdfData.length,
    });
    res.end(pdfData);
  });

  // === Certificate Layout ===
  doc.rect(0, 0, 595, 842).fill("#ffffff");

  // Borders
  doc.save();
  for (let i = 0; i < 5; i++) {
    doc
      .lineWidth(5 - i)
      .strokeColor(i % 2 === 0 ? "#FF6F00" : "#FFB74D")
      .rect(20 + i * 2, 20 + i * 2, 555 - i * 4, 802 - i * 4)
      .stroke();
  }
  doc.restore();

  // Brand logo
  const logoPath = path.join(__dirname, "assets", "brand-logo.png");
  if (fs.existsSync(logoPath)) doc.image(logoPath, 460, 45, { width: 70 });

  // Title & subtitle
  doc.fillColor("#E65100").font("Times-Bold").fontSize(36)
    .text("Certificate of Completion", 0, 140, { align: "center" });
  doc.fillColor("#000000").font("Times-Roman").fontSize(16)
    .text("This is proudly presented to", 0, 190, { align: "center" });

  // Student Name
  doc.fillColor("#cccccc").font("Helvetica-Bold").fontSize(30)
    .text(name, 2, 222, { align: "center" });
  doc.fillColor("#000").text(name, 0, 220, { align: "center" });

  // Divider
  doc.moveTo(150, 260).lineTo(445, 260).lineWidth(1).strokeColor("#FF8F00").stroke();

  // Course & Organisation
  doc.fillColor("#000000").font("Times-Roman").fontSize(16)
    .text(`for successfully completing the course: "${course}"`, 0, 280, { align: "center" });
  doc.moveTo(150, 310).lineTo(445, 310).lineWidth(0.5).strokeColor("#FF8F00").stroke();
  doc.fillColor("#333333").font("Helvetica-Oblique").fontSize(14)
    .text(`Organisation: ${organisation}`, 0, 330, { align: "center" });

  // Skills logos
  const skillList = skills.split(",").map((s) => s.trim().toLowerCase());
  const logoWidth = 50, spacing = 15;
  const totalWidth = skillList.length * logoWidth + (skillList.length - 1) * spacing;
  let startX = (595 - totalWidth) / 2;
  const logoY = 380;
  skillList.forEach((skill) => {
    const skillLogo = path.join(__dirname, "assets", `${skill}.png`);
    if (fs.existsSync(skillLogo)) {
      doc.image(skillLogo, startX, logoY, { width: logoWidth, height: logoWidth });
      startX += logoWidth + spacing;
    }
  });

  // Bottom row: QR + signature + certificate ID
  const bottomY = logoY + logoWidth + 120;
  const qrSize = 80;
  const qrBuffer = Buffer.from(qrImage.split(",")[1], "base64");
  const qrX = (595 - qrSize) / 2;
  const qrY = bottomY;
  doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });

  const sigWidth = 180;
  const sigX = 595 - 50 - sigWidth;
  const sigY = qrY + qrSize / 2;
  doc.moveTo(sigX, sigY).lineTo(sigX + sigWidth, sigY).lineWidth(1).strokeColor("#000000").stroke();
  doc.font("Times-Roman").fontSize(12).fillColor("#000000")
    .text("Authorized Signature", sigX, sigY + 5, { width: sigWidth, align: "center" });

  const leftTextHeight = 24;
  const leftY = qrY + (qrSize - leftTextHeight) / 2;
  doc.font("Times-Roman").fontSize(12).fillColor("#000000")
    .text(
      `Certificate ID: ${certificateID}\nDate: ${new Date().toLocaleDateString("en-GB",{day:'2-digit',month:'short',year:'numeric'})}`,
      50,
      leftY,
      { align: "left" }
    );

  doc.fontSize(10).fillColor("#666666")
    .text("Generated by CertifyPro - Verify using QR code", 0, 780, { align: "center" });

  doc.end();
});

// ============================
// 📜 FETCH ALL CERTIFICATES
// ============================
app.get("/certificates", (req, res) => {
  db.query("SELECT * FROM certificates ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(results);
  });
});

// ============================
// 🚀 START SERVER
// ============================
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
