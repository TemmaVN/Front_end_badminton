import React, {useState} from 'react'
import MyInput from '../components/MyInput'
import { useMediaQuery } from '../mystate/useMediaQuery'
import FlashButton from '../components/FlashButton'
import { UserCircleIcon } from 'lucide-react'

const Information = () => {
    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSaveInfo = () => {
        // Validate input fields
        if (!fullName || !email) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        alert('Thông tin đã được lưu thành công!');
    }

    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [address, setAddress] = useState('');

    const handleSaveAddress = () => {
        // Validate input fields
        if (!province || !district || !ward || !address) {
            alert('Vui lòng điền đầy đủ thông tin giao hàng!');
            return;
        }

        alert('Thông tin giao hàng đã được lưu thành công!');
    }

    const isCol = useMediaQuery('(min-width: 970px)');
    const isMini = useMediaQuery('(max-width: 768px)');
    const isFlexData = useMediaQuery('(max-width: 1030px)');


    return (
        <form className={`w-full h-full p-8 flex flex-col border-gray-300 ${isMini? 'border-y-2':'border-l-2'}`}>
                <div className='border-b-2 border-gray-300 pb-8'>
                    <h2 className='font-bold text-2xl pb-8'>Thông tin tài khoản</h2>
                    <div className='flex flex-wrap gap-3 justify-around items-center '>
                        <img src="https://static.fbshop.vn/template/assets/images/im-des.png" className='rounded-full h-20 w-20'/>
                        <div className={`flex grow ${isCol? '':'flex-wrap'} max-w-160 gap-3`}>
                            <div className={`flex flex-wrap grow ${isCol? 'max-w-80': 'max-w-120'}`}>
                                <div className='flex flex-col grow max-w-120'>
                                    <div className='flex gap-2 pb-2'>
                                        <label htmlFor="">Họ và tên</label>
                                        <span className='text-orange-default'>*</span>
                                    </div>
                                    <MyInput 
                                    size="200" 
                                    className=''
                                    placeHolder="Họ và tên"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-col grow max-w-120'>
                                    <label className='pb-2' htmlFor="">Ngày sinh</label>
                                    <MyInput 
                                    size="200" 
                                    type="datetime-local"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={`flex flex-wrap grow ${isCol? 'max-w-80': 'max-w-120'}`}>
                                <div className='flex grow flex-col max-w-120'>
                                    <label className='pb-2' htmlFor="email">Email</label>
                                    <MyInput 
                                    size="200" 
                                    placeHolder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className='flex grow flex-col max-w-120'>
                                    <label className='pb-2' htmlFor="phone">Số điện thoại</label>
                                    <MyInput 
                                    size="200" 
                                    placeHolder="Số điện thoại"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='pt-8 gap-8 flex flex-col'>
                    <h2 className='font-bold text-2xl'>Thông tin giao hàng</h2>
                    <div className={`flex flex-col grow ${isFlexData? '':'flex-wrap'} gap-3 justify-around items-center`}>
                        <div className={`flex grow ${isFlexData? 'flex-col':''} justify-around items-center gap-5 w-full`}>
                            <div className='w-full flex flex-col h-25'>
                                <div className='flex pb-2 gap-2'>
                                    <label htmlFor="">Tỉnh/thành phố </label>
                                    <span className='text-orange-default'>*</span>  
                                </div>
                                <MyInput size="800" placeHolder="Tỉnh/thành phố"/>
                            </div>
                            <div className='w-full flex flex-col h-25'>
                                <div className='flex pb-2 gap-2'>
                                    <label htmlFor="">Quận/huyện </label>
                                    <span className='text-orange-default'>*</span>  
                                </div>
                                <MyInput size="800" placeHolder="Quận/huyện"/>
                            </div>
                            <div className='w-full flex flex-col h-25'>
                                <div className='flex pb-2 gap-2'>
                                    <label htmlFor="">Phường/xã</label>
                                    <span className='text-orange-default'>*</span>  
                                </div>
                                <MyInput size="800" placeHolder="Phường/xã"/>
                            </div>
                        </div>
                        <div className='w-full flex flex-col h-25'>
                                <div className='flex pb-2 gap-2'>
                                    <label htmlFor="">Địa chỉ</label>
                                    <span className='text-orange-default'>*</span>  
                                </div>
                                <MyInput size="800" placeHolder="Địa chỉ của bạn"/>
                            </div>
                    </div>
                    <div className='flex w-full justify-center'>
                        <FlashButton itemName="Lưu thông tin"/>
                    </div>
                </div>
            </form>
  )
}

export default Information