import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import api from '../middleware/axios';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = React.useState<string | null>(null);
  const [isError, setIsError] = React.useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setMessage('Không tìm thấy token xác thực.');
      setIsError(true);
      return;
    }

    const verify = async () => {
      try {
        const response = await api.get(`/verify-email?token=${token}`);
        setMessage(response.data.message);
        setIsError(false);
        setTimeout(() => navigate('/login'), 3000);
      } catch (err: any) {
        setMessage(err.response?.data?.message || 'Có lỗi xảy ra khi xác thực.');
        setIsError(true);
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <>
      <Helmet>
        <title>Xác thực email - Gấu Bông Shop</title>
        <meta name="description" content="Xác thực email tài khoản Gấu Bông Shop" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-8"
        style={{
          backgroundImage: `url('https://img.lovepik.com/bg/20240224/Captivating-3D-Rendered-Illustration-with-Charming-Teddy-Bears-and-Fluffy_3695349_wh300.jpg')`,
        }}
      >
        <div className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/20 text-center">
          <div className="w-16 h-16 mx-auto mb-6">
            {isError ? (
              <FaExclamationTriangle className="text-red-500 text-4xl" />
            ) : (
              <FaCheckCircle className="text-green-500 text-4xl" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isError ? 'Xác thực thất bại' : 'Xác thực thành công'}
          </h2>
          {message && <p className="text-gray-600 mb-6">{message}</p>}
          {!isError && (
            <p className="text-gray-600">
              Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...
            </p>
          )}
          <div className="mt-6">
            <Link
              to="/login"
              className="text-rose-500 hover:text-rose-600 font-semibold underline"
            >
              Đi đến đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;