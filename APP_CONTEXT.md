# Substrack - Subscription Management App Documentation

## 1. Project Overview

### About The Project
Substrack is a comprehensive subscription management application designed for businesses and service providers who manage multiple customer subscriptions. The app addresses several key challenges in subscription-based businesses:

**Problem Statement:**
- Manual tracking of customer subscriptions is error-prone and time-consuming
- Missing renewal dates leads to revenue loss
- Lack of centralized system for customer subscription data
- Difficulty in sending timely reminders to customers
- No easy way to analyze subscription patterns and revenue

**Solution:**
Substrack provides a digital solution that:
- Centralizes all subscription information in one place
- Automates renewal reminders through WhatsApp and notifications
- Tracks expiring subscriptions to prevent revenue loss
- Provides analytics for better business decisions
- Simplifies customer communication

**Target Users:**
- Small business owners
- Service providers
- Subscription-based businesses
- Freelancers managing recurring services

**Key Benefits:**
1. **Business Efficiency:**
   - Reduced manual tracking
   - Automated reminders
   - Quick access to customer information

2. **Revenue Protection:**
   - Never miss renewal dates
   - Track payment status
   - Monitor subscription patterns

3. **Customer Management:**
   - Centralized customer database
   - Easy communication channels
   - Professional follow-ups

4. **Business Insights:**
   - Revenue analytics
   - Customer behavior patterns
   - Subscription trends

### Tech Stack
```
Frontend: React Native with Expo
Backend: Supabase
Database: PostgreSQL (via Supabase)
Authentication: Supabase Auth
State Management: React Hooks
Navigation: Expo Router
UI Components: React Native Paper
```

### Project Structure

```
/app - Main application code (Expo Router based)
  /(auth) - Authentication related screens
  /(tabs) - Main app tabs (Dashboard, Subscriptions, Profile)
  /subscription - Subscription management screens
  /components - App-specific components
  /theme - Theme configuration

/components - Reusable components
/lib - Utility functions and services
/assets - Static assets (images, fonts)
/constants - App constants and configurations
```

## 2. Core Features & Implementation

### A. Authentication System
**Location:** `app/(auth)/_layout.tsx` and `app/(auth)/login.tsx`
```typescript
Features:
- Email/Password based authentication
- Session management
- Protected routes
- Auto-redirect based on auth state
```

### B. Dashboard
**Location:** `app/(tabs)/index.tsx`
```typescript
Features:
- Subscription statistics
- Active/Expired counts
- Monthly active subscriptions
- Quick actions
```

### C. Subscription Management
**Location:** `app/(tabs)/subscriptions.tsx` and `app/subscription/new.tsx`
```typescript
Features:
- CRUD operations for subscriptions
- Filtering and searching
- Status tracking
- WhatsApp integration
- Date management
```

### D. Notifications System
**Location:** `app/notifications.tsx` and `lib/alertService.ts`
```typescript
Features:
- Expiry alerts
- Custom notifications
- WhatsApp messaging
- Alert management
```

## 3. Database Schema

### Subscriptions Table
```sql
subscriptions {
  id: uuid
  user_id: uuid
  customer_email: string
  customer_name: string
  subscription_name: string
  phone_number: string
  amount: number
  buy_date: date
  expiry_date: date
  created_at: timestamp
}
```

## 4. API Integration

### Supabase Integration
**Location:** `lib/supabase.ts`
```typescript
Services:
- Authentication
- Database operations
- Real-time updates
- File storage (if needed)
```

## 5. State Management

The app uses React's built-in state management with hooks:
```typescript
- useState for local state
- useEffect for side effects
- Custom hooks for shared logic
```

## 6. Development Setup

1. **Prerequisites:**
```bash
Node.js (v16+)
npm/yarn
Expo CLI
Android Studio/Xcode (for native development)
```

2. **Installation:**
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Start development server
npx expo start
```

3. **Environment Setup:**
```typescript
// Create .env file with:
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 7. Build & Deployment

### Development Build
```bash
eas build --profile development --platform android
```

### Production Build
```bash
eas build --platform android
eas build --platform ios
```

### Updates
```bash
eas update --branch production
```

## 8. Current Limitations & TODOs

1. **Performance Improvements Needed:**
   - Subscription list pagination
   - Cache management
   - Image optimization

2. **Feature Gaps:**
   - Offline support
   - Push notifications
   - Payment integration
   - Advanced analytics

3. **Technical Debt:**
   - Type definitions need improvement
   - Test coverage needed
   - Error boundary implementation
   - Better error handling

## 9. Testing

Currently implemented:
```typescript
- Basic component tests
- Navigation testing
- Auth flow testing
```

Needed:
```typescript
- E2E testing
- Integration tests
- Performance testing
```

## 10. Contributing Guidelines

1. **Code Style:**
   - Follow TypeScript best practices
   - Use functional components
   - Follow React Native Paper design system
   - Comment complex logic

2. **Git Workflow:**
   - Feature branches
   - Pull request reviews
   - Semantic versioning
   - Conventional commits

## 11. Useful Commands

```bash
# Development
npm start                 # Start development server
npm run android          # Run on Android
npm run ios              # Run on iOS
npm run web              # Run on web

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode

# Building
eas build               # Build for production
eas update             # Push updates
```

## 12. Important Files

1. **Configuration:**
   - `app.json` - Expo configuration
   - `package.json` - Dependencies
   - `tsconfig.json` - TypeScript configuration
   - `eas.json` - EAS Build configuration

2. **Core Logic:**
   - `app/_layout.tsx` - Root layout & initialization
   - `lib/supabase.ts` - Supabase client
   - `lib/alertService.ts` - Notification logic

3. **Main Screens:**
   - `app/(tabs)/index.tsx` - Dashboard
   - `app/(tabs)/subscriptions.tsx` - Subscription list
   - `app/(tabs)/profile.tsx` - User profile
   - `app/subscription/new.tsx` - Add subscription

## 13. Security Considerations

1. **Authentication:**
   - Session management
   - Token handling
   - Secure storage

2. **Data Protection:**
   - Input validation
   - Data encryption
   - Secure API calls

## 14. Performance Considerations

1. **Optimization Areas:**
   - Image loading
   - List rendering
   - API caching
   - State updates

2. **Monitoring Needed:**
   - API response times
   - App load time
   - Memory usage
   - Battery impact

## 15. Future Improvements

1. **Payment Integration:**
   - Online payment collection
   - Payment reminders
   - Payment history tracking
   - Multiple payment methods (UPI, Cards)

2. **Enhanced Notifications:**
   - Push notifications
   - WhatsApp templates
   - Email notifications
   - Custom schedules

3. **Analytics & Reporting:**
   - Monthly/yearly reports
   - Customer analytics
   - Subscription trends
   - Data export (PDF/Excel)

4. **UI/UX Improvements:**
   - Dark mode
   - Custom themes
   - Better loading states
   - Enhanced animations

5. **Customer Management:**
   - Detailed profiles
   - Categories
   - History tracking
   - Bulk operations

6. **Business Features:**
   - Invoice generation
   - Receipt generation
   - GST support
   - Business analytics

7. **Integration & Automation:**
   - Calendar sync
   - SMS integration
   - Auto-renewals
   - Webhook support

## 16. Contact & Support

For any queries or contributions, please contact:
- Project Maintainer: [Name]
- Email: [Email]
- GitHub: [GitHub Profile]

## 17. License

[License Type] - See LICENSE file for details 