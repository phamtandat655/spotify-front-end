import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineMenu, HiOutlinePhotograph, HiOutlineUser, HiOutlineMusicNote, HiOutlinePlus, HiLogin } from 'react-icons/hi';
import { RiCloseLine } from 'react-icons/ri';

import { logo } from '../assets';

const getLinks = () => {
  const userRole = localStorage.getItem('userRole');
  const baseLinks = [
    { name: 'Khám phá', to: '/', icon: HiOutlineHome },
  ];

  if (userRole === 'admin') {
    return [
      ...baseLinks,
      { name: 'Album của bạn', to: '/your-album', icon: HiOutlinePhotograph },
      { name: 'Hồ sơ của bạn', to: '/profile', icon: HiOutlineUser },
      { name: 'Admin Dashboard', to: '/admin', icon: HiOutlineMusicNote },
      { name: 'Tạo Bài Hát', to: '/admin/create-track', icon: HiOutlinePlus },
    ];
  } else if (userRole === 'user') {
    return [
      ...baseLinks,
      { name: 'Album của bạn', to: '/your-album', icon: HiOutlinePhotograph },
      { name: 'Hồ sơ của bạn', to: '/profile', icon: HiOutlineUser },
    ];
  }

  return [
    ...baseLinks,
    { name: 'Đăng nhập', to: '/login', icon: HiLogin },
  ];
};

const NavLinks = ({ handleClick }) => (
  <div className="mt-10">
    {getLinks().map((item) => (
      <NavLink
        key={item.name}
        to={item.to}
        end
        className={({ isActive }) =>
          `flex flex-row justify-start items-center my-8 text-sm font-medium ${
            isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-300'
          }`
        }
        onClick={() => handleClick && handleClick()}
      >
        <item.icon className="w-6 h-6 mr-2" />
        {item.name}
      </NavLink>
    ))}
  </div>
);

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="md:flex hidden flex-col w-[240px] py-10 px-4 bg-[#191414]">
        <img src={logo} alt="logo" className="w-full h-14 object-contain" />
        <NavLinks />
      </div>

      {/* Mobile Menu Toggle */}
      <div className="absolute md:hidden block top-6 right-3">
        {!mobileMenuOpen ? (
          <HiOutlineMenu
            className="w-6 h-6 mr-2 text-white"
            onClick={() => setMobileMenuOpen(true)}
          />
        ) : (
          <RiCloseLine
            className="w-6 h-6 mr-2 text-white"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`absolute top-0 h-screen w-2/3 bg-gradient-to-tl from-white/10 to-[#191414] backdrop-blur-lg z-10 p-6 md:hidden smooth-transition ${
          mobileMenuOpen ? 'left-0' : '-left-full'
        }`}
      >
        <img src={logo} alt="logo" className="w-full h-14 object-contain" />
        <NavLinks handleClick={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
};

export default Sidebar;