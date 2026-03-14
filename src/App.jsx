import React from 'react'
import Button from './components/Button'
import { ArrowLeft, Search } from 'lucide-react'
import PageHeader from './layouts/PageHeader'
import MainHeader from './layouts/MainHeader'
import {useMediaQuery} from './mystate/useMediaQuery'


function App() {
  const isHideMainHeader = useMediaQuery('(min-width: 1250px)');
  return (
    <div className='bg-white'>
    <PageHeader/>
    {isHideMainHeader && <MainHeader></MainHeader>}
    </div>
  )
}

export default App
