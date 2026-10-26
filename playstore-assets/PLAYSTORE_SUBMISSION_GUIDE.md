# Google Play Store Submission Package
## TailorC (Partner & Admin App) · Package: `com.tailorc.partner`

This document contains everything required for Google Play Console submission: App Title, Descriptions, Category, Graphic Assets Checklist, Data Safety Questionnaire answers, Reviewer Credentials, and Policy compliance links.

---

### 1. App Listing Information

| Field | Console Limit | Exact Value to Enter |
| :--- | :--- | :--- |
| **App Name** | Max 30 chars | `TailorC Partner & Admin` |
| **Short Description** | Max 80 chars | `Workshop dispatch, custom quotes desk, and master cutter naap management.` |
| **Category** | Dropdown | `Business` (Alternative: `Productivity`) |
| **Tags** | Up to 5 tags | `Tailoring`, `Order Management`, `CRM`, `Business Management`, `Atelier` |

---

### 2. Full Description (Copy & Paste directly into Play Console)

```text
TailorC Partner & Admin is the enterprise workshop management and dispatch console for master cutters, custom embroidery studios, and bespoke tailoring ateliers. 

Designed specifically for Indian bespoke couture, bridal maggam work, lehengas, and master suit craftsmanship, this app empowers tailoring workshop owners and managers to streamline orders, dispatch price quotes, record anatomical measurements, and track production pipelines in real time.

✨ CORE FEATURES & CAPABILITIES:

📊 1. ADMIN HQ COMMAND CENTER
• Real-time platform metrics: Today's Due Orders, Pending Bookings, Platform Volume, and Total Customers.
• Daily, monthly, and overall atelier revenue tracking.
• Quick-action order generator with instant master cutter assignment.

💬 2. CUSTOM QUOTATIONS DESK
• Receive bespoke design requests directly from patrons.
• Examine customer-uploaded fabric swatches, neck cut patterns, and embroidery inspiration.
• Set stitching price estimates and dispatch instant quotation alerts to customers via WhatsApp and SMS.

✂️ 3. WORKSHOP DISPATCH & MASTER CUTTER ASSIGNMENT
• Assign orders to specialized master cutters (Master Cutters, Hand Maggam Artisans, Coat Makers).
• Full visibility over artisan workload, turnaround timelines, and workshop capacity.

🏭 4. 6-STAGE LIVE WORKSHOP TRACKING
• Real-time order progress tracking through 6 precise tailoring stages:
  1. Fabric Intake & Flaw Inspection
  2. Master Cutting & Pattern Drafting
  3. Hand Maggam & Zardozi Embroidery
  4. Machine Assembly & Stitching
  5. 10-Point Quality Inspection
  6. Ready for Doorstep Dispatch
• Instant status milestone sync with customer mobile apps.

📐 5. 18-POINT DIGITAL NAAP STUDIO
• Comprehensive anatomical measurement specifications with dual Hindi and English labels:
  - Upper Body: Length (लम्बाई), Chest (सीना), Waist (कमर), Shoulder (तीरा), Neck (गला), Sleeves (बाजू), Bicep, Elbow, Wrist.
  - Lower Body: Length, Waist Belt, Hip (सीट), Thighs, Knee, Calf, and Bottom (मोहरी).
• Fit preference tagging: Comfort Fit, Relaxed Fit, or Bridal Snug Fit.
• Persistent Digital Naap Passport prevents repeated customer measuring.

🌸 6. BRIDAL & MAGGAM EMBROIDERY CATALOG MANAGER
• Pre-loaded luxury Indian bridal designs: Peacock Zardozi Maggam, Lotus & Temple Antique Zari, Kundan Cutwork, and Royal Ambari Zari.
• Toggle service availability and edit atelier stitching rates in real time.

👥 7. PATRON & ATELIER CRM DIRECTORY
• Search customer order history, past measurements, and delivery notes.
• Manage partner tailoring workshops, addresses, ratings, and payout settlements.

🔒 ENTERPRISE SECURITY & PRIVACY:
• Encrypted data storage on enterprise AWS RDS PostgreSQL cloud servers.
• Isolated measurement vault adhering to Google Play Developer Policies and Indian DPDP Act 2023.

Download TailorC Partner & Admin today to transform your tailoring atelier into a modern, high-precision bespoke enterprise!
```

---

### 3. Graphic Assets Checklist

All assets are located in `tailor-partner-app/playstore-assets/` and formatted to Google Play's exact specifications:

| Asset Type | Requirement | Filename | Status |
| :--- | :--- | :--- | :--- |
| **App Icon** | 512 x 512 px, 32-bit PNG, max 1MB, no transparency | `app-icon-512x512.png` | ✅ Generated (332 KB) |
| **Feature Graphic** | 1024 x 500 px, PNG/JPEG, max 15MB | `feature-graphic-1024x500.png` | ✅ Generated (743 KB) |
| **Screenshot 1** | Phone 9:16 portrait (1080 x 1920 PNG) | `screenshot-1-admin-dashboard.png` | ✅ Generated |
| **Screenshot 2** | Phone 9:16 portrait (1080 x 1920 PNG) | `screenshot-2-quotes-desk.png` | ✅ Generated |
| **Screenshot 3** | Phone 9:16 portrait (1080 x 1920 PNG) | `screenshot-3-workshop-pipeline.png` | ✅ Generated |
| **Screenshot 4** | Phone 9:16 portrait (1080 x 1920 PNG) | `screenshot-4-digital-naap.png` | ✅ Generated |
| **Screenshot 5** | Phone 9:16 portrait (1080 x 1920 PNG) | `screenshot-5-maggam-catalog.png` | ✅ Generated |

---

### 4. Mandatory Reviewer Credentials (App Access in Play Console)

Google Play reviewers require valid test credentials to access restricted screens:

- **Access Type:** All functionality is available with restrictions (Enter credentials)
- **Account Name / Role:** Platform Administrator
- **Email / Username:** `admin@tailorc.com`
- **Password:** `admin123`
- **Instructions for Reviewer:**
  ```text
  1. Open the app to the login screen.
  2. Enter the administrator credentials provided above and tap 'Sign In'.
  3. The Admin Overview dashboard will display active atelier orders, custom quotes desk, and workshop pipeline.
  4. No external hardware or physical accessories are required to test the app.
  ```

---

### 5. Policy & Legal URLs

- **Privacy Policy URL:**
  ```text
  https://tailorc.com/privacy
  ```
  *(Or your deployed domain, e.g. `https://<your-project>.vercel.app/privacy`)*
- **User Data & Account Deletion URL:**
  ```text
  https://tailorc.com/privacy#account-deletion
  ```
- **Terms of Service URL:**
  ```text
  https://tailorc.com/terms
  ```

---

### 6. Data Safety Questionnaire Answers

When completing the **Data Safety** section in Google Play Console:

1. **Does your app collect or share any of the required user data types?** -> **Yes**
2. **Is all of the user data collected by your app encrypted in transit?** -> **Yes** (TLS 1.3 enforced)
3. **Do you provide a way for users to request that their data be deleted?** -> **Yes** (Provide URL: `https://tailorc.com/privacy#account-deletion`)
4. **Data Types Collected:**
   - **Personal info:**
     - Name (App functionality, Account management)
     - Phone number (App functionality, Account management, Fraud prevention)
     - Physical Address (App functionality - doorstep pickup & delivery)
     - Email (Optional - Account management)
   - **Photos and Videos:**
     - Photos (App functionality - customer fabric photos, embroidery motif designs)
   - **Location:**
     - Approximate & Precise location (App functionality - Doorstep fitting & delivery logistics)
   - **Financial info:**
     - Purchase history (App functionality - Invoicing & order accounting; payment card numbers are NOT stored)
   - **Device or other IDs:**
     - Device IDs / Push tokens (App functionality - order status notifications)

---

### 7. Content Rating & Target Audience

- **Target Audience:** Age 18 and over (B2B atelier management & commerce).
- **Contains Ads?:** Select **"No, my app does not contain ads"**.
- **Financial Features?:** None (Order invoicing only).
- **Government Apps?:** No.
- **News Apps?:** No.
