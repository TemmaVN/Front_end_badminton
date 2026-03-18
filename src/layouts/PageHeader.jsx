import React, { useState } from 'react'
import { ArrowLeft, ClosedCaption, Heart, Menu, MenuIcon, Search, ShoppingCart, User, User2 } from 'lucide-react'
import Button from '../components/Button'
import {useMediaQuery} from '../mystate/useMediaQuery'
import { div } from 'framer-motion/client'
import MenuHeader from './MenuHeader'

const PageHeader = () => {
  const [isFocus, setIsFocus] = useState(false);
  const [showFullWidthSearch, setShowFullWidthSearch] = useState(false);
  const isPageMedium = useMediaQuery('(min-width: 768px)');
  const isChangeFindButton = useMediaQuery('(min-width: 1500)');
  const isShowFullWidthSearch = !isPageMedium && showFullWidthSearch;
  const [showMenuBar, setShowMenuBar] = useState(false);
  const isHideMainHeader = useMediaQuery('(min-width: 1250px)');

  return (
    <div className='flex flex-col relative'>
      <div className='flex gap-10 justify-center lg:gap-20 pt-4 mb-6 mx-4'>
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
        <form action="" className={`bg-gray-bg rounded-[10px] grow max-w-[900px] items-center ${isShowFullWidthSearch? 'flex': 'md:flex hidden'} ${isFocus? 'border border-orange-default shadow-inner': ''}`}>
          
          <Button variant='ghost' size='icon' className=''><Search/></Button>
          <input 
          type="search" 
          placeholder='Search...'
          className='py-1 px-4 text-lg outline-none text-gray-text flex-1'
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          />
          <Button variant='find' className='h-full px-6'>
            {!isShowFullWidthSearch? 'Tìm kiếm': <Search/>}
          </Button>
        </form>
        {!isShowFullWidthSearch && 
        <div className='flex'>
          <Button size='icon' className='md:hidden' onClick={() => {setShowFullWidthSearch(true)}}>
            <Search/>
          </Button>
          <Button size='icon'>
            <Heart/>
          </Button>
                    <Button size='icon'>
            <User2/>
          </Button>
                    <Button size='icon'>
            <ShoppingCart />
          </Button>
        </div>}
    </div>
    {!isHideMainHeader && showMenuBar && (
  <div className='absolute top-full left-0 z-[100] bg-white w-max-200 shadow-lg border'>
    <MenuHeader />
  </div>
)}
      </div>
  );
}

export default PageHeader