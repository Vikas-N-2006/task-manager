export const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ 
      error: "Unauthorized access. Please provide valid credentials." 
    });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  // Hardcoded credentials as per requirements
  if (username === 'admin' && password === 'password123') {
    next();
  } else {
    return res.status(401).json({ 
      error: "Unauthorized access. Please provide valid credentials." 
    });
  }
};