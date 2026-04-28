import React from 'react'
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
import CustomerList from '../components/admin/CustomerList'

const Admin = () => {

  const [sideBarCollapsed, setSideBarCollapsed] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState('Dashboard')
  const [activeFilters, setActiveFilters] = React.useState(null);
  

  const renderContent = () => {
    switch (currentPage) {
      case 'Dashboard': return <Dashboard />;
      case 'Catalog': 
        return <Catalog setCurrentPage={setCurrentPage} setActiveFilters={setActiveFilters} />;
      
      case 'products': 
        return <ProductList initialFilters={activeFilters} />;
      
      case 'categories': return <Categories onCategoryClick={(id) => {
          setActiveFilters({ categoryId: id });
          setCurrentPage('products');
      }} />;
      
      case 'brands': return <Brand onBrandClick={(id) => {
          setActiveFilters({ brandId: id });
          setCurrentPage('products');
      }} />;
      case 'Sales': return <SalesOverview />;
      case 'orders': return <OrderList />;
      case 'order-details': return <OrderDetail/>
      case 'Customers': return <CustomerList/>
      default: return <Dashboard />;
    }
  };

  return (
    <div className='flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden'>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} sideBarCollapsed={sideBarCollapsed} onToggleSidebar={setSideBarCollapsed} />
      <div className='flex-1 flex flex-col overflow-hidden relative'>
        <Header />
        <main className='flex-1 overflow-y-auto p-6 custom-scrollbar'>
           {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Admin