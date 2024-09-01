export function requireRole(role) {
    return (req, res, next) => {
      console.log('User Role:', req.user.role);  // Log the role for debugging
      if (req.user && req.user.role === role) {
        next();
      } else {
        console.log('Access denied. User does not have the required role.');  // Log access denial
        return res.status(403).send('Access denied.');
      }
    };
  }
  