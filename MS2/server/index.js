const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3001']; // Removed trailing slash

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow requests with no 'origin' (like mobile apps, Postman)
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation: Origin not allowed'), false); // Improved CORS error
    }
    return callback(null, true);
  },
  credentials: true
}));

const JWT_SECRET = '1234'; // Use an environment variable in production

const verifyJWT = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: 'No token provided. Unauthorized access.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification failed:', err);
      return res.status(403).json({ message: 'Invalid token. Access forbidden.' });
    }
    req.user = decoded; // Contains tenantId, empId
    next();
  });
};

// Dummy data
const dashboardData = [
  { tenantId: 'tenant1', empId: 'emp1', data: 'Dashboard data for emp1 in tenant1' },
  { tenantId: 'tenant2', empId: 'emp2', data: 'Dashboard data for emp2 in tenant2' }
];

app.get('/dashboard', verifyJWT, (req, res) => {
  const { tenantId, empId } = req.user;
  const userData = dashboardData.find(item => item.tenantId === tenantId && item.empId === empId);

  if (userData) {
    return res.status(200).json({ data: userData.data });
  } else {
    return res.status(404).json({ message: 'Dashboard data not found for the given user.' });
  }
});

// Catch-all route for unhandled requests
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(5000, () => {
  console.log('Dashboard microservice running on port 5000');
});
