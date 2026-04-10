import React from 'react'
import { Link } from 'react-router-dom'
import TuVan from '../components/TuVan'
import { LocateIcon, LocationEditIcon, Mail, User, User2 } from 'lucide-react'

const MenuData = ({isOpen, setIsOpen}) => {
  return (
    <div className='flex flex-col grow  text-black gap-2.5 p-5 '>
      {/* Main content */}
      <div className='flex flex-col border-b border-b-gray-900 pb-3'>
        <Link onClick={() => setIsOpen(false)} to="/" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Trang chủ</Link>
        <Link onClick={() => setIsOpen(false)} to="/rackets" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Vợt cầu lông</Link>
        <Link onClick={() => setIsOpen(false)} to="/shoes" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Giày</Link>
        <Link onClick={() => setIsOpen(false)} to="/bags" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Balo</Link>
        <Link onClick={() => setIsOpen(false)} to="/racket-bags" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Bao vợt</Link>
        <Link onClick={() => setIsOpen(false)} to="/accessories" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Phụ kiện</Link>
        <Link onClick={() => setIsOpen(false)} to="/sales" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Giảm giá</Link>
        <Link onClick={() => setIsOpen(false)} to="/contract" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Liên hệ</Link>
      </div>
      {/* Tu van */}
      <div className='flex justify-between  border-b border-b-gray-900 pb-3'>
        <div className='flex flex-col gap-3'>
        <TuVan name='Tư vấn sản phẩm' phoneNumber='0979.170.274'/>
        <TuVan name='Bảo hành và CSKH' phoneNumber='0979.170.274'/>
        </div>
        <div className='flex flex-col gap-3'>
        <TuVan name='Hàn vợt carbon' phoneNumber='0979.170.274'/>
        <TuVan name='Xem hệ thống cửa hàng' phoneNumber='0979.170.274'/>
        </div>
      </div>
      {/* Imformation */}
      <div>
        <div className='flex gap-2 py-4'>
          <User2 className='text-orange-default'/>
          <p className='font-bold'>Người đại diện</p>
          <p>Trương Minh Thành</p>
        </div>
        <div className='flex gap-2 py-4'>
          <LocationEditIcon className='text-orange-default'/>
          <p className='font-bold'>Địa chỉ </p>
          <p>12/70 ngõ 102 Trường Chinh, Đống Đa, Hà Nội</p>
        </div>
        <div className='flex gap-2 py-4'>
          <Mail className='text-orange-default'/>
          <p className='font-bold'>Email</p>
          <p>caulongshop@gmail.com</p>
        </div>
      </div>
    </div>
  )
}

export default MenuData