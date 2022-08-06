import React from 'react'
import './App.css'
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import Home from "/@/views/Home";
import Index from "/@/views/Index";

export default ()=>(
    <BrowserRouter>
        <Routes>
            <Route path="/" key={'/'} element={<Index/>}/>
            <Route path="/home" key={'/home'} element={<Home/>}/>
        </Routes>
    </BrowserRouter>
)
