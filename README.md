# Production-Grade E-Commerce & Real-Time Messaging Backend Engine

An enterprise-ready, high-performance RESTful API and Real-Time WebSocket engine built using the **MERN Stack ecosystem (Node.js, Express, MongoDB)**. This system is architected using industry-standard clean design patterns (Controller-Service-Repository), heavily optimized for database performance, and secured against modern web vulnerabilities.

---

## 🚀 Key Architectural Highlights

*   **Layered Architecture (Separation of Concerns):** Structured using isolated layers: Routes ➡️ Middlewares ➡️ Controllers ➡️ Services ➡️ Models to ensure maximum maintainability and testability.
*   **Database Query Optimization:** Leveraged Compound and Text Indexes reducing query scanning from `COLLSCAN` to `IXSCAN`, bringing database response times down to **< 2ms**.
*   **Real-Time WebSocket Rooms Engine:** Engineered a stateful Socket.io layer supporting real-time group messaging and event-driven data casting with dual-collection data persistence.
*   **Bulletproof Security & Sanitization:** Implemented advanced protection mechanisms against NoSQL Injections, Cross-Site Scripting (XSS), Brute-Force/DoS attacks, and runtime object alterations.

---

## 🛠️ Tech Stack & Ecosystem

*   **Runtime Environment:** Node.js (ES6+ Modules)
*   **Framework:** Express.js
*   **Database Engine:** MongoDB & Mongoose ORM
*   **Real-Time Layer:** Socket.io
*   **Security & Utils:** Joi, BcryptJS, JSON Web Tokens (JWT), Helmet, Express-Mongo-Sanitize, Express-Rate-Limit, Multer, Winston Engine.

---

## 📦 System Features & Modules

### 1. Advanced Querying & Aggregation Pipeline
*   Dynamic filtering, multi-field sorting, automated pagination, and field selection mapping.
*   Advanced statistical computation using Mongoose **Aggregation Pipelines** (calculating averages, min/max prices, and status grouping).

### 2. Scalable Authentication & Route Guards
*   Secure registration and login flows powered by **BcryptJS** password hashing utilizing `pre-save` hooks.
*   Stateless authentication using **JWT (JSON Web Tokens)** with dynamic extraction and active session validations.

### 3. Joi Request Validation Middleware
*   Global interception layer validating incoming body schemas before hit execution hits the controller level, filtering out polluted attributes.

### 4. Automated Data Seeding & Scripting CLI
*   Custom standalone JavaScript CLI scripts leveraging `@faker-js/faker` to automate database wipes and fast generation of mock production data (`npm run data:import`).

### 5. Multi-Node File Upload Pipeline
*   Streamlined file buffering and storage management using **Multer Middleware** with strict mime-type boundaries and dynamic schema URL virtualization.

---

## 🛠️ Installation & Local Setup

### Prerequisites
*   Node.js (v18.x or higher)
*   MongoDB Local Instance or Atlas URI

### Steps to Run
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/adeelraza113/express-mongo-mastery.git](https://github.com/adeelraza113/express-mongo-mastery.git)
   cd your-repo-name