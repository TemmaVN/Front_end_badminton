import {User, LogOut, Filter, Menu, Plus, Search, Sun, Moon, Bell, Settings, ChevronDown} from 'lucide-react'
import React, {useEffect, useRef, useState} from 'react'
import {useAuth} from  "../../contexts/AuthContext"
import {useNavigate, Link} from "react-router-dom"
import {useMediaQuery} from '../../mystate/useMediaQuery';
import {useTheme} from '../../contexts/ThemeContext';


const Header = ({onToggleSidebar}) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const dropdownRef = useRef(null);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const fullName = user?.fullName ?? '';
    const isMedium = useMediaQuery('(min-width: 1280px)');
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsProfileOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        const result = await logout();
        if (result.success) {
            alert("Đăng xuất thành công");
            navigate('/');
        } else {
            alert(result.message);
        }
      };
  return (
    <div className='bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b
    border-slate-200/50 dark:border-slate-700/50 px-6 py-4 z-50'>
        <div className=' flex items-center justify-between'>
            {/*Bên trái*/}
            <div className='flex items-center space-x-4'>
                <button 
                className='p-2 rounded-lg text-slate-600 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                onClick={onToggleSidebar}
                >
                    <Menu className='w-5 h-5'/>
                </button>

                <div className='hidden md:block'>
                    <h1 className='text-2xl font-black text-slate-800 dark:text-white'>Tổng quan</h1>
                    <p>Chào mừng trở lại, Quản trị viên!</p>
                </div>
            </div>
            {/*Center*/}
            {isMedium && (
              <div className='flex-1 max-w-md mx-8'>
                <div className='relative'>
                    <Search className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400'/>
                    <input 
                    type="text" 
                    placeholder="Tìm kiếm..."
                    className='w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border
                    border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white
                    placeholder:slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    />
                    <button className='absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600
                     dark:hover:text-slate-300'>
                        <Filter/>
                    </button>
                </div>
            </div>
            )}
            {/*Right side*/}
            <div className='flex items-center space-x-3'>
                {/*Thao tác nhanh*/}
                <button className='hidden lg:flex items-center space-x-2 py-2 px-4
                bg-linear-to-r from-orange-default to-orange-dark text-white rounded-xl hover:shadow
                transition-all'>
                    <Plus className='w-4 h-4'/>
                    <span className='text-sm font-medium'>Tạo mới</span>
                </button>
                {/*Toggle*/}
                <button
                    onClick={toggleTheme}
                    className='p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100
                 dark:hover:bg-slate-800 transition-colors'
                    title={isDark ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
                >
                    {isDark ? <Sun className='w-5 h-5'/> : <Moon className='w-5 h-5'/>}
                </button>
                {/*Thông báo*/}
                <button className='relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100
                 dark:hover:bg-slate-800 transition-colors'>
                    <Bell className='w-5 h-5'/>
                    <span className='absolute -top-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full
                    flex items-center justify-center'>3</span>
                </button>
                {/*Cài đặt*/}
                <button className='p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100
                 dark:hover:bg-slate-800 transition-colors'>
                    <Settings className='w-5 h-5'/>
                </button>
                {/*Hồ sơ người dùng*/}
          <div className='relative' ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className='flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-800/50 hover:opacity-80 transition-all'
            >
              <img
                src="https://i.pravatar.cc/300"
                alt="Ảnh đại diện"
                className='w-8 h-8 rounded-full ring-2 ring-orange-default'
              />
              <div className='hidden md:block text-left'>
                <p className='text-sm font-medium text-slate-800 dark:text-white leading-tight'>{fullName}</p>
                <p className='text-[10px] text-slate-500 dark:text-slate-400'>Quản trị viên</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className='absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200'>
                <button className='w-full flex items-center space-x-3 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'>
                  <User className='w-4 h-4 text-orange-default' />
                  <span>Thông tin tài khoản</span>
                </button>
                <div className='border-t border-slate-100 dark:border-slate-800 my-1'></div>
                <button 
                className='w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors'
                onClick={handleLogout}
                >
                  <LogOut className='w-4 h-4' />
                  <span className='font-medium'>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
            </div>
        </div>
    </div>
  )
}

export default Header