# 🍬 Sweet Shop Management System (MERN Stack)

This is a full-stack Sweet Shop Management System built as a TDD (Test-Driven Development) Kata. It features a complete RESTful API built with Node.js and Express, and a modern, responsive frontend built with React.

The project demonstrates a robust backend with secure authentication, role-based access control (user vs. admin), and full CRUD functionality for managing inventory. The frontend is a clean, dark-mode single-page application (SPA) that consumes the API.

---

## 🚀 Live Demo

### https://incuybte-project-frontend.onrender.com

### To login as admin -> Email: admin@sweetshop.com Pass: admin1234
---

## 📸 Screenshots

| Login/ Register Page | Homepage (User View) |
| :---: | :---: |
| *<img width="1833" height="910" alt="image" src="https://github.com/user-attachments/assets/9f66c532-0e99-417a-91de-5cbba27d9e8f" />* | *<img width="1834" height="920" alt="image" src="https://github.com/user-attachments/assets/4075d146-b8d6-49aa-bb93-8eb9ac8e88c4" />* |
| **Admin Panel** | **Adding Sweet (Admin Panel)** |
| *<img width="1829" height="916" alt="image" src="https://github.com/user-attachments/assets/9c7a243b-1797-4749-8d23-06a33f166d84" />* | *<img width="1291" height="799" alt="image" src="https://github.com/user-attachments/assets/e90cbabc-506f-4a0d-8c4d-8e816331ff1f" />* |

---

## ✨ Features

* **Full JWT Authentication:** Secure user registration and login with token-based authentication.
* **Protected Routes:** Separate, protected routes for regular users (viewing/purchasing) and admins (full management).
* **Sweet Dashboard:** A responsive, grid-based homepage to display all available sweets.
* **Dynamic Search:** A comprehensive search bar to filter sweets by **name**, **category**, and **price range** (min/max).
* **Inventory Management:**
    * Users can "purchase" sweets, which (atomically) decreases the stock quantity in the database.
    * The "Purchase" button is correctly **disabled** if the quantity is zero.
* **Secure Admin Panel:** A dedicated admin-only section to manage the shop:
    * **Create, Read, Update, Delete (CRUD)** for all sweets.
    * **Restock** sweets to increase quantity.
* **Notifications:** Real-time feedback for actions like "Purchase Successful!" or "Item Restocked!"
* **TDD Backend:** The backend API was built using a strict Test-Driven Development workflow, with Jest and Supertest ensuring high test coverage.

---

## 💻 Technology Stack

* **Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs, cors
* **Frontend:** React (with Vite), React Router, React Context API, Axios
* **Database:** MongoDB Atlas (Non-relational cloud database)
* **Testing:** Jest, Supertest
* **Deployment:** Render (for Web Service & Static Site)

---

## 🚀 Setup and Run Locally

To run this project on your local machine, you will need to run the **backend** and **frontend** in two separate terminals.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or later)
* A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
* Your favorite code editor (e.g., VS Code)

### 1. Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_GITHUB_REPO_URL]
    cd [YOUR_PROJECT_FOLDER]/backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create your `.env` file:**
    Create a file named `.env` in the `/backend` folder and add the following variables:
    ```
    MONGO_URI=[Your_MongoDB_Atlas_Connection_String]
    JWT_SECRET=thisisasecretkeyfornow
    CORS_ORIGIN=http://localhost:5173
    ```
    *(Replace the `MONGO_URI` with your own connection string from MongoDB Atlas)*
4.  **Run the server:**
    ```bash
    npm run dev
    ```
    The backend server will start on `http://localhost:5000`.

### 2. Frontend Setup

1.  Open a **new terminal**.
2.  **Navigate to the frontend:**
    ```bash
    cd ../frontend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create your `.env` file:**
    Create a file named `.env` in the `/frontend` folder:
    ```
    VITE_API_URL=http://localhost:5000/api
    ```
5.  **Run the client:**
    ```bash
    npm run dev
    ```
    The React application will start on `http://localhost:5173`.

### 3. (MANDATORY) Create an Admin User

1.  Open the application (`http://localhost:5173`) and **register a new user**.
2.  Log in to your **MongoDB Atlas** account and "Browse Collections".
3.  Navigate to your `sweetshop` database > `users` collection.
4.  Find the user you just created and **manually edit** their document.
5.  Change the `role` field from `"user"` to **`"admin"`** and save the change.
6.  Log out of the application and log back in as that user. The "Admin Panel" link will now be visible in the navbar.

---

## 🧪 Backend Test Report

The backend API has a comprehensive test suite. To run the tests:

1.  Navigate to the `/backend` folder in your terminal.
2.  Run the test command (ensure your server is **not** running in this terminal):
    ```bash
    npm test
    ```

#### Test Results:
*(This is the passing output from our development)*
```
 PASS  __tests__/auth.test.js
  Auth Endpoints
    ✓ should register a new user successfully (201 ms)
    ✓ should log in an existing user successfully (116 ms)
    ✓ should fail to log in with incorrect password (116 ms)
    ✓ should access a protected route with a valid token (216 ms)
    ✓ should fail to access protected route without a token (3 ms)

 PASS  __tests__/sweets.test.js
  Sweets API
    ✓ should create a new sweet as a logged-in user (113 ms)
    ✓ should fail to create a sweet if not logged in (107 ms)
    ✓ should get all available sweets (109 ms)
    ✓ should FAIL to delete a sweet as a regular user (109 ms)
    ✓ should delete a sweet as an admin user (215 ms)
    ✓ should allow a user to purchase a sweet, decreasing quantity (214 ms)
    ✓ should fail to purchase a sweet that is out of stock (166 ms)
    ✓ should allow an admin to restock a sweet, increasing quantity (219 ms)
    ✓ should FAIL to restock as a regular user (109 ms)
    ✓ should allow an admin to update a sweet (215 ms)
    ✓ should FAIL to update a sweet as a regular user (107 ms)
  Search Sweets
    ✓ should search by name (case-insensitive) (107 ms)
    ✓ should search by category (105 ms)
    ✓ should search by price range (107 ms)
    ✓ should combine search queries (category and minPrice) (109 ms)

Test Suites: 2 passed, 2 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        ...s
```
---

## 🤖 My AI Usage (Mandatory)

This project explicitly encouraged the use of AI tools to be transparently documented. This section details how I used AI (Gemini) throughout the development process.

### 1. Which AI tools I used:
* **Gemini (Google):** I used Gemini as my primary AI pair-programmer for this entire project.

### 2. How I used them:
* **Phase 1 (Setup):** I asked Gemini to provide a step-by-step plan for setting up a MERN stack project with TDD, including which NPM packages to install for both frontend and backend.
* **Phase 2 (Backend Auth):** I used Gemini to generate the full "Red-Green-Refactor" TDD workflow. I asked for the Jest/Supertest test code *first* (the "Red" test), and then asked for the controller and route code to make it pass ("Green").
* **Phase 3 (Backend Sweets):** I repeated the TDD process with Gemini for all the sweets and inventory endpoints. This included asking for the Mongoose query logic for the complex `GET /api/sweets/search` endpoint.
* **Phase 4 (Frontend Auth):** I asked Gemini to generate the code for a global `AuthContext` in React to manage user state, tokens, and `localStorage`. I also had it generate the `ProtectedRoute` and `AdminRoute` components.
* **Phase 5 (Frontend UI):** I asked Gemini to build the `SweetsContext` for managing product data and the `SweetCard` component. I also tasked it with writing all the CSS for a modern, dark-themed UI, which it provided in multiple stages (base CSS, then beautification).
* **Phase 6 (Admin Panel):** I asked Gemini to generate the code for the `AdminPage` and the reusable `SweetFormModal` component for both creating and editing sweets.
* **Debugging:** I actively used Gemini for debugging. I pasted in error messages and screenshots, and it helped me resolve:
    * `TypeError: argument handler must be a function` (missing `routes/auth.js` file).
    * `Error connecting to MongoDB: The \`uri\` parameter... got "undefined"` (missing `MONGO_URI=` in the `.env` file).
    * `TypeError: Sweet.createMany is not a function` (correcting to `insertMany`).
    * Test timeouts and data leaks (moving a `beforeEach` hook to the correct `describe` block).
    * CSS issues (like the "white button" problem, which was due to a missing `index.css` update).
* **Deployment:** I asked Gemini for the best way to deploy a MERN app and it recommended Render. It then provided step-by-step instructions, including the necessary code changes (like `CORS_ORIGIN` and `VITE_API_URL` environment variables) to make the deployment successful.

### 3. My Reflection on AI Usage:
* Working with Gemini felt like having a senior developer as a pair-programmer. Its ability to generate the TDD workflow (tests first) was a huge productivity booster and enforced good habits. Instead of spending time on boilerplate, I could focus on the *logic* and *architecture*. The debugging process was incredibly fast; it identified issues from stack traces in seconds. This entire project, which might have taken a solo developer several days, was completed in a fraction of the time. It was an invaluable tool for learning, building, and debugging simultaneously.
