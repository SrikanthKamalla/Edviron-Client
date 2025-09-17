# EduPay Server 
## School Fee Payment Management System

EduPay is a web application designed to simplify school fee management and transactions between institutions, trustees, students, and parents. It provides an easy-to-use interface for tracking transactions, viewing payment history, and managing users securely.

## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express, mongoDB, webhooks



## Installation

### Project Setup

#### Prerequisites
- Node.js
- npm 
- MongoDB

### Install my-project
#### Frontend
  - git clone https://github.com/SrikanthKamalla/Edviron-Client
  - cd "folder name"
  - npm i
  - npm run dev

#### Backend
 - git clone https://github.com/SrikanthKamalla/Edviron-Server
  - cd "folder name"
  - npm i
  - npm run dev


## Environment Variables
#### Frontend
```
  VITE_API_URL ->your backend url 
```
#### Backend
```
  PORT
  MONGODB_URI
  JWT_SECRET_KEY
  FRONTEND_URL
  CALLBACK_URL
  SCHOOL_ID
  PG_SECRET
  API_KEY
  PG_URL
```

## Pages & Functionality
### Login & Signup

- Secure authentication for trustees, school admins.
- JWT-based session management.

### Dashboard

Displays key statistics:

- Total transactions.

- Successful, pending, failed transactions.

- Total collected amount.

- Success rate %.

### Schools

- Admins can view schools they manage.
- See transactions grouped by school.


### Check Status
- Verify status of a payment request.
- Shows success, pending, or failed.
- View order amount, transaction amount, payment mode, bank reference.

### Create Payment

- Admins initiate fee requests for students.
- Select student info, enter details, send request.
- System generates a payment link.
- Link helps schools collect fees digitally.


## Screeshorts

### Signup Page
<img width="1900" height="1023" alt="Screenshot 2025-09-17 114531" src="https://github.com/user-attachments/assets/d1e967d0-b5b0-4eda-8cc4-01f91b7dbef7" />

### Login Page
<img width="1919" height="1025" alt="Screenshot 2025-09-17 114612" src="https://github.com/user-attachments/assets/269fb36d-99bd-4bbc-9438-368f0ba74543" />


### Dashboard Page
<img width="1917" height="1021" alt="image" src="https://github.com/user-attachments/assets/28d57c15-dc2e-4354-a756-4d48919cadec" />
<img width="1919" height="1023" alt="image" src="https://github.com/user-attachments/assets/812e6f52-57ca-486f-b679-632ada903407" />


### Schools Page
<img width="1919" height="1023" alt="image" src="https://github.com/user-attachments/assets/45fd9e11-7d0d-46cf-ab38-7a15bdc4b780" />
<img width="1919" height="1024" alt="image" src="https://github.com/user-attachments/assets/4b747bfb-a4fa-45b8-b4ab-2af6f41c10f5" />

### Check Status  Page
<img width="1919" height="1019" alt="image" src="https://github.com/user-attachments/assets/fd177df2-26a5-4346-b078-290fa2b63b9c" />
<img width="1919" height="1025" alt="image" src="https://github.com/user-attachments/assets/0764bfda-5853-45b6-a833-26c9c335d321" />


### Create payment Page
<img width="1919" height="1025" alt="image" src="https://github.com/user-attachments/assets/25f8284c-60c7-4d27-83c7-a8bc2c6d2f5f" />
<img width="1909" height="1026" alt="image" src="https://github.com/user-attachments/assets/8003027d-b479-447f-a67f-13d99cae2250" />
<img width="1919" height="1024" alt="image" src="https://github.com/user-attachments/assets/56cb6cf5-600d-4ec0-bd1b-de9197787f67" />

### Logot
<img width="1918" height="1022" alt="Screenshot 2025-09-17 121751" src="https://github.com/user-attachments/assets/cf9f0ee4-a9c5-49f6-96e5-a313395f4e21" />





## Scope for Extension

### Here are possible enhancements to grow EduPay further:

#### Multi-Currency & International Payments
- Support INR, USD, and other currencies with conversion.

#### Mobile App

- Parent-friendly mobile version for fee payment.

#### Notifications & Reminders

- Email/SMS/Push notifications for pending or successful payments.

#### Analytics Dashboard

- Graphs and insights into fee collection trends.

#### Role-based Permissions

- Different dashboards for trustees, school admins, and parents.

#### AI-powered Fraud Detection

- Monitor suspicious transaction patterns.



