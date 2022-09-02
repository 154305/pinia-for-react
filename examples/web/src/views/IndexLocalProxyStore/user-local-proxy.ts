import {defineLocalProxyStore} from "../../../../../src/index";

export default defineLocalProxyStore({
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
