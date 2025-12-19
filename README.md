# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# Demo Script for Web-Based Air-Conditioning Service Appointment System

OPENING (1 minute)
"Good [morning/afternoon]. I'm presenting our Web-Based Air-Conditioning Service Appointment System for EER Air-conditioning.
The Problem: Small AC companies use manual booking - phone calls, texts, handwritten notes. This causes schedule conflicts, overbooking, lost records, and poor technician tracking.
Our Solution: A complete digital system that automates scheduling, prevents schedule conflicts and overbooking, manages technicians, and tracks revenue. Let me show you how it works."

CUSTOMER BOOKING (2 minutes)
"First, the customer experience:"
[Navigate to booking page]
"Customers can:
• Enter their details easily
• Select multiple services - Installation, Repair, Checkup and Maintenance, Cleaning
• Choose multiple AC types per service
• Pick preferred dates"
[Fill form quickly, submit]
"When submitted, the system validates everything and stores it as 'Pending' for admin review. Customer gets instant confirmation."

ADMIN DASHBOARD & APPOINTMENT MANAGEMENT (6 minutes)
Dashboard Overview (1 minute)
[Navigate to Admin Dashboard]
"The admin dashboard gives a real-time overview: performance metrics, today's schedule, and upcoming appointments for the next 7 days. Admins see:
• Acceptance, completion, and cancellation rates
• Today's scheduled jobs with full details
• Quick preview of all upcoming appointments, sorted by date and service type."

Appointment Management (5 minutes)
[Navigate to Admin Appointments]
"The Admin Appointments page has two main tabs: Pending and Accepted."

Accept Appointment (2 minutes)
[Show pending appointment]
"Here's our customer's booking. Admin sees all details - customer info, services, dates, AC types."
[Click Accept]
"When accepting, the technician assignment modal opens. This is powerful - admin can:
• Select existing technicians
• Add custom names that automatically save to database
• Assign multiple technicians"
[Add technician, accept]
"System automatically:
• Changes status to 'Accepted'
• Sends confirmation email to customer
• Moves to Accepted tab"

Key Management Features (2 minutes)
[Show accepted tab]
"In Accepted appointments, admin can:
[Demo reschedule]
• Reschedule - System checks our 5-appointment daily limit and prevents overbooking.
[Demo complete with revenue]
• Complete - Admin inputs revenue amount, system saves with timestamp.
• Return to Pending - Flexibility to reverse if needed.
• Cancel - Automatically sends cancellation email."

Date Validation Demo (1 minute)
[Try to reschedule to busy date]
"Watch this - if I try scheduling on a date with 5 bookings, system prevents overbooking automatically. This solves their major scheduling problem."

Loading States (30 seconds)
"Notice the loading indicators - prevents duplicate actions and shows clear system feedback."

BIG CALENDAR (1 minute)
[Navigate to calendar]
"The Big Calendar provides visual overview of all appointments. Click any date to see full details - customer, services, technicians, status. Perfect for planning and preventing conflicts."

________________________________________
💰 REVENUE SYSTEM (3 minutes)
Revenue Management (1.5 minutes)
[Navigate to Revenue, show completed appointments]
"When services are completed, they appear here. Admin can:
• Input revenue for each appointment
• See real-time total calculations
• Save comprehensive revenue records"
[Input some revenue amounts, save]
"System validates all inputs and saves complete records with timestamps."

Revenue History (1.5 minutes)
[Switch to History tab]
"Revenue History provides complete financial tracking:
• All saved records with dates
• Filter by date range and service type
• Total earnings calculations
• Export functionality
• Pagination for large datasets"
[Demo quick filter]
"Admins can filter by specific periods or service types for business analysis."

________________________________________
📊 REPORTS OVERVIEW (1 minute)
[Navigate to Reports]
"Our comprehensive reporting system generates five report types:
• Completed appointments with revenue
• Pending appointments awaiting action
• Accepted appointments with technicians
• Cancelled appointments
• Revenue History with totals
Each provides detailed business intelligence for decision-making."

________________________________________
⚡ SYSTEM IMPACT & CONCLUSION (1 minute)
"Key Achievements:
• ✅ Eliminates overbooking with 5-appointment daily limit
• ✅ Automates email notifications - confirmation and cancellation
• ✅ Digital record keeping replaces lost paper records
• ✅ Revenue tracking with accurate calculations
• ✅ Technician management with automatic database updates
• ✅ Visual scheduling prevents conflicts"
