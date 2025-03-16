# MediLink - Hospital Resource Management System

![MediLink Logo](https://api.dicebear.com/7.x/avataaars/svg?seed=hospital)

## Overview

MediLink is a comprehensive hospital resource management system designed to streamline operations across hospital departments. The application provides real-time tracking of bed availability, patient queues, resource allocation, and emergency alerts through an intuitive mobile and web interface.

## Features

- **Real-time Bed Management**: Track bed status (available, occupied, maintenance) across all hospital departments
- **Patient Queue System**: Manage patient wait times with priority-based queuing
- **Resource Allocation**: Monitor staff distribution, equipment availability, and supply levels
- **Emergency Alerts**: Coordinate rapid response to critical situations
- **Role-based Access Control**: Customized interfaces for administrators, medical staff, and reception personnel
- **Dark Mode Support**: Comfortable viewing in all environments
- **Responsive Design**: Works on mobile devices and desktop browsers

## Technology Stack

- **Frontend**: React Native with Expo
- **Styling**: TailwindCSS (via NativeWind)
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Context API
- **Navigation**: Expo Router
- **Icons**: Lucide React Native

## Screenshots

### Dashboard
![Dashboard](https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80)

### Bed Management
![Bed Management](https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80)

### Patient Queue
![Patient Queue](https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/medilink.git
   cd medilink
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

## Database Setup

The application uses Supabase as its backend. The database schema includes tables for:

- `profiles`: User profiles with role information
- `beds`: Hospital bed information
- `patients`: Patient records
- `alerts`: Emergency alerts
- `resources`: Hospital resources
- `user_settings`: User preferences

Migration files are included in the `supabase/migrations` directory.

## Demo Accounts

The system comes with pre-configured demo accounts:

- **Administrator**: admin@hospital.org / password123
- **Medical Staff**: doctor@hospital.org / password123
- **Reception**: reception@hospital.org / password123

## Deployment

The application can be deployed as a web app or as native mobile apps using Expo's build services.

## Contributors

This project is maintained by the following contributors who have been granted read-only access to the repository:

- spring-er
- R-on20
- droolbug27
- xaviercode-21
- Shemzy616

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Repository

The official repository for this project is available at: https://github.com/Samuelmwendwa/medilink

---

© 2025 MediLink. All rights reserved.
