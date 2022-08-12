# pinia-for-react

```
一个跟vue pinia类似的react状态管理 
```
## 1.特点
```
1.可以直接在组件外部修改状态（解决目前大多数状态库不能在外部使用的问题）
2.状态分类管理(按模块拆分)
3.天然异步支持
4.开箱即用 无需provider根组件包裹
5.友好的typescript提示
```
## 2.使用

```
npm i pinia-for-react
or
yarn add pinia-for-react
```

## 3.示例代码
### 1.全局普通store
```tsx
import {defineStore} from "pinia-for-react";

const userStore = defineStore({
    state() {
        return {
            username: 'aaa',
            password: '1111',
            password1: '1111',
        }
    },
    actions: {
        setUserInfo(userInfo) {
            const state = this.$getState();
            //可以访问内部提供的方法
            this.$setState({
                ...state,
                ...userInfo
            })
        },
        //异步调用
        async syncUserInfo() {
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.$patch({
                username: 'syncUserInfoaaa',
                password: 'syncUserInfo1111',
                password1: 'syncUserInfo1111',
            })
        },
        reset() {
            this.$reset()
        }
    }
});

//满足hook以use开头规范
const useUserStore = userStore;

//外部更新状态
setInterval(() => {
    userStore.setUserInfo({username: '我是来自组件外部更改的状态', username1: new Date().getTime()})
}, 3000)

const ComponentA = () => {
    // 直接调用返回值
    const [{username}] = useUserStore();
    return (
        <div>
            {username}
            <div>
                ComponentA
            </div>
        </div>
    )
}

const ComponentB = () => {
    //也可以直接使用useStore方法hook
    const [userInfo, actions] = userStore.useStore();
    return (
        <div>
            {JSON.stringify(userInfo)}
            <button onClick={() => actions.setUserInfo({username: new Date().getTime()})}>
                ComponentB
            </button>
        </div>
    )
}

const ComponentC = () => {
    const [userInfo, actions] = userStore.useStore();

    return (
        <div>
            {JSON.stringify(userInfo)}
            <button onClick={() => actions.setUserInfo({username: new Date().getTime()})}>
                ComponentB
            </button>
        </div>
    )
}


export default () => {
    return (
        <div>
            <span>Hello world!</span>
            <ComponentA/>
            <ComponentB/>
            <ComponentC/>
            {/*也可以直接调用返回的userStore变量的方法*/}
            <button onClick={() => userStore.$reset()}>
                状态重置
            </button>
            {/*也可以直接调用返回的userStore变量的方法*/}
            <button onClick={() => userStore.$patch({username: '$patch username'})}>
                $patch 更改局部状态
            </button>
        </div>
    )
}

```
### 2.全局代理store
```tsx
import {defineProxyStore} from "pinia-for-react";

const useUserProxyStore = defineProxyStore({
    state() {
        return {
            username: 'aaa',
            password: '1111',
            password1: '1111',
        }
    },
    actions: {
        setUserInfo(userInfo) {
            Object.assign(this.state,userInfo)
        },
        async syncUserInfo (){
            await new Promise(resolve=>setTimeout(resolve,2000));
            Object.assign(this.state,{
                username: 'syncUserInfoaaa',
                password: 'syncUserInfo1111',
                password1: 'syncUserInfo1111',
            })
        },
        reset() {
            this.$reset()
        }
    }
});
//外部调用
useUserProxyStore.state.username = 'xxxxxx'

export default useUserProxyStore

```
```tsx
import React from 'react'
import useUserProxyStore from '/@/stores/user-proxy'
import {useNavigate} from "react-router-dom";
import {Button, Card, Space} from 'antd'
import './index.css';

const ComponentA = () => {
    //解构后set值无效，但任然可以拿到最新的store
    const [{username}, {setUserInfo}] = useUserProxyStore();
    console.log('刷新ComponentA')
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
    const [userInfo, {setUserInfo}] = useUserProxyStore.useStore();
    console.log('刷新ComponentB')
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

let count = 0;

const ComponentC = () => {
    const [userInfo, actions] = useUserProxyStore.useStore();
    console.log('刷新ComponentC'+(++count))
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

    const [state, actions] = useUserProxyStore.useStore();

    const continuityUpdate = async ()=>{
        for (let i = 0; i < 100; i++) {
            await new Promise((resolve)=>setTimeout(resolve,50))
            useUserProxyStore.$patch({
                username: Math.random()+'',
            })
        }
    }

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
                    <Button onClick={() => useUserProxyStore.$reset()}>
                        状态重置
                    </Button>
                    <Button onClick={continuityUpdate}>
                        连续更新状态10次
                    </Button>
                    <Button onClick={() => state.username = new Date().getTime()+''}>
                        $patch 更改局部状态
                    </Button>
                    <Button onClick={() => useUserProxyStore.syncUserInfo()}>
                        异步更改状态
                    </Button>
                    <Button type="primary" onClick={() => navigate('/home')}>跳转到Home页面</Button>
                </Space>
            </Space>
        </div>
    )
}

```

## 4.运行示例
#### 1.安装依赖
`yarn & npm run install`
#### 2.运行web或者taro
`yarn run start:web` 
or
`yarn run start:taro` 




