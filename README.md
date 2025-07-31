# EMR Frontend System

A comprehensive React-based Electronic Medical Records (EMR) system for multi-facility patient registration and healthcare service management.

## 🏥 Features

### Core Functionality
- **Multi-Facility Architecture**: Centralized patient management across multiple healthcare facilities
- **Patient Registration**: Complete CRUD operations with demographics, insurance, and medical services
- **Advanced Search**: Search patients by name, MRN, email, phone number with filtering capabilities
- **Service Management**: Support for multiple healthcare services (Lab, Radiology, Consultation)
- **Authentication**: Secure login system with role-based access control

### Key Components
- **Dashboard**: Real-time statistics and recent patient overview
- **Patient Management**: Registration forms, patient lists, and detailed views
- **Facility Management**: Healthcare facility administration
- **Search & Filter**: Advanced patient search with multiple criteria
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend EMR API server running on `http://localhost:8080`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AhmedARmohamed/emr_frontend_system.git
   cd emr_frontend_system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open http://localhost:5173 in your browser
   - Use demo credentials: `admin/password`

## 🛠 Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Auth/            # Authentication components
│   ├── Layout/          # Layout components (Header, Sidebar)
│   └── Patients/        # Patient-specific components
├── contexts/            # React Context providers
├── pages/              # Main application pages
├── services/           # API services and HTTP client
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🔧 Configuration

### API Configuration
Update the API base URL in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Environment Variables
Create a `.env` file for environment-specific configuration:
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=EMR System
```

## 🏥 Usage Guide

### Patient Registration
1. Navigate to "New Patient" from the sidebar or dashboard
2. Fill in required patient demographics:
   - Medical Record Number (MRN)
   - Personal information (name, DOB, gender)
   - Contact details (phone, email, address)
   - Insurance information (optional)
3. Select applicable healthcare services
4. Choose the facility for registration
5. Submit the form to create the patient record

### Searching Patients
1. Use the "Search Patients" page
2. Enter search terms (name, MRN, email, or phone)
3. Apply filters for gender, date range, or facility
4. View, edit, or delete patients from search results

### Managing Facilities
1. View all registered healthcare facilities
2. Add new facilities with contact information
3. Edit existing facility details
4. Monitor facility-specific patient registrations

## 🔒 Security Features

- **Authentication**: Secure login with JWT tokens
- **Role-based Access**: Different permissions for Admin, Facility Manager, and Staff
- **API Security**: Automatic token inclusion in requests
- **Session Management**: Automatic logout on token expiration
- **Input Validation**: Comprehensive form validation and sanitization

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured dashboard with sidebar navigation
- **Tablet**: Responsive grid layouts and touch-friendly interactions
- **Mobile**: Optimized forms and navigation for smaller screens

## 🔗 API Integration

The frontend integrates with the Spring Boot backend through REST APIs:

- **Authentication**: `/api/auth/*`
- **Patients**: `/api/patients/*`
- **Facilities**: `/api/facilities/*`
- **Services**: `/api/services/*`

All API calls include proper error handling and loading states.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in the `dist/` directory can be deployed to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static file hosting service

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration for React and TypeScript
- Consistent component structure and naming
- Comprehensive TypeScript typing
- Modular architecture with clear separation of concerns

## 📄 License

This project is part of a technical assignment and is for demonstration purposes.

## 🤝 Contributing

This is a technical assignment project. For production use, consider:
- Adding comprehensive unit and integration tests
- Implementing end-to-end testing with Cypress or Playwright
- Adding proper error boundaries and fallback UI
- Implementing advanced search and reporting features
- Adding print functionality for patient records
- Integrating with additional healthcare systems

## 📞 Support

For technical questions or issues:
- Check the console for error messages
- Ensure the backend API is running and accessible
- Verify all required dependencies are installed
- Review the API documentation for endpoint specifications