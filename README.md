# MedPulse - Next-Gen Hospital Management System (HMS)

MedPulse is a modern, responsive, and feature-rich Hospital Management Dashboard built with **React.js**, **Vite**, **React Router v6**, **Tailwind CSS**, **Recharts**, and **Lucide Icons**.

It features state persistence via `localStorage`, dynamic dark/light mode, real-time telemetry charts, protected authentication routes, and interactive CRUD interfaces across all 10 core clinical modules.

---

## 🌟 Core Modules

1. **Authentication & Security**
   - Login with Role Selector (Admin, Doctor, Receptionist/Staff)
   - Quick-fill demo credentials
   - Forgot Password & Reset Password simulation
   - Protected routes guard checking active user session

2. **Executive Dashboard Overview**
   - KPI metrics: Total Patients, Active Doctors, Today's Appointments, Available Beds, Paid Revenue, Critical Cases
   - Emergency Alert Banner with priority warnings
   - Interactive SVG charts: Patient Admission Trends (AreaChart), Revenue vs Expenses (BarChart), Bed Occupancy Distribution (Donut PieChart)
   - Quick Action Speed-Dial buttons (Admit Patient, Book Appointment, Create Invoice)

3. **Patient Management**
   - Patient directory grid & table
   - Search by name/ID, filter by Department & Triage Severity Status
   - Multi-column sorting & pagination
   - Admit New Patient modal with form validation
   - Clinical file drawer (Live vitals telemetry, medical history, active prescriptions, discharge action)

4. **Doctor Management**
   - Toggle between Roster Grid view and Table view
   - Filter by Specialization & Duty Status (On Duty, On Call, Off Duty)
   - Add/Edit Doctor modal
   - Doctor Schedule drawer with consultation hours, fee, ratings, and total patients count

5. **Appointment Management**
   - Schedule & Table views
   - Status transition workflow: Scheduled → In-Progress → Completed / Cancelled
   - Filter by Doctor, Date, and Status
   - Book Appointment modal with dynamic doctor slot selection

6. **Bed & Ward Management**
   - Visual Ward Grid (ICU, Emergency Ward, General Ward, VIP Deluxe Suites)
   - Real-time status badges: Occupied, Available, Maintenance, Reserved
   - Assign Bed modal & Release Bed action
   - Ward capacity & occupancy metrics bar

7. **Pharmacy & Inventory**
   - Medicine catalog table (SKU, Stock, Reorder threshold, Unit price, Expiry date)
   - Low-Stock Alert Warning banner (< threshold)
   - Add/Edit Medicine modal
   - Prescription Dispense Simulator (deducts stock and calculates total fee)

8. **Billing & Invoicing**
   - Financial KPI cards: Total Billed, Revenue Collected, Pending Receivables, Overdue Payments
   - Create Invoice modal with dynamic itemized lines calculation (qty * rate + tax - discount)
   - Formatted Printable PDF Invoice modal preview with hospital letterhead

9. **Notifications Center**
   - Header badge dropdown with live unread counter
   - Priority categories: Emergency, Pharmacy, Appointments, Bed Management, Billing
   - Mark as Read & Clear notification history

10. **User Profile & Settings**
    - Account info & department management
    - Appearance Theme selector (Dark Mode / Light Mode)
    - Security password update form
    - **Reset All Data to System Defaults** button

---

## 🛠️ Tech Stack & Dependencies

- **Frontend Core**: React 18/19, Vite
- **Routing**: `react-router-dom` v6
- **Styling & Aesthetics**: Tailwind CSS v4, Custom CSS Variables, Animations
- **Icons**: `lucide-react`
- **Charts & Data Visualization**: `recharts`
- **State Management**: React Context API (`AuthContext`, `ThemeContext`, `HospitalContext`, `ToastContext`) + LocalStorage Sync

---

## 🚀 Setup & Local Execution Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/hospital-management.git

# Navigate to project directory
cd hospital-management

# Install dependencies
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## ☁️ Deployment Instructions

### Deploy to Vercel
1. Install Vercel CLI or connect your GitHub repository to [Vercel](https://vercel.com).
2. Set build command to `npm run build` and output folder to `dist`.

### Deploy to Netlify
1. Connect your GitHub repository to [Netlify](https://netlify.com).
2. Set build command to `npm run build` and publish directory to `dist`.
3. Add a `_redirects` file with `/*  /index.html  200` to support client-side React Router routing.
