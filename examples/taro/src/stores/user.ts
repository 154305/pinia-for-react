// import {defineStore} from "../aotai/react-pinia";
import {defineStore} from "pinia-for-react";

const useUserStore = defineStore({
  state() {
    return {
      username: 'aaa',
      password: '1111',
      password1: '1111',
    }
  },
  actions: {
    setUserInfo(userInfo) {
      this.$setState(userInfo)
    },
    async syncUserInfo (){
      await new Promise(resolve=>setTimeout(resolve,2000));
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

export default useUserStore
