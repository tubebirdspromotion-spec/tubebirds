# TubeBirds - Component Structure & Pages Guide

This document outlines all the components and pages that need to be created to complete the frontend.

## 📁 Components to Create

### Common Components (`client/src/components/`)

1. **Navbar.jsx** - Main navigation bar
   - Logo
   - Navigation links (Home, About, Services, Pricing, Portfolio, Contact)
   - Login/Register buttons (when not authenticated)
   - User menu with dashboard link (when authenticated)
   - Mobile responsive hamburger menu

2. **Footer.jsx** - Footer component
   - Company info
   - Quick links
   - Services links
   - Social media icons
   - Copyright

3. **Loading.jsx** - Loading spinner component
4. **ErrorBoundary.jsx** - Error boundary component
5. **SEO.jsx** - SEO meta tags component

### Home Page Components (`client/src/components/home/`)

1. **Hero.jsx** - Hero section with parallax
   - Title: "Best YouTube Promotion Agency In India"
   - Animated background
   - CTA buttons

2. **EnquiryForm.jsx** - Lead capture form
   - Name, Email, Phone, Service, Message
   - Form validation
   - API integration

3. **ServiceCards.jsx** - Service overview cards
4. **Stats.jsx** - Animated statistics counter
5. **Testimonials.jsx** - Customer testimonials slider
6. **FAQ.jsx** - Frequently asked questions

### Dashboard Components (`client/src/components/dashboard/`)

1. **DashboardHeader.jsx** - Dashboard top header
   - User avatar and name
   - Notifications
   - Logout button

2. **ClientSidebar.jsx** - Client dashboard sidebar
   - Dashboard link
   - Orders link
   - Profile link

3. **AdminSidebar.jsx** - Admin dashboard sidebar
   - Dashboard
   - Orders
   - Users
   - Services
   - Pricing
   - Portfolio
   - Contacts

4. **StatCard.jsx** - Statistics card component
5. **OrderCard.jsx** - Order card component
6. **ProgressBar.jsx** - Progress visualization
7. **ChartComponent.jsx** - Chart wrapper using Recharts

## 📄 Pages to Create

### Public Pages (`client/src/pages/`)

1. **Home.jsx** - Landing page
   ```jsx
   - Hero section with parallax
   - Enquiry form
   - Services overview
   - Why choose us section
   - Stats section
   - Testimonials
   - CTA section
   ```

2. **About.jsx** - About us page
   ```jsx
   - Company story
   - Mission & vision
   - Team section
   - Why choose us
   - Achievements
   ```

3. **Services.jsx** - Services listing page
   ```jsx
   - All 6 services as cards
   - Each card links to detail page
   ```

4. **ServiceDetail.jsx** - Individual service page
   ```jsx
   - Service title and description
   - Features list
   - Benefits
   - Pricing CTA
   - Related services
   ```

5. **Pricing.jsx** - Pricing plans page
   ```jsx
   - Tabs for 4 categories:
     * YouTube Views
     * YouTube Subscribers
     * YouTube Monetization
     * YouTube Revenue
   - Pricing cards with features
   - Popular badge for featured plans
   - Order now buttons
   ```

6. **Portfolio.jsx** - Portfolio page
   ```jsx
   - Tabs for Reports and Reviews
   - Report cards showing before/after stats
   - Review cards with ratings
   - Filter by featured
   ```

7. **Contact.jsx** - Contact page
   ```jsx
   - Contact form
   - Contact information
   - Map (optional)
   - Social media links
   ```

8. **Login.jsx** - Login page
   ```jsx
   - Email and password fields
   - Remember me checkbox
   - Login button
   - Link to register
   - Redirect to dashboard after login
   ```

9. **Register.jsx** - Registration page
   ```jsx
   - Name, email, phone, password fields
   - Terms checkbox
   - Register button
   - Link to login
   ```

### Client Dashboard Pages (`client/src/pages/client/`)

1. **Dashboard.jsx** - Client dashboard home
   ```jsx
   - Welcome message
   - Statistics: Total orders, Active orders, Completed orders, Total spent
   - Recent orders table
   - Quick actions
   - Active orders progress
   ```

2. **Orders.jsx** - All client orders
   ```jsx
   - Orders table with filters
   - Status badges
   - Progress indicators
   - Order actions (view details)
   ```

3. **OrderDetail.jsx** - Single order view
   ```jsx
   - Order information
   - Channel details
   - Progress tracking with visual chart
   - Payment status
   - Order timeline
   - Notes section
   - Download reports
   ```

4. **Profile.jsx** - Client profile page
   ```jsx
   - User information
   - Edit profile form
   - Change password
   - Avatar upload
   ```

### Admin Dashboard Pages (`client/src/pages/admin/`)

1. **Dashboard.jsx** - Admin dashboard home
   ```jsx
   - Statistics cards:
     * Total revenue (monthly/yearly/all-time)
     * Total orders
     * Active orders
     * Total users
     * Unread contacts
   - Revenue chart (monthly)
   - Orders by status chart
   - Recent orders table
   - Quick actions
   ```

2. **Orders.jsx** - All orders management
   ```jsx
   - Orders table with advanced filters
   - Status filter dropdown
   - Search functionality
   - Edit/Delete actions
   - Bulk actions
   ```

3. **OrderDetail.jsx** - Order management detail
   ```jsx
   - Full order information
   - Update order status
   - Update progress
   - Add notes
   - Upload reports
   - Customer details
   - Payment information
   - Timeline
   ```

4. **Users.jsx** - User management
   ```jsx
   - Users table
   - Role filter
   - Search users
   - Edit user details
   - Activate/Deactivate users
   - Delete users
   ```

5. **Services.jsx** - Service management
   ```jsx
   - Services table
   - Add new service
   - Edit service
   - Delete service
   - Toggle active status
   - Reorder services
   ```

6. **Pricing.jsx** - Pricing management
   ```jsx
   - Pricing plans table
   - Category filter
   - Add new plan
   - Edit plan
   - Delete plan
   - Toggle popular badge
   - Toggle active status
   ```

7. **Portfolio.jsx** - Portfolio management
   ```jsx
   - Portfolio items table
   - Type filter (Reports/Reviews)
   - Add new item
   - Edit item
   - Delete item
   - Toggle featured
   - Upload images
   ```

8. **Contacts.jsx** - Contact submissions
   ```jsx
   - Contacts table
   - Status filter (New, Contacted, Converted, Closed)
   - Mark as read
   - Add notes
   - Update status
   - Delete contact
   ```

## 🎨 UI/UX Implementation Checklist

### Animations & Effects

- [ ] Parallax effects on hero section using `react-parallax`
- [ ] Framer Motion animations:
  - [ ] Page transitions
  - [ ] Card hover effects
  - [ ] Button animations
  - [ ] List animations (stagger children)
  - [ ] Number counter animations
  - [ ] Progress bar animations
  
- [ ] Scroll animations (fade in on scroll)
- [ ] Smooth scrolling
- [ ] Loading skeletons

### Responsive Design

- [ ] Mobile menu (hamburger)
- [ ] Responsive grid layouts
- [ ] Mobile-first approach
- [ ] Tablet breakpoints
- [ ] Desktop optimizations

### Tailwind CSS Utilities

- [ ] Custom color palette (primary, secondary)
- [ ] Custom button styles
- [ ] Card components
- [ ] Form styles
- [ ] Badge components
- [ ] Alert components

## 🔧 Utility Functions to Create

### Client Utils (`client/src/utils/`)

1. **formatters.js**
   ```javascript
   - formatCurrency(amount)
   - formatDate(date)
   - formatNumber(number)
   - truncateText(text, length)
   ```

2. **validators.js**
   ```javascript
   - validateEmail(email)
   - validatePhone(phone)
   - validatePassword(password)
   ```

3. **constants.js**
   ```javascript
   - ORDER_STATUS
   - PAYMENT_STATUS
   - SERVICE_CATEGORIES
   - PRICING_CATEGORIES
   ```

4. **helpers.js**
   ```javascript
   - calculateProgress(completed, target)
   - getStatusColor(status)
   - getStatusBadge(status)
   ```

## 📦 Additional Features to Implement

### Payment Flow

1. **PaymentModal.jsx** - Razorpay payment modal
   ```jsx
   - Display order summary
   - Razorpay checkout integration
   - Payment success/failure handling
   - Redirect after payment
   ```

2. **OrderForm.jsx** - Order creation form
   ```jsx
   - Select pricing plan
   - Enter channel details
   - Channel URL validation
   - Current stats input
   - Terms acceptance
   - Create order and initiate payment
   ```

### Advanced Features

1. **Search.jsx** - Global search component
2. **Notifications.jsx** - Notification dropdown
3. **ImageUpload.jsx** - Image upload with preview
4. **Modal.jsx** - Reusable modal component
5. **Tabs.jsx** - Reusable tabs component
6. **Table.jsx** - Reusable data table
7. **Pagination.jsx** - Pagination component

## 🚀 Implementation Priority

### Phase 1: Core Structure (COMPLETED ✅)
- [x] Project setup
- [x] Backend API
- [x] Database models
- [x] Authentication system
- [x] Payment integration
- [x] Redux store setup

### Phase 2: Essential Pages (HIGH PRIORITY)
- [ ] Navbar & Footer
- [ ] Home page with hero & enquiry form
- [ ] Services page
- [ ] Pricing page
- [ ] Login & Register pages

### Phase 3: Dashboards (MEDIUM PRIORITY)
- [ ] Client dashboard
- [ ] Client orders
- [ ] Admin dashboard
- [ ] Admin order management

### Phase 4: Additional Pages (LOWER PRIORITY)
- [ ] About page
- [ ] Portfolio page
- [ ] Contact page
- [ ] Service detail pages

### Phase 5: Polish & Animations (FINAL)
- [ ] Framer Motion animations
- [ ] Parallax effects
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive refinements

## 📝 Notes for Development

1. **Reusability**: Create reusable components for common UI patterns
2. **Consistency**: Use Tailwind CSS utility classes consistently
3. **Performance**: Lazy load images and components where appropriate
4. **Accessibility**: Add proper ARIA labels and keyboard navigation
5. **SEO**: Add meta tags and structured data
6. **Testing**: Test responsive design on multiple devices

---

This structure provides a complete roadmap for building all frontend components. The backend is fully functional, so you can focus on creating an attractive, animated, and responsive user interface!
