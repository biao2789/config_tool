import device_data from '../../device.js'

//数组排重
function getFilterArray(array) {
    const res = [];
    const json = {};
    for (let i = 0; i < array.length; i++) {
        const _seft = array[i];
        if (!json[_self]) {
            res.push(_self);
            json[_self] = 1;
        }
    }
    return res;
}

const state = {
    deviceList: [],
    cartList: []
}

const getters = {
    // protocols(state){
    //     const protocols = state.deviceList.map(item => item.protocol);
    //         return getFilterArray(protocols);
    // }
    protocols: state => {
        const protocols = state.deviceList.map(item => item.protocol);
        return getFilterArray(protocols);
    }
}

const mutations = {
    // 添加商品列表
    setDeviceList(state, data) {
        state.deviceList = data;
    },
    // 添加到购物车
    addCart(state, id) {
        // 先判断购物车是否已有，如果有，数量+1
        const isAdded = state.cartList.find(item => item.id === id);
        if (isAdded) {
            isAdded.count++;
        } else {
            state.cartList.push({
                id: id,
                count: 1
            })
        }
    },
    // 修改商品数量
    editCartCount(state, payload) {
        const product = state.cartList.find(item => item.id === payload.id);
        product.count += payload.count;
    },
    // 删除商品
    deleteCart(state, id) {
        const index = state.cartList.findIndex(item => item.id === id);
        state.cartList.splice(index, 1);
    },
    // 清空购物车
    emptyCart(state) {
        state.cartList = [];
    }

}

const actions = {

    // getDeviceList({ commit }) {
    //     // do something async
    //     commit('setDeviceList', device_data)
    // },
    // buy({ commit }) {
    //     return commit('emptyCart');
    // }
    // 请求设备列表
    getDeviceList (context) {
        console.log("=====setDeviceList")
        context.commit('setDeviceList',device_data)

        // 真实环境通过 ajax 获取，这里用异步模拟
        // setTimeout(() => {
        //     context.commit('setDeviceList', device_data);
        // }, 500);
    },
    // 购买
    buy (context) {
        context.commit('emptyCart')
        // 真实环境应通过 ajax 提交购买请求后再清空购物列表
        // return new Promise(resolve=> {
        //     setTimeout(() => {
        //         context.commit('emptyCart');
        //         resolve();
        //     }, 500)
        // });
    }  
}

export default {
    state,
    getters,
    mutations,
    actions
}
