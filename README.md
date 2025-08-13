# greencart
GreenCart Logistics Project
# GreenCart Logistics Delivery Simulation & KPI Dashboard

## 1. Project Overview & Purpose

GreenCart Logistics is an eco-friendly urban delivery company. This project implements an internal tool that simulates delivery operations and calculates key performance indicators (KPIs) like profit, efficiency, and delivery punctuality.
Managers use the tool to experiment with staffing, delivery schedules, and route allocations to optimize business outcomes.

---

## 2. Setup Steps

### Prerequisites

* Node.js (v16+)
* npm or yarn
* MongoDB Atlas account or access to a MongoDB instance
* Git

---

## 3. Tech Stack Used

* **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, cors
* **Frontend:** React (Hooks), React Router, Axios, Chart.js, react-chartjs-2
* **Testing:** Jest, Supertest
* **Deployment:** Render (Backend), Vercel (Frontend), MongoDB Atlas (Database)

---

## 4. Setup Instructions

### Backend

1. Clone the repo and navigate to `/backend` folder:

   ```bash
   git clone <repo-url>
   cd backend
   ```
   Sure! Here’s a **structured template and example content** you can use to create a professional `README.md` fulfilling **PART 4: Documentation Requirements** for your full-stack project.

---

# README.md Template for GreenCart Logistics Project

````markdown
# GreenCart Logistics Delivery Simulation & KPI Dashboard

## 1. Project Overview & Purpose
GreenCart Logistics is an eco-friendly urban delivery company. This project implements an internal tool that simulates delivery operations and calculates key performance indicators (KPIs) like profit, efficiency, and delivery punctuality.  
Managers use the tool to experiment with staffing, delivery schedules, and route allocations to optimize business outcomes.

---

## 2. Setup Steps

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account or access to a MongoDB instance
- Git

---

## 3. Tech Stack Used
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, cors
- **Frontend:** React (Hooks), React Router, Axios, Chart.js, react-chartjs-2
- **Testing:** Jest, Supertest
- **Deployment:** Render (Backend), Vercel (Frontend), MongoDB Atlas (Database)

---

## 4. Setup Instructions

### Backend

1. Clone the repo and navigate to `/backend` folder:
   ```bash
   git clone <repo-url>
   cd backend
````

2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file with required environment variables (see section 5).
4. Start the backend server:

   ```bash
   npm start
   ```
5. The backend will run on `http://localhost:5000`.

### Frontend

1. Navigate to `/frontend` folder:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file with environment variables as needed (e.g., API base URL).
4. Start the React development server:

   ```bash
   npm start
   ```
5. The frontend will run on `http://localhost:3000`.

---

## 5. Environment Variables

### Backend `.env`

```
MONGO_URI=mongodb+srv://greencartUser:greencart123@cluster0.tfguwlm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=supersecret
PORT=5000
ADMIN_EMAIL=manager@example.com
ADMIN_PASSWORD=manager123

```

### Frontend `.env`

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 6. Deployment Instructions

* Backend is deployed on Render: [https://your-backend-url.onrender.com](https://your-backend-url.onrender.com)
* Frontend is deployed on Vercel: [https://your-frontend-url.vercel.app](https://your-frontend-url.vercel.app)
* MongoDB database hosted on MongoDB Atlas
* Ensure environment variables are set in deployment dashboards accordingly.

---

## 7. API Documentation

You can find the API documentation in the Postman collection here:

###  API Requests & Responses

* **Login**

  `POST /api/login`

  Request Body:

  ```json
  {
    "username": "manager1",
    "password": "password123"
  }
  ```

  Response:

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR..."
  }
  ```

* **Run Simulation**

  `POST /api/simulate`

  Request Headers:

  ```
  Authorization: Bearer <token>
  ```

  Request Body:

  ```json
  {
    "driversAvailable": 5,
    "routeStartTime": "08:00",
    "maxHoursPerDriver": 8
  }
  ```

  Response:

  ```json
  {
    "timestamp": "2025-08-13T06:00:00Z",
    "inputs": { ... },
    "results": {
      "totalProfit": 12000,
      "efficiencyScore": 95,
      "onTimeDeliveries": 120,
      "lateDeliveries": 5,
      "fuelCost": 3000
    }
  }
  ```

---

## Contact

For any questions or issues, please contact:
Shanmugapriya D— [shanmumoorthy22@gmail.com}(mailto:shanmumoorthy22@gmail.com)



