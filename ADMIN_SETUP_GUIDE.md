# Admin Panel Setup Guide

## Quick Start

### Prerequisites

- Node.js installed
- Next.js project initialized
- Backend API URL configured

### Installation Steps

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```
   NEXT_PUBLIC_BACKEND_URL=http://your-backend-url
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Access Admin Panel**
   - Navigate to: `http://localhost:3000/admin/sign-in`
   - Sign in with admin credentials (provided by backend)

## Project Structure

```
frontend/
├── app/
│   ├── (admin-auth)/          # Authentication pages
│   ├── (admin)/               # Main admin panel
│   │   ├── admin/             # Admin pages (products, categories, etc.)
│   │   ├── hooks/             # Custom hooks for admin
│   │   └── AdminLayout.jsx    # Main admin layout wrapper
│   └── (client)/              # Client-side pages
├── components/
│   ├── admin/                 # Shared admin components
│   └── client/                # Client-side components
├── context/                   # Context providers
├── data/                      # Static data (routes, config)
```

## Key Setup Files

| File                           | Purpose                             |
| ------------------------------ | ----------------------------------- |
| `app/(admin)/AdminLayout.jsx`  | Main layout wrapper for admin pages |
| `app/(admin)/AdminContext.jsx` | Authentication context              |
| `data/adminRouteData.js`       | Route configuration and navigation  |
| `components/admin/Sidebar.jsx` | Admin navigation sidebar            |

## Authentication Flow

1. User visits `/admin/sign-in`
2. Credentials validated against backend
3. JWT token stored in cookies
4. `AdminContext` verifies token on app load
5. Redirects to login if token invalid/expired

## Main Admin Modules

- **Products**: Manage product listings and details
- **Categories**: Organize products by category
- **Brands**: Brand management
- **Users**: Admin user management
- **Attribute Collections**: Product attributes configuration
- **Home Layout**: Customize homepage sections

## Common Development Tasks

### Add New Admin Page

1. Create folder in `app/(admin)/admin/[page-name]/`
2. Add `page.jsx` component
3. Create custom hook in same folder (`use[PageName].js`)
4. Add route to `data/adminRouteData.js`
