# Shift Management System

A comprehensive shift management system built with Next.js, TypeScript, MongoDB, and Tailwind CSS. This system allows administrators and employees to manage shifts, track attendance, and handle employee information efficiently.

## Features

- **User Authentication**: Login and registration with role-based access (Admin/Employee)
- **Employee Management**: Create, read, update, and delete employee records
- **Shift Management**: Schedule, view, and manage employee shifts
- **Attendance Tracking**: Mark attendance with check-in/check-out times
- **Dashboard**: Overview of key statistics and metrics
- **Role-Based Access Control**: Different permissions for admins and employees

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod

## Project Structure

```
shift-management/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── components/       # Reusable UI components
│   │   ├── dashboard/        # Dashboard page
│   │   ├── employees/        # Employee management pages
│   │   ├── shifts/           # Shift management pages
│   │   ├── attendance/       # Attendance pages
│   │   ├── login/            # Login page
│   │   └── utils/            # Utility functions
│   ├── lib/
│   │   ├── db.ts            # MongoDB connection
│   │   └── models/          # Mongoose models
│   └── types/               # TypeScript type definitions
├── .env.example
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shift-management
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` file with your MongoDB connection string and JWT secret:
```env
MONGODB_URI=mongodb://localhost:27017/shift-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### First Time Setup

1. Navigate to the login page
2. Click "Register" to create a new account
3. Choose your role (Admin or Employee)
4. Fill in your details and register

### Admin Features

- View and manage all employees
- Create, edit, and delete shifts
- View all attendance records
- Access dashboard with statistics

### Employee Features

- View assigned shifts
- Mark own attendance
- View own attendance history

## API Routes

### Authentication
- `POST /api/auth` - Login, Register, Logout

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee (Admin only)
- `GET /api/employees/[id]` - Get employee by ID
- `PUT /api/employees/[id]` - Update employee (Admin only)
- `DELETE /api/employees/[id]` - Delete employee (Admin only)

### Shifts
- `GET /api/shifts` - Get all shifts (with optional filters)
- `POST /api/shifts` - Create shift (Admin only)
- `GET /api/shifts/[id]` - Get shift by ID
- `PUT /api/shifts/[id]` - Update shift (Admin only)
- `DELETE /api/shifts/[id]` - Delete shift (Admin only)

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/history` - Get attendance history (with filters)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Models

### User
- email (unique)
- password (hashed)
- role (admin/employee)
- name

### Employee
- name
- email (unique)
- phone
- position
- department
- hireDate
- status (active/inactive)
- userId (optional reference to User)

### Shift
- employeeId
- startTime
- endTime
- date
- location
- notes
- status (scheduled/completed/cancelled)

### Attendance
- employeeId
- shiftId (optional)
- date
- checkIn
- checkOut (optional)
- status (present/absent/late/early-leave)
- notes

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control
- Input validation with Zod
- Protected API routes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
