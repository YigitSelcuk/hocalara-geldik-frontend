# Environment Variables Configuration

This document explains the environment variables used in the frontend application.

## Environment Files

- `.env` - Default environment variables (currently set to production server)
- `.env.example` - Example template for local development
- `.env.production` - Production environment variables

## Variables

### VITE_API_URL
- **Description**: The API endpoint URL used by the frontend
- **Default**: `/api`
- **Usage**: Used throughout the app for API calls. The `/api` path is proxied by Vite dev server to the backend.

### VITE_BACKEND_URL
- **Description**: The backend server URL used by Vite proxy in development
- **Production**: `http://212.68.46.84:4000`
- **Development**: `http://localhost:4000`
- **Usage**: Used in `vite.config.ts` to configure the proxy target

## Setup Instructions

### For Local Development
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. The default values in `.env.example` are configured for local development with backend running on `localhost:4000`

### For Production
1. The `.env.production` file is already configured with the production server IP
2. When building for production, Vite will automatically use `.env.production`

## Files Updated

The following files have been updated to use environment variables instead of hardcoded URLs:

1. **vite.config.ts** - Proxy configuration now uses `VITE_BACKEND_URL`
2. **pages/ContactPage.tsx** - Contact form submission uses `VITE_API_URL`
3. **components/admin/PackageManager.tsx** - Package API calls use `VITE_API_URL`
4. **components/admin/BranchPackageManager.tsx** - Branch package API calls use `VITE_API_URL`
5. **components/admin/BranchNewsManager.tsx** - Branch news API calls use `VITE_API_URL`
6. **components/admin/ApprovalsManager.tsx** - Approvals API calls use `VITE_API_URL`
7. **components/AdminLayout.tsx** - Admin layout API calls use `VITE_API_URL`

## Important Notes

- **Never commit** sensitive credentials to `.env` files
- The `.env` file should be added to `.gitignore` (already done)
- Always use `.env.example` as a template for other developers
- Environment variables in Vite must be prefixed with `VITE_` to be exposed to the client
