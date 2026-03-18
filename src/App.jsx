import React from 'react'
import PageHeader from './layouts/PageHeader'
import MainHeader from './layouts/MainHeader'
import {useMediaQuery} from './mystate/useMediaQuery'
import Advertisement from './layouts/ui/Advertisement';


function App() {
  const isHideMainHeader = useMediaQuery('(min-width: 1250px)');
  return (
    <div className='bg-white relative max-h-screen w-full'>
    <PageHeader/>
    {isHideMainHeader && <MainHeader></MainHeader>}
    </div>
  )
}

export default App
