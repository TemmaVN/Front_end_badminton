import React from 'react'
import TuVan from '../components/TuVan'
import { LocateIcon, LocationEditIcon, Mail, User, User2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const MenuHeader = () => {
  return (
    <div className='bg-gray-100 shadow-cyan-100 flex flex-col grow max-w-150 text-black gap-2.5 p-5 '>
      {/* Main content */}
      <div className='flex flex-col border-b border-b-gray-900 pb-3'>
        <Link to="/" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Trang chủ</Link>
        <Link to="/rackets" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Vợt cầu lông</Link>
        <Link to="/shoes" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Giày</Link>
        <Link to="/bags" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Balo</Link>
        <Link to="/racket-bags" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Bao vợt</Link>
        <Link to="/accessories" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Phụ kiện</Link>
        <Link to="/sale" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Giảm giá</Link>
        <Link to="/contract" className='font-bold px-2 pt-5 hover:border-orange-default hover:text-orange-default'>Liên hệ</Link>
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

export default MenuHeader