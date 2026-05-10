import React, { use, useEffect, useState } from 'react'
import { ArrowLeft, ClosedCaption, Heart, LogOut, Menu, MenuIcon, Package, Search, ShoppingCart, User, User2 } from 'lucide-react'
import Button from '../components/Button'
import {useMediaQuery} from '../mystate/useMediaQuery'
import MenuHeader from './MenuHeader'
import { Link } from 'react-router-dom'
import { FaUserCircle } from 'react-icons/fa'
import {useAuth} from  "../contexts/AuthContext"
import {useNavigate} from "react-router-dom"
import CartDrawer from './CartDrawer'
import { useCart } from '../contexts/CartContext'
import { GrOrderedList } from 'react-icons/gr'

const PageHeader = () => {
  const [isFocus, setIsFocus] = useState(false);
  const [showFullWidthSearch, setShowFullWidthSearch] = useState(false);
  const [showMenuBar, setShowMenuBar] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false)

  const isHideMainHeader = useMediaQuery('(min-width: 1250px)');
  const isPageMedium = useMediaQuery('(min-width: 768px)');
  const isChangeFindButton = useMediaQuery('(min-width: 1500)');
  const isShowFullWidthSearch = !isPageMedium && showFullWidthSearch;

  const {isAuthenticated, logout} = useAuth();
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const {cart, totalItems, addToCart, fetchCart,updateCartItem, setCart ,deleteCartItem, clearCartState} = useCart()
  const handleLogout = async (e) => {
    e.preventDefault();
    setError('')
    setLoading(true);
    
    const result = await logout();
    
    if (result.success) {
      alert("Đăng xuất thành công");
      navigate('/');
    } else {
      setError(result.message);
      alert(message);
    }
  };


  return (
    <div className='flex flex-col relative'>
      <div className='flex gap-10 justify-center lg:gap-20 pt-4 pb-6 px-4 z-120 bg-white'>
        {!isHideMainHeader && <Button size='icon' onClick={() => setShowMenuBar(!showMenuBar)}>{showMenuBar? "Close":<MenuIcon/>}</Button>}
        {!isShowFullWidthSearch && 
        <div>
          <a href="">
            <img src="https://static.fbshop.vn/wp-content/uploads/2026/01/cropped-logo-4.webp" alt="" className='w-12 h-12'/>
          </a>
        </div>}
        {isShowFullWidthSearch &&
          <Button size='icon' onClick={() => {setShowFullWidthSearch(false)}}>
            <ArrowLeft/>
          </Button>}
        <form 
        action="" 
        className={`bg-gray-bg rounded-[10px] grow max-w-225 items-center ${isShowFullWidthSearch? 'flex': 'md:flex hidden'} ${isFocus? 'border border-orange-default shadow-inner': ''}`}>  
          <Button variant='ghost' size='icon' className=''><Search/></Button>
          <input 
          type="search" 
          placeholder='Search...'
          className='py-1 px-4 text-lg outline-none text-gray-text flex-1'
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          />
          <Button variant='find' size='find'>
            {!isShowFullWidthSearch? 'Tìm kiếm': <Search/>}
          </Button>
        </form>
        {!isShowFullWidthSearch && 
        <div className='flex gap-2'>
          <Button size='icon' className='md:hidden' onClick={() => {setShowFullWidthSearch(true)}}>
            <Search/>
          </Button>

          <Link 
            to={isAuthenticated ? "/user-info" : "/login"}           >
            <Button size='icon'>
              {isAuthenticated? <img src="https://static.fbshop.vn/template/assets/images/im-des.png" className='rounded-full'/>:<User2/>}
            </Button>
          </Link>
          {isAuthenticated &&
          <Button 
            size='icon'
            onClick={() => setShowCartDrawer(true)}
            className="relative">
              <ShoppingCart />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
          </Button>
          }
          {isAuthenticated && <Button size='icon'>
            <Link 
              to="/login"
              onClick={handleLogout}
            ><LogOut/></Link>
          </Button>}
        </div>}
    </div>
    {!isHideMainHeader && showMenuBar && (
  <div className='absolute top-full left-0 z-100 bg-white w-max-200 shadow-lg border'>
    <MenuHeader 
    isOpen={showMenuBar}
    setIsOpen={setShowMenuBar}
    />
  </div>
)}
        {showCartDrawer && (
          <div className='absolute top-0 left-0 z-150 bg-white w-max-200 shadow-lg border'>
            <CartDrawer 
            isOpen={showCartDrawer}
            setIsOpen={setShowCartDrawer}
            />
          </div>
        )}
      </div>
  );
}

export default PageHeader