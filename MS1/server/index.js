const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: 'http://localhost:5174', credentials: true }));

const JWT_SECRET = '1234'; 

const generateJWT = (tenantId, empId) => {
  return jwt.sign({ tenantId, empId }, JWT_SECRET, { expiresIn: '1h' });
};

app.post('/login', (req, res) => {
  const { tenantId, empId } = req.body;

  // Dummy authentication
  if (tenantId && empId) {
    const token = generateJWT(tenantId, empId);
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: 'Lax',
      maxAge: 3600000, // 1 hour
    });
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.listen(4000, () => {
  console.log('Login microservice running on port 4000');
});
