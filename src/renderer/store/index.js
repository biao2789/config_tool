import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'

import device_data from '../device.js'
Vue.use(Vuex)

//数组排重
function getFilterArray(array) {
  const res = [];
  const json = {};
  for (let i = 0; i < array.length; i++) {
      const _self = array[i];
      if (!json[_self]) {
          res.push(_self);
          json[_self] = 1;
      }
  }
  return res;
}

export default new Vuex.Store({
  state: {
    deviceList: [],
    cartList: []
  },
  getters: {
    protocols: state => {
      const protocols = state.deviceList.map(item => item.protocol);
      return getFilterArray(protocols);
    }
  },
  mutations: {
    // 添加商品列表
    setDeviceList(state, data) {
      state.deviceList = data;
    },
    // 添加到购物车
    addCart(state, id) {
      // 先判断购物车是否已有，如果有，数量+1
      console.log('addCart======');
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

  },
  actions: {
    getDeviceList(context) {
      console.log("=====setDeviceList")
      context.commit('setDeviceList', device_data)
    },
    // 购买
    buy(context) {
      context.commit('emptyCart')
    }
  },
  // modules
  // plugins: [
  //   createPersistedState(),
  //   createSharedMutations()
  // ],
  // strict: process.env.NODE_ENV !== 'production'
})
