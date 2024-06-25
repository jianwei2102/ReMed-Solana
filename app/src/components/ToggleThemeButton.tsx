import React from 'react'
import { Button } from 'antd'
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi'

interface ToggleThemeButtonProps {
  darkTheme: boolean;
  toggleTheme: () => void;
}

const ToggleThemeButton = ({ darkTheme, toggleTheme }: ToggleThemeButtonProps) => {
  return (
    <div className='absolute bottom-8 left-5 flex items-center justify-center text-lg'>
        <Button onClick={toggleTheme}>
            {darkTheme ? <HiOutlineSun /> : <HiOutlineMoon />}
        </Button>
    </div>
  )
}

export default ToggleThemeButton