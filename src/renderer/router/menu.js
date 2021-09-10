const menu = [
  {
    icon:'cube',
    title:'我的商品',
    path:'/products',
    component: require('@/pages/menu/products').default,
  },
  {
    icon: 'cube',
    title: '我的参数',
    path: '/goods',
    component: require('@/pages/menu/goods').default,
  },
  {
    icon: 'clipboard',
    title: '我的测试',
    path: '/detailList',
    component: require('@/pages/menu/detaillist').default,
  }
];
export default menu;
