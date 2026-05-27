# WebPage-She-Can-Foundation

# She Can Foundation - Full Stack NGO Website

A modern full stack NGO website inspired by the official She Can Foundation platform. This project was built using HTML, CSS, JavaScript, Node.js, Express.js, and MySQL. The website focuses on women empowerment, community support, volunteer engagement, and social impact initiatives.

The platform includes a responsive NGO-style frontend, contact form integration, volunteer registration system, cloud database storage, admin features, and automated email notification functionality.

---

# Live Deployment

Frontend (Vercel):
https://web-page-she-can-foundation.vercel.app

Backend (Render):
https://she-can-backend-38a3.onrender.com

---

# Features

* Responsive NGO-style website
* Modern UI inspired by She Can Foundation
* Contact Us form
* Volunteer Join form
* Form validation
* Cloud MySQL database integration
* REST API using Express.js
* Automated email notifications
* Admin dashboard for viewing submissions
* Smooth animations and transitions
* Mobile-friendly responsive layout
* Secure backend architecture
* Production deployment setup
* Error handling and rate limiting

---

# Tech Stack

## Frontend

* HTML5
* CSS3
* Vanilla JavaScript

## Backend

* Node.js
* Express.js

## Database

* MySQL (Railway Cloud Database)

## Deployment & Hosting

* Vercel (Frontend Hosting)
* Render (Backend Hosting)
* Railway (Cloud MySQL Database)

## Backend Services & Libraries

* Nodemailer (Email Notifications)
* dotenv (Environment Variable Management)
* mysql2 (MySQL Driver)
* cors (Cross-Origin Resource Sharing)
* helmet (Security Middleware)
* morgan (HTTP Request Logger)

---

# Project Structure

```bash
project-root/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── server.js
│   ├── app.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── admin/
│   └── assets/
│
├── sql/
│   └── schema.sql
│
└── README.md
```

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
```

---

## 2. Install Backend Dependencies

Move into backend folder:

```bash
cd backend
```

Install packages:

```bash
npm install
```

---

# Database Setup (Railway MySQL)

## Step 1: Create Railway MySQL Database

Create a free MySQL database using Railway:

https://railway.app

---

## Step 2: Create Tables

Open Railway SQL Editor and run:

```sql
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE volunteers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  skills TEXT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# Environment Variables

Create a `.env` file inside backend folder.

Example:

```env
PORT=5000

DB_HOST=YOUR_RAILWAY_PUBLIC_HOST
DB_PORT=YOUR_RAILWAY_PUBLIC_PORT
DB_USER=YOUR_RAILWAY_USERNAME
DB_PASSWORD=YOUR_RAILWAY_PASSWORD
DB_NAME=YOUR_RAILWAY_DATABASE

CORS_ORIGIN=http://127.0.0.1:5500

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=YOUR_GMAIL
SMTP_PASS=YOUR_16_DIGIT_APP_PASSWORD

NOTIFY_EMAIL=vg9584911@gmail.com
```

---

# Gmail Setup for Nodemailer

To enable email notifications:

1. Enable 2-Step Verification on Gmail
2. Generate App Password

Generate app password here:

https://myaccount.google.com/apppasswords

Use generated password inside:

```env
SMTP_PASS=YOUR_APP_PASSWORD
```

---

# Start Backend Server

Inside backend folder run:

```bash
npm run dev
```

or

```bash
npm start
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Start Frontend

Open frontend folder and run using Live Server extension in VS Code.

Or directly open:

```bash
frontend/index.html
```

Recommended:
Use VS Code Live Server Extension.

Frontend URL:

```bash
http://127.0.0.1:5500
```

---

# API Endpoints

## Contact Form API

```bash
POST /api/contact
```

## Volunteer Form API

```bash
POST /api/volunteer
```

## Health Check API

```bash
GET /health
```

---

# Deployment

## Frontend Hosting

* Vercel

## Backend Hosting

* Render

## Database Hosting

* Railway MySQL

---

# Production Deployment Setup

## Frontend

Deploy frontend folder on Vercel.

## Backend

Deploy backend folder on Render.

## Database

Use Railway MySQL public networking credentials.

---

# Future Improvements

* Authentication system
* Admin login panel
* Dashboard analytics
* File upload support
* Donation payment integration
* NGO event management
* Newsletter subscription
* CMS integration

---

# Author

Built by Varun Gupta

Inspired by the official She Can Foundation NGO website.
