Certainly! Below is the updated context file for your Subscription Management App, incorporating the specified technology stack to ensure clarity for any developer or AI involved in the project:

---

# Subscription Management App - Context File
# app name - Substrack

## 1. Overview

This Android application is a personal tool designed to manage customer subscriptions, replacing manual record-keeping with a digital system. It allows for adding, editing, viewing, and analyzing subscriptions. The app is intended for personal use, with access limited to the owner and trusted individuals.

## 2. Core Features

### A. User Authentication
- **Login System:**
  - **Method:** Email and password-based login.
  - **User Access:** Only the owner will log in; credentials may be shared with trusted individuals to view the dashboard.
  - **Security:** Data is accessible only to those with login credentials.
  - **Backend:** Managed by Supabase, providing authentication services.

### B. Subscription Management
- **Add Subscription:**
  - Fields include:
    - Customer Email ID
    - Customer Name
    - Subscription Name
    - Phone Number
    - Subscription Amount
    - Buy Date
    - Expiry Date
- **Check Subscription:**
  - Display a list of subscriptions with filtering options (active, expired, expiring soon).
  - View detailed information for each subscription.
- **Edit Subscription:**
  - Only accessible to users with login credentials.
- **Expiry Management:**
  - Highlight subscriptions that are expired or nearing expiry.
  - Implement local notifications to remind the owner about upcoming expirations.

### C. Analytics Dashboard
- **Overview:**
  - Display key metrics:
    - Total number of subscriptions
    - Total active subscriptions
    - Total expired subscriptions
- **Presentation:**
  - A simple, uncluttered view showing these counts.

## 3. Data Model

### A. Subscription Entity
- **Attributes:**
  - `subscription_id` (unique identifier)
  - `customer_email` (string)
  - `customer_name` (string)
  - `subscription_name` (string)
  - `phone_number` (string)
  - `amount` (numeric)
  - `buy_date` (date)
  - `expiry_date` (date)
  - `status` (derived field: active, expired, expiring soon)

### B. User Entity (for Authentication)
- **Attributes:**
  - `user_id`
  - `email`
  - `password_hash`
  - `created_at`

## 4. Technical Stack

### A. Frontend
- **Framework:** React Native with TypeScript
  - Enables cross-platform development with strong typing.
- **Development Environment:** Expo with Expo Router
  - Simplifies the development process and manages native code complexities.
  - Expo Router provides a file-based routing system, enhancing code organization.

### B. Backend/Database
- **Platform:** Supabase
  - An open-source alternative to Firebase, offering authentication, real-time databases, and storage solutions.
  - Built on PostgreSQL, providing scalability and flexibility.

### C. UI Framework
- **Library:** React Native Paper
  - A collection of customizable and production-ready components following Google’s Material Design guidelines.
  - Ensures a consistent and visually appealing user interface across platforms. citeturn0search0

### D. AI Processing
- **Service:** DeepSeek
  - Provides advanced language models and AI solutions, offering real-time processing and intelligent automation. citeturn0search1

### E. Notifications
- **Implementation:** Utilize React Native's built-in libraries or third-party packages compatible with Expo to handle local notifications.

## 5. User Interface (UI) Flow

### A. Screens
1. **Login Screen:**
   - Email and password fields.
2. **Dashboard/Home Screen:**
   - Overview displaying key metrics (total subscriptions, active subscriptions, expired subscriptions).
3. **Subscription List Screen:**
   - List of all subscriptions with filter options.
   - Options to view, edit, or delete a subscription.
4. **Add/Edit Subscription Screen:**
   - Form to add a new subscription or modify an existing one.
5. **Analytics Screen:**
   - Summary of subscription counts.

### B. Navigation
- **Style:** Utilize Expo Router for file-based routing, ensuring intuitive navigation between screens.

## 6. Additional Considerations

- **Access Control:**
  - Only users with login credentials can add or edit subscription details.
- **Notifications:**
  - Implement local notifications to alert the owner about subscription expirations.
 