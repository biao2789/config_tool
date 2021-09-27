<style lang="less">
  @import "../../assets/less/global.less";

  aside {
    position: relative;
    background-color: @aside-color;
    box-shadow: 0 0 7px #000;
    .layout-menu-left {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 40px;
      text-align: center;
    }
    .aside-drop-menu {
      position: absolute;
      height: 40px;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      .ivu-dropdown {
        .ivu-dropdown-rel {
          cursor: pointer;
        }
      }
    }
  }

  .aboutText {
    p {
      line-height: 26px;
    }
  }

  .psText {
    margin-top: 20px;
  }
</style>

<template>
  <aside>
    <Menu ref="menu"
          @on-select="selectMenu"
          theme="dark"
          width="100%"
          :active-name="activeMenuName"
          accordion
          class="layout-menu-left">
      <Menu-item v-for="(menu, index) in menus"
                 :name="menu.path"
                 :key="index">
        <Tooltip :content="menu.title"
                 placement="right"
                 :delay="800">
          <Icon :type="menu.icon"
                :size="30"
                color="white"></Icon>
        </Tooltip>
      </Menu-item>
    </Menu>

  </aside>
</template>

<script>
  import menus from "../../router/menu";
  import packageJson from "../../../../package.json";
  import { docDir } from "../../utils/settings";

  export default {
    data() {
      return {
        menus,
        activeMenuName: "",
        modalShow: false,
        version: packageJson.version,
        docDir,
      };
    },

    methods: {
      selectMenu(path) {
        this.$router.push({ path });
      },
      dropMenuClick(name) {
        switch (name) {
          case "serialport":
            console.log("serialport setting");
            this.serialportModal = true;
            break;
          case "update":
            console.log("check update");
            break;
          case "about":
            this.modalShow = true;
            break;
          default:
            null;
        }
      },
      openUrl(url) {
        this.$electron.shell.openExternal(url);
      },
      openPath(path) {
        this.$electron.shell.openItem(path);
      },
    },
    watch: {
      $route() {
        this.activeMenuName = this.$route.path;
        this.$nextTick(() => {
          this.$refs.menu.updateActiveName();
        });
      }
    },
    created() {
      this.activeMenuName = this.$route.path;
      this.$nextTick(() => {
        this.$refs.menu.updateActiveName();
      });
      // console.log("store", this.$store.state.Counter.main);
    }
  };
</script>
