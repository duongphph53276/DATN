// src/components/Account/Profile.tsx
import React, { useEffect, useState } from 'react';

interface User {
  name: string;
  email: string;
  phone?: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập fetch dữ liệu từ localStorage hoặc API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center py-8">Loading profile...</div>;

  if (!user) return <div className="text-center py-8">Không tìm thấy hồ sơ người dùng.</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Hồ sơ cá nhân</h2>
      <div className="space-y-4 border p-6 rounded-2xl shadow-md bg-white">
        <div>
          <strong>Tên người dùng:</strong> {user.name}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        {user.phone && (
          <div>
            <strong>Số điện thoại:</strong> {user.phone}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
