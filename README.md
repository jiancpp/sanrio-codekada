# 🌟 TalaCare 

**TalaCare** is a collaborative health monitoring platform designed to bridge the distance for modern Filipino families. While traditional health apps focus on individual progress, TalaCare is built for **mutual accountability**, allowing families to care for each other collectively—whether they are in the same household or working miles away as OFWs.

By centralizing medication tracking, vital sign logs, and medical records into a shared family dashboard, we transform healthcare from a lonely, often-forgotten task into a collective family effort.

---

## 🚀 Core Features

### 👨‍👩‍👧‍👦 Family Connectivity
* **Join via Family Code:** Easily add family members to a shared circle using a unique link or family code.
* **Shared Dashboard:** A real-time overview of the entire family's health status in one glance.

### 📋 Health & Medical Management
* **Emergency Medical Profiles:** Quick access to critical data like Blood Type, Allergies, Medical Conditions, and Maintenance Meds.
* **Daily Health Logs:** Track vitals including Blood Pressure, Heart Rate, Blood Sugar, Weight, and Water Intake.
* **Medication Tracker:** A checkbox system for maintenance meds with the ability to attach images as "proof of intake" (perfect for making sure *pasaway* relatives stay on track).

### ⚡ Accountability Tools
* **The "Nudge" (Socket.io):** Send real-time reminders to loved ones who forget to log their vitals or take their medications.
* **Health Streaks:** Gamified daily streaks to incentivize consistent health tracking and habit building.
* **Clinic & Lab Repository:** Upload and archive lab results and clinic visit notes securely using **Cloudinary**.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Real-time Communication:** Socket.io (Powering the Nudge system)
* **File Storage:** Cloudinary (For lab results and medication proof images)

---

## ⚙️ Repository Setup

### 1. Install Dependencies
Inside the root directory of the repository:
```bash
npm install
```
### 2. Environment Variables
Create a .env file in the server directory and add your configurations (MongoDB URI, Cloudinary API Keys, etc.).

### 3. Run the App Locally
Start the backend server:

```bash
cd backend
node server.js
```

On a different terminal, start the frontend development server:

```bash
npm run dev
```

The application will run at:

http://localhost:5173

## 📖 Why TalaCare?
In the Philippines, caring for family has never depended on distance. However, busy schedules and migration (OFWs) often lead to "reactive" healthcare—only paying attention when someone gets sick.

TalaCare moves the needle toward proactive care. Unlike generic habit trackers that rely on individual willpower, TalaCare relies on the strongest motivator we have: Family Love. It’s not just an app reminding you to take your pill; it’s your daughter sending you a nudge from 3,000 miles away.

## 🛡️ Development Note
This project was developed by Team Sanrio (CS Students from DLSU).

React + Vite was chosen for a fast, optimized development experience.

ESLint is configured for production-grade code quality.
