import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Save, Image, Settings, Monitor, Plus, Edit3, Eye, EyeOff, Palette, Globe, GripVertical } from 'lucide-react';
import { ToastSucess, ToastError, ToastWarning } from '../../utils/toast';
import { 
  getSystemConfig, 
  updateSystemConfig, 
  addBanner, 
  updateBanner, 
  deleteBanner as deleteBannerAPI,
  reorderBanners,
  type SystemConfig,
  type Banner 
} from '../../services/api/systemConfig';
import { uploadToCloudinary } from '../../lib/cloudinary';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Banner Item Component
interface SortableBannerItemProps {
  banner: Banner;
  index: number;
  onToggleActive: (index: number) => void;
  onDelete: (index: number) => void;
  onUpdateTitle: (index: number, title: string) => void;
  onUploadImage: (file: File, index: number) => void;
}

const SortableBannerItem: React.FC<SortableBannerItemProps> = ({
  banner,
  index,
  onToggleActive,
  onDelete,
  onUpdateTitle,
  onUploadImage
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative mb-4">
        <img
          src={banner.image}
          alt={banner.title}
          className="w-full h-40 object-cover rounded-xl shadow-md"
        />
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onToggleActive(index)}
            className={`p-2 rounded-xl shadow-lg transition-all duration-200 ${
              banner.isActive 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-500 hover:bg-gray-600 text-white'
            }`}
            title={banner.isActive ? 'Đang hoạt động' : 'Đã tắt'}
          >
            {banner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(index)}
            className="p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all duration-200"
            title="Xóa banner"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        {banner.isActive && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
              Active
            </span>
          </div>
        )}
        {/* Drag Handle */}
        <div className="absolute top-3 left-12">
          <button
            {...attributes}
            {...listeners}
            className="p-2 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing"
            title="Kéo để sắp xếp"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={banner.title}
            onChange={(e) => onUpdateTitle(index, e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Tên banner..."
          />
        </div>
        
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadImage(file, index);
            }}
            className="block w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};

const SystemSettings: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>({
    banners: [],
    maxBanners: 10,
    autoSlideInterval: 5,
    logo: '',
    favicon: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load config from API on component mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const data = await getSystemConfig();
        setConfig(data);
      } catch (error) {
        console.error('Error loading system config:', error);
        ToastError('Lỗi khi tải cấu hình hệ thống');
      } finally {
        setLoading(false);
      }
    };
    
    loadConfig();
  }, []);

  const handleBannerUpload = async (file: File, index?: number) => {
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      ToastError('Chỉ chấp nhận file hình ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      ToastError('File quá lớn. Tối đa 5MB');
      return;
    }

    setUploading(true);
    try {
      // Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      
      if (index !== undefined) {
        // Update existing banner
        const updatedBanner = await updateBanner(config.banners[index].id, {
          image: imageUrl
        });
        
        const updatedBanners = [...config.banners];
        updatedBanners[index] = updatedBanner;
        setConfig(prevConfig => ({ ...prevConfig, banners: updatedBanners }));
      } else {
        // Add new banner
        if (config.banners.length >= config.maxBanners) {
          ToastError(`Đã đạt giới hạn tối đa ${config.maxBanners} banner. Vui lòng xóa banner cũ để thêm banner mới.`);
          setUploading(false);
          return;
        }

        const newBanner = await addBanner({
          title: `Banner ${config.banners.length + 1}`,
          image: imageUrl,
          bgGradient: 'bg-gradient-to-r from-purple-200 via-pink-200 to-purple-50',
          isActive: true
        });

        setConfig(prevConfig => ({
          ...prevConfig,
          banners: [...prevConfig.banners, newBanner]
        }));
      }
      ToastSucess('Upload banner thành công');
    } catch (error) {
      console.error('Error uploading banner:', error);
      ToastError('Upload thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      ToastError('Chỉ chấp nhận file hình ảnh');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      ToastError('File quá lớn. Tối đa 2MB');
      return;
    }

    setUploading(true);
    try {
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      const updatedConfig = await updateSystemConfig({ logo: imageUrl });
      setConfig(updatedConfig);
      
      // Force update logo in header by dispatching custom event
      window.dispatchEvent(new CustomEvent('logoUpdated', { detail: imageUrl }));
      
      ToastSucess('Upload logo thành công');
    } catch (error) {
      console.error('Error uploading logo:', error);
      ToastError('Upload thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleFaviconUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      ToastError('Chỉ chấp nhận file hình ảnh');
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      ToastError('File quá lớn. Tối đa 1MB');
      return;
    }

    setUploading(true);
    try {
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      const updatedConfig = await updateSystemConfig({ favicon: imageUrl });
      setConfig(updatedConfig);
      
      // Force update favicon immediately
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = imageUrl;
      
      let shortcutIcon = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
      if (!shortcutIcon) {
        shortcutIcon = document.createElement('link');
        shortcutIcon.rel = 'shortcut icon';
        document.head.appendChild(shortcutIcon);
      }
      shortcutIcon.href = imageUrl;
      
      ToastSucess('Upload favicon thành công');
    } catch (error) {
      console.error('Error uploading favicon:', error);
      ToastError('Upload thất bại');
    } finally {
      setUploading(false);
    }
  };

  const deleteBanner = async (index: number) => {
    try {
      const banner = config.banners[index];
      await deleteBannerAPI(banner.id);
      
      const updatedBanners = config.banners.filter((_, i) => i !== index);
      setConfig({ ...config, banners: updatedBanners });
      ToastSucess('Xóa banner thành công');
    } catch (error) {
      console.error('Error deleting banner:', error);
      ToastError('Xóa banner thất bại');
    }
  };

  const toggleBannerActive = async (index: number) => {
    try {
      const banner = config.banners[index];
      const updatedBanner = await updateBanner(banner.id, {
        isActive: !banner.isActive
      });
      
      const updatedBanners = [...config.banners];
      updatedBanners[index] = updatedBanner;
      setConfig({ ...config, banners: updatedBanners });
    } catch (error) {
      console.error('Error toggling banner:', error);
      ToastError('Cập nhật trạng thái banner thất bại');
    }
  };

  const updateBannerTitle = async (index: number, title: string) => {
    try {
      const banner = config.banners[index];
      const updatedBanner = await updateBanner(banner.id, { title });
      
      const updatedBanners = [...config.banners];
      updatedBanners[index] = updatedBanner;
      setConfig({ ...config, banners: updatedBanners });
    } catch (error) {
      console.error('Error updating banner title:', error);
      ToastError('Cập nhật tiêu đề banner thất bại');
    }
  };

  const saveConfig = async () => {
    setLoading(true);
    try {
      await updateSystemConfig({
        maxBanners: 10, // Cố định 10 banner
        autoSlideInterval: config.autoSlideInterval
      });
      
      ToastSucess('Lưu cấu hình thành công');
    } catch (error) {
      console.error('Error saving config:', error);
      ToastError('Lưu cấu hình thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = config.banners.findIndex(banner => banner.id === active.id);
      const newIndex = config.banners.findIndex(banner => banner.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBanners = arrayMove(config.banners, oldIndex, newIndex);
        
        // Update local state immediately for smooth UX
        setConfig(prev => ({ ...prev, banners: newBanners }));
        
        try {
          // Send reorder request to backend
          const bannerIds = newBanners.map(banner => banner.id);
          await reorderBanners(bannerIds);
          ToastSucess('Sắp xếp lại banner thành công');
        } catch (error) {
          console.error('Error reordering banners:', error);
          ToastError('Sắp xếp lại banner thất bại');
          // Revert to original order on error
          const originalConfig = await getSystemConfig();
          setConfig(originalConfig);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Đang tải cấu hình hệ thống...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Cài đặt hệ thống
                  </h1>
                  <p className="text-gray-600 mt-1">Quản lý cấu hình banner, logo và favicon</p>
                </div>
              </div>
            </div>
            <button
              onClick={saveConfig}
              disabled={loading}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
            >
              <Save className="w-5 h-5 group-hover:animate-pulse" />
              {loading ? 'Đang lưu...' : 'Lưu cấu hình'}
            </button>
          </div>
        </div>

        {/* Banner Management */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Image className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Quản lý Banner</h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
              <span className="text-sm font-semibold text-purple-700">
                {config.banners.length}/{config.maxBanners}
              </span>
              <span className="text-sm text-purple-600">banner</span>
            </div>
          </div>

          {/* Banner Upload */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Thêm banner mới
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleBannerUpload(file);
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:text-white hover:file:from-purple-600 hover:file:to-pink-600 transition-all duration-200 cursor-pointer"
                />
              </div>
              {uploading && (
                <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-xl">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-blue-700 font-medium">Đang upload...</span>
                </div>
              )}
            </div>
          </div>

          {/* Banner List */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={config.banners.map(banner => banner.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {config.banners.length > 0 ? (
                  config.banners.map((banner, index) => (
                    <SortableBannerItem
                      key={banner.id}
                      banner={banner}
                      index={index}
                      onToggleActive={toggleBannerActive}
                      onDelete={deleteBanner}
                      onUpdateTitle={updateBannerTitle}
                      onUploadImage={handleBannerUpload}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="p-6 bg-white rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                      <Image className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Chưa có banner nào</h3>
                    <p className="text-gray-500 mb-4">Hãy thêm banner đầu tiên để bắt đầu</p>
                    <div className="flex items-center justify-center gap-2 text-purple-600">
                      <Plus className="w-5 h-5" />
                      <span className="font-medium">Thêm banner mới</span>
                    </div>
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* System Settings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Cài đặt chung</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Max Banners - Fixed */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Số lượng banner tối đa
              </label>
              <div className="relative">
                <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-medium flex items-center justify-between">
                  <span>10 banner</span>
                  <div className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">Cố định</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto Slide Interval */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Thời gian tự động chuyển (giây)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={config.autoSlideInterval}
                  onChange={(e) => setConfig({ ...config, autoSlideInterval: parseInt(e.target.value) })}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Monitor className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo & Favicon */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Logo & Favicon</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Logo */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Logo website
              </label>
              <div className="space-y-4">
                {config.logo ? (
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <img
                        src={config.logo}
                        alt="Logo"
                        className="w-40 h-20 object-contain border border-gray-200 rounded-xl"
                      />
                                           <button
                       onClick={async () => {
                         setConfig({ ...config, logo: '' });
                         await updateSystemConfig({ logo: '' });
                         
                         // Force update logo in header by dispatching custom event
                         window.dispatchEvent(new CustomEvent('logoUpdated', { detail: '' }));
                       }}
                       className="px-4 py-2 text-red-600 hover:text-red-700 text-sm font-medium hover:bg-red-50 rounded-lg transition-all duration-200"
                     >
                       Xóa logo
                     </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Chưa có logo</p>
                  </div>
                )}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-orange-500 file:to-red-500 file:text-white hover:file:from-orange-600 hover:file:to-red-600 transition-all duration-200 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Favicon */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Favicon
              </label>
              <div className="space-y-4">
                {config.favicon ? (
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <img
                        src={config.favicon}
                        alt="Favicon"
                        className="w-20 h-20 object-contain border border-gray-200 rounded-xl"
                      />
                                           <button
                       onClick={async () => {
                         setConfig({ ...config, favicon: '' });
                         await updateSystemConfig({ favicon: '' });
                         
                         // Reset to default favicon
                         let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
                         if (!favicon) {
                           favicon = document.createElement('link');
                           favicon.rel = 'icon';
                           document.head.appendChild(favicon);
                         }
                         favicon.href = '/logo.png';
                         
                         let shortcutIcon = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
                         if (!shortcutIcon) {
                           shortcutIcon = document.createElement('link');
                           shortcutIcon.rel = 'shortcut icon';
                           document.head.appendChild(shortcutIcon);
                         }
                         shortcutIcon.href = '/logo.png';
                       }}
                       className="px-4 py-2 text-red-600 hover:text-red-700 text-sm font-medium hover:bg-red-50 rounded-lg transition-all duration-200"
                     >
                       Xóa favicon
                     </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Chưa có favicon</p>
                  </div>
                )}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFaviconUpload(file);
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-orange-500 file:to-red-500 file:text-white hover:file:from-orange-600 hover:file:to-red-600 transition-all duration-200 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
