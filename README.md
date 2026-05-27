# WebPage-She-Can-Foundation
# She Can Foundation - Full Stack NGO Website

A modern full stack NGO website inspired by the official She Can Foundation platform. This project was built using HTML, CSS, JavaScript, Node.js, Express.js, and MySQL. The website focuses on women empowerment, community support, and social impact initiatives.

The platform includes a responsive NGO-style frontend, contact form integration, volunteer form, MySQL database storage, admin features, and email notification functionality.

---

# Features

* Responsive NGO-style website
* Modern UI inspired by She Can Foundation
* Contact Us form
* Volunteer Join form
* Form validation
* MySQL database integration
* REST API using Express.js
* Email notifications using Nodemailer
* Admin dashboard for viewing submissions
* Smooth animations and modern design
* Mobile-friendly layout

---

# Tech Stack

Frontend:

* HTML5
* CSS3
* JavaScript

Backend:

* Node.js
* Express.js

Database:

* MySQL

Other Tools:

* Nodemailer
* dotenv
* mysql2

---

# Project Structure

```bash
project-root/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
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

# MySQL Database Setup

Open MySQL Workbench and run:

```sql
CREATE DATABASE she_can_foundation;
```

Then select database:

```sql
USE she_can_foundation;
```

Run the SQL schema from:

```bash
sql/schema.sql
```

Or manually run:

```sql
CREATE TABLE IF NOT EXISTS contacts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

---

# Environment Variables

Create a `.env` file inside backend folder.

Example:

```env
PORT=5000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=she_can_foundation

EMAIL_USER=vg9584911@gmail.com
EMAIL_PASS=YOUR_APP_PASSWORD

CORS_ORIGIN=http://127.0.0.1:5500
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
EMAIL_PASS=YOUR_APP_PASSWORD
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

# API Endpoint

Contact Form API:

```bash
POST /api/contact
```

Volunteer Form API:

```bash
POST /api/volunteer
```

---

# Deployment

Frontend Hosting:

* Vercel
* Netlify

Backend Hosting:

* Render

Database Hosting:

* Railway MySQL
* PlanetScale

---

# Future Improvements

* Authentication system
* Admin login
* Dashboard analytics
* File upload support
* Donation integration
* NGO event management

---

# Author

Built by Varun

Inspired by She Can Foundation NGO website.
