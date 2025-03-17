# Contributing to MediLink

Thank you for your interest in contributing to MediLink! This document outlines the process for contributing to the project and the guidelines that contributors should follow.

## Repository Access

The MediLink repository is maintained as a private repository with restricted access. The following contributors have been granted read-only access:

- @spring-er
- @R-on20
- @droolbug27
- @xaviercode-21
- @Shemzy616

## Contribution Process

Due to the proprietary nature of this application, direct contributions to the codebase are restricted. However, we welcome feedback, bug reports, and feature suggestions through the following process:

1. **Issue Reporting**: Create a detailed issue report describing the bug or feature request
2. **Discussion**: Participate in discussions about the reported issue
3. **Review**: Review proposed changes when shared by the repository owner

## Development Guidelines

For authorized developers working on the codebase:

### Code Style

- Follow the existing code style and patterns in the project
- Use meaningful variable and function names
- Include comments for complex logic
- Use TypeScript types for all components and functions

### Component Structure

- Keep components small and focused on a single responsibility
- Use the existing folder structure:
  - `components/`: Reusable UI components
  - `contexts/`: React context providers
  - `lib/`: Utility functions and API clients
  - `app/`: Expo Router pages

### Testing

- Test all new features thoroughly before submitting for review
- Ensure the application works on both web and mobile platforms
- Verify that all role-based permissions work correctly

## Security Considerations

- Never commit sensitive information (API keys, passwords, etc.)
- Use environment variables for all configuration
- Follow Supabase security best practices for database access
- Implement proper input validation for all user inputs

## Contact

For questions about contributing to MediLink, please contact the repository owner.

---

© 2025 MediLink. All rights reserved.
