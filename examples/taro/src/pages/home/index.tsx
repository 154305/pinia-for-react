import './index.scss'
import {Button, View} from "@tarojs/components";
import useUserStore from "../../stores/user";
import Taro from "@tarojs/taro";

const ComponentA = () => {
  const [{username},{setUserInfo}] = useUserStore();
  return (
    <View>
      {username}
      <Button onClick={() => setUserInfo({Component:'ComponentA',username: new Date().getTime()})}>
        ComponentA修改状态
      </Button>
    </View>
  )
}


const ComponentB = () => {
  const [userInfo, {setUserInfo}] = useUserStore.useStore();
  return (
    <View>
      {JSON.stringify(userInfo)}
      <Button onClick={() => setUserInfo({Component:'ComponentB',username: new Date().getTime()})}>
        ComponentB
      </Button>
    </View>
  )
}

const ComponentC = () => {
  const [userInfo, actions] = useUserStore.useStore();

  return (
    <View>
      {JSON.stringify(userInfo)}
      <Button onClick={() => actions.setUserInfo({Component:'ComponentC',username: new Date().getTime()})}>
        ComponentC
      </Button>
    </View>
  )
}


export default () => {

  return (
    <View className='index'>
      <View style={{width:'100%',textAlign:'center',margin:'20px'}}>Home page</View>
      <ComponentA />
      <ComponentB />
      <ComponentC />
      <Button onClick={() => useUserStore.$reset()}>
        状态重置
      </Button>
      <Button onClick={() => useUserStore.$patch({username:'$patch username' })}>
        $patch 更改局部状态
      </Button>
      <Button onClick={() => useUserStore.syncUserInfo()}>
        异步更改状态
      </Button>
      <Button onClick={()=>Taro.navigateBack({delta:1})}>back index</Button>
    </View>
  )
}
