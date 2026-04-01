import React from 'react'
import MyInput from '../components/MyInput'
import Button from '../components/Button'
import FlashButton from '../components/FlashButton'
import { useMediaQuery } from '../mystate/useMediaQuery'
import { Link } from 'react-router-dom'


const Login = () => {
  const isShowPic = useMediaQuery("(min-width: 700px)");
  return (
    <div className='flex w-full h-auto text-black'>
      {
        isShowPic && <img src="https://static.fbshop.vn/wp-content/uploads/2023/08/plogin-img.jpg" alt="" className='w-1/2 h-auto'/>
      }
        <form action="" className='flex flex-col grow max-w-150 mx-10 md:mx-20 justify-center gap-1'>
            <label htmlFor="" className='font-bold text-4xl'>Đăng nhập</label>
            <label htmlFor="" className='pt-8'>Email</label>
            <MyInput type='text' placeHolder='Email' size='150' className=''></MyInput>
            <label htmlFor="" className='pt-8'>Mật khẩu</label>
            <MyInput type='password' placeHolder='password' size='150'></MyInput>
            <div className='w-full flex justify-end'>
              <a href="" className='text-orange-default hover:text-orange-900 pt-3'>Quên mật khẩu</a>
            </div>
            <div className='w-full flex justify-center'>
              <FlashButton
              itemName="Đăng nhập"
            >
            </FlashButton>
            </div>
            <div className={`flex ${isShowPic? '':'justify-center'}`}>
              <div className={`flex gap-2 py-3`}>
              <label htmlFor="">Bạn mới biết đến FBShop?</label>
              <Link to="/register" className='text-orange-default hover:text-orange-900'>Đăng ký</Link>
              </div>
            </div>
        </form>
    </div>
  )
}

export default Login