// File path: /src/components/LoginForm.jsx

import { LoginForm } from "../../features/common/auth/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-500">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-8 text-center">Đăng nhập</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
