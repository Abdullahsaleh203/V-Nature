# V-Natural Technical Architecture

This document provides a detailed overview of the V-Natural application architecture, including the system components, their interactions, and design decisions.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Technology Stack](#technology-stack)
- [Component Details](#component-details)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)
- [Performance Considerations](#performance-considerations)
- [Scalability](#scalability)

## System Overview

V-Natural is a full-stack web application for booking tours. It follows a traditional MVC (Model-View-Controller) architecture with a RESTful API backend and a server-rendered frontend using Pug templates.

The application is built with Node.js and Express.js, using MongoDB as the database. It implements various security features, including JWT authentication, data sanitization, and rate limiting.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client Layer                                  │
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────┐   │
│  │             │    │             │    │             │    │         │   │
│  │  Web Browser│    │  Mobile App │    │  Desktop App│    │  API    │   │
│  │             │    │             │    │             │    │  Client │   │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └────┬────┘   │
│         │                  │                   │                  │     │
└─────────┼──────────────────┼───────────────────┼──────────────────┼─────┘
          │                  │                   │                  │
          ▼                  ▼                   ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           Application Layer                             │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     Express.js Server                           │    │
│  │                                                                 │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │    │
│  │  │             │  │             │  │             │  │         │ │    │
│  │  │  Middleware │  │   Routes    │  │ Controllers │  │  Utils  │ │    │
│  │  │             │  │             │  │             │  │         │ │    │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │    │
│  │         │                 │                 │                   │    │
│  │  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐  ┌─────┴────┐│    │
│  │  │             │  │             │  │             │  │          ││    │
│  │  │  Security   │  │  API Routes │  │  Business   │  │  Helpers ││    │
│  │  │  Middleware │  │  View Routes│  │  Logic      │  │  & Tools ││    │
│  │  │             │  │             │  │             │  │          ││    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘│    │
│  │                                                                 │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │    │
│  │  │             │  │             │  │             │  │         │ │    │
│  │  │  Pug        │  │  Static     │  │  Models     │  │  Email  │ │    │
│  │  │  Templates  │  │  Assets     │  │             │  │  Service│ │    │
│  │  │             │  │             │  │             │  │         │ │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │    │
│  │                                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           Data Layer                                    │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     MongoDB Database                              │  │
│  │                                                                   │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │  │
│  │  │             │  │             │  │             │  │           │ │  │
│  │  │  Users      │  │  Tours      │  │  Reviews    │  │ Bookings  │ │  │
│  │  │  Collection │  │  Collection │  │  Collection │  │ Collection│ │  │
│  │  │             │  │             │  │             │  │           │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │  │
│  │                                                                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           External Services                             │
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │             │  │             │  │             │  │             │     │
│  │  Stripe     │  │  SendGrid   │  │  Cloudinary │  │  Mapbox     │     │
│  │  Payment    │  │  Email      │  │  Image      │  │  Geocoding  │     │
│  │  Processing │  │  Service    │  │  Storage    │  │  Service    │     │
│  │             │  │             │  │             │  │             │     │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Interactions

1. **Client Layer**:
   - Users interact with the application through web browsers, mobile apps, desktop apps, or API clients.
   - All client requests are sent to the Express.js server.

2. **Application Layer**:
   - **Express.js Server**: The core of the application that handles all incoming requests and outgoing responses.
   - **Middleware**: Processes requests before they reach the routes, handling security, logging, and request parsing.
   - **Routes**: Define the API endpoints and connect them to the appropriate controllers.
   - **Controllers**: Contain the business logic and interact with the models.
   - **Utils**: Provide utility functions used throughout the application.
   - **Pug Templates**: Render HTML for the frontend.
   - **Static Assets**: Serve CSS, JavaScript, and images.
   - **Models**: Define the data structure and validation rules.
   - **Email Service**: Handle sending emails for notifications and password resets.

3. **Data Layer**:
   - **MongoDB Database**: Stores all application data.
   - **Collections**: Organize data into Users, Tours, Reviews, and Bookings.

4. **External Services**:
   - **Stripe**: Process payments for tour bookings.
   - **SendGrid**: Send transactional emails.
   - **Cloudinary**: Store and optimize tour and user images.
   - **Mapbox**: Provide geocoding services for finding tours near a location.

## Technology Stack

### Backend

- **Runtime Environment**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Template Engine**: Pug
- **File Upload**: Multer, Sharp
- **Email Service**: Nodemailer, SendGrid
- **Payment Processing**: Stripe
- **Security**: Helmet, Express Rate Limit, Express Mongo Sanitize, XSS Clean, HPP

### Frontend

- **Template Engine**: Pug
- **CSS**: Custom CSS
- **JavaScript**: Vanilla JS with modules
- **Bundler**: Parcel

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **Development Server**: Nodemon
- **Debugging**: ndb

## Component Details

### Models

The application uses Mongoose models to define the data structure and validation rules:

- **User Model**: Defines user properties, authentication methods, and password hashing
- **Tour Model**: Defines tour properties, virtual properties for ratings, and geospatial indexing
- **Review Model**: Defines review properties and relationships with users and tours
- **Booking Model**: Defines booking properties and relationships with users and tours

### Controllers

Controllers handle the business logic and interact with the models:

- **Auth Controller**: Handles user authentication, including signup, login, password reset, and JWT token generation
- **User Controller**: Handles user management, including CRUD operations and profile updates
- **Tour Controller**: Handles tour management, including CRUD operations, filtering, sorting, and geospatial queries
- **Review Controller**: Handles review management, including CRUD operations
- **Booking Controller**: Handles booking management, including CRUD operations and Stripe integration
- **View Controller**: Handles rendering of Pug templates
- **Error Handler**: Handles error responses in a consistent format

### Routes

Routes define the API endpoints and connect them to the appropriate controllers:

- **User Routes**: Define endpoints for user authentication and management
- **Tour Routes**: Define endpoints for tour management and queries
- **Review Routes**: Define endpoints for review management
- **Booking Routes**: Define endpoints for booking management and Stripe checkout
- **View Routes**: Define endpoints for rendering Pug templates

### Middleware

The application uses various middleware for security, logging, and request processing:

- **Authentication Middleware**: Verifies JWT tokens and attaches user information to the request
- **Authorization Middleware**: Restricts access to certain routes based on user roles
- **Error Handling Middleware**: Catches errors and sends appropriate responses
- **Security Middleware**: Implements various security measures, including HTTP headers, rate limiting, data sanitization, and parameter pollution prevention
- **Logging Middleware**: Logs HTTP requests in development mode

### Utils

Utility functions and classes used throughout the application:

- **Async Handler**: Wraps async functions to avoid try-catch blocks
- **App Error**: Custom error class for consistent error handling
- **API Features**: Implements filtering, sorting, pagination, and field selection
- **Email**: Handles sending emails using Nodemailer or SendGrid

### Views

Pug templates for rendering the frontend:

- **Base Template**: Defines the common layout for all pages
- **Overview Template**: Displays a list of tours
- **Tour Template**: Displays details of a specific tour
- **Login Template**: Displays the login form
- **Account Template**: Displays user account information
- **Error Template**: Displays error messages

### Static Assets

Static files served by Express:

- **CSS**: Stylesheets for the frontend
- **JavaScript**: Client-side scripts, including Stripe integration
- **Images**: Tour and user images

## Data Flow

### User Authentication Flow

1. User submits login credentials
2. Server validates credentials and generates a JWT token
3. Token is sent to the client and stored in a cookie
4. Client includes the token in subsequent requests
5. Server validates the token and attaches user information to the request

### Tour Booking Flow

1. User selects a tour and clicks "Book Now"
2. Client requests a checkout session from the server
3. Server creates a Stripe checkout session and returns the session ID
4. Client redirects to the Stripe checkout page
5. User completes the payment on the Stripe page
6. Stripe sends a webhook to the server
7. Server creates a booking record in the database
8. Server sends a confirmation email to the user

## Security Architecture

The application implements various security measures:

- **JWT Authentication**: Secure user authentication using JSON Web Tokens
- **Password Hashing**: Passwords are hashed using bcrypt
- **HTTP Security Headers**: Set using Helmet to prevent various attacks
- **Rate Limiting**: Limits the number of requests from the same IP
- **Data Sanitization**: Prevents NoSQL injection and XSS attacks
- **Parameter Pollution Prevention**: Prevents HTTP Parameter Pollution attacks
- **Secure Cookies**: JWT tokens are stored in secure, HTTP-only cookies
- **CSRF Protection**: Implemented through secure cookies and same-site attributes

## Deployment Architecture

The application can be deployed in various environments:

### Development

- Local MongoDB instance
- Nodemon for auto-restarting the server
- Environment variables loaded from a .env file

### Production

- MongoDB Atlas or other cloud MongoDB service
- PM2 or similar process manager for running the Node.js application
- Nginx or similar web server as a reverse proxy
- Environment variables set through the hosting platform

## Performance Considerations

The application implements various performance optimizations:

- **Indexing**: MongoDB indexes for frequently queried fields
- **Pagination**: Limits the number of results returned in a single request
- **Field Selection**: Allows clients to request only the fields they need
- **Caching**: Can be implemented at various levels (application, database, CDN)
- **Image Optimization**: Images are resized and optimized using Sharp

## Scalability

The application can be scaled in various ways:

- **Horizontal Scaling**: Multiple instances of the Node.js application behind a load balancer
- **Database Scaling**: MongoDB replication and sharding
- **Caching**: Redis or similar for caching frequently accessed data
- **CDN**: For serving static assets
- **Microservices**: Breaking down the application into smaller, independent services 
