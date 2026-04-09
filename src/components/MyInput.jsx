import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react'
import Button from './Button';
import { cva } from 'class-variance-authority';

export const inputStyle = cva(["transition-colors"], {
  variants: {
    variant: {
     default: [
      ""
     ]
    }
  }
})

const MyInput = ({type, placeHolder, size, className}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [isHide, setIsHide] = useState(true);
  return (
    <div className={`flex justify-between border ${isFocus? 'border-orange-default': 'border-gray-200'} max-w-${size} rounded-full p-3`}>
        <input 
        type={isHide? type:'text'} 
        placeholder={placeHolder} 
        className={`focus:border-none outline-none text-black w-full h-auto ${className || ''}`}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        />
        {type=='password'? 
        <button 
        className='text-orange-default hover:transition-transform hover:duration-150 hover:scale-125'
        onClick={() => setIsHide(!isHide)}
        type='button'
        >
          {
            isHide? <EyeOff></EyeOff>:<Eye></Eye>
          }
        </button>:
        <></>}
    </div>
  )
}

export default MyInput;