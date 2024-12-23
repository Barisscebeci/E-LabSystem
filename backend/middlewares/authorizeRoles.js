const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'Erişim izni yok' });
    }
    next();
  };
};

// Tek rol desteği sağlayan authorizeRole fonksiyonu
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.rol !== requiredRole) {
      return res.status(403).json({ message: 'Erişim engellendi' });
    }
    next();
  };
};

// Her iki fonksiyonu da dışa aktar
module.exports = { authorizeRoles, authorizeRole };