const menu = [
  {
    icon:'cube',
    title:'My Panels',
    path:'/panels',
    component: require('@/pages/menu/panels').default,
  },
  // {
  //   icon: 'clipboard',
  //   title: '我的测试',
  //   path: '/detailList',
  //   component: require('@/pages/menu/detaillist').default,
  // },
  {
    icon: 'clipboard',
    title: 'Panel View',
    path: '/view/panel/:name',
    component: require('@/pages/menu/view').default,
  },
  {
    icon: 'clipboard',
    title: 'Panel Configuration',
    path: '/config/panel/:name',
    component: require('@/pages/menu/configuration').default,
  },
  {
    icon: 'clipboard',
    title: 'Panel Export',
    path: '/export/panel/:name',
    component: require('@/pages/menu/export').default,
  },
  {
    icon: 'clipboard',
    title: 'Device Detail',
    path: '/device/:id',
    component: require('@/pages/menu/dialog').default,
  }


];
export default menu;
