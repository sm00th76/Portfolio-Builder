# Authentication Setup Guide

## MongoDB Atlas Configuration

### 1. Create MongoDB Atlas Account
- Go to https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Create a database user with username and password
- Get connection string

### 2. Set Environment Variables
Create `.env` file in project root:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio-architect?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 3. Install Dependencies
All required packages are installed:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT auth
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

## Project Structure

```
server/
├── models/
│   └── User.ts          # MongoDB User schema
├── middleware/
│   └── auth.ts          # JWT authentication middleware
└── routes/
    └── auth.ts          # Login/Signup endpoints

src/
├── components/
│   ├── LoginSignup.tsx  # Auth UI component
│   ├── ResumeForm.tsx   # Resume form (was here)
│   └── ProjectWorkspace.tsx
├── services/
│   ├── auth.ts          # Frontend auth API calls
│   └── gemini.ts        # (existing)
└── types.ts
```

## API Endpoints

### POST /api/auth/signup
Create new account
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### POST /api/auth/login
Login to existing account
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### GET /api/auth/me
Get current user (requires Bearer token)
```
Authorization: Bearer <token>
```

## How It Works

1. **User Registration**: 
   - User enters email, password, name
   - Password is hashed using bcryptjs
   - User document stored in MongoDB
   - JWT token issued and stored in localStorage

2. **User Login**:
   - User enters email, password
   - Password verified against hash
   - JWT token issued and stored in localStorage

3. **Protected Routes**:
   - Token sent with every request (Authorization header)
   - Middleware verifies JWT signature
   - User can only access /api/auth/me with valid token

4. **Session Persistence**:
   - Token stored in localStorage
   - Token checked on app load
   - Automatic logout if token invalid

## Security Notes

⚠️ **Production Requirements**:
1. Change `JWT_SECRET` to a strong random value
2. Use HTTPS for all requests
3. Set proper CORS origins
4. Enable rate limiting
5. Use secure password requirements
6. Add email verification
7. Implement refresh tokens
8. Add 2FA support

## Troubleshooting

**Cannot connect to MongoDB**
- Check MONGO_URI in .env
- Verify MongoDB Atlas IP whitelist
- Ensure cluster is active

**401 Unauthorized**
- Token missing or expired
- Check Authorization header format: `Bearer <token>`
- Clear localStorage and re-login

**CORS errors**
- Update CORS origin in server.ts
- Ensure both frontend and backend are running
- Check browser console for exact error
