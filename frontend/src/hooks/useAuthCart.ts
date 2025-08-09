import { useEffect } from 'react';
import { clearAllCarts, migrateOldCart } from '../utils/cartUtils';

export const useAuthCart = () => {
  useEffect(() => {
    // Listen for storage changes (logout từ tab khác)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) {
        // Token bị xóa = logout
        clearAllCarts();
      } else if (e.key === 'user' && e.newValue) {
        // User mới login
        migrateOldCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogin = () => {
    // Migrate cart cũ khi login
    migrateOldCart();
  };

  const handleLogout = () => {
    // Clear tất cả cart khi logout
    clearAllCarts();
  };

  return {
    handleLogin,
    handleLogout
  };
};
