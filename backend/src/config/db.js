import mongoose from 'mongoose';

const connectDB = async () => {
  try {
  await mongoose.connect(process.env.MONGOS_GOOGLE_CLOUD_URI, {
    // family: 4
});    console.log('Kết nối DB thành công');
  } catch (error) {
    console.error('Kết nối DB thất bại:', error);
    process.exit(1);
  }
};

export default connectDB;