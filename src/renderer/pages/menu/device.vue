<template>
  <div class="product">
    <router-link :to="'/device/' + info.id" class="product-main">
      <img :src="info.image" height="200" width="200" />

      <el-button
        type="primary"
        icon="el-icon-minus"
        circle
        @click.prevent= "subtractDevice"
      ></el-button>
      {{ getDeviceNums }}
      <el-button
        type="primary"
        icon="el-icon-plus"
        circle
        @click.prevent="addDevice"
      ></el-button>
      <h4>{{ info.type }}</h4>

      <div class="product-add-cart" @click.prevent="dialogFormVisible = true">加入购物车</div>
    </router-link>

    <!-- form dialog -->
    <el-dialog title="Device Parameters" :visible.sync="dialogFormVisible">
      <!-- <el-form :model="form" >
        <el-form-item v-for="(value,key) in form" :label="key" :label-width="formLabelWidth">
          <el-input v-model="form.key"></el-input>
        </el-form-item>
      </el-form> -->

      <el-form label-position="left" :model="form" ref="form">
        <el-form-item label="Device Name" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="Station ID" v-if="if_show_station_id" :label-width="formLabelWidth">
          <el-input v-model="form.station_id"></el-input>
        </el-form-item>
        <el-form-item label="IP Address" v-if="if_show_ip" :label-width="formLabelWidth">
          <el-input v-model="form.ip"></el-input>
        </el-form-item>
        <el-form-item label="Device Port" v-if="if_show_port" :label-width="formLabelWidth">
          <el-input v-model="form.port"></el-input>
        </el-form-item>
        <el-form-item label="Client ID" v-if="if_show_client_id" :label-width="formLabelWidth">
          <el-input v-model="form.client_id"></el-input>
        </el-form-item>                            
        <el-form-item label="Username" v-if="if_show_username" :label-width="formLabelWidth">
          <el-input v-model="form.username"></el-input>
        </el-form-item>    
        <el-form-item label="Password" v-if="if_show_password" :label-width="formLabelWidth">
          <el-input v-model="form.password"></el-input>
        </el-form-item>            
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.prevent="cancelSumbit">Cancel</el-button>
        <el-button type="primary" @click.prevent="sumbitForm">Save</el-button>
      </div>
    </el-dialog>
    <!-- table dialog -->
    <el-dialog title="Device Info" :visible.sync="dialogTableVisible">
      <Table
        border
        stripe
        :columns="dataList_table_column"
        :data="dataList"
      ></Table>
    </el-dialog>
  </div>
</template>
<script>
import util from "../../utils/util";

export default {
  inject:['reload'],
  props: {
    info: Object,
    panel_name: String,
  },
  computed: {
    getDeviceNums() {
      const SQL = `SELECT COUNT(id) AS totalCount from DEVICE WHERE panel_name = '${this.panel_name}' and type_name = '${this.info.type}' `;
      // console.log(SQL)
      this.$db.get(SQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: "get count Failed",
            desc: err,
          });
        } else {
          this.counts = res.totalCount;
          // console.log(res.totalCount);
        }
      });
      return this.counts;
    }
  },
  data() {
    return {
      counts: "",
      dataList: [],
      dataList_table_column: [
        {
          title: "Create Date",
          key: "create_time",
          align: "center",
          render: (h, params) => {
            return h("span", util.dateFilter(params.row.create_time));
          },
        },
        {
          title: "Type Name",
          key: "type_name",
          align: "center"
        },
        {
          title: "Device Name",
          key: "name",
          align: "center"
        },
        {
          title: "Operation",
          key: "action",
          align: "center",
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              h("Button", {
                props: {
                  type: "error",
                  size: "small",
                  icon: "trash-b",
                },
                attrs: {
                  title: "Delete",
                },
                style: {
                  "margin-left": "5px",
                },
                on: {
                  click: () => {
                    this.del(params.row);
                  },
                },
              }),
            ]);
          },
        },
      ],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: "",
        station_id: "",
        ip:'',
        port:'',
        client_id: "",
        username: "",
        password: ""
       
      },
      if_show_station_id:false,
      if_show_ip:false,
      if_show_port:false,
      if_show_client_id:false,
      if_show_username:false,
      if_show_password:false,
  
      formLabelWidth: "120px",
    };
  },
  methods: {
    addDevice(){
      console.log(this.info.protocol);
      if (this.info.protocol=="Modbus"){
        this.if_show_station_id=true;

      }else if (this.info.protocol=="IEC61850"){
          this.if_show_ip=true;
          this.if_show_port=true;
      }
      else{
          this.if_show_ip=true;
          this.if_show_port=true;
          this.if_show_client_id=true;
          this.if_show_username=true;
          this.if_show_password=true;
      }
      this.dialogFormVisible = true;
    },
    subtractDevice() {
		this.dialogTableVisible = true,
		this.getData();
    },
    sumbitForm() {
      console.log(this.form);
    //   console.log("sumbitForm=======");
      var SQL = "";
      if (this.info.protocol == "Modbus") {
        SQL = `INSERT INTO DEVICE (panel_name,type_name,name,station_id,create_time,update_time)
          VALUES ('${this.panel_name}','${this.info.type}','${
          this.form.name
        }','${this.form.station_id}','${Date.now()}','${Date.now()}')`;
      } else if (this.info.protocol == "IEC61850") {
        SQL = `INSERT INTO DEVICE (panel_name,type_name,name,ip,port,create_time,update_time)
          VALUES ('${this.panel_name}','${this.info.type}','${
          this.form.name
        }','${this.form.ip}','${
          this.form.port
        }','${Date.now()}','${Date.now()}')`;
      } else {
        SQL = `INSERT INTO DEVICE (panel_name,type_name,name,ip,port,client_id,username,password,create_time,update_time)
          VALUES ('${this.panel_name}','${this.info.type}','${
          this.form.name
        }','${this.form.ip}','${this.form.port}','${this.form.client_id}','${
          this.form.username
        }','${this.form.password}','${Date.now()}','${Date.now()}')`;
      }
      console.log(SQL);
      this.$db.run(SQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: "Insert Data Failed",
            desc: err,
          });
        } else {
          this.$Message.success({
            content: "Insert successful",
          });
          this.counts++;
        }
      });
      this.dialogFormVisible = false;
      // this.$store.commit("addCart", this.info.id);
    },
    cancelSumbit() {
      console.log("cancelSave=========");
      this.$refs.form.resetFields();
      console.log(this.$refs.form.resetFields());
      this.dialogFormVisible = false;
    },
    getData() {
      // this.tableLoading = true;
      const SQL = `SELECT create_time,type_name,name from device WHERE panel_name = '${this.panel_name}' and type_name = '${this.info.type}' `;
      console.log(SQL);
      this.$db.all(SQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: "获取失败",
            desc: err,
          });
        } else {
          console.log(res);
          this.dataList = res;
        }
      });
    },
	del(row){
		// console.log(row);
      this.$db.serialize(() => {
        this.$db.run("BEGIN");
        // 删除所有明细
        const deleteDetailSQL = `DELETE FROM device WHERE name='${row.name}'`;
        this.$logger(deleteDetailSQL);
        this.$db.run(deleteDetailSQL, (err) => {
          if (err) {
            this.$logger(err);
            this.$db.run("ROLLBACK");
            this.$Notice.error({
              title: "Delete Failed!",
              desc: err,
            });
          }
        });
        this.$db.run("COMMIT");
        this.dialogTableVisible= false;
        this.$Message.success({
          content: "Delete successful!",
        });
		this.reload();
      });
	}
  },
  mounted() {

  },
};
</script>
<style scoped>
.product {
  width: 25%;
  float: left;
}
.product-main {
  display: block;
  margin: 16px;
  padding: 16px;
  border: 1px solid #dddee1;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  text-align: center;
  position: relative;
}
.product-main img {
  width: 100%;
}
h4 {
  color: #222;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.product-main:hover h4 {
  color: #0070c9;
}
.product-color {
  display: block;
  width: 16px;
  height: 16px;
  border: 1px solid #dddee1;
  border-radius: 50%;
  margin: 6px auto;
}
.product-cost {
  color: #de4037;
  margin-top: 6px;
}
.product-add-cart {
  display: none;
  padding: 4px 8px;
  background: #2d8cf0;
  color: #fff;
  font-size: 12px;
  border-radius: 3px;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
}
.product-main:hover .product-add-cart {
  display: inline-block;
}
</style>