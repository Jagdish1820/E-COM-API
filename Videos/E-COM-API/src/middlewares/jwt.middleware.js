import jwt from 'jsonwebtoken';

export default function jwtAuth(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).send('Access denied. No token provided.');
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, 'AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz'); // Use your secret key
    console.log('Decoded JWT:', decoded);  // Log the decoded token for debugging
    req.user = decoded;  // Attach decoded token (including role) to req.user
    next();
  } catch (ex) {
    console.log('Token verification failed:', ex);  // Log the error
    return res.status(400).send('Invalid token.');
  }
}
