import { LockKeyhole, PackageMinus, User2, UserCircleIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import Button from '../components/Button'
import { useMediaQuery } from '../mystate/useMediaQuery'
import Information from '../components/Information'
import ChangePass from '../components/ChangePass'
import Orders from '../components/Orders'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const UserInfo = () => {
    const isCol = useMediaQuery('(min-width: 970px)');
    const isMini = useMediaQuery('(max-width: 768px)');
    const isFlexData = useMediaQuery('(max-width: 1030px)');
    const [page, setPage] = useState('info');
    const { logout } = useAuth();
    useEffect(() => {
    console.log("UserInfo vừa được sinh ra (Mount)");
}, []);
    return (
    <div className='text-black flex justify-center '>
        <div className={`w-300 h-auto my-30 p-15 flex ${isMini? 'flex-col':''} gap-8 shadow-2xl`}>
            <div className={``}>
                <div className='flex'>
                <img src="https://static.fbshop.vn/template/assets/images/im-des.png" className='rounded-full h-20 w-20'/>
                    <div className='px-3 flex flex-col justify-center'>
                        <div>Hello</div>
                        <Link 
                        to="/" 
                        onClick={logout}
                        className='text-gray-500 underline hover:text-orange-default'>Đăng xuất</Link>
                    </div>
                </div>
                <div className={`flex flex-col gap-8 pt-8 ${isMini? 'w-full h-auto':'w-60'}`}>
                    <Button 
                    onClick={() => setPage('info')} 
                    className={`flex gap-2 justify-center hover:bg-orange-light ${page === 'info' ? 'bg-orange-light font-bold' : ''} rounded-full`}
                    ><User2/> Thông tin tài khoản</Button>
                    <Button 
                    onClick={() => setPage('changePass')} 
                    className={`flex gap-2 justify-center hover:bg-orange-light ${page === 'changePass' ? 'bg-orange-light font-bold' : ''} rounded-full`}
                    ><LockKeyhole/> Thay đổi mật khẩu</Button>
                    <Button 
                    onClick={() => setPage('orders')} 
                    className={`flex gap-2 justify-center hover:bg-orange-light ${page === 'orders' ? 'bg-orange-light font-bold' : ''} rounded-full`}
                    ><PackageMinus/> Lịch sử đơn hàng</Button>
                </div>
            </div>
            {page === 'info' && <Information/>}
            {page === 'changePass' && <ChangePass/>}
            {page === 'orders' && <Orders/>}
        </div>
    </div>
  )
}

export default UserInfo