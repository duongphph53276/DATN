import instance from '../../../api/instance';

export interface Banner {
  id: string;
  title: string;
  image: string;
  bgGradient: string;
  isActive: boolean;
}

export interface SystemConfig {
  banners: Banner[];
  maxBanners: number;
  autoSlideInterval: number;
  logo: string;
  favicon: string;
}



// Get system configuration
export const getSystemConfig = async (): Promise<SystemConfig> => {
  const response = await instance.get('/system-config/config');
  return response.data.data;
};

// Update system configuration
export const updateSystemConfig = async (config: Partial<SystemConfig>): Promise<SystemConfig> => {
  const response = await instance.put('/system-config/config', config);
  return response.data.data;
};



// Add banner
export const addBanner = async (banner: Omit<Banner, 'id'>): Promise<Banner> => {
  const response = await instance.post('/system-config/banners', banner);
  return response.data.data;
};

// Update banner
export const updateBanner = async (id: string, banner: Partial<Banner>): Promise<Banner> => {
  const response = await instance.put(`/system-config/banners/${id}`, banner);
  return response.data.data;
};

// Delete banner
export const deleteBanner = async (id: string): Promise<void> => {
  await instance.delete(`/system-config/banners/${id}`);
};

// Reorder banners
export const reorderBanners = async (bannerIds: string[]): Promise<Banner[]> => {
  const response = await instance.post('/system-config/banners/reorder', { bannerIds });
  return response.data.data;
};
