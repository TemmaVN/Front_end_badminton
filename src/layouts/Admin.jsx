import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './admin/Sidebar'
import Header from './admin/Header'

import Dashboard from '../components/admin/Dashboard'
import Catalog from '../components/admin/Catalog'
import ProductList from '../components/admin/ProductList'
import Categories from '../components/admin/Categories'
import Brand from '../components/admin/Brand'
import SalesOverview from '../components/admin/SalesOverview'
import OrderList from '../components/admin/OrderList'
import OrderDetail from '../components/admin/OrderDetail'
import UserList from '../components/admin/UserList'
import { UserProvider } from '../contexts/UserContext'



const Admin = () => {
  const [sideBarCollapsed, setSideBarCollapsed] = React.useState(false)
  return (
    <UserProvider>
      <div className='flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden'>
        <Sidebar 
          collapsed={sideBarCollapsed}
        />
        <div className='flex-1 flex flex-col overflow-hidden relative'>
          <Header 
          sideBarCollapsed={sideBarCollapsed}
          onToggleSidebar={() => setSideBarCollapsed(!sideBarCollapsed)}
          />
          <main className='flex-1 overflow-y-auto p-6 custom-scrollbar'>
              <Outlet />
          </main>
        </div>
      </div>
    </UserProvider>
  );
};

export default Admin;