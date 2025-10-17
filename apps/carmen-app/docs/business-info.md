# Carmen Software - Business Information
> ข้อมูลพื้นฐานสำหรับการสร้าง Terms of Service และ Privacy Policy

## ข้อมูลพื้นฐาน

### ชื่อบริษัท/แอป/เว็บไซต์
**Carmen Software**
- ชื่อเต็ม: Carmen - Hotel Finance Management Software
- คำอธิบาย: Hospitality Supply Chain Management System

### ประเภทธุรกิจ
**SaaS (Software as a Service) - B2B Enterprise Application**
- ระบบบริหารจัดการ Supply Chain สำหรับอุตสาหกรรมโรงแรมและธุรกิจ Hospitality
- Multi-tenant inventory management platform
- Enterprise resource planning (ERP) system

### กลุ่มเป้าหมาย
**B2B (Business-to-Business)**
- โรงแรม (Hotels)
- ธุรกิจ Hospitality (Resorts, Serviced Apartments)
- ร้านอาหาร (Restaurants)
- Business Unit Managers
- Procurement Officers
- Finance Managers
- Department Heads
- Warehouse/Store Managers

---

## การให้บริการ

### บริการหลัก
Carmen Software ให้บริการระบบจัดการครบวงจร ประกอบด้วย:

#### 1. **Procurement Management** (การจัดซื้อ)
- Purchase Request (ใบขอซื้อ)
- Purchase Order (ใบสั่งซื้อ)
- Goods Received Note (ใบรับสินค้า)
- Credit Note (ใบลดหนี้)
- Purchase Request Approvals (ระบบอนุมัติใบขอซื้อ)
- Vendor Comparison (เปรียบเทียบผู้จัดจำหน่าย)

#### 2. **Product Management** (การจัดการสินค้า)
- Product Catalog
- Product Categories (Category, Sub-category, Item Group)
- Unit Management
- Price Management

#### 3. **Vendor Management** (การจัดการผู้จัดจำหน่าย)
- Vendor Directory
- Price Lists
- Price Comparisons
- Vendor Performance Tracking

#### 4. **Inventory Management** (การจัดการสต็อก)
- Stock Overview (Inventory Balance, Inventory Aging, Stock Card)
- Inventory Adjustments
- Physical Count Management
- Spot Check
- Period End Management
- Store Requisitions
- Stock Replenishment

#### 5. **Operational Planning** (การวางแผนการดำเนินงาน)
- Recipe Management
- Menu Engineering
- Demand Forecasting
- Production Planning

#### 6. **Finance Management** (การเงิน)
- Account Code Mapping
- Budget Planning and Control
- Exchange Rates
- Credit Terms
- VAT/Tax Management

#### 7. **System Administration** (การจัดการระบบ)
- User Management
- Workflow Management
- Business Unit Management
- Cluster Management
- General Settings

#### 8. **Configuration** (การตั้งค่า)
- Currency Management
- Delivery Points
- Store Locations
- Department Management
- Tax Profiles
- Extra Cost Management
- Business Types

### มีระบบสมาชิก/บัญชีผู้ใช้หรือไม่?
**ใช่ - ต้อง Register และ Login**
- ระบบ JWT Authentication (Access Token + Refresh Token)
- Email + Password login
- Role-based access control
- Multi-Business Unit support (ผู้ใช้สามารถสลับระหว่าง Business Unit ได้)
- Session Management

### มีการชำระเงินหรือไม่?
**Subscription-based (B2B Enterprise Licensing)**
- แบบสมาชิก (Subscription model)
- ราคาตามจำนวน Business Units
- Enterprise licensing
- ไม่มีข้อมูลการชำระเงินผ่านแอป (จัดการโดยทีมขายโดยตรง)

### มี User-Generated Content หรือไม่?
**ใช่ - มีข้อมูลที่ผู้ใช้สร้างภายในระบบ**

ผู้ใช้สามารถ:
- สร้างและจัดการ Purchase Requests, Purchase Orders
- อัพโหลดเอกสารแนบ (Documents/Files)
- เพิ่ม Comments และ Notes ในเอกสาร
- สร้างและจัดการข้อมูล Products, Vendors, Recipes
- กำหนดค่า Workflow และ Approval Process
- บันทึกข้อมูล Inventory Transactions
- จัดการข้อมูล Business Dimensions

---

## ข้อมูลและความเป็นส่วนตัว

### เก็บข้อมูลอะไรบ้าง?

#### ข้อมูลส่วนบุคคล (Personal Information)
- Email Address
- ชื่อ-นามสกุล (Full Name)
- เบอร์โทรศัพท์
- แผนก (Department)
- Business Unit Assignment
- User Role และ Permissions

#### ข้อมูลการใช้งาน (Usage Data)
- Login History (Last Login Date/Time)
- Session Information
- Business Unit Context (bu-code)
- Workflow Actions และ Approval History
- Transaction History

#### ข้อมูลธุรกิจ (Business Data)
- ข้อมูลบริษัท/Business Unit
- ข้อมูล Vendors และ Suppliers
- ข้อมูล Products และ Inventory
- ข้อมูล Purchase Orders และ Transactions
- ราคาและเงื่อนไขการชำระเงิน
- เอกสารแนบและไฟล์

#### ข้อมูลทางเทคนิค (Technical Data)
- IP Address
- Browser Type และ Version
- Device Information
- Cookies และ Local Storage
- Performance Metrics (Sentry)

### ใช้ข้อมูลเพื่ออะไร?

1. **การให้บริการ (Service Delivery)**
   - ยืนยันตัวตนและจัดการ Authentication
   - จัดการสิทธิ์การเข้าถึง (Authorization)
   - Multi-tenant data isolation
   - ประมวลผล Workflow และ Approvals

2. **การปรับปรุงระบบ (System Improvement)**
   - Error Monitoring (Sentry Integration)
   - Performance Tracking
   - Analytics สำหรับปรับปรุง UX

3. **การรักษาความปลอดภัย (Security)**
   - Fraud Detection
   - Audit Logging
   - Session Management

4. **การสื่อสาร (Communication)**
   - System Notifications
   - Workflow Alerts
   - Email Notifications สำหรับ Approvals

### มี Third-Party Services หรือไม่?

**ใช่ - มีการใช้บริการภายนอก**

1. **Error Monitoring & Performance**
   - **Sentry** - Error tracking และ Performance monitoring

2. **Authentication & Security**
   - JWT Token Authentication (Self-hosted)

3. **Infrastructure & Hosting**
   - Next.js Deployment Platform
   - API Backend Services

4. **Development Tools**
   - TanStack Query - Data fetching
   - Axios - HTTP client

**หมายเหตุ:** ไม่พบการใช้งาน
- Google Analytics (ยังไม่มีในโค้ด)
- Payment Gateway (จัดการนอกระบบ)
- Email Service Providers เช่น SendGrid, Mailgun (อาจมีใน backend)

---

## ข้อกฎหมาย

### ประเทศที่ให้บริการหลัก
**ประเทศไทย (Thailand) + International**
- รองรับ 2 ภาษา: ไทย (th) และ อังกฤษ (en)
- เหมาะสำหรับตลาดไทยและ Asia-Pacific
- รองรับ Multi-currency

### ต้องการ Comply กับกฎหมายอะไร?

#### 1. **PDPA (Personal Data Protection Act) - ประเทศไทย**
- พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
- ต้องมี:
  - นโยบายความเป็นส่วนตัว (Privacy Policy)
  - ขอความยินยอมในการเก็บข้อมูล
  - สิทธิของเจ้าของข้อมูล (Data Subject Rights)
  - การแจ้งเหตุละเมิดข้อมูล

#### 2. **GDPR (สำหรับลูกค้า EU) - Optional**
- ถ้ามีลูกค้าในยุโรป ต้อง comply กับ GDPR
- Right to Access, Right to Delete, Right to Portability

#### 3. **กฎหมายอิเล็กทรอนิกส์ไทย**
- พ.ร.บ. ว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์
- พ.ร.บ. คอมพิวเตอร์

#### 4. **ข้อกำหนดด้านความปลอดภัย**
- ISO/IEC 27001 (ถ้าต้องการ certification)
- SOC 2 Compliance (สำหรับ Enterprise customers)

---

## สรุป Key Points สำหรับ Legal Documents

### Terms of Service ควรครอบคลุม:
- ✅ การใช้งานระบบ (B2B Enterprise)
- ✅ สิทธิ์และหน้าที่ของผู้ใช้
- ✅ Subscription และ Licensing
- ✅ Intellectual Property Rights
- ✅ User-generated Content Ownership
- ✅ Data Security และ Backup
- ✅ Service Level Agreement (SLA)
- ✅ Limitation of Liability
- ✅ Termination Policy

### Privacy Policy ควรครอบคลุม:
- ✅ ข้อมูลที่เก็บ (Personal + Business Data)
- ✅ วัตถุประสงค์การใช้ข้อมูล
- ✅ Third-party Services (Sentry)
- ✅ Cookies และ Local Storage
- ✅ สิทธิของเจ้าของข้อมูล (PDPA)
- ✅ การรักษาความปลอดภัยข้อมูล
- ✅ Multi-tenant Data Isolation
- ✅ Data Retention Policy
- ✅ การติดต่อ Data Protection Officer

---

**เอกสารนี้สร้างขึ้นโดยอิงจาก:**
- CLAUDE.md
- package.json
- Translation files (en.json, th.json)
- Codebase structure และ features
