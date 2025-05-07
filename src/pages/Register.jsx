import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { spotifyApi } from '../redux/services/spotifyApi';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Tên là bắt buộc';
    if (!email.trim()) newErrors.email = 'Email là bắt buộc';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Định dạng email không hợp lệ';
    if (!username.trim()) newErrors.username = 'Tên người dùng là bắt buộc';
    if (!password.trim()) newErrors.password = 'Mật khẩu là bắt buộc';
    else if (password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (password !== password2) newErrors.password2 = 'Mật khẩu xác nhận không khớp';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const resp = await spotifyApi.registerUser({ name, email, username, password });
        if (resp.error) {
          throw resp.error;
        }
        navigate('/login');
      } catch (err) {
        const apiErrors = err.data || {};
        setErrors({
          name: apiErrors.name?.[0],
          email: apiErrors.email?.[0],
          username: apiErrors.username?.[0],
          password: apiErrors.password?.[0],
          password2: apiErrors.password2?.[0],
          submit: apiErrors.non_field_errors?.[0] || 'Đăng ký thất bại',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-[#121212] rounded-lg shadow-lg text-white mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">Đăng Ký</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-[#b3b3b3]">
            Tên
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-[#242424] border border-[#3f3f3f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954] text-white placeholder-[#b3b3b3]"
            placeholder="Nhập tên của bạn"
          />
          {errors.name && (
            <p className="text-[#ef4444] text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-[#b3b3b3]">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-[#242424] border border-[#3f3f3f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954] text-white placeholder-[#b3b3b3]"
            placeholder="Nhập email của bạn"
          />
          {errors.email && (
            <p className="text-[#ef4444] text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1 text-[#b3b3b3]">
            Tên Người Dùng
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 bg-[#242424] border border-[#3f3f3f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954] text-white placeholder-[#b3b3b3]"
            placeholder="Nhập tên người dùng"
          />
          {errors.username && (
            <p className="text-[#ef4444] text-sm mt-1">{errors.username}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-[#b3b3b3]">
            Mật Khẩu
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-[#242424] border border-[#3f3f3f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954] text-white placeholder-[#b3b3b3]"
            placeholder="Nhập mật khẩu"
          />
          {errors.password && (
            <p className="text-[#ef4444] text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <div>
          <label htmlFor="password2" className="block text-sm font-medium mb-1 text-[#b3b3b3]">
            Xác Nhận Mật Khẩu
          </label>
          <input
            type="password"
            id="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="w-full p-2 bg-[#242424] border border-[#3f3f3f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954] text-white placeholder-[#b3b3b3]"
            placeholder="Xác nhận mật khẩu"
          />
          {errors.password2 && (
            <p className="text-[#ef4444] text-sm mt-1">{errors.password2}</p>
          )}
        </div>
        {errors.submit && (
          <p className="text-[#ef4444] text-sm">{errors.submit}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-[#1db954] text-white rounded-lg hover:bg-[#1ed760] disabled:bg-[#a3a3a3] disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
        </button>
      </form>
      <p className="mt-4 text-center text-[#b3b3b3]">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-[#1db954] hover:underline">
          Đăng Nhập
        </Link>
      </p>
    </div>
  );
};

export default Register;