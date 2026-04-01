import React from 'react'
import { useMediaQuery } from '../mystate/useMediaQuery'
import MyInput from './MyInput';
import FlashButton from './FlashButton';

const ChangePass = () => {
  const isMini = useMediaQuery('(max-width: 768px)');
  return (
    <form className={`max-w-160 h-full p-8 gap-4 flex flex-col grow border-gray-300 ${isMini? 'border-t-2':'border-l-2'}`} action="">
        <h2 className='font-bold text-2xl pb-4'>Thay đổi mật khẩu</h2>
        <div className='gap-3 flex flex-col font-medium'>
            <label htmlFor="">Mật khẩu cũ</label>
            <MyInput size="300" type="password" placeholder='Mật khẩu cũ'/>
        </div>
        <div className='gap-3 flex flex-col font-medium'>
            <label htmlFor="">Mật khẩu mới</label>
            <MyInput size="300" type="password" placeholder='Mật khẩu mới'/>
        </div>
        <div className='gap-3 flex flex-col font-medium'>
            <label htmlFor="">Nhập lại mật khẩu mới</label>
            <MyInput size="300" type="password" placeholder='Nhập lại mật khẩu mới'/>
        </div>
        <div className='w-full flex justify-center'>
            <FlashButton itemName="Lưu thay đổi"></FlashButton>
        </div>
    </form>
  )
}

export default ChangePass