import SystemConfig from '../models/systemConfig.js';

// Get system configuration
const getSystemConfig = async (req, res) => {
  try {
    const config = await SystemConfig.getConfig();
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error getting system config:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy cấu hình hệ thống'
    });
  }
};

// Update system configuration
const updateSystemConfig = async (req, res) => {
  try {
    const { banners, maxBanners, autoSlideInterval, logo, favicon } = req.body;
    
    let config = await SystemConfig.getConfig();
    
    // Update fields if provided
    if (banners !== undefined) config.banners = banners;
    if (maxBanners !== undefined) config.maxBanners = maxBanners;
    if (autoSlideInterval !== undefined) config.autoSlideInterval = autoSlideInterval;
    if (logo !== undefined) config.logo = logo;
    if (favicon !== undefined) config.favicon = favicon;
    
    // Force maxBanners to be 10
    config.maxBanners = 10;
    
    await config.save();
    
    res.json({
      success: true,
      message: 'Cập nhật cấu hình thành công',
      data: config
    });
  } catch (error) {
    console.error('Error updating system config:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật cấu hình hệ thống'
    });
  }
};



// Add banner
const addBanner = async (req, res) => {
  try {
    const { title, image, bgGradient } = req.body;
    
    let config = await SystemConfig.getConfig();
    
    // Check if max banners reached
    if (config.banners.length >= config.maxBanners) {
      return res.status(400).json({
        success: false,
        message: `Đã đạt giới hạn tối đa ${config.maxBanners} banner`
      });
    }

    const newBanner = {
      id: Date.now().toString(),
      title: title || `Banner ${config.banners.length + 1}`,
      image,
      bgGradient: bgGradient || 'bg-gradient-to-r from-purple-200 via-pink-200 to-purple-50',
      isActive: true
    };

    config.banners.push(newBanner);
    await config.save();
    
    res.json({
      success: true,
      message: 'Thêm banner thành công',
      data: newBanner
    });
  } catch (error) {
    console.error('Error adding banner:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm banner'
    });
  }
};

// Update banner
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, bgGradient, isActive } = req.body;
    
    let config = await SystemConfig.getConfig();
    
    const bannerIndex = config.banners.findIndex(banner => banner.id === id);
    if (bannerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy banner'
      });
    }

    // Update banner fields
    if (title !== undefined) config.banners[bannerIndex].title = title;
    if (image !== undefined) config.banners[bannerIndex].image = image;
    if (bgGradient !== undefined) config.banners[bannerIndex].bgGradient = bgGradient;
    if (isActive !== undefined) config.banners[bannerIndex].isActive = isActive;
    
    await config.save();
    
    res.json({
      success: true,
      message: 'Cập nhật banner thành công',
      data: config.banners[bannerIndex]
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật banner'
    });
  }
};

// Delete banner
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    
    let config = await SystemConfig.getConfig();
    
    const bannerIndex = config.banners.findIndex(banner => banner.id === id);
    if (bannerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy banner'
      });
    }

    config.banners.splice(bannerIndex, 1);
    await config.save();
    
    res.json({
      success: true,
      message: 'Xóa banner thành công'
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa banner'
    });
  }
};

// Reorder banners
const reorderBanners = async (req, res) => {
  try {
    const { bannerIds } = req.body; // Array of banner IDs in new order
    
    if (!Array.isArray(bannerIds)) {
      return res.status(400).json({
        success: false,
        message: 'bannerIds phải là một mảng'
      });
    }
    
    let config = await SystemConfig.getConfig();
    
    // Create new banners array with reordered items
    const reorderedBanners = [];
    for (const id of bannerIds) {
      const banner = config.banners.find(b => b.id === id);
      if (banner) {
        reorderedBanners.push(banner);
      }
    }
    
    // Update config with reordered banners
    config.banners = reorderedBanners;
    await config.save();
    
    res.json({
      success: true,
      message: 'Sắp xếp lại banner thành công',
      data: config.banners
    });
  } catch (error) {
    console.error('Error reordering banners:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi sắp xếp lại banner'
    });
  }
};



export {
  getSystemConfig,
  updateSystemConfig,
  addBanner,
  updateBanner,
  deleteBanner,
  reorderBanners
};
