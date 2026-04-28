import React, {use, useEffect, useState} from 'react'
import MyInput from '../components/MyInput'
import { useMediaQuery } from '../mystate/useMediaQuery'
import FlashButton from '../components/FlashButton'
import { UserCircleIcon } from 'lucide-react'
import { useUser } from '../contexts/UserContext'

const Information = () => {
    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState("");
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [address, setAddress] = useState('');
    const { UpdateProfile } = useUser();

    const {  getUserInfo } = useUser();

    const handleSaveInfo = async () => {
        // Validate input fields
        if (!fullName || !email) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }
        const result = await UpdateProfile({fullName, birthDate, phoneNumber});
        if (result.success) {
            alert('Thông tin đã được lưu thành công!');
        } else {
            alert(result.message);
        }
        
    }

    const isCol = useMediaQuery('(min-width: 970px)');
    const isMini = useMediaQuery('(max-width: 768px)');
    const isFlexData = useMediaQuery('(max-width: 1030px)');

    const storedUser = localStorage.getItem('user');
    const user = JSON.parse(storedUser);

    const handleGetUserInfo = async () => {
        const result = await getUserInfo();
        if (result.success) {
            setFullName(result.user.fullName);
            const formattedDate = formatDateForInput(result.user.dateOfBirth);
            setBirthDate(formattedDate);
            setEmail(result.user.email);
            setPhoneNumber(result.user.phoneNumber);
            localStorage.setItem('user', JSON.stringify(result.user));
        }
    };

    useEffect(() => {
        handleGetUserInfo();
    }, []);

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        return dateString.split('T')[0]; 
    };

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
                                    type="date"
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
                                    isReadOnly={true}
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
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
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
                                    <span className='text-orange-default'></span>  
                                </div>
                                <MyInput size="800" placeHolder="Tỉnh/thành phố"/>
                            </div>
                            <div className='w-full flex flex-col h-25'>
                                <div className='flex pb-2 gap-2'>
                                    <label htmlFor="">Quận/huyện </label>
                                    <span className='text-orange-default'></span>  
                                </div>
                                <MyInput size="800" placeHolder="Quận/huyện"/>
                            </div>
                            <div className='w-full flex flex-col h-25'>
                                <div className='flex pb-2 gap-2'>
                                    <label htmlFor="">Phường/xã</label>
                                    <span className='text-orange-default'></span>  
                                </div>
                                <MyInput size="800" placeHolder="Phường/xã"/>
                            </div>
                        </div>
                        <div className='w-full flex flex-col h-25'>
                                <div className='flex pb-2 gap-2'>
                                    <label htmlFor="">Địa chỉ</label>
                                    <span className='text-orange-default'></span>  
                                </div>
                                <MyInput size="800" placeHolder="Địa chỉ của bạn"/>
                            </div>
                    </div>
                    <div className='flex w-full justify-center'>
                        <FlashButton 
                        type='submit'
                        itemName="Lưu thông tin"
                        onClick={handleSaveInfo}
                        />
                    </div>
                </div>
            </form>
  )
}

export default Information