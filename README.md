# 🗂 Project Task Tracker App

*READ THIS CAREFULLY BEFORE USING THIS APP*

A simple Project & Task Management App with role-based functionality:

- ✅ Admin can manage team members, projects, tasks
- ✅ Team Members can view and update their assigned tasks
- ✅ All data is stored in MongoDB Atlas

---

## 🚀 Features

### Admin
- Create, edit, delete projects
- Create, edit, delete team members (name + email)
- Assign tasks to team members
- View and manage all tasks

### Team Member
- View only tasks assigned to them
- Update task status (To Do, In Progress, Done)
- View progress (dynamic progress bar)
- Comment feature coming soon (optional)

---

## 🏗 Project Structure

/backend → Node.js + Express API (MongoDB Atlas)
/frontend → React (Vite) frontend

---

## ⚙ Setup Instructions (For Local Run)

### 1️⃣ Clone or Unzip Project

bash
# If cloning from GitHub:
git clone <repo-url>

# If ZIP:
Unzip the file and open the project folder.
2️⃣ Setup Backend
bash
Copy
Edit
cd backend
npm install
⚠ Configure .env
In /backend/.env, add:
env
MONGO_URI="your_mongo_url"

Run Backend Server
bash
Copy
Edit
npm start
👉 Backend runs at: http://localhost:5000

3️⃣ Setup Frontend
bash
Copy
Edit
cd frontend
npm install
npm run dev
👉 Frontend runs at: http://localhost:5173

👥 Roles & Login
Admin Login
Email: admin@tracker.com
Password: Admin123
Team Member Login
Admin must create team members first (with name and email)

Team member can then log in using their email and password

# 🌐 Environment Variables (.env Setup)

### 📌 Why .env is Important  
This project connects to *one MongoDB database*, which contains four collections:  
- users → Handles authentication & user profiles  
- projects → Stores project details  
- tasks → Stores assigned tasks with status info  
- team_members → Holds team member names/emails  

### 🛠 How to Configure .env
1️⃣ Open the .env file in /backend/  
2️⃣ Update your *MongoDB connection string*, like this:  
    env
    MONGO_URI="your_mongo_url"
    
3️⃣ *IMPORTANT:* Replace "your_mongo_url" with your actual MongoDB Atlas connection string.  
4️⃣ If deploying, use a *secure remote database URL* instead of a local setup.

### 📝 .env.example (Recommended)
To help other developers set up their .env, create an .env.example file with a placeholder:  
```env
MONGO_URI="your_mongodb_url"


### 📌 Database Structure & Collections  

MongoDB Atlas is used — no need to install MongoDB locally.  

✔ This project stores data in *one MongoDB database, which organizes data into **four collections*:  
- users → Handles authentication & user profiles  
- projects → Stores project details  
- tasks → Manages task assignments & progress  
- team_members → Holds details of assigned team members  

Make sure all API requests reference the correct collection when interacting with the database.

---

Fully responsive UI built with Material UI

Backend is a REST API

Future Improvements (Optional)
Add Task Comments (per task)

Add Task Due Dates and Reminders

Add User Profile Page

Add Email Notifications for Task Assignment


🎉 Final Result
✅ Fully working Project + Task Tracker App
✅ Admin + Team roles
✅ Persistent database (MongoDB Atlas)
✅ Clean, modern UI