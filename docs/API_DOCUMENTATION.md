# Azhagu Salon Platform — Backend REST API Documentation

Base URL: `http://localhost:5050/api`

---

## 1. Authentication APIs

### `POST /auth/login`
Authenticates a user by email address, phone number, or full name.

**Request Body:**
```json
{
  "identifier": "kavitha@azhagu.demo",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "jwt_token_user-owner-1_1788449900000",
  "user": {
    "id": "user-owner-1",
    "full_name": "Kavitha Ramasamy",
    "email": "kavitha@azhagu.demo",
    "role": "SALON_OWNER",
    "status": "ACTIVE"
  }
}
```

---

### `POST /auth/register`
Creates a new customer or salon owner user profile.

**Request Body:**
```json
{
  "full_name": "Soundarya Kumar",
  "email": "soundarya@example.com",
  "phone": "98401 99887",
  "role": "CUSTOMER",
  "password": "password123"
}
```

---

## 2. Salons & Services APIs

### `GET /salons`
Returns a list of all active salons.

### `GET /services`
Returns all services with prices, durations, and category references.

### `GET /staff`
Returns all stylists and assigned service IDs.

---

## 3. Appointments & Overlap Protection APIs

### `POST /appointments`
Creates a new appointment with **double-booking collision detection**.

**Request Body:**
```json
{
  "customer_id": "user-cust-1",
  "salon_id": "salon-1",
  "staff_id": "stf-1",
  "service_id": "srv-101",
  "appointment_date": "2026-09-15",
  "start_time": "10:00",
  "end_time": "12:30",
  "customer_name": "Guruprasath Sundaram",
  "payment_method": "INSTANT_UPI"
}
```

**Double Booking Conflict Error (409 Conflict):**
```json
{
  "success": false,
  "error": "That time slot is no longer available. Please select another time slot."
}
```

---

### `POST /appointments/cancel`
Enforces the **2-hour cancellation policy**.

**Request Body:**
```json
{
  "appointment_id": "appt-1001",
  "actor_id": "user-cust-1"
}
```

**2-Hour Window Rejection (403 Forbidden):**
```json
{
  "success": false,
  "error": "Appointments within the 2-hour window cannot be cancelled online."
}
```
