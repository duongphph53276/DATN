import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

interface NoPermissionProps {
  message?: string;
  showBackButton?: boolean;
}

const NoPermission: React.FC<NoPermissionProps> = ({ 
  message = "Bạn không có quyền truy cập trang này", 
  showBackButton = true 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <ShieldX size={64} className="text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Không có quyền truy cập
        </h2>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {showBackButton && (
          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Về Dashboard
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200"
            >
              Quay lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoPermission; 