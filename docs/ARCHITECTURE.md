# MediLink Architecture

## Overview

MediLink is built as a cross-platform application using React Native with Expo, allowing it to run on web, iOS, and Android platforms. The application follows a client-server architecture with Supabase providing backend services.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Applications                     │
│                                                             │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐  │
│  │   Web App     │    │   iOS App     │    │  Android App  │  │
│  │  (React PWA)  │    │ (React Native)│    │ (React Native)│  │
│  └───────┬───────┘    └───────┬───────┘    └───────┬───────┘  │
│          │                    │                    │          │
│          └──────────┬─────────┴──────────┬────────┘          │
│                     │                    │                    │
└─────────────────────┼────────────────────┼────────────────────┘
                      │                    │
┌─────────────────────┼────────────────────┼────────────────────┐
│                     ▼                    ▼                    │
│                  Expo Router & Navigation                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    React Components                      │ │
│  │                                                          │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │ │
│  │  │ Dashboard  │  │    Bed     │  │  Patient   │   ...   │ │
│  │  │ Components │  │ Management │  │   Queue    │         │ │
│  │  └────────────┘  └────────────┘  └────────────┘         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    Context Providers                     │ │
│  │                                                          │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │ │
│  │  │    Auth    │  │  Settings  │  │    ...     │         │ │
│  │  │   Context  │  │  Context   │  │            │         │ │
│  │  └────────────┘  └────────────┘  └────────────┘         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    Utility Libraries                     │ │
│  └──────────────────────────────────────────────────────────┘ │
│                              │                               │
└──────────────────────────────┼───────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────┐
│                              ▼                               │
│                         Supabase SDK                         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Auth     │  │  Database   │  │    Edge Functions   │  │
│  │   Service   │  │   Service   │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────┐
│                              ▼                               │
│                        Supabase Backend                      │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Auth     │  │  PostgreSQL │  │    Edge Functions   │  │
│  │   Service   │  │   Database  │  │     & Webhooks      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

The application follows a component-based architecture with the following main sections:

### Core Components

1. **Layout Components**
   - `DashboardLayout`: Main layout wrapper for authenticated pages
   - `Header`: Top navigation bar with notifications and user info
   - `Sidebar`: Navigation sidebar with role-based menu items

2. **Feature Components**
   - `BedManagement`: Bed tracking and status management
   - `PatientQueue`: Patient waiting list and management
   - `ResourceAllocation`: Staff and equipment allocation
   - `EmergencyAlerts`: Critical situation management

3. **UI Components**
   - `BedStatusCard`: Individual bed status display
   - `PatientCard`: Patient information card
   - `ActiveAlertCard`: Emergency alert display
   - Various form components and modals

### State Management

The application uses React Context API for state management:

1. **AuthContext**: Manages user authentication state
   - User login/logout
   - User profile information
   - Role-based permissions

2. **SettingsContext**: Manages application settings
   - Dark mode preferences
   - Notification settings
   - Hospital name configuration

## Database Schema

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│   profiles    │       │     beds      │       │   patients    │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ id            │       │ id            │       │ id            │
│ email         │       │ status        │       │ name          │
│ name          │       │ department    │       │ wait_time     │
│ role          │       │ patient_id    │◄──────┤ priority      │
│ department    │       │ admission_time│       │ department    │
└───────┬───────┘       └───────────────┘       │ status        │
        │                                       └───────────────┘
        │                                                ▲
        │                                                │
        │               ┌───────────────┐                │
        │               │    alerts     │                │
        │               ├───────────────┤                │
        │               │ id            │                │
        └──────────────►│ created_by    │                │
                        │ title         │                │
                        │ description   │                │
                        │ priority      │                │
                        │ status        │                │
                        └───────────────┘                │
                                                        │
        ┌───────────────┐               ┌───────────────┐
        │ user_settings │               │   resources   │
        ├───────────────┤               ├───────────────┤
        │ id            │               │ id            │
        │ user_id       │◄──────────────┤ name          │
        │ hospital_name │               │ type          │
        │ dark_mode     │               │ department    │
        │ notifications │               │ quantity      │
        └───────────────┘               └───────────────┘
```

## Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Login   │     │ Supabase │     │  Fetch   │     │ Dashboard │
│  Screen  │────►│   Auth   │────►│ Profile  │────►│   View   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                       │                                 │
                       │                                 │
                       ▼                                 ▼
                 ┌──────────┐                     ┌──────────┐
                 │  Store   │                     │ Role-based│
                 │ Session  │                     │   UI     │
                 └──────────┘                     └──────────┘
```

## Security Considerations

1. **Authentication**: JWT-based authentication through Supabase Auth
2. **Authorization**: Row-level security policies in the database
3. **Data Validation**: Input validation on both client and server
4. **Secure Storage**: Secure storage for sensitive information on mobile devices

## Performance Optimizations

1. **Code Splitting**: Lazy loading of components
2. **Memoization**: React.memo and useMemo for expensive calculations
3. **Virtualized Lists**: FlatList for efficient rendering of long lists
4. **Image Optimization**: Optimized images for faster loading

---

© 2025 MediLink. All rights reserved.
