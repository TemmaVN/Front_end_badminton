import React from 'react'
import MyInput from '../components/MyInput'
import { useMediaQuery } from '../mystate/useMediaQuery'
import FlashButton from '../components/FlashButton'
import { UserCircleIcon } from 'lucide-react'

const Information = () => {
    const isCol = useMediaQuery('(min-width: 970px)');
    const isMini = useMediaQuery('(max-width: 768px)');
    const isFlexData = useMediaQuery('(max-width: 1030px)');
    return (
        <form className={`w-full h-full p-8 flex flex-col border-gray-300 ${isMini? 'border-y-2':'border-l-2'}`}>
                <div className='border-b-2 border-gray-300 pb-8'>
                    <h2 className='font-bold text-2xl pb-8'>Thông tin tài khoản</h2>
                    <div className='flex flex-wrap gap-3 justify-around items-center '>
                        <UserCircleIcon className='h-20 w-20'/>
                        <div className={`flex grow ${isCol? '':'flex-wrap'} max-w-160 gap-3`}>
                            <div className={`flex flex-wrap grow ${isCol? 'max-w-80': 'max-w-120'}`}>
                                <div className='flex flex-col grow max-w-120'>
                                    <label htmlFor="">Họ và tên *</label>
                                    <MyInput size="200" className=''/>
                                </div>
                                <div className='flex flex-col grow max-w-120'>
                                    <label htmlFor="">Ngày sinh</label>
                                    <MyInput size="200" type="datetime-local"/>
                                </div>
                            </div>
                            <div className={`flex flex-wrap grow ${isCol? 'max-w-80': 'max-w-120'}`}>
                                <div className='flex grow flex-col max-w-120'>
                                    <label htmlFor="">Email</label>
                                    <MyInput size="200"/>
                                </div>
                                <div className='flex grow flex-col max-w-120'>
                                    <label htmlFor="">Số điện thoại</label>
                                    <MyInput size="200"/>
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
                                <label className='pb-4' htmlFor="">Tỉnh/thành phố *</label>
                                <MyInput size="800"/>
                            </div>
                            <div className='w-full flex flex-col h-25'>
                                <label className='pb-4'  htmlFor="">Tỉnh/thành phố *</label>
                                <MyInput size="800"/>
                            </div>
                            <div className='w-full flex flex-col h-25'>
                                <label className='pb-4'  htmlFor="">Tỉnh/thành phố *</label>
                                <MyInput size="800"/>
                            </div>
                        </div>
                        <div className='w-full flex flex-col h-25'>
                                <label className='pb-4'  htmlFor="">Tỉnh/thành phố *</label>
                                <MyInput size="800"/>
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