🚀 Bitespeed Identity Resolution Service
A backend service that consolidates customer identities across multiple purchases by resolving and linking contact records using email and phone number.
Live Link:---> [https://bitespeed-six.vercel.app/](https://bitespeed-six.vercel.app/)
📌 Problem Statement
FluxKart collects customer contact details during checkout.
Customers may use different emails or phone numbers across purchases.

The goal is to:

Identify if an incoming request belongs to an existing customer

Merge contact records when overlaps exist

Maintain a single primary identity

Track all linked secondary identities


🏗 Tech Stack
###Backend
Node.js
TypeScript
Express
Prisma ORM
PostgreSQL (Neon DB)

###Frontend
React (Vite)
Tailwind CSS
Axios

###Deployment
Backend: Render
Database: Neon PostgreSQL
Frontend: Vercel

###Project Structure

backend/
 ├── prisma/
 │     └── schema.prisma
 ├── src/
 │     ├── server.ts
 │     ├── prisma.ts
 │     ├── routes/
 │     │     └── identify.ts
 │     └── services/
 │           └── contactService.ts
 └── .env

frontend/
 ├── src/
 │     ├── App.jsx
 │     ├── main.jsx
 │     └── index.css
 └── tailwind.config.js

 ### Database Schema
 Contact
-------
id                Int (Primary Key)
phoneNumber       String?
email             String?
linkedId          Int?
linkPrecedence    "primary" | "secondary"
createdAt         DateTime
updatedAt         DateTime
deletedAt         DateTime?

🔗 API Endpoint
POST /identify
Request Body (JSON)
{
  "email": "string (optional)",
  "phoneNumber": "string (optional)"
}

✅ Response
{
  "contact": {
    "primaryContatctId": number,
    "emails": string[],
    "phoneNumbers": string[],
    "secondaryContactIds": number[]
  }
}

🛠 Local Setup
1) git clone [https://github.com/Pranavkashikey/bitespeed](https://github.com/Pranavkashikey/bitespeed)
cd backend
2) npm install
3) Create env file and add
   DATABASE_URL="your_postgresql_connection_string"
4) Run Migration :-   npx prisma migrate dev --name init
5) npm run dev ---> start backend


📌 Author
Pranav Kashikey
B.Tech – MNNIT Allahabad
Full Stack Developer | Backend Enthusiast


Database: Neon PostgreSQL

Frontend: Vercel
