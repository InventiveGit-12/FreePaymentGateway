<div align="center">
  
# 🚀 FreePay 

**Redefining Payment Gateways with a Zero-Fee, Real-Time P2P UPI Engine.**

*You do not need a payment gateway if you have an UPI app.* FreePay utilises notifications from upi applications to verify transactions and serves as a bridge to your SaaS application. (Code for GooglePay)

Built without websockets, you can deploy the architecture on vercel. 

TO BE COUPLED WITH [FreePay App](https://github.com/InventiveGit-12/GpayReader)

[![Tech Stack](https://img.shields.io/badge/Stack-MERN%20%7C%20React%20Native-blueviolet?style=for-the-badge)](#)
[![Zero Fees](https://img.shields.io/badge/Gateway%20Fees-0%25-success?style=for-the-badge)](#)
[![Architecture](https://img.shields.io/badge/Architecture-Event--Driven-orange?style=for-the-badge)](#)

> *Why lose 3% of your revenue to payment gateways and wait 2 days for settlements? FreePay features a proprietary, custom-built Android Listener and Webhook pipeline that verifies standard UPI payments in real-time. Zero commissions. Instant settlements. Maximum engineering.*

[Explore the Architecture](#-how-it-works-the-architecture) • [Key Features](#-the-best-stuff-key-features) • [Tech Stack](#%EF%B8%8F-tech-stack) • [Quick Start](#-quick-start)

</div>

---

## 🔥 The Best Stuff: Key Features

FreePay isn't just another payment gateway; it’s a masterclass in distributed system design and financial tech engineering.

* 💸 **0% Payment Gateway Fees:** Bypassing Razorpay and Stripe entirely, payments flow directly from the customer's UPI app to the merchant's bank account instantly. 
* ⚡ **Headless Android Interceptor:** A locked, background React Native process silently listens for UPI app push notifications, securely extracting cryptographic transaction notes via regex, and dispatching webhook payloads.
* 🛡️ **Race-Condition-Proof Webhooks:** The backend Node.js engine utilizes highly optimized, atomic MongoDB operations to guarantee idempotency. 
* 🧹 **Self-Cleaning Database:** Built with MongoDB Partial TTL Indexing. Abandoned QR code sessions automatically self-destruct after 10 minutes, keeping the database incredibly lean without heavy, memory-draining Cron jobs.
* 🔄 **Real-Time Client Polling:** The React frontend asynchronously polls the server with automatic timeout fail-safes, providing the user with a magical, instant success animation the second the webhook clears.
* ⚡ **Deployable on Vercel**

---

## 🧠 How It Works: The Architecture

FreePay operates on a 3-node distributed architecture:

### 1. The Checkout Client (React.js)
Customers initiate a checkout. The React app generates a secure UPI deep-link (`upi://pay?...`) encoded into a dynamic QR code. It then acts as a "Watcher," silently pinging the server for success.

### 2. The Verification Engine (Node.js/Express)
The central brain. It generates a unique Cryptographic Nonce (`tn`) for every transaction, securing the payload. It exposes a public webhook endpoint that validates incoming P2P payments and securely handles atomic state transitions.

### 3. The Listener App (React Native)
A dedicated Android device running our headless service. When a customer pays via GPay/PhonePe, this app intercepts the system-level push notification, extracts the unique `tn`, and fires the webhook to the Node engine. 

---

## 🛠️ Tech Stack

**Frontend (Web)**
* React.js & TypeScript
* Tailwind CSS (Modern, responsive UI)
* `qrcode.react` (Dynamic SVG generation)

**Backend**
* Node.js & Express.js
* MongoDB & Mongoose (Strictly typed with Partial Indexes)
* JSON Web Tokens (JWT) for secure, stateless auth

**Mobile (Listener Service)**
* React Native (Expo)
* Headless JS Android Background Tasks

---

## 🚀 Quick Start

Want to run FreePay locally? 

### 1. Start the Backend
```bash
cd server
npm install
# Ensure your .env file is populated with MONGO_URI and JWT_SECRET
npm run dev
