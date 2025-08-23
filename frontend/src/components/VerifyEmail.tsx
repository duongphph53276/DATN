import React, { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = React.useState<string | null>(null);
  const [isError, setIsError] = React.useState(false);

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      setIsError(false);
      switch (success) {
        case "verified":
          setMessage("Xác thực email thành công!");
          setTimeout(() => navigate("/login"), 3000);
          break;
        case "already_verified":
          setMessage("Email của bạn đã được xác thực trước đó.");
          setTimeout(() => navigate("/login"), 3000);
          break;
        default:
          setMessage("Xác thực email thành công!");
          setTimeout(() => navigate("/login"), 3000);
      }
    } else if (error) {
      setIsError(true);
      switch (error) {
        case "missing_token":
          setMessage("Không tìm thấy token xác thực.");
          break;
        case "user_not_found":
          setMessage("Người dùng không tồn tại.");
          break;
        case "invalid_token":
          setMessage("Token không hợp lệ hoặc đã hết hạn.");
          break;
        default:
          setMessage("Có lỗi xảy ra khi xác thực.");
      }
    } else {
      setMessage("Không tìm thấy thông tin xác thực.");
      setIsError(true);
    }
  }, [searchParams, navigate]);

  return (
    <>
      <Helmet>
        <title>Xác thực email - Gấu Bông Shop</title>
        <meta
          name="description"
          content="Xác thực email tài khoản Gấu Bông Shop"
        />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      {/* Nền xám, khối hồng 2/3 màn hình */}
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
        <div className="w-[66vw] h-[66vh] bg-pink-500 text-white rounded-3xl shadow-2xl flex">
          <div className="m-auto text-center px-6">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              {isError ? (
                <FaExclamationTriangle className="text-4xl" />
              ) : (
                <FaCheckCircle className="text-4xl" />
              )}
            </div>

            <h2 className="text-3xl font-extrabold mb-3 tracking-tight">
              {isError ? "Xác thực thất bại" : "Xác thực thành công"}
            </h2>

            {message && (
              <p className="opacity-90 mb-6 text-lg leading-relaxed">
                {message}
              </p>
            )}

            {!isError && (
              <p className="opacity-80 mb-6">
                Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...
              </p>
            )}

            <Link
              to="/login"
              className="inline-block font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity"
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