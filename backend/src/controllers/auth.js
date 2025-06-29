import { UserModel } from '../models/User/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { RoleModel } from '../models/User/role.js'; // Import RoleModel

dotenv.config();

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email }).populate('role_id');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const role = user.role_id ? user.role_id.name : 'client';
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body; // Thêm name
  console.log('Received data:', { name, email, password }); // Log để kiểm tra
  try {
    // Tìm hoặc tạo role "client" mặc định
    let clientRole = await RoleModel.findOne({ name: 'client' });
    if (!clientRole) {
      clientRole = new RoleModel({ name: 'client', description: 'Default client role' });
      await clientRole.save();
      console.log('Created default client role:', clientRole._id);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashedPassword, role_id: clientRole._id }); // Thêm name
    await user.save();

    // Populate role_id để lấy thông tin role
    const savedUser = await UserModel.findById(user._id).populate('role_id');
    if (!savedUser || !savedUser.role_id) {
      return res.status(500).json({ message: 'Failed to populate role information' });
    }

    const userResponse = {
      name: savedUser.name || '', // Đảm bảo trả về chuỗi trống nếu không có
      email: savedUser.email,
      role: savedUser.role_id.name,
      status: savedUser.status,
      _id: savedUser._id,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
      __v: savedUser.__v
    };

    const token = jwt.sign({ id: savedUser._id, role: savedUser.role_id.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).send({ message: 'Đăng ký thành công', user: userResponse, status: true, token });
  } catch (error) {
    console.error('Registration error:', error.message);
    // Kiểm tra lỗi trùng email
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email đã tồn tại' });
    } else {
      res.status(400).json({ message: error.message });
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