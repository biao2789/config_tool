<template>
  <div v-show="list.length">
    <h1 style="margin-bottom: 10px; text-align: center">Panel Configuration</h1>
    <el-button type="primary" style="margin: 5px 20px" @click="goBack"
      >Back</el-button
    >

    <div class="list-control">
      <div class="list-control-filter">
        <div>Protocol：</div>
        <div
          class="list-control-filter-item"
          :class="{ on: item === filterProtocol }"
          v-for="item in protocols"
          @click="handleFilterProtocol(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <Device
      v-for="item in filteredAndOrderedList"
      :info="item"
      :panel_name="name"
      :key="item.id"
    ></Device>
    <div class="product-not-found" v-show="!filteredAndOrderedList.length">
      暂无相关商品
    </div>
  </div>
</template>
<script>
import Device from "./device.vue";
export default {
  name: "configuration",
  components: {
    Device,
  },
  computed: {
    list() {
      // console.log("list is==========");
      // console.log(this.$store.state.deviceList);
      return this.$store.state.deviceList;
    },
    protocols() {
      return this.$store.getters.protocols;
    },
    filteredAndOrderedList() {
      let list = [...this.list];
      // 按品牌过滤
      if (this.filterProtocol !== "") {
        list = list.filter((item) => item.protocol === this.filterProtocol);
      }
      return list;
    },
  },
  data() {
    return {
      name: "",
      filterProtocol: "MODBUS",
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    handleFilterProtocol(protocol) {
      if (this.filterProtocol === protocol) {
        this.filterProtocol = "";
      } else {
        this.filterProtocol = protocol;
      }
    },
  },
  mounted() {
    this.name = this.$route.params.name;
    // console.log(this.name);
    this.$store.dispatch("getDeviceList");
    console.log("getDeviceList");
  },
};
</script>

<style scoped>
.list-control {
  background: #fff;
  border-radius: 6px;
  margin: 16px;
  padding: 16px;
  font-size: 16px;
  /* box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2); */
  border: 1px solid ;

}
.list-control-filter {
  margin-bottom: 16px;
}
.list-control-filter-item,
.list-control-order-item {
  cursor: pointer;
  display: inline-block;
  border: 1px solid #e9eaec;
  border-radius: 4px;
  margin-right: 6px;
  padding: 2px 6px;
}
.list-control-filter-item.on,
.list-control-order-item.on {
  background: #f2352e;
  border: 1px solid #f2352e;
  color: #fff;
}
.product-not-found {
  text-align: center;
  padding: 32px;
}
</style>