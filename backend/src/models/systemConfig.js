import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  bgGradient: {
    type: String,
    default: 'bg-gradient-to-r from-purple-200 via-pink-200 to-purple-50'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const systemConfigSchema = new mongoose.Schema({
  banners: {
    type: [bannerSchema],
    default: []
  },
  maxBanners: {
    type: Number,
    default: 10
  },
  autoSlideInterval: {
    type: Number,
    default: 5
  },
  logo: {
    type: String,
    default: ''
  },
  favicon: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure only one system config document exists
systemConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({
      banners: [],
      maxBanners: 10,
      autoSlideInterval: 5,
      logo: '',
      favicon: ''
    });
  }
  return config;
};

export default mongoose.model('SystemConfig', systemConfigSchema);
