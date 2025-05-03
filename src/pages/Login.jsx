import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginUserMutation, useGetUserProfileQuery } from '../redux/services/spotifyApi';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const { refetch: refetchUserProfile } = useGetUserProfileQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!username.trim()) newErrors.username = 'Tên người dùng là bắt buộc';
    if (!password.trim()) newErrors.password = 'Mật khẩu là bắt buộc';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await loginUser({ username, password }).unwrap();
        const userProfile = await refetchUserProfile().unwrap();
        localStorage.setItem('userId', userProfile.id || 'unknown');
        navigate('/profile');
      } catch (err) {
        setErrors({ submit: err.data?.error || 'Sai tên người dùng hoặc mật khẩu' });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-[#121212] rounded-lg shadow-lg text-white mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">Đăng Nhập</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        {errors.submit && (
          <p className="text-[#ef4444] text-sm">{errors.submit}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-[#1db954] text-white rounded-lg hover:bg-[#1ed760] disabled:bg-[#a3a3a3] disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
        </button>
      </form>
      <p className="mt-4 text-center text-[#b3b3b3]">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-[#1db954] hover:underline">
          Đăng Ký
        </Link>
      </p>
    </div>
  );
};

export default Login;