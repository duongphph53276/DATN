import React from 'react';

export const ForgotPassword: React.FC = () => {
  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat flex justify-center items-center"
      style={{
        backgroundImage:
          'url(https://img.playbook.com/IZSaaisbuPYRUSQYBZckzA61Px-1dJx2_5pGRp3N4dk/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzRkZmUwYjQ2/LWRhNjAtNDQ2Yy1h/Y2UxLWM0ZTZkMGI3/NTdlMA)',
      }}
    >
      <div className="w-[420px] bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg text-white rounded-xl p-10">
        <form>
          <h1 className="text-3xl font-semibold text-center mb-8">Forgot Password</h1>

          <p className="text-sm text-center mb-6 text-white/80">
            Enter your email address and we’ll send you a link to reset your password.
          </p>

          <div className="relative w-full h-[50px] mb-6">
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full h-full bg-transparent border border-white/20 rounded-full text-white px-5 pr-12 outline-none placeholder-white"
            />
            <i className="bx bxs-envelope absolute right-5 top-1/2 transform -translate-y-1/2 text-xl"></i>
          </div>

          <button
            type="submit"
            className="w-full h-[45px] rounded-full bg-white text-gray-800 font-semibold shadow-md hover:bg-gray-100 transition"
          >
            Send Reset Link
          </button>

          <div className="text-center text-sm mt-6">
            <p>
              Remember your password?{' '}
              <a href="#" className="font-semibold hover:underline">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
