import React from 'react'
import MyInput from '../components/MyInput'
import Button from '../components/Button'
import FlashButton from '../components/FlashButton'
import { useMediaQuery } from '../mystate/useMediaQuery'
import { Link } from 'react-router-dom'


const Register = () => {
    const isShowPic = useMediaQuery("(min-width: 700px)");
  return (
    <div className='flex w-full h-auto text-black'>
      {
        isShowPic && <img src="https://cdn.shopvnb.com/uploads/images/bai_viet/anh-cau-long-ngau-1-1737322298.webp" alt="" className='w-1/2 h-auto'/>
      }
        <form action="" className='flex flex-col grow max-w-150 mx-10 md:mx-20 justify-center gap-1'>
            <label htmlFor="" className='font-bold text-4xl'>Đăng ký</label>
            <label htmlFor="" className='pt-8' size='150'>Email</label>
            <MyInput type='text' placeHolder='Email' className='' size='150'></MyInput>
            <label htmlFor="" className='pt-8'>Mật khẩu</label>
            <MyInput type='password' placeHolder='password' size='150'></MyInput>
            <label htmlFor="" className='pt-8'>Nhập lại mật khẩu</label>
            <MyInput type='password' placeHolder='confirm password'></MyInput>
            <div className='relative z-200 w-full flex gap-2 py-2'>
                <input 
                type="checkbox"
                name="ok"
                className='size-4 accent-blue-600 cursor-pointer' 
                />
                <label>Tôi đồng ý với Điều khoản sử dụng dịch vụ</label>
            </div>
            <div className='w-full flex justify-center'>
              <FlashButton
              itemName="Đăng nhập"
            >
            </FlashButton>
            </div>
            <div className={`flex ${isShowPic? '':'justify-center'}`}>
              <div className={`flex gap-2 py-3`}>
              <label htmlFor="">Bạn đã có tài khoản?</label>
              <Link to="/login" className='text-orange-default hover:text-orange-900'>Đăng nhập</Link>
              </div>
            </div>
        </form>
    </div>
  )
}

export default Register;