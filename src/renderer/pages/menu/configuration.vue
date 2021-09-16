<template>
    <div v-show="list.length">
      <p>panel_name :  {{name}} </p>   

      <div> 
        <h1 style="text-align:center;display:inline">Panel Configuration</h1>
        <el-button type='primary' style="margin-left:820px;display:inline">Save</el-button>   
        <el-button type='primary' style="float:right;display:inline">Cancel</el-button>   
      </div> 
      
      <div class="list-control">
        <div class="list-control-filter">
          <span>Protocol：</span>
          <span
            class="list-control-filter-item"
            :class="{ on: item === filterProtocol }"
            v-for="item in protocols"
            @click="handleFilterProtocol(item)"
            >{{ item }}</span
          >
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
        // console.log(this.$store)
        // console.log(this.$store.state.deviceList);
      return this.$store.state.deviceList;
    },
    protocols() {
        // console.log("protocols is==========");
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
      name:'',
      filterProtocol: "",
    };
  },
  methods: {
    handleFilterProtocol(protocol) {
      if (this.filterProtocol === protocol) {
        this.filterProtocol = "";
      } else {
        this.filterProtocol = protocol;
      }
    }
  },
  mounted() {
    // this.id = this.$route.params.id;
    // console.log(this.id);
    this.name = this.$route.params.name;
    console.log(this.name);
    this.$store.dispatch('getDeviceList');
    console.log('getDeviceList')
  },
};
</script>

<style scoped>
.list-control {
  background: #fff;
  border-radius: 6px;
  margin: 16px;
  padding: 16px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
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