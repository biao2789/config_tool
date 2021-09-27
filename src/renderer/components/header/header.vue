<style lang="less">
@import "../../assets/less/global.less";

header {
  font-family: "Microsoft YaHei";
  font-size: 16px;
  overflow: hidden;

  -webkit-app-region: drag;
  .left {
    float: left;
    margin-left: 25px;
    a {
      -webkit-app-region: no-drag;
      margin-left: 10px;
    }
  }
  .version {
    font-size: 12px;
    float: left;
    margin-left: 20px;
    .ivu-tooltip {
      -webkit-app-region: no-drag;
    }
  }
  .right {
    float: right;
    margin-right: 20px;
    a {
      -webkit-app-region: no-drag;
      color: #000;
      margin-right: 10px;
    }
  }
}
</style>

<template>
  <header>
    <div class="left">
      <h1
        style="font-size:25px;position:relative;font:weight:2000;color:#00CED1"
      >
        <a href="javascript:void(0)" @click="selectPath"> SIEMENS </a>
      </h1>

    </div>
    <div class="right">
      <a href="javascript:void(0)" @click="minWindows">
        <Icon size="14" type="minus-round"></Icon>
      </a>
      <a href="javascript:void(0)" @click="maxWindows">
        <Icon size="14" type="arrow-resize"></Icon>
      </a>
      <a href="javascript:void(0)" @click="closeWindows">
        <Icon size="14" type="close"></Icon>
      </a>
    </div>

    <Modal
      v-model="updateModalShow"
      :mask-closable="false"
      :closable="false"
      title="版本升级"
    >
      <div class="aboutText">
        <Card>
          <h2 slot="title">{{ updateInfo.releaseName }}</h2>
          <p slot="extra">{{ currentVersion }} → {{ updateInfo.version }}</p>
          <div v-html="updateInfo.releaseNotes"></div>
          <p>更新时间：{{ updateInfo.releaseDate | dateFilter }}</p>
        </Card>
      </div>
      <div slot="footer">
        <Button @click="closeUpdateModal"> 取消升级，下次启动时再询问 </Button>
        <Button type="primary" @click="updateConfirm"
          >确认升级，将重启应用
        </Button>
      </div>
    </Modal>
    <!-- <SerialportCompontent @cancel="modalCancel"
                          v-if="serialportModal" /> -->
  </header>
</template>
<script>
import packageJson from "../../../../package.json";
// import SerialportCompontent from './serialport.vue'
export default {
  data() {
    return {
      currentVersion: packageJson.version,
      updateText: "",
      downloadProgress: null,
      downloadInfo: {
        percent: null,
        totalMB: 0,
        KBPerSecond: 0,
      },
      updateModalShow: false,
      updateInfo: {
        releaseName: "",
        releaseNotes: "",
        releaseDate: "",
        version: "",
      },
      serialportModal: false,
    };
  },
  components: {
    // SerialportCompontent
  },
  methods: {
    selectPath() {
      this.$router.push({ path: "/panels" });
    },
    modalCancel(type, reload) {
      this[type + "Modal"] = false;
    },
    minWindows() {
      this.$electron.ipcRenderer.send("min-window");
    },
    maxWindows() {
      this.$electron.ipcRenderer.send("max-window");
    },
    closeWindows() {
      this.$electron.ipcRenderer.send("close-window");
    },
    showUpdateModal() {
      this.updateModalShow = true;
    },
    updateConfirm() {
      this.updateModalShow = false;
      this.$electron.ipcRenderer.send("update-now");
    },
    closeUpdateModal() {
      this.updateModalShow = false;
      this.updateText = "更新已取消";
    },
    update() {
      this.$electron.ipcRenderer.on("update-message", (event, msg) => {
        const message = msg.message;
        const data = msg.data;
        switch (message) {
          case "error":
            this.updateText = "检查更新失败";
            this.downloadInfo = this.$options.data().downloadInfo;
            break;
          case "checking-for-update":
            this.updateText = "检查更新中";
            break;
          case "update-available":
            this.updateText = "有可用更新";
            this.updateInfo = {
              releaseDate:
                new Date(data.releaseDate).getTime() -
                new Date().getTimezoneOffset() * 60 * 1000,
              releaseName: data.releaseName,
              releaseNotes: data.releaseNotes,
              version: data.version,
            };
            break;
          case "update-not-available":
            this.updateText = "已经是最新版";
            break;
          case "download-progress":
            this.updateText = "";
            this.downloadInfo = {
              percent: data.percent.toFixed(2),
              totalMB: (data.total / 1024 / 1024).toFixed(3),
              KBPerSecond: (data.bytesPerSecond / 1024).toFixed(3),
            };
            break;
          case "update-downloaded":
            this.updateText = "";
            this.downloadInfo = this.$options.data().downloadInfo;
            this.showUpdateModal();
            break;
          default:
            this.updateText = "";
            this.downloadInfo = this.$options.data().downloadInfo;
        }
      });
    },
  },
  created() {
    this.update();
  },
};
</script>



<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

