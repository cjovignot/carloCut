# Sheet Metal PWA

A Progressive Web App for standardizing sheet metal part ordering in joinery.

## Features

- **Project Management**: Create and manage projects with multiple joineries
- **Sheet Specification**: Define sheets with standard profiles or custom drawings
- **PDF Generation**: Export technical drawings and specifications
- **Email Integration**: Send orders directly to suppliers
- **Progressive Web App**: Installable, offline-capable application
- **Authentication**: Role-based access (Admin/Employee)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + Mongoose
- **Database**: MongoDB Atlas
- **Authentication**: JWT with bcrypt
- **PDF Generation**: PDFKit with technical diagrams
- **Email**: Nodemailer with SMTP
- **PWA**: Vite PWA plugin with Workbox

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- SMTP email service (Gmail/Outlook)

### Installation

1. Clone and install dependencies:

```bash
npm install
```

2. Create `.env` file:

```bash
cp .env.example .env
```

3. Configure environment variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sheetmetal
JWT_SECRET=your-secure-secret
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

4. Start development servers:

```bash
npm run dev
```

### Production Deployment

1. Build the application:

```bash
npm run build
```

2. Deploy backend to your preferred platform (Heroku, Railway, etc.)
3. Deploy frontend to CDN (Netlify, Vercel, etc.)

## Usage

### Default Login

- Email: `admin@example.com`
- Password: `admin123`

### Creating Projects

1. Navigate to Projects page
2. Click "New Project"
3. Fill in project details
4. Add joineries and sheets
5. Export PDF or send via email

### Sheet Profiles

- **Sill**: Window sill profiles
- **Jamb**: Door/window frame sides
- **Lintel**: Header profiles
- **Custom**: User-defined shapes

### PDF Export

- Includes technical drawings
- Dimensions and specifications
- Material and finish details
- Professional formatting

## Architecture

### Data Models

```
Project → Joineries → Sheets
  ↓         ↓         ↓
Client    Type     Profile
Address   Name     Dimensions
Notes     -        Material
```

### API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/pdf/project/:id` - Generate PDF
- `POST /api/email/send-project/:id` - Send email

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

MIT License - see LICENSE file for details
