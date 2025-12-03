# Payment API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## Authentication
All payment endpoints (except webhook) require JWT authentication.

```http
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Create Payment Order

Creates a Razorpay order for checkout.

**Endpoint:** `POST /payment/create-order`

**Auth Required:** Yes

**Request Body:**
```json
{
  "pricingId": 1,
  "videoUrl": "https://youtube.com/watch?v=xxxxx",
  "channelName": "Your Channel Name",
  "channelUrl": "https://youtube.com/@yourchannel"
}
```

**Validation:**
- `pricingId` (required): Valid pricing plan ID
- `videoUrl` (required): Valid YouTube video URL
- `channelName` (optional): Channel name
- `channelUrl` (optional): Channel URL

**Response (200):**
```json
{
  "status": "success",
  "message": "Payment order created successfully",
  "data": {
    "orderId": 123,
    "orderNumber": "ORD-20231210-1234",
    "razorpayOrderId": "order_xxxxxxxxxxxxx",
    "razorpayKeyId": "rzp_test_xxxxxxxxxxxxx",
    "amount": 1180.00,
    "baseAmount": 1000.00,
    "gstAmount": 180.00,
    "gstRate": 18,
    "currency": "INR",
    "customerDetails": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210"
    }
  }
}
```

**Error Responses:**
```json
// Missing video URL
{
  "status": "error",
  "message": "Pricing plan and YouTube video URL are required"
}

// Invalid video URL
{
  "status": "error",
  "message": "Please provide a valid YouTube video URL"
}

// Pricing plan not found
{
  "status": "error",
  "message": "Pricing plan not found"
}

// Payment gateway not configured
{
  "status": "error",
  "message": "Payment gateway is currently unavailable"
}
```

---

### 2. Verify Payment

Verifies Razorpay payment signature and updates order status.

**Endpoint:** `POST /payment/verify`

**Auth Required:** Yes

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxxxxxxxxxxxx",
  "razorpay_payment_id": "pay_xxxxxxxxxxxxx",
  "razorpay_signature": "signature_here",
  "orderId": 123
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Payment verified successfully! Your order is now being processed.",
  "data": {
    "orderId": 123,
    "orderNumber": "ORD-20231210-1234",
    "paymentId": "pay_xxxxxxxxxxxxx",
    "invoiceNumber": "INV-20231210-5678",
    "amount": 1180.00,
    "status": "processing",
    "paymentStatus": "paid"
  }
}
```

**Error Responses:**
```json
// Invalid signature
{
  "status": "error",
  "message": "Payment verification failed. Invalid signature."
}

// Order not found
{
  "status": "error",
  "message": "Order not found"
}

// Unauthorized
{
  "status": "error",
  "message": "Not authorized to verify this payment"
}
```

---

### 3. Get Payment History

Retrieves payment transaction history.

**Endpoint:** `GET /payment/history`

**Auth Required:** Yes

**Query Parameters:**
- `status` (optional): Filter by status (success, pending, failed, refunded)
- `limit` (optional): Number of results (default: 50)

**Response (200):**
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "payments": [
      {
        "id": 1,
        "orderId": 123,
        "userId": 5,
        "razorpayOrderId": "order_xxxxxxxxxxxxx",
        "razorpayPaymentId": "pay_xxxxxxxxxxxxx",
        "amount": 1180.00,
        "baseAmount": 1000.00,
        "gstAmount": 180.00,
        "currency": "INR",
        "status": "success",
        "paymentMode": "card",
        "invoiceNumber": "INV-20231210-5678",
        "createdAt": "2023-12-10T10:30:00.000Z",
        "user": {
          "id": 5,
          "name": "John Doe",
          "email": "john@example.com"
        },
        "order": {
          "id": 123,
          "orderNumber": "ORD-20231210-1234",
          "service": {
            "name": "YouTube Views"
          },
          "pricing": {
            "name": "Starter Plan",
            "quantity": "1000 Views"
          }
        }
      }
    ]
  }
}
```

**Note:** 
- Users can only see their own payments
- Admins can see all payments

---

### 4. Get Payment Details (Admin Only)

Fetches detailed payment information from Razorpay.

**Endpoint:** `GET /payment/:paymentId`

**Auth Required:** Yes (Admin only)

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "payment": {
      "id": "pay_xxxxxxxxxxxxx",
      "entity": "payment",
      "amount": 118000,
      "currency": "INR",
      "status": "captured",
      "method": "card",
      "card": {
        "network": "Visa",
        "last4": "1111"
      },
      "created_at": 1702200600
    }
  }
}
```

---

### 5. Process Refund (Admin Only)

Initiates a refund for a payment.

**Endpoint:** `POST /payment/refund`

**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
  "orderId": 123,
  "amount": 1180.00,
  "reason": "Customer requested refund"
}
```

**Note:** 
- If `amount` is not provided, full refund is processed
- Partial refunds are supported

**Response (200):**
```json
{
  "status": "success",
  "message": "Refund initiated successfully",
  "data": {
    "refundId": "rfnd_xxxxxxxxxxxxx",
    "amount": 1180.00,
    "status": "pending"
  }
}
```

**Error Responses:**
```json
// No successful payment found
{
  "status": "error",
  "message": "No successful payment found for this order"
}

// Payment gateway error
{
  "status": "error",
  "message": "Refund failed: Insufficient balance"
}
```

---

### 6. Webhook Handler

Handles Razorpay webhook events.

**Endpoint:** `POST /payment/webhook`

**Auth Required:** No (Verified by signature)

**Headers:**
```
X-Razorpay-Signature: <signature>
Content-Type: application/json
```

**Request Body:**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_xxxxxxxxxxxxx",
        "order_id": "order_xxxxxxxxxxxxx",
        "amount": 118000,
        "status": "captured"
      }
    }
  }
}
```

**Supported Events:**
- `payment.authorized`
- `payment.captured`
- `payment.failed`
- `refund.processed`

**Response (200):**
```json
{
  "status": "ok"
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Invalid signature"
}
```

---

## Order Management Endpoints

### 7. Get All Orders

**Endpoint:** `GET /orders`

**Auth Required:** Yes

**Response:**
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "orders": [
      {
        "id": 123,
        "orderNumber": "ORD-20231210-1234",
        "userId": 5,
        "amount": 1180.00,
        "baseAmount": 1000.00,
        "gstAmount": 180.00,
        "gstRate": 18,
        "status": "processing",
        "paymentStatus": "paid",
        "paymentMethod": "razorpay",
        "channelDetails": {
          "videoUrl": "https://youtube.com/watch?v=xxxxx",
          "videoId": "xxxxx",
          "channelName": "My Channel"
        },
        "customer": {
          "id": 5,
          "name": "John Doe",
          "email": "john@example.com"
        },
        "service": {
          "name": "YouTube Views"
        },
        "pricing": {
          "name": "Starter Plan",
          "quantity": "1000 Views"
        },
        "createdAt": "2023-12-10T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 8. Update Order Status (Admin Only)

**Endpoint:** `PUT /orders/:id/status`

**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
  "status": "completed",
  "adminNotes": "Order completed successfully"
}
```

**Status Options:**
- `pending`
- `processing`
- `in-progress`
- `completed`
- `cancelled`
- `refunded`

**Response (200):**
```json
{
  "status": "success",
  "message": "Order status updated to completed",
  "data": {
    "order": {
      "id": 123,
      "status": "completed",
      "completionDate": "2023-12-10T15:30:00.000Z"
    }
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid parameters |
| 401  | Unauthorized - Invalid or missing token |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource doesn't exist |
| 500  | Internal Server Error |
| 503  | Service Unavailable - Payment gateway not configured |

---

## Rate Limiting

- **Rate Limit:** 100 requests per 15 minutes
- **Header:** `X-RateLimit-Remaining`
- **Response (429):**
```json
{
  "status": "error",
  "message": "Too many requests, please try again later"
}
```

---

## Testing

### Postman Collection

Import the following endpoints into Postman:

1. **Login** (to get JWT token)
   ```
   POST /auth/login
   Body: { "email": "user@example.com", "password": "password" }
   ```

2. **Create Order**
   ```
   POST /payment/create-order
   Headers: Authorization: Bearer <token>
   Body: { "pricingId": 1, "videoUrl": "https://youtube.com/watch?v=test" }
   ```

3. **Get Payment History**
   ```
   GET /payment/history
   Headers: Authorization: Bearer <token>
   ```

---

## Webhooks Setup

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add URL: `https://yourdomain.com/api/payment/webhook`
3. Select events: payment.*, refund.*
4. Copy webhook secret to `.env`
5. Test webhook with Razorpay's test events

---

## Security Notes

1. **Never expose** RAZORPAY_KEY_SECRET in client-side code
2. **Always verify** payment signatures on server-side
3. **Use HTTPS** in production
4. **Validate** all user inputs
5. **Store** sensitive data encrypted
6. **Log** all payment activities
7. **Monitor** for suspicious activities

---

## Support

For API issues:
- Check server logs
- Verify environment variables
- Test with Razorpay test mode
- Review Razorpay dashboard logs

For Razorpay-specific issues:
- Visit: https://razorpay.com/docs/
- Email: support@razorpay.com

---

**Last Updated:** December 2024  
**API Version:** 1.0  
**Razorpay SDK:** 2.9.2
