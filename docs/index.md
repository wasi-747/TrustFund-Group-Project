# TrustFund Project Documentation

Welcome to the documentation for **TrustFund**, a modern crowdfunding platform designed to help users create, manage, and support fundraising campaigns with transparency and trust.

---

## 🎯 Overview

TrustFund is a full-stack web application that enables:

- **Fundraisers** to create campaigns with milestone-based fund release
- **Donors** to contribute securely with real-time updates
- **Admins** to verify users and approve milestone completions

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│           React + Vite + TailwindCSS + DaisyUI             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                            │
│            Node.js + Express + Socket.IO                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Database                              │
│                        MongoDB                              │
└─────────────────────────────────────────────────────────────┘
```

## 🌟 Key Features

| Feature                 | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| **Campaign Management** | Create, update, and manage fundraising campaigns with images/videos  |
| **Milestone Escrow**    | Funds are locked and released based on verified milestone completion |
| **Secure Donations**    | Integrated SSLCommerz payment gateway for secure transactions        |
| **User Verification**   | KYC-like verification with NID/document upload                       |
| **Real-time Updates**   | Socket.IO powered live donation notifications                        |
| **AI Enhancement**      | Groq AI-powered story validation and enhancement                     |
| **OAuth Support**       | GitHub OAuth for easy sign-up                                        |
| **Admin Dashboard**     | Complete admin panel for platform management                         |

## 📦 Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Passport.js (GitHub OAuth)
- **Real-time**: Socket.IO
- **Payments**: SSLCommerz
- **AI**: Groq SDK (LLama 3.3)
- **Email**: Nodemailer

### Frontend

- **Library**: React 19
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS + DaisyUI
- **Animations**: Framer Motion
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client

## 📚 Quick Links

<div class="grid cards" markdown>

- :material-rocket-launch:{ .lg .middle } **Getting Started**

  ***

  Set up your development environment

  [:octicons-arrow-right-24: Installation Guide](setup.md)

- :material-api:{ .lg .middle } **API Reference**

  ***

  Explore all backend API endpoints

  [:octicons-arrow-right-24: API Documentation](api-reference.md)

- :material-server:{ .lg .middle } **Backend**

  ***

  Server architecture and models

  [:octicons-arrow-right-24: Backend Docs](backend/index.md)

- :material-monitor:{ .lg .middle } **Frontend**

  ***

  React components and pages

  [:octicons-arrow-right-24: Frontend Docs](frontend/index.md)

</div>

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd TrustFund-Week1

# Start Backend
cd backend
npm install
npm start

# Start Frontend (new terminal)
cd frontend
npm install
npm run dev
```

!!! tip "Development URLs" - Frontend: `http://localhost:5173` - Backend API: `http://localhost:5000`
