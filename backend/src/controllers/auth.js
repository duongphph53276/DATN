// controllers/auth.js
import { UserModel } from "../models/User/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RoleModel } from "../models/User/role.js";
import { sendVerificationEmail } from "../services/emailService.js";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email }).populate("role_id");

    // 1. Kiểm tra tồn tại và mật khẩu
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Tài khoản hoặc mật khẩu không đúng" });
    }

    // 2. Kiểm tra xác thực email
    // Nếu không phải admin mà chưa xác thực => chặn
    const isAdmin = user.role_id?.name === "admin";
    if (!isAdmin && !user.isVerified) {
      return res
        .status(403)
        .json({
          message: "Vui lòng xác thực email trước khi đăng nhập",
          status: false,
        });
    }

    // 3. Gán token và trả về
    const role = user.role_id ? user.role_id.name : "client";
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user: { role, id: user._id }, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let clientRole = await RoleModel.findOne({ name: "client" });
    if (!clientRole) {
      clientRole = new RoleModel({
        name: "client",
        description: "Default client role",
      });
      await clientRole.save();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      role_id: clientRole._id,
      isVerified: false,
    });
    await user.save();

    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    await sendVerificationEmail(email, verificationToken);

    res.status(201).send({
      message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực.",
      status: true,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Email đã tồn tại", status: false });
    } else {
      res.status(500).json({ message: error.message, status: false });
    }
  }
};

export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Tìm hoặc tạo role admin
    let adminRole = await RoleModel.findOne({ name: "admin" });
    if (!adminRole) {
      adminRole = new RoleModel({
        name: "admin",
        description: "Administrator role",
      });
      await adminRole.save();
    }

    // Bỏ qua kiểm tra admin đã tồn tại - cho phép tạo nhiều admin
    // const existingAdmin = await UserModel.findOne({ role_id: adminRole._id });
    // if (existingAdmin) {
    //   return res.status(400).json({ 
    //     message: "Hệ thống đã có admin. Không thể tạo thêm admin mới.", 
    //     status: false 
    //   });
    // }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      role_id: adminRole._id,
      isVerified: true, // Admin được xác thực ngay
      status: "active"
    });
    await user.save();

    res.status(201).send({
      message: "Tạo tài khoản admin thành công.",
      status: true,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Email đã tồn tại", status: false });
    } else {
      res.status(500).json({ message: error.message, status: false });
    }
  }
};

export const checkEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await UserModel.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.redirect(`http://localhost:5173/verify-email?error=missing_token`);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.redirect(`http://localhost:5173/verify-email?error=user_not_found`);
    }

    if (user.isVerified) {
      return res.redirect(`http://localhost:5173/verify-email?success=already_verified`);
    }

    user.isVerified = true;

    // Nếu user đang bị block do chưa xác thực, thì mở khóa luôn
    if (user.status === "block" && !user.banReason) {
      user.status = "active";
    }

    await user.save();

    // Redirect về frontend với thông báo thành công
    return res.redirect(`http://localhost:5173/verify-email?success=verified`);

  } catch (error) {
    console.error("Verify email error:", error);
    return res.redirect(`http://localhost:5173/verify-email?error=invalid_token`);
  }
};

export const Profile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user)
      return res
        .status(404)
        .send({ message: "Người dùng không tồn tại", status: false });

    res
      .status(200)
      .send({ message: "Lấy thông tin hồ sơ thành công", status: true, user });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Lấy thông tin hồ sơ thất bại", status: false });
  }
};

export const UpdateProfile = async (req, res) => {
  try {
    const { name, phoneNumber, avatar } = req.body;
    const userId = req.user.id;

    const user = await UserModel.findById(userId);
    if (!user)
      return res
        .status(404)
        .send({ message: "Người dùng không tồn tại", status: false });

    if (name) user.name = name;
    if (phoneNumber) user.phone = phoneNumber;
    if (avatar) user.avatar = avatar;

    await user.save();
    const updatedUser = await UserModel.findById(userId).select("-password");

    res
      .status(200)
      .send({
        message: "Cập nhật hồ sơ thành công",
        status: true,
        user: updatedUser,
      });
  } catch (error) {
    res.status(500).send({ message: "Cập nhật hồ sơ thất bại", status: false });
  }
};
