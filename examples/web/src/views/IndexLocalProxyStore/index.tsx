import React, {useEffect, useRef, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {Button, Card, Space} from 'antd'
import './index.css';
import useLocalProxyStore from "./user-local-proxy";
import {uuid} from "../../../../../src/utils";


const ChildComponent = ({id}) => {
    const [state] = useLocalProxyStore();
    return (
        <div>
            <div>ChildComponent:{id}</div>
            <div>{state?.username}</div>
        </div>
    )
}

const ParentComponent = useLocalProxyStore.$wrapper((props) => {
    const [state] = useLocalProxyStore();
    console.log('state', state)

    const id = useRef(uuid());

    return (
        <Card
            title={id.current}
        >
            <div>{state?.username}</div>
            <ChildComponent id={id.current}/>
            <Button onClick={() => state.username = new Date().getTime()}>修改组件状态</Button>
        </Card>
    )
});

export default () => {

    const navigate = useNavigate();

    let [iff, setIff] = useState(true);

    useEffect(() => {
        setTimeout(() => setIff(!iff), 2000)
    }, [])

    return (
        <div className='home-page'>
            <h1>Index Page</h1>
            <Space direction={'vertical'}>
                <Space>
                    <ParentComponent/>
                    <ParentComponent/>
                    {iff && <ParentComponent/>}
                    <Button type="primary" onClick={() => navigate('/home')}>跳转到Home页面</Button>
                </Space>
            </Space>
        </div>
    )
}
