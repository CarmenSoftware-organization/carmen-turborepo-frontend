# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build production application
- `npm run start:dev` - Start built application
- `npm run lint` - Run ESLint for code quality

## Architecture Overview

**Carmen** is a multi-tenant inventory management application built with Next.js 14 App Router, featuring comprehensive workflow management for procurement, product management, and vendor operations.

### Core Technologies
- **Next.js 14**: App Router with internationalization (en/th locales)
- **TypeScript**: Strict mode with `@/*` path aliases
- **TanStack Query**: Server state management with 1-minute stale time
- **React Hook Form + Zod**: Form validation and type safety
- **Tailwind CSS**: Utility-first styling with Shadcn/ui components
- **Axios**: HTTP client with JWT authentication and business unit context

### Project Structure
```
app/[locale]/(root)/          # Internationalized authenticated routes
├── configuration/            # System configuration modules
├── procurement/              # Procurement workflows  
├── product-management/       # Product management
└── vendor-management/        # Vendor management

components/                   # UI component library
├── ui/                      # Shadcn/ui base components
├── ui-custom/               # Business-specific components
├── form-custom/             # Custom form controls
└── lookup/                  # Data selection components

hooks/                       # Custom React hooks for data fetching
services/                    # API service layer with axios
context/                     # React Context providers
dtos/                        # TypeScript data transfer objects
```

### Multi-Tenant Architecture
- **Business Unit Context**: Users can switch between multiple business units
- **API Headers**: All requests include `bu-code` header for tenant isolation
- **Authentication**: JWT tokens with tenant-aware routing

### Component Patterns
- **Internationalization**: All components use `useTranslations('ModuleName')` 
- **Data Fetching**: Custom hooks in `/hooks/` using TanStack Query patterns
- **Form Handling**: React Hook Form with Zod validation schemas
- **Error Handling**: Toast notifications with consistent error boundaries

### Service Layer Conventions
- Each domain has dedicated service file (e.g., `grn.service.ts`)
- All services use axios with Bearer token authentication
- Business unit code (`buCode`) passed as parameter and header
- Consistent error logging and propagation

### State Management
- **Server State**: TanStack Query with domain-specific custom hooks
- **App State**: React Context for authentication and business unit selection
- **Local Storage**: Cross-tab synchronization for tenant switching

### Development Notes
- React Strict Mode disabled for compatibility
- Sentry integration for error monitoring and performance tracking  
- Next.js middleware handles locale routing and authentication
- TypeScript strict mode with comprehensive type coverage