# V-Nature - Tour Booking
Application


A full-stack Node.js application for booking tours, built with Express, MongoDB, and Pug templates.

## Table of Contents

- [V-Nature - Tour Booking Application](#v-nature---tour-booking-application)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Project Structure](#project-structure)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Usage](#usage)
    - [Development Mode](#development-mode)
    - [Production Mode](#production-mode)
    - [Building Frontend Assets](#building-frontend-assets)
  - [API Documentation](#api-documentation)
    - [Tours](#tours)
    - [Users](#users)
    - [Reviews](#reviews)
    - [Bookings](#bookings)
  - [Security Features](#security-features)
  - [Development](#development)
    - [Code Style](#code-style)
    - [Debugging](#debugging)
  - [License](#license)

## Features

- User authentication and authorization (signup, login, password reset)
- Tour management (create, read, update, delete)
- Review system for tours
- Booking system with Stripe payment integration
- Email notifications
- Responsive design with Pug templates
- Advanced filtering, sorting, and pagination
- Geospatial queries for finding tours near a location
- File uploads for tour images and user photos
- Error handling and logging

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: Pug templates, CSS
- **Payment Processing**: Stripe
- **Email Service**: Nodemailer, SendGrid
- **File Upload**: Multer, Sharp
- **Security**: Helmet, Express Rate Limit, Express Mongo Sanitize, XSS Clean, HPP
- **Development Tools**: Nodemon, ESLint, Prettier

## Project Structure

```
V-Nature/
├── controller/         # Business logic
├── models/             # Database models
├── public/             # Static files (CSS, JS, images)
├── router/             # API routes
├── utils/              # Utility functions
├── views/              # Pug templates
├── app.js              # Express application setup
├── server.js           # Server entry point
└── package.json        # Project dependencies and scripts
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Abdullahsaleh203/V-Nature.git

   cd V-Nature
   ```


2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=3000
   DATABASE_URI=mongodb://localhost:27017/V-Nature
   JWT_SECRET_KEY=your-jwt-secret-key
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90
   EMAIL_USERNAME=your-email-username
   EMAIL_PASSWORD=your-email-password
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_FROM=your-email-from
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
   ```

## Configuration

The application uses environment variables for configuration. Make sure to set up the `.env` file with the appropriate values for your environment.

## Usage

### Development Mode

```
npm run dev
```

### Production Mode

```
npm run start:prod
```

### Building Frontend Assets

```
npm run build:js
```

## API Documentation

The API provides the following endpoints:

### Tours

- `GET /api/v1/tours` - Get all tours
- `GET /api/v1/tours/:id` - Get a specific tour
- `POST /api/v1/tours` - Create a new tour (admin only)
- `PATCH /api/v1/tours/:id` - Update a tour (admin only)
- `DELETE /api/v1/tours/:id` - Delete a tour (admin only)
- `GET /api/v1/tours/top-5-cheap` - Get top 5 cheapest tours
- `GET /api/v1/tours/tour-stats` - Get tour statistics (admin only)
- `GET /api/v1/tours/monthly-plan/:year` - Get monthly plan (admin only)
- `GET /api/v1/tours/tours-within/:distance/center/:latlng/unit/:unit` - Get tours within a distance
- `GET /api/v1/tours/distances/:latlng/unit/:unit` - Get distances to tours

### Users

- `POST /api/v1/users/signup` - Sign up a new user
- `POST /api/v1/users/login` - Log in a user
- `GET /api/v1/users/logout` - Log out a user
- `POST /api/v1/users/forgotPassword` - Request password reset
- `PATCH /api/v1/users/resetPassword/:token` - Reset password
- `PATCH /api/v1/users/updateMyPassword` - Update password (authenticated)
- `GET /api/v1/users/Me` - Get current user (authenticated)
- `PATCH /api/v1/users/updateMe` - Update current user (authenticated)
- `DELETE /api/v1/users/deleteMe` - Delete current user (authenticated)
- `GET /api/v1/users` - Get all users (admin only)
- `POST /api/v1/users` - Create a new user (admin only)
- `GET /api/v1/users/:id` - Get a specific user (admin only)
- `PATCH /api/v1/users/:id` - Update a user (admin only)
- `DELETE /api/v1/users/:id` - Delete a user (admin only)

### Reviews

- `GET /api/v1/reviews` - Get all reviews
- `GET /api/v1/reviews/:id` - Get a specific review
- `POST /api/v1/reviews` - Create a new review (authenticated)
- `PATCH /api/v1/reviews/:id` - Update a review (authenticated)
- `DELETE /api/v1/reviews/:id` - Delete a review (authenticated)

### Bookings

- `GET /api/v1/booking` - Get all bookings (admin only)
- `POST /api/v1/booking` - Create a new booking (admin only)
- `GET /api/v1/booking/:id` - Get a specific booking (admin only)
- `PATCH /api/v1/booking/:id` - Update a booking (admin only)
- `DELETE /api/v1/booking/:id` - Delete a booking (admin only)
- `GET /api/v1/booking/checkout-session/:tourId` - Get checkout session (authenticated)

## Security Features

- **HTTP Security Headers**: Using Helmet to set various HTTP headers for security
- **Rate Limiting**: Limiting requests from the same IP
- **Data Sanitization**: Against NoSQL query injection and XSS attacks
- **Parameter Pollution Prevention**: Using HPP to prevent parameter pollution
- **JWT Authentication**: For secure user authentication
- **Password Hashing**: Using bcrypt for password hashing
- **Secure Cookies**: For storing authentication tokens

## Development

### Code Style

The project uses ESLint and Prettier for code formatting. Run the following commands to check and fix code style issues:

```
npx eslint .
npx prettier --write .
```

### Debugging

For debugging, you can use the following command:

```
npm run debug
```

## License

This project is licensed under the MIT License.
