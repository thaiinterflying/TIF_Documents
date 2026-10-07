# THAI INTER FLYING - Customer Training Order & Tracking Form

ระบบเว็บแอปพลิเคชันสำหรับกรอกและจัดการข้อมูลเอกสาร **CUSTOMER TRAINING ORDER & TRACKING FORM (F-MK-0063)** ของ Thai Inter Flying

## คุณสมบัติหลัก (Key Features)

- **Exact Document Replica**: ถอดแบบโครงสร้างและเลย์เอาต์ตรงตามเอกสารต้นฉบับ 100%
- **Sections ครบถ้วนตามมาตรฐาน**:
  - SECTION A – DISTRIBUTION
  - SECTION B – CUSTOMER INFORMATION
  - SECTION C – EMERGENCY CONTACT
  - SECTION D – LICENSE & MEDICAL
  - SECTION E – COURSE ORDER DETAILS
  - SECTION F – OTHER SERVICES
  - SECTION G – FINANCE (tracking) (คำนวณราคาสุทธิ Final อัตโนมัติ)
  - SECTION J – APPROVAL & SIGNATURE (ระบบเซ็นชื่อสดด้วยเมาส์หรือทัชสกรีน)
- **Form Preview**: หน้าแสดงตัวอย่างเอกสาร 2 หน้าก่อนพิมพ์/ส่งออก
- **Export PDF**: สร้างไฟล์ PDF ด้วย `@react-pdf/renderer` พร้อมประทับตราโลโก้และลายเซ็น
- **Export Word (.docx)**: สร้างไฟล์ Microsoft Word ด้วย `docx` สามารถเปิดและแก้ไขต่อได้จริง
- **Local Storage Auto-Save**: บันทึกข้อมูลอัตโนมัติ ไม่สูญหายเมื่อรีเฟรชหน้าเว็บ พร้อมระบบ Restore Draft
- **Corporate Dashboard**: ระบบค้นหา Draft ตาม Tracking No. หรือชื่อลูกค้า พร้อมฟังก์ชันโหลด Demo Cadet Data
- **Vercel Ready**: รองรับการ Deploy บน Vercel ทันที

## เทคโนโลยีที่ใช้ (Tech Stack)

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Hook Form + Zod
- Lucide React
- @react-pdf/renderer (PDF Export)
- docx (Word Export)

## การติดตั้งและรันโปรเจกต์ (Local Development)

```bash
# ติดตั้ง dependencies
npm install

# รัน Development Server
npm run dev

# ทดสอบ Build สำหรับ Production
npm run build
```
