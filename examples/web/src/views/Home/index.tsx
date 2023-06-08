import React from 'react'
import {Button, Space} from 'antd'
import './index.css';
import {defineSimpleStore,defineStore, useReactive, useRefState} from "../../../../../src";

const useGlobalStore = defineSimpleStore({
    count: 0,
});

const useGlobalStore1 = defineStore({
    state() {
        return {
            count: 0,
        }
    },
    actions: {
        increment() {
            console.log(this)
            this.state.count++;
        },
        decrement() {
            this.state.count--;
        }
    }
})

export default () => {

    const state = useReactive({
        count: 0,
    });

    const globalStore = useGlobalStore();

    const refState = useRefState(0);

    const globalStore2 = useGlobalStore1();

    return (
        <div className='home-page'>
            <h1>Home Page</h1>

            <Space direction={'vertical'}>
                <Space direction='horizontal'>
                    <Button onClick={() => state.count--}>-</Button>
                    {state.count}
                    <Button onClick={() => state.count++}>+</Button>
                </Space>
                <Space direction='horizontal'>
                    <Button onClick={() => refState.value--}>-</Button>
                    {refState.value}
                    <Button onClick={() => refState.value++}>+</Button>
                </Space>
                <Space direction='horizontal'>
                    <Button onClick={() => globalStore.count--}>-</Button>
                    {globalStore.count}
                    <Button onClick={() => globalStore.count++}>+</Button>
                </Space>
                <Space direction='horizontal'>
                    <Button onClick={() => globalStore2.decrement()}>-</Button>
                    {globalStore2.count}
                    <Button onClick={() => globalStore2.increment()}>+</Button>
                </Space>
            </Space>
        </div>
    )
}
