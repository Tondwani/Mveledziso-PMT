# Important

Issues of this repository are tracked on https://github.com/aspnetboilerplate/aspnetboilerplate. Please create your issues on https://github.com/aspnetboilerplate/aspnetboilerplate/issues.

# Mveledziso PMT

A modern project management tool built with Next.js and ASP.NET Core.

## Project Overview

Mveledziso PMT is a full-stack project management tool designed to streamline project tracking, team collaboration, and task management. The application features a modern, responsive UI built with Next.js and a robust backend powered by ASP.NET Core.

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Ant Design
- React
- Tailwind CSS

### Backend
- ASP.NET Core
- Entity Framework Core
- SQL Server

## Project Structure

```
Mveledziso PMT/
├── aspnet-core/       # Backend ASP.NET Core application
│   ├── src/          # Source code
│   ├── test/         # Test projects
│   └── build/        # Build configuration
├── FrontEnd/         # Frontend Next.js application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Dependencies
└── README.md         # Project documentation
```

## Key Features

- Project Management
  - Create and manage projects
  - Assign team members
  - Track project progress
  - Set deadlines and priorities

- Team Collaboration
  - Team management
  - Role-based access control
  - Task assignment
  - Progress tracking

- Task Management
  - Task creation and tracking
  - Priority levels
  - Status updates
  - Deadline management

## Security

- Role-based authentication
- Protected routes
  - Admin menu for project management
  - User menu for task management
- Secure API communication

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- .NET 8 SDK
- SQL Server
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd aspnet-core
   dotnet restore
   ```
3. Install frontend dependencies:
   ```bash
   cd FrontEnd
   npm install
   ```
4. Set up environment variables
5. Run the development servers

## License

This project is proprietary and confidential. All rights reserved.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support, please contact the development team.

# Introduction

This is a template to create **ASP.NET Core MVC / Angular** based startup projects for [ASP.NET Boilerplate](https://aspnetboilerplate.com/Pages/Documents). It has 2 different versions:

1. [ASP.NET Core MVC & jQuery](https://aspnetboilerplate.com/Pages/Documents/Zero/Startup-Template-Core) (server rendered multi-page application).
2. [ASP.NET Core & Angular](https://aspnetboilerplate.com/Pages/Documents/Zero/Startup-Template-Angular) (single page application).
 
User Interface is based on [AdminLTE theme](https://github.com/ColorlibHQ/AdminLTE).

# Download

Create & download your project from https://aspnetboilerplate.com/Templates

# Screenshots

#### Sample Dashboard Page
![](_screenshots/module-zero-core-template-ui-home.png)

#### User Creation Modal
![](_screenshots/module-zero-core-template-ui-user-create-modal.png)

#### Login Page

![](_screenshots/module-zero-core-template-ui-login.png)

# Documentation

* [ASP.NET Core MVC & jQuery version.](https://aspnetboilerplate.com/Pages/Documents/Zero/Startup-Template-Core)
* [ASP.NET Core & Angular  version.](https://aspnetboilerplate.com/Pages/Documents/Zero/Startup-Template-Angular)

# License

[MIT](LICENSE).
