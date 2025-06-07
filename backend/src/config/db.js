import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/FuzzyBear');
    console.log('Kết nối DB thành công');
  } catch (error) {
    console.error('Kết nối DB thất bại:', error);
    process.exit(1);
  }
};

export default connectDB;