import React from 'react'
import useUserStore from '/@/stores/user'
import {useNavigate} from "react-router-dom";
import {Button, Card, Space} from 'antd'
import './index.css';

const ComponentA = () => {
    const [{username}, {setUserInfo}] = useUserStore();
    return (
        <Card>
            <div>
                {username}
            </div>
            <Button onClick={() => setUserInfo({Component: 'ComponentA', username: new Date().getTime()})}>
                ComponentA修改状态
            </Button>
        </Card>
    )
}

const ComponentB = () => {
    const [userInfo, {setUserInfo}] = useUserStore.useStore();
    return (
        <Card>
            <div>
                {JSON.stringify(userInfo)}
            </div>
            <Button onClick={() => setUserInfo({Component: 'ComponentB', username: new Date().getTime()})}>
                ComponentB
            </Button>
        </Card>
    )
}

const ComponentC = () => {
    const [userInfo, actions] = useUserStore.useStore();

    return (
        <Card>
            <div>
                {JSON.stringify(userInfo)}
            </div>
            <Button onClick={() => actions.setUserInfo({Component: 'ComponentC', username: new Date().getTime()})}>
                ComponentC
            </Button>
        </Card>
    )
}


export default () => {

    const navigate = useNavigate();

    return (
        <div className='home-page'>
            <h1>Index Page</h1>
            <Space direction={'vertical'}>
                <Space>
                    <ComponentA/>
                    <ComponentB/>
                    <ComponentC/>
                </Space>
                <Space>
                    <Button onClick={() => useUserStore.$reset()}>
                        状态重置
                    </Button>
                    <Button onClick={() => useUserStore.$patch({username: '$patch username'})}>
                        $patch 更改局部状态
                    </Button>
                    <Button onClick={() => useUserStore.syncUserInfo()}>
                        异步更改状态
                    </Button>
                    <Button type="primary" onClick={() => navigate('/home')}>跳转到Home页面</Button>
                </Space>
            </Space>
        </div>
    )
}
