# 7. Frontend Component Architecture

## 7.1 Folder Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx                    # App entry point
│   ├── App.tsx                     # Root component with routing
│   ├── index.css                   # Tailwind imports
│   ├── vite-env.d.ts
│   │
│   ├── api/                        # API layer
│   │   ├── client.ts               # Axios instance with interceptors
│   │   ├── auth.ts                 # Auth API calls
│   │   ├── properties.ts           # Property API calls
│   │   └── types.ts                # API response types
│   │
│   ├── components/                 # Reusable components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Pagination.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── MobileMenu.tsx
│   │   │
│   │   ├── property/
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyGrid.tsx
│   │   │   ├── PropertyForm.tsx
│   │   │   ├── PropertyTable.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   └── AgentContact.tsx
│   │   │
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       └── ProtectedRoute.tsx
│   │
│   ├── contexts/                   # React contexts
│   │   ├── AuthContext.tsx         # Auth state management
│   │   ├── ToastContext.tsx        # Toast notifications
│   │   └── FavoritesContext.tsx    # Favorites (localStorage)
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useFavorites.ts
│   │   ├── useProperties.ts
│   │   └── useToast.ts
│   │
│   ├── pages/                      # Page components
│   │   ├── public/
│   │   │   ├── HomePage.tsx
│   │   │   ├── PropertyDetailPage.tsx
│   │   │   └── FavoritesPage.tsx
│   │   │
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   │
│   │   ├── agent/
│   │   │   ├── DashboardPage.tsx
│   │   │   └── EditPropertyPage.tsx
│   │   │
│   │   ├── admin/
│   │   │   └── AdminDashboardPage.tsx
│   │   │
│   │   └── NotFoundPage.tsx
│   │
│   ├── types/                      # TypeScript types
│   │   ├── user.ts
│   │   ├── property.ts
│   │   └── common.ts
│   │
│   └── utils/                      # Utility functions
│       ├── formatters.ts           # Price, date formatting
│       ├── validators.ts           # Form validation
│       └── storage.ts              # localStorage helpers
│
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
└── .env
```

## 7.2 Component Hierarchy

```
<App>
├── <AuthProvider>
├── <FavoritesProvider>
├── <ToastProvider>
└── <Router>
    ├── <Layout>
    │   ├── <Header />
    │   ├── <main>
    │   │   └── {page content}
    │   └── <Footer />
    │
    └── Routes:
        │
        ├── "/" → <HomePage>
        │   ├── <Hero />
        │   ├── <FilterBar />
        │   ├── <PropertyGrid>
        │   │   └── <PropertyCard /> (multiple)
        │   └── <Pagination />
        │
        ├── "/properties/:id" → <PropertyDetailPage>
        │   ├── <ImageGallery />
        │   ├── <PropertyInfo />
        │   └── <AgentContact />
        │
        ├── "/favorites" → <FavoritesPage>
        │   └── <PropertyGrid>
        │       └── <PropertyCard /> (multiple)
        │
        ├── "/login" → <LoginPage>
        │   └── <LoginForm />
        │
        ├── "/dashboard" → <ProtectedRoute role="agent">
        │   └── <DashboardPage>
        │       ├── <PropertyForm />
        │       └── <PropertyTable />
        │
        ├── "/dashboard/properties/:id/edit" → <ProtectedRoute role="agent">
        │   └── <EditPropertyPage>
        │       ├── <PropertyForm />
        │       └── <ImageUploader />
        │
        ├── "/admin" → <ProtectedRoute role="admin">
        │   └── <AdminDashboardPage>
        │       ├── <FilterBar />
        │       ├── <PropertyTable />
        │       └── <Pagination />
        │
        └── "*" → <NotFoundPage />
```

## 7.3 State Management

Using React Context API for simplicity:

**AuthContext:**
```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
```

**FavoritesContext:**
```typescript
interface FavoritesContextType {
  favorites: number[];  // Property IDs
  addFavorite: (propertyId: number) => void;
  removeFavorite: (propertyId: number) => void;
  isFavorite: (propertyId: number) => boolean;
}
```

**ToastContext:**
```typescript
interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}
```

---
