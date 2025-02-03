import React from 'react'
import PanelSideBar from './PanelSideBar'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Panel = () => {
    const {activeUser} = useSelector((state)=>state.user)

       
    return activeUser ? (<PanelSideBar /> ) :  (<Navigate to="/giris" />)
  
}

export default Panel