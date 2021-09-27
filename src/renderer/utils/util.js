exports.dateFilter = value => {
  if (value) {
    const d = new Date(parseInt(value));
    const date = {
      Y: d.getFullYear(),
      M: d.getMonth() > 8 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1),
      D: d.getDate() > 9 ? d.getDate() : '0' + d.getDate(),
      h: d.getHours() > 9 ? d.getHours() : '0' + d.getHours(),
      m: d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes(),
      s: d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds(),
    };
    const t = date.Y + '-' + date.M + '-' + date.D + ' ' + date.h + ':' + date.m + ':' + date.s;
    return t;
  }
  return '';
};

exports.getRegexp = type => {
  switch (type) {
    case 'money':
      return /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    default:
      return null;
  }
};

exports.getDatePickerOpt = () => {
  return {
    disabledDate: date => {
      return date.valueOf() > Date.now();
    },
  };
};




exports.saveJSON = (data, filename) => {
  if (!data) {
    alert("保存的数据为空");
    return;
  };
  if (!filename) filename = "export.json";
  if (typeof data === "object") {
    data = JSON.stringify(data, undefined, 4);
  }
  // 要创建一个 blob 数据
  var blob = new Blob([data], { type: "text/json" }),
    // 添加鼠标事件
    e = document.createEvent("MouseEvents"),
    a = document.createElement("a");
  a.download = filename;
  // 将blob转换为地址
  // 创建 URL 的 Blob 对象
  a.href = window.URL.createObjectURL(blob);

  a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");

  // web 标准中已废弃
  // 用以在鼠标事件创建时初始化其属性的值
  e.initMouseEvent(
    "click",
    true, // 是否可以冒泡
    false,// 是否可以阻止事件默认行为
    window,// 指向window对象
    0, // 事件的鼠标点击数量
    0, // 事件的屏幕的x坐标
    0,
    0, // 事件的客户端x坐标
    0,
    false, // 事件发生时 control 键是否被按下
    false, // 事件发生时 alt 键是否被按下
    false, // 事件发生时 shift 键是否被按下
    false, // 事件发生时 meta 键是否被按下
    0, // 鼠标按键值
    null
  );
  // 向一个指定的事件目标派发一个事件
  a.dispatchEvent(e);
};
