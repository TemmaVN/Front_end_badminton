import { cva } from 'class-variance-authority';
import React from 'react'

const buttonStyles = cva(["hover:"])

const Button = () => {
  return (
    <div className=''>
        <button>Hello world</button>
    </div>
  )
}

export default Button;