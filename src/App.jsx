import React from 'react'
import PageHeader from './layouts/PageHeader'
import MainHeader from './layouts/MainHeader'
import {useMediaQuery} from './mystate/useMediaQuery'
import Login from './layouts/Login';
import Register from './layouts/Register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Advertisement from './components/Advertisement';

function App() {
  const isHideMainHeader = useMediaQuery('(min-width: 1250px)');
  return (
    <BrowserRouter>
      <div className='bg-white relative h-auto w-full'>
        <PageHeader/>
          {isHideMainHeader && <MainHeader></MainHeader>}
        <Routes>
          <Route path='/' element={<Advertisement/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
