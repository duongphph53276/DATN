import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send({ message: "Không có token, truy cập bị từ chối", status: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Gắn thông tin từ token vào req.user
    next();
  } catch (error) {
    res.status(401).send({ message: "Xác thực thất bại", status: false });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ message: "Bạn không có quyền truy cập", status: false });
    }
    next();
  };
};
