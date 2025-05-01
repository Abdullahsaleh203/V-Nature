# V-Nature API Documentation

This document provides detailed information about the V-Nature API endpoints, including request/response formats, authentication, and examples.

## Table of Contents

- [Authentication](#authentication)
- [Tours](#tours)
- [Users](#users)
- [Reviews](#reviews)
- [Bookings](#bookings)
- [Error Handling](#error-handling)

## Authentication

The API uses JWT (JSON Web Token) for authentication. To access protected endpoints, you need to include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

#### Sign Up

```
POST /api/v1/users/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "id": "5f8a0f1b9d5c0b1c9d5c0b1c"
    }
  }
}
```

#### Login

```
POST /api/v1/users/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout

```
GET /api/v1/users/logout
```

**Response:**
```json
{
  "status": "success"
}
```

#### Forgot Password

```
POST /api/v1/users/forgotPassword
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Token sent to email!"
}
```

#### Reset Password

```
PATCH /api/v1/users/resetPassword/:token
```

**Request Body:**
```json
{
  "password": "newpassword123",
  "passwordConfirm": "newpassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Update Password

```
PATCH /api/v1/users/updateMyPassword
```

**Request Body:**
```json
{
  "passwordCurrent": "password123",
  "password": "newpassword123",
  "passwordConfirm": "newpassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Tours

### Get All Tours

```
GET /api/v1/tours
```

**Query Parameters:**
- `fields`: Comma-separated list of fields to include (e.g., `name,price,duration`)
- `sort`: Field to sort by (e.g., `price` or `-price` for descending)
- `page`: Page number for pagination
- `limit`: Number of items per page
- `difficulty`: Filter by difficulty (easy, medium, difficult)
- `price`: Filter by price (e.g., `price[gte]=1000`)
- `duration`: Filter by duration (e.g., `duration[gte]=5`)
- `maxGroupSize`: Filter by max group size (e.g., `maxGroupSize[gte]=10`)
- `ratingsAverage`: Filter by ratings average (e.g., `ratingsAverage[gte]=4.5`)

**Response:**
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "tours": [
      {
        "id": "5f8a0f1b9d5c0b1c9d5c0b1c",
        "name": "The Forest Hiker",
        "duration": 5,
        "maxGroupSize": 25,
        "difficulty": "easy",
        "price": 397,
        "summary": "Breathtaking hike through the Canadian Banff National Park",
        "description": "...",
        "imageCover": "tour-1-cover.jpg",
        "images": ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"],
        "startDates": ["2021-04-04T10:00:00.000Z", "2021-07-13T09:00:00.000Z"],
        "ratingsAverage": 4.7,
        "ratingsQuantity": 8,
        "guides": ["5f8a0f1b9d5c0b1c9d5c0b1c", "5f8a0f1b9d5c0b1c9d5c0b1d"]
      },
      // ... more tours
    ]
  }
}
```

### Get Tour

```
GET /api/v1/tours/:id
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "tour": {
      "id": "5f8a0f1b9d5c0b1c9d5c0b1c",
      "name": "The Forest Hiker",
      "duration": 5,
      "maxGroupSize": 25,
      "difficulty": "easy",
      "price": 397,
      "summary": "Breathtaking hike through the Canadian Banff National Park",
      "description": "...",
      "imageCover": "tour-1-cover.jpg",
      "images": ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"],
      "startDates": ["2021-04-04T10:00:00.000Z", "2021-07-13T09:00:00.000Z"],
      "ratingsAverage": 4.7,
      "ratingsQuantity": 8,
      "guides": [
        {
          "id": "5f8a0f1b9d5c0b1c9d5c0b1c",
          "name": "John Doe",
          "role": "lead-guide"
        },
        {
          "id": "5f8a0f1b9d5c0b1c9d5c0b1d",
          "name": "Jane Smith",
          "role": "guide"
        }
      ],
      "reviews": [
        {
          "id": "5f8a0f1b9d5c0b1c9d5c0b1e",
          "review": "Great tour!",
          "rating": 5,
          "user": {
            "id": "5f8a0f1b9d5c0b1c9d5c0b1f",
            "name": "Alice Johnson"
          }
        }
      ]
    }
  }
}
```

### Create Tour (Admin Only)

```
POST /api/v1/tours
```

**Request Body:**
```json
{
  "name": "The Mountain Explorer",
  "duration": 7,
  "maxGroupSize": 15,
  "difficulty": "difficult",
  "price": 997,
  "summary": "Exciting mountain adventure for experienced hikers",
  "description": "Detailed description of the tour...",
  "imageCover": "tour-2-cover.jpg",
  "images": ["tour-2-1.jpg", "tour-2-2.jpg", "tour-2-3.jpg"],
  "startDates": ["2021-05-04T10:00:00.000Z", "2021-08-13T09:00:00.000Z"],
  "guides": ["5f8a0f1b9d5c0b1c9d5c0b1c", "5f8a0f1b9d5c0b1c9d5c0b1d"]
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "tour": {
      "id": "5f8a0f1b9d5c0b1c9d5c0b1g",
      "name": "The Mountain Explorer",
      // ... other tour properties
    }
  }
}
```

### Update Tour (Admin Only)

```
PATCH /api/v1/tours/:id
```

**Request Body:**
```json
{
  "price": 899,
  "maxGroupSize": 12
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "tour": {
      "id": "5f8a0f1b9d5c0b1c9d5c0b1g",
      "name": "The Mountain Explorer",
      "price": 899,
      "maxGroupSize": 12,
      // ... other tour properties
    }
  }
}
```

### Delete Tour (Admin Only)

```
DELETE /api/v1/tours/:id
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

### Get Top 5 Cheapest Tours

```
GET /api/v1/tours/top-5-cheap
```

**Response:**
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "tours": [
      // ... 5 cheapest tours
    ]
  }
}
```

### Get Tour Statistics (Admin Only)

```
GET /api/v1/tours/tour-stats
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "tours": [
      {
        "_id": "easy",
        "numTours": 6,
        "numRatings": 4,
        "avgRating": 4.7,
        "avgPrice": 397
      },
      {
        "_id": "medium",
        "numTours": 9,
        "numRatings": 7,
        "avgRating": 4.6,
        "avgPrice": 697
      },
      {
        "_id": "difficult",
        "numTours": 5,
        "numRatings": 3,
        "avgRating": 4.8,
        "avgPrice": 997
      }
    ]
  }
}
```

### Get Monthly Plan (Admin Only)

```
GET /api/v1/tours/monthly-plan/:year
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "plan": [
      {
        "month": 1,
        "numToursStart": 2,
        "numTours": 2,
        "tours": ["The Forest Hiker", "The Sea Explorer"]
      },
      {
        "month": 2,
        "numToursStart": 1,
        "numTours": 1,
        "tours": ["The Snow Adventurer"]
      },
      // ... other months
    ]
  }
}
```

### Get Tours Within Distance

```
GET /api/v1/tours/tours-within/:distance/center/:latlng/unit/:unit
```

**Example:**
```
GET /api/v1/tours/tours-within/233/center/34.111745,-118.113491/unit/mi
```

**Response:**
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "tours": [
      // ... tours within the specified distance
    ]
  }
}
```

### Get Distances to Tours

```
GET /api/v1/tours/distances/:latlng/unit/:unit
```

**Example:**
```
GET /api/v1/tours/distances/34.111745,-118.113491/unit/mi
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "distances": [
      {
        "distance": 0.0,
        "name": "The Forest Hiker"
      },
      {
        "distance": 233.0,
        "name": "The Sea Explorer"
      },
      // ... other tours with distances
    ]
  }
}
```

## Users

### Get Current User

```
GET /api/v1/users/Me
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "5f8a0f1b9d5c0b1c9d5c0b1c",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "photo": "user-1.jpg"
    }
  }
}
```

### Update Current User

```
PATCH /api/v1/users/updateMe
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "5f8a0f1b9d5c0b1c9d5c0b1c",
      "name": "John Smith",
      "email": "john.smith@example.com",
      "role": "user",
      "photo": "user-1.jpg"
    }
  }
}
```

### Delete Current User

```
DELETE /api/v1/users/deleteMe
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

### Get All Users (Admin Only)

```
GET /api/v1/users
```

**Response:**
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "users": [
      {
        "id": "5f8a0f1b9d5c0b1c9d5c0b1c",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "photo": "user-1.jpg"
      },
      // ... more users
    ]
  }
}
```

### Create User (Admin Only)

```
POST /api/v1/users
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "role": "user"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "5f8a0f1b9d5c0b1c9d5c0b1d",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "user"
    }
  }
}
```

### Get User (Admin Only)

```
GET /api/v1/users/:id
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "5f8a0f1b9d5c0b1c9d5c0b1d",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "user",
      "photo": "user-2.jpg"
    }
  }
}
```

### Update User (Admin Only)

```
PATCH /api/v1/users/:id
```

**Request Body:**
```json
{
  "name": "Jane Johnson",
  "role": "guide"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "5f8a0f1b9d5c0b1c9d5c0b1d",
      "name": "Jane Johnson",
      "email": "jane@example.com",
      "role": "guide",
      "photo": "user-2.jpg"
    }
  }
}
```

### Delete User (Admin Only)

```
DELETE /api/v1/users/:id
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

## Reviews

### Get All Reviews

```
GET /api/v1/reviews
```

**Response:**
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "reviews": [
      {
        "id": "5f8a0f1b9d5c0b1c9d5c0b1e",
        "review": "Great tour!",
        "rating": 5,
        "user": {
          "id": "5f8a0f1b9d5c0b1c9d5c0b1f",
          "name": "Alice Johnson"
        },
        "tour": {
          "id": "5f8a0f1b9d5c0b1c9d5c0b1c",
          "name": "The Forest Hiker"
        }
      },
      // ... more reviews
    ]
  }
}
```

### Get Review

```
GET /api/v1/reviews/:id
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "review": {
      "id": "5f8a0f1b9d5c0b1c9d5c0b1e",
      "review": "Great tour!",
      "rating": 5,
      "user": {
        "id": "5f8a0f1b9d5c0b1c9d5c0b1f",
        "name": "Alice Johnson"
      },
      "tour": {
        "id": "5f8a0f1b9d5c0b1c9d5c0b1c",
        "name": "The Forest Hiker"
      }
    }
  }
}
```

### Create Review

```
POST /api/v1/reviews
```

**Request Body:**
```json
{
  "review": "Amazing experience!",
  "rating": 5,
  "tour": "5f8a0f1b9d5c0b1c9d5c0b1c"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "review": {
      "id": "5f8a0f1b9d5c0b1c9d5c0b1g",
      "review": "Amazing experience!",
      "rating": 5,
      "user": "5f8a0f1b9d5c0b1c9d5c0b1f",
      "tour": "5f8a0f1b9d5c0b1c9d5c0b1c"
    }
  }
}
```

### Update Review

```
PATCH /api/v1/reviews/:id
```

**Request Body:**
```json
{
  "review": "Updated review text",
  "rating": 4
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "review": {
      "id": "5f8a0f1b9d5c0b1c9d5c0b1e",
      "review": "Updated review text",
      "rating": 4,
      "user": "5f8a0f1b9d5c0b1c9d5c0b1f",
      "tour": "5f8a0f1b9d5c0b1c9d5c0b1c"
    }
  }
}
```

### Delete Review

```
DELETE /api/v1/reviews/:id
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

## Bookings

### Get All Bookings (Admin Only)

```
GET /api/v1/booking
```

**Response:**
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "bookings": [
      {
        "id": "5f8a0f1b9d5c0b1c9d5c0b1h",
        "tour": {
          "id": "5f8a0f1b9d5c0b1c9d5c0b1c",
          "name": "The Forest Hiker"
        },
        "user": {
          "id": "5f8a0f1b9d5c0b1c9d5c0b1f",
          "name": "Alice Johnson"
        },
        "price": 397,
        "paid": true,
        "createdAt": "2020-10-17T12:00:00.000Z"
      },
      // ... more bookings
    ]
  }
}
```

### Create Booking (Admin Only)

```
POST /api/v1/booking
```

**Request Body:**
```json
{
  "tour": "5f8a0f1b9d5c0b1c9d5c0b1c",
  "user": "5f8a0f1b9d5c0b1c9d5c0b1f",
  "price": 397
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "booking": {
      "id": "5f8a0f1b9d5c0b1c9d5c0b1i",
      "tour": "5f8a0f1b9d5c0b1c9d5c0b1c",
      "user": "5f8a0f1b9d5c0b1c9d5c0b1f",
      "price": 397,
      "paid": false,
      "createdAt": "2020-10-17T12:00:00.000Z"
    }
  }
}
```

### Get Booking (Admin Only)

```
GET /api/v1/booking/:id
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "booking": {
      "id": "5f8a0f1b9d5c0b1c9d5c0b1h",
      "tour": {
        "id": "5f8a0f1b9d5c0b1c9d5c0b1c",
        "name": "The Forest Hiker"
      },
      "user": {
        "id": "5f8a0f1b9d5c0b1c9d5c0b1f",
        "name": "Alice Johnson"
      },
      "price": 397,
      "paid": true,
      "createdAt": "2020-10-17T12:00:00.000Z"
    }
  }
}
```

### Update Booking (Admin Only)

```
PATCH /api/v1/booking/:id
```

**Request Body:**
```json
{
  "paid": true
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "booking": {
      "id": "5f8a0f1b9d5c0b1c9d5c0b1h",
      "tour": "5f8a0f1b9d5c0b1c9d5c0b1c",
      "user": "5f8a0f1b9d5c0b1c9d5c0b1f",
      "price": 397,
      "paid": true,
      "createdAt": "2020-10-17T12:00:00.000Z"
    }
  }
}
```

### Delete Booking (Admin Only)

```
DELETE /api/v1/booking/:id
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

### Get Checkout Session

```
GET /api/v1/booking/checkout-session/:tourId
```

**Response:**
```json
{
  "status": "success",
  "session": {
    "id": "cs_test_123456789",
    "object": "checkout.session",
    "amount_total": 39700,
    "currency": "usd",
    "customer": "cus_123456789",
    "customer_email": "john@example.com",
    "payment_status": "unpaid",
    "url": "https://checkout.stripe.com/pay/cs_test_123456789"
  }
}
```

## Error Handling

The API uses a consistent error response format:

```json
{
  "status": "fail",
  "message": "Error message here"
}
```

Common HTTP status codes:

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Example error responses:

### Authentication Error

```json
{
  "status": "fail",
  "message": "You are not logged in! Please log in to get access."
}
```

### Not Found Error

```json
{
  "status": "fail",
  "message": "Can't find tour with id: 5f8a0f1b9d5c0b1c9d5c0b1x on this server"
}
```

### Validation Error

```json
{
  "status": "fail",
  "message": "Invalid input data. passwordConfirm is required"
}
```

### Permission Error

```json
{
  "status": "fail",
  "message": "You do not have permission to perform this action"
}
``` 
