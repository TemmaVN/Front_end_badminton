import React, { useState } from 'react';
import MyInput from '../components/MyInput'
import Button from '../components/Button'
import FlashButton from '../components/FlashButton'
import { useMediaQuery } from '../mystate/useMediaQuery'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const Login = () => {
  const isShowPic = useMediaQuery("(min-width: 700px)");
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const [loading, setLoading] = useState(false);
      const navigate = useNavigate();
      const { login } = useAuth();
  
      const handleSubmit = async (e) => {
          e.preventDefault();
          setError('');
          setLoading(true);
  
          const result = await login(email, password);
  
          if (result.success) {
              alert("Đăng nhập thành công!");
              navigate('/');
          } else {
              setError(result.message);
              alert("Sai email hoặc mật khẩu!");
          }
  
          setLoading(false);
      };
  return (
    <div className='flex w-full h-auto text-black'>
      {
        isShowPic && <img src="https://static.fbshop.vn/wp-content/uploads/2023/08/plogin-img.jpg" alt="" className='w-1/2 h-auto'/>
      }
        <form action="" className='flex flex-col grow max-w-150 mx-10 md:mx-20 justify-center gap-1'>
            <label htmlFor="" className='font-bold text-4xl'>Đăng nhập</label>
            <label htmlFor="" className='pt-8'>Email</label>
            <MyInput 
            type='text' 
            placeHolder='Email' 
            size='150' 
            className=''
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ></MyInput>
            <label htmlFor="" className='pt-8'>Mật khẩu</label>
            <MyInput 
            type='password' 
            placeHolder='password' 
            size='150'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ></MyInput>
            <div className='w-full flex justify-end'>
              <a href="" className='text-orange-default hover:text-orange-900 pt-3'>Quên mật khẩu</a>
            </div>
            <div className='w-full flex justify-center'>
              <FlashButton
              disabled={loading}
              type='submit'
              onClick={handleSubmit}
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