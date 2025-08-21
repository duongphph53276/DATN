import { useEffect } from 'react';
import { getSystemConfig } from '../services/api/systemConfig';

export const useFavicon = () => {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        const config = await getSystemConfig();
        if (config.favicon) {
          // Update favicon
          let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
          if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
          }
          favicon.href = config.favicon;
          
          // Update shortcut icon
          let shortcutIcon = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
          if (!shortcutIcon) {
            shortcutIcon = document.createElement('link');
            shortcutIcon.rel = 'shortcut icon';
            document.head.appendChild(shortcutIcon);
          }
          shortcutIcon.href = config.favicon;
        } else {
          // Use default favicon if no custom favicon is set
          const defaultFavicon = '/logo.png';
          let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
          if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
          }
          favicon.href = defaultFavicon;
          
          let shortcutIcon = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
          if (!shortcutIcon) {
            shortcutIcon = document.createElement('link');
            shortcutIcon.rel = 'shortcut icon';
            document.head.appendChild(shortcutIcon);
          }
          shortcutIcon.href = defaultFavicon;
        }
      } catch (error) {
        console.error('Error updating favicon:', error);
        // Fallback to default favicon
        const defaultFavicon = '/logo.png';
        let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.rel = 'icon';
          document.head.appendChild(favicon);
        }
        favicon.href = defaultFavicon;
      }
    };

    // Update favicon on mount
    updateFavicon();

    // Poll for favicon updates every 30 seconds
    const interval = setInterval(updateFavicon, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
};
