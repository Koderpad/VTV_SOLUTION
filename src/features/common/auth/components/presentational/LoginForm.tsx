interface LoginFormProps {
  username: string;
  password: string;
  errMsg: string;
  handleUserInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePwdInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}
export const LoginForm: React.FC<LoginFormProps> = ({
  username,
  password,
  errMsg,
  handleUserInput,
  handlePwdInput,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit}>
    <div className="mb-4">
      <label htmlFor="email" className="block text-sm font-semibold mb-2">
        Email/Số điện thoại/Tên đăng nhập
      </label>
      <input
        type="text"
        id="email"
        className="border w-full p-2 rounded"
        value={username}
        onChange={handleUserInput}
      />
    </div>
    <div className="mb-4">
      <label htmlFor="password" className="block text-sm font-semibold mb-2">
        Mật khẩu
      </label>
      <input
        type="password"
        id="password"
        className="border w-full p-2 rounded"
        value={password}
        onChange={handlePwdInput}
      />
    </div>
    {errMsg && <div>{errMsg}</div>}
    <div className="flex items-center justify-between mb-4">
      <button type="submit" className="bg-orange-400 text-white p-2 rounded">
        ĐĂNG NHẬP
      </button>
      <a href="#" className="text-xs text-blue-600">
        Quên mật khẩu?
      </a>
    </div>
    <div className="flex items-center justify-center mb-4">
      <span className="text-sm">Hoặc</span>
    </div>
    <div className="flex gap-4">
      <button className="bg-blue-800 text-white p-2 rounded w-full">
        Facebook
      </button>
      <button className="bg-red-600 text-white p-2 rounded w-full">
        Google
      </button>
    </div>
    <div className="text-center mt-4">
      <span className="text-sm">Bạn mới biết đến Shoppee?</span>
      <a href="#" className="text-blue-600 text-sm">
        {" "}
        Đăng ký
      </a>
    </div>
  </form>
);
