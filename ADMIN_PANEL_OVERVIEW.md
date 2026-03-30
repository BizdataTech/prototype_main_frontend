# Admin Panel Overview

## What is the Admin Panel?

The Admin Panel is a comprehensive management dashboard for controlling e-commerce platform operations. It provides administrators with tools to manage products, categories, brands, users, and homepage layout.

## Folder Structure Explained

### Main Admin Directory: `app/(admin)/`

```
app/(admin)/
├── AdminLayout.jsx          # Main wrapper component for all admin pages
├── AdminContext.jsx         # Authentication & admin user state (Context API)
├── admin.css                # Admin-wide styles
├── admin/                   # Admin page routes
│   ├── useRoute.js          # Hook to get current page info (title, breadcrumbs)
│   ├── products/            # Product management
│   ├── categories/          # Category management
│   ├── brands/              # Brand management
│   ├── users/               # User management
│   ├── attribute-collections/  # Product attributes
│   └── home-layout/         # Homepage customization
└── hooks/
    └── useMouseClick.js    # Global click handler hook
```

### Admin Auth Directory: `app/(admin-auth)/`

```
app/(admin-auth)/
├── admin/
│   ├── authenticate.css
│   ├── sign-in/page.jsx    # Admin login page
│   └── sign-up/page.jsx    # Admin registration page
└── components/
    └── Label.jsx           # Reusable form label
```

### Admin Components: `components/admin/`

```
components/admin/
├── Sidebar.jsx             # Navigation menu
├── AdminSectionTitle.jsx   # Page header with icon
├── AdminBreadCrumbs.jsx    # Navigation breadcrumbs
├── SearchSections.jsx      # Search functionality
├── LoadingButton.jsx       # Button with loading state
├── LoadingRow.jsx          # Table row loading skeleton
├── TableEmptyRow.jsx       # Empty state in tables
├── ModalDeleteButton.jsx   # Delete confirmation modal
├── InputLabel.jsx          # Form input wrapper
├── ShimmerContainer.jsx    # Shimmer loading effect
├── AdminElseBlock.jsx      # Error/empty state block
├── AdminBreadCrumbs.jsx    # Page hierarchy navigation
└── SearchSections.jsx      # Global search component
```

## Main Operations

### 1. **Products Management**

- **Path**: `/admin/products`
- **Location**: `app/(admin)/admin/products/`
- **Operations**:
  - View all products
  - Add new products
  - Edit product details
  - Delete products
  - Manage product images
  - Set pricing and inventory

### 2. **Categories Management**

- **Path**: `/admin/categories`
- **Location**: `app/(admin)/admin/categories/`
- **Operations**:
  - View all categories
  - Create categories
  - Edit category details
  - Delete categories
  - Manage category subcategories

### 3. **Brands Management**

- **Path**: `/admin/brands`
- **Location**: `app/(admin)/admin/brands/`
- **Operations**:
  - View all brands
  - Add new brands
  - Edit brand information
  - Delete brands
  - Upload brand logos

### 4. **Users Management**

- **Path**: `/admin/users`
- **Location**: `app/(admin)/admin/users/`
- **Operations**:
  - View customer list
  - View user details
  - Manage user permissions
  - Delete user accounts

### 5. **Attribute Collections**

- **Path**: `/admin/attribute-collections`
- **Location**: `app/(admin)/admin/attribute-collections/`
- **Operations**:
  - Create attribute groups
  - Manage attribute values
  - Link attributes to products
  - Edit collection settings

### 6. **Home Layout Management**

- **Path**: `/admin/home-layout`
- **Location**: `app/(admin)/admin/home-layout/`
- **Operations**:
  - Working on this section

## Core Components

### AdminLayout.jsx

**Purpose**: Main wrapper for all admin pages

- Handles authentication checks
- Renders sidebar and main content area
- Manages page title and breadcrumbs
- Integrates toast notifications

**Key Props**: `children` (page content)

### AdminContext.jsx

**Purpose**: Manages admin user authentication

- Validates login tokens
- Stores admin user data
- Handles logout
- Provides authentication state to all components


### Sidebar.jsx

**Purpose**: Navigation menu

- Displays all admin routes
- Shows active page highlight
- Links to all modules
- Responsive design

### useRoute.js

**Purpose**: Gets current page information

- Returns: `page_title`, `icon_class`, `breadcrumbs`, `routes_length`
- Used for dynamic page headers

## Data Flow

```
User Login
    ↓
AdminContext validates token
    ↓
If valid → AdminLayout renders admin UI
If invalid → Redirect to /admin/sign-in
    ↓
Navigate to module (products, categories, etc.)
    ↓
Page renders with custom hook (useProducts, useCategories, etc.)
    ↓
Hook fetches data from backend API
    ↓
Component displays data with admin UI components
```

## Authentication Requirements

- Admin credentials from backend
- JWT token stored in cookies
- Token validation on every app load
- Automatic redirect if unauthorized

## Routes Configuration

Routes are defined in: `data/adminRouteData.js`

Each route has:

- `path`: URL path
- `sidebar_title`: Menu display name
- `page_title`: Page header
- `icon_class`: FontAwesome icon
- `sidebar`: Show in navigation (true/false)
- `slug`: Route identifier
- `breadcrumbs`: Navigation path text

## Custom Hooks Pattern

Each module uses custom hooks for data management:

- `useProducts.js` - Product operations
- `useCategories.js` - Category operations
- `useBrand.js` - Brand operations
- `useUsers.js` - User operations

**Hook Pattern**:

```javascript
const useProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    // API call to backend
  };

  return { data, loading, fetch };
};
```

## Styling

- **CSS Framework**: Tailwind CSS
- **Main Style File**: `app/(admin)/admin.css`
- **Icon Library**: FontAwesome, phosphor-react

## Key Features

✓ Role-based access control  
✓ Real-time data updates  
✓ Toast notifications  
✓ Loading states & skeletons  
✓ Search functionality  
✓ Breadcrumb navigation  
✓ Responsive design  
✓ Modal dialogs for confirmations
