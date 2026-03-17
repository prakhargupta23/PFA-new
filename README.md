# PFA Dashboard 🚀

A sophisticated **Personal/Professional Finance Assistant** dashboard built with the modern web stack. This application provides a comprehensive suite of tools for financial analysis, task management, audit inspections, and AI-driven decision-making.

---

## 🏗️ Core Modules

- **🧠 AI Decision Brain**: Leveraging Azure OpenAI to provide intelligent financial insights and decision support.
- **📊 Executive Summary**: A high-level overview of financial health with dynamic data visualization.
- **💰 Owe Management**: Track and manage payables/receivables with integrated WhatsApp notification services.
- **📂 Capex Analysis**: Detailed analysis and reporting of capital expenditures.
- **✅ Task Management**: Robust task tracking system for financial operations.
- **� Voice Capturing**: Hands-free interactions with the dashboard.
- **�🔍 Audit & Inspection**: Digital tools for streamlining audit processes and reporting.

---

## 🛠️ Technology Stack

### **Frontend & Core**
- **React (v18)**: Core UI framework.
- **TypeScript**: Ensuring type safety and robust development.
- **React Router Dom**: Client-side routing.
- **Axios**: Promised-based HTTP client for API communication.

### **Authentication & Analytics**
- **Azure MSAL**: Secure authentication using Microsoft Identity Platform (`@azure/msal-react`).
- **Mixpanel**: Advanced user analytics and behavior tracking.

### **UI & Aesthetics** (Rich & Premium)
- **Material UI (MUI)**: Primary component library for a clean, professional interface.
- **Framer Motion**: Smooth micro-animations and transitions.
- **Vanta.js & Three.js**: Dynamic, high-end background effects.
- **React Particles**: Interactive particle systems for enhanced visual engagement.
- **Slick Carousel**: Fluid content sliders and carousels.

### **AI & Data Processing**
- **Azure OpenAI**: Powering the intelligent decision-making features.
- **Recharts & Chart.js**: Advanced data visualization and interactive charts.
- **SQL.js**: Client-side SQLite processing for complex data handling.
- **Papaparse & XLSX**: Powerful CSV and Excel processing.

### **Cloud & Infrastructure**
- **Azure Storage**: Utilizing Blob and Queue storage for data and document management.
- **WhatsApp API Integration**: Automated messaging for financial reminders and alerts.

### **Document Management**
- **PDF Services**: Generating and processing professional financial reports (PDF/Docx).
- **Mammoth & jsPDF**: Client-side document conversion and generation.

---

## 📁 Project Structure

```text
src/
├── modules/      # Core business modules (Audit, Capex, Owe, etc.)
├── services/     # API services (AI, WhatsApp, Database, etc.)
├── layout/       # Layout components and navigation
├── components/   # Reusable UI components
├── shared/       # Constants, types, and shared utilities
└── utils/        # Helper functions
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm / yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## 📜 Available Scripts

- `npm start`: Runs the app in development mode.
- `npm run build`: Builds the production-ready application.
- `npm test`: Executes the test suite.

---

**Built with ❤️ for sophisticated financial management.**
