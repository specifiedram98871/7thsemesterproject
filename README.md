# 7th Semester Project CSIT

Full-stack ecommerce application with:
- Frontend: React (Create React App)
- Backend: Node.js + Express + MongoDB

## Project Structure

```text
7thsemesterproject/
	backend/      # Express API
	frontend/     # React app
	Automation/   # Cypress tests
```

## Prerequisites

Install these before running the project:
- Node.js 18+ (recommended)
- npm 8+
- MongoDB (local or cloud MongoDB URI)

Optional (for full features):
- Cloudinary account (image upload)
- SendGrid account (email)
- Khalti payment credentials

## 1. Backend Setup

### 1.1 Install dependencies

```bash
cd backend
npm install
```

### 1.2 Create environment file

Create this file:

`backend/config/config.env`

Use the following template:

```env
PORT=4000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_MAIL=your_verified_sendgrid_email
SENDGRID_RESET_TEMPLATEID=your_sendgrid_reset_template_id
SENDGRID_ORDER_TEMPLATEID=your_sendgrid_order_template_id

WEBSITE_URL=http://localhost:3000

KHALTI_KEY=your_khalti_secret_key
KHALTI_GATEWAY_URL=https://a.khalti.com
```

### 1.3 Run backend server

Development (with auto-reload):

```bash
npm run server
```

Production mode:

```bash
npm start
```

Backend will run on:
- `http://localhost:4000` (default)

Health check:
- Open `http://localhost:4000/`

## 2. Frontend Setup

### 2.1 Install dependencies

```bash
cd frontend
npm install
```

### 2.2 Create environment file

Create this file:

`frontend/.env`

Add:

```env
REACT_APP_BACK_URL=http://localhost:4000
```

### 2.3 Run frontend app

```bash
npm start
```

Frontend will run on:
- `http://localhost:3000` (default CRA port)

## 3. Run Full Stack Locally

Use two terminals:

Terminal 1:
```bash
cd backend
npm run server
```

Terminal 2:
```bash
cd frontend
npm start
```

Then open:
- `http://localhost:3000`

## 4. Important CORS Note

Backend CORS origin is currently set in `backend/app.js` to `http://localhost:5173`.

If you run frontend on CRA default `http://localhost:3000`, update the origin in `backend/app.js` accordingly, then restart backend.

## 5. Useful Scripts

### Backend (`backend/package.json`)
- `npm run server` -> run with nodemon
- `npm start` -> run with node

### Frontend (`frontend/package.json`)
- `npm start` -> start development server
- `npm run build` -> create production build
- `npm test` -> run tests
- `npm run analyze` -> bundle size analysis

## 6. Common Issues

1. API calls failing / CORS error
- Ensure backend is running on `http://localhost:4000`.
- Ensure `REACT_APP_BACK_URL` is correct.
- Ensure backend CORS origin matches frontend URL.

2. MongoDB connection error
- Verify `MONGO_URI` in `backend/config/config.env`.

3. Email not sending
- Verify SendGrid keys and template IDs.

4. Image upload not working
- Verify Cloudinary credentials.

5. Payment initiation failure
- Verify Khalti key and gateway URL.
