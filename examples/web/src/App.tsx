import React from 'react'
import './App.css'
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import Home from "/@/views/Home";
import Index from "/@/views/Index";
import IndexProxyStore from "/@/views/IndexProxyStore";
import IndexLocalProxyStore from "/@/views/IndexLocalProxyStore";

export default ()=>(
    <BrowserRouter>
        <Routes>
            <Route path="/" key={'/'} element={<Index/>}/>
            <Route path="/home" key={'/home'} element={<Home/>}/>
            <Route path="/proxyStore" key={'/proxyStore'} element={<IndexProxyStore/>}/>
            <Route path="/indexLocalProxyStore" key={'/indexLocalProxyStore'} element={<IndexLocalProxyStore/>}/>
        </Routes>
    </BrowserRouter>
)
