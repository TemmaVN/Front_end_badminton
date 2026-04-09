import React from 'react'
import PageHeader from './layouts/PageHeader'
import MainHeader from './layouts/MainHeader'
import {useMediaQuery} from './mystate/useMediaQuery'
import Login from './layouts/Login';
import Register from './layouts/Register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Advertisement from './components/Advertisement';
import Contract from './layouts/Contract';
import { Slash } from 'lucide-react';
import Sales from './layouts/Sales';

function App() {
  const isHideMainHeader = useMediaQuery('(min-width: 1250px)');
  return (
    <BrowserRouter>
      <div className='bg-white relative h-auto w-full'>
        <PageHeader/>
          {isHideMainHeader && <MainHeader></MainHeader>}
          <Sales/>
        {/* <Routes>
          <Route path='/' element={<Advertisement/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/contract' element={<Contract/>}/>
        </Routes> */}
      </div> 
    </BrowserRouter>
  )
}

export default App
