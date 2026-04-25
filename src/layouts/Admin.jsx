import React from 'react'
import Sidebar from './admin/Sidebar'
import Header from './admin/Header'

const Admin = () => {

  const [sideBarCollapsed, setSideBarCollapsed] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState('Dashboard')

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 via-blue-50
    to-indigo-50 dark:via-slate-800 dark:to-slate-900 transition-all duration-500'>
        <div className='flex h-screen overflow-hidden'>
            <Sidebar 
            collapsed={sideBarCollapsed} 
            onToggle={() => setSideBarCollapsed(!sideBarCollapsed)}
            currentPage = {currentPage}
            setCurrentPage = {setCurrentPage}
            />
            <div className='flex-1 flex flex-col overflow-hidden'>
                {/*Header*/}
                <Header/>
            </div>
        </div>
    </div>
  )
}

export default Admin