<template>
  <div>
    <div>
      <h1 style="magin: 10px">My Panels</h1>
      <el-button
        type="primary"
        style="float: right; margin-right: 45px; font-size: 1.5em"
        @click.prevent="add"
        >Create</el-button
      >
      <br />
    </div>

    <div>
      <Table
        border
        stripe
        size="large"
        style="margin-top: 30px"
        :columns="dataList_table_column"
        :data="dataList"
        :loading="tableLoading"
        @on-row-dblclick="tableRowDblClick"
      ></Table>

      <Page
        :total="dataListTotalCount"
        :current="searchParams.pageIndex"
        :page-size="searchParams.pageSize"
        @on-change="getDataList"
        @on-page-size-change="getDataListOnPageChange"
        :page-size-opts="[10, 20, 30, 40, 50]"
        show-total
        show-sizer
        show-elevator
        transfer
      ></Page>
    </div>

    <!-- <Modal
      v-model="modalView"
      :mask-closable="false"
      title="Configuration Overview"
      @on-cancel="modalView = false"
      width="60"
      class="font-size-base:50px"
    >
      <div>
        <Recursion :list="list"></Recursion>
      </div>
      <div slot="footer">
        <Button type="default" @click.prevent="modalView = false">Close</Button>
      </div>
    </Modal> -->

    <el-dialog
      title="Overview"
      :visible.sync="centerDialogVisible"
      width="60%"
      center
    >
      <el-tree
        :data="list"
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="ruleValidate">
        <el-form-item
          label="Panel Name"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog('form')">Cancel</el-button>
        <el-button type="primary" v-if="!form.id" @click="sumbitForm('form')"
          >Sumbit</el-button
        >
        <el-button type="primary" v-if="form.id" @click="editConfirm('form')"
          >Edit</el-button
        >
      </div>
    </el-dialog>

    <Modal
      v-model="delModalShow"
      title="Delete Panel"
      :loading="loading"
      @on-ok="delConfirm"
      width="370"
    >
      <h4>Sure to delete？</h4>
    </Modal>
  </div>
</template>
<script>
import util from "../../utils/util";
import Recursion from "../../components/recursion/recursion.vue";
export default {
  components: { Recursion },
  data() {
    return {
      modalBtnLoading: false,
      tableLoading: false,
      loading: true,
      centerDialogVisible: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      form: {
        name: "",
      },
      ruleValidate: {
        name: [
          { required: true, message: "Please input panel name" },
          { max: 100, message: "Panel Name is lower than 100 chars" },
        ],
      },
      search: {
        name: "",
        remark: "",
        sort: "DESC",
        totalMax: null,
        totalMin: null,
        pageIndex: 1,
        pageSize: 10,
      },
      searchParams: {},
      dataList: [],
      dataListTotalCount: 0,
      list: [],
      defaultProps: { children: "children", label: "label" },
      // list:  [
      //   {
      //     label: 'Device',
      //     children: [
      //       {
      //       label: 'MCU-MH',
      //       children: [{
      //         label: 'MCU-MH-1'
      //       },{
      //         label: 'MCU-MH-2'
      //       }]
      //     }]
      //   } ],
      dataList_table_column: [
        {
          title: "Panel Name",
          key: "name",
          align: "center",
        },
        {
          title: "Last Update",
          key: "update_time",
          align: "center",
          render: (h, params) => {
            return h("span", util.dateFilter(params.row.update_time));
          },
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
                  type: "primary",
                  size: "large",
                  icon: "ios-download-outline",
                },
                attrs: {
                  title: "Export",
                },
                on: {
                  click: () => {
                    this.export(params.row);
                  },
                },
              }),
              h("Button", {
                props: {
                  type: "primary",
                  size: "large",
                  icon: "ios-list-outline",
                },
                attrs: {
                  title: "View",
                },
                style: {
                  "margin-left": "10px",
                },
                on: {
                  click: () => {
                    this.view(params.row);
                  },
                },
              }),
              h("Button", {
                props: {
                  type: "primary",
                  size: "large",
                  icon: "settings",
                },
                attrs: {
                  title: "Configuration",
                },
                style: {
                  "margin-left": "10px",
                },
                on: {
                  click: () => {
                    this.config(params.row);
                  },
                },
              }),
              h("Button", {
                props: {
                  type: "primary",
                  size: "large",
                  icon: "edit",
                },
                attrs: {
                  title: "Edit",
                },
                style: {
                  "margin-left": "10px",
                },
                on: {
                  click: () => {
                    this.edit(params.row);
                  },
                },
              }),
              h("Button", {
                props: {
                  type: "error",
                  size: "large",
                  icon: "trash-b",
                },
                attrs: {
                  title: "Delete",
                },
                style: {
                  "margin-left": "10px",
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

      delModalShow: false,

      downloadExcelSQL: "",
    };
  },
  computed: {
    title() {
      return this.form.id ? "Edit Panel" : "New Panel";
    },
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    getList(name) {
      // console.log(name);
      var array = [];
      const SQL = `SELECT protocol,count(id) as COUNT from type WHERE panel_name = '${name}' GROUP BY protocol`;
      this.$db.all(SQL, (err, res) => {
        if (res.length) {
          res.forEach((item) => {
            var obj = {};
            obj.label = item.protocol + " Device" + `('${item.COUNT}')`;
            var array_2 = [];
            // console.log("1111111");
            // console.log(item);
            var type_SQL = `SELECT name from type WHERE panel_name = '${name}' AND protocol='${item.protocol}' GROUP BY name`;
            this.$db.all(type_SQL, (err, res) => {
              if (res.length) {
                res.forEach((a) => {
                  // console.log("type");
                  // console.log(a);
                  var obj_2 = {};
                  obj_2.label = a.name;
                  var array_3 = [];
                  const device_SQL = `SELECT name,station_id,ip,port,client_id,username,password from device WHERE panel_name = '${name}' AND type_name='${a.name}'`;
                  this.$db.all(device_SQL, (err, res) => {
                    if (res.length) {
                      res.forEach((b) => {
                        var str = "";
                        for (var i in b) {
                          if (b[i] != null) {
                            str += i + ":" + b[i] + " ";
                          }
                        }
                        const obj_3 = {};
                        obj_3.label = str;
                        array_3.push(obj_3);
                      });
                    }
                  });
                  // console.log(array_3)
                  obj_2.children = array_3;
                  // console.log(obj_2);

                  array_2.push(obj_2);
                });
              }
            });
            obj.children = array_2;
            array.push(obj);
          });
        }
      });
      console.log("array===");
      console.log(array);
      this.list = array;
      // this.list.concat(array);
      console.log(this.list);
    },

    // 清空该项输入
    // getList(name) {
    //   const array = new Array();
    //   const SQL = `SELECT protocol,name from type WHERE panel_name = '${name}'`;
    //   this.$db.all(SQL, (err, res) => {
    //     if (res.length) {
    //       res.forEach((item) => {
    //         // console.log("1111111");
    //         // console.log(item);
    //         const obj = new Object();
    //         obj.label = item.protocol + " Device";

    //         const array_child = new Array();

    //         const obj_child_1 = new Object();
    //         obj_child_1.label = item.name;

    //         const array_chlid2 = new Array();
    //         const type_SQL = `SELECT name,station_id,ip,port,client_id,username,password from device WHERE panel_name = '${name}' AND type_name='${item.name}'`;
    //         this.$db.all(type_SQL, (err, res) => {
    //           if (res.length) {
    //             res.forEach((a) => {
    //               console.log("22222");
    //               console.log(a);

    //               let str = "";
    //               for (var i in a) {
    //                 if (a[i] != null) {
    //                   str += i + ": " + a[i] + " ";
    //                 }
    //               }
    //               const obj_child = new Object();
    //               obj_child.label = str;
    //               // obj_child.type_name = a.type_name;

    //               // obj_child.name = a.name;
    //               // obj_child.station_id = a.station_id;
    //               // obj_child.ip = a.ip;
    //               // obj_child.port = a.port;
    //               // obj_child.client_id = a.client_id;
    //               // obj_child.username = a.username;
    //               array_chlid2.push(obj_child);
    //             });
    //           }
    //         });
    //         obj_child_1.children = array_chlid2;
    //          console.log("obj_child_1")
    //         console.log(obj_child_1)
    //         array_child.push(obj_child_1);

    //         obj.children = array_child;
    //         array.push(obj);
    //       });
    //     }
    //   });
    //   console.log("array===");
    //   console.log(array);
    //   this.list = array;
    //   // console.log("list===");
    //   // console.log(this.list)
    // },
    clearInputNumber(max, min) {
      this.search[max] = null;
      this.search[min] = null;
    },
    // 搜索
    getDataList(method) {
      this.tableLoading = true;
      if (method === "search") {
        this.searchParams = JSON.parse(JSON.stringify(this.search));
      }
      if (typeof method === "number") {
        this.searchParams.pageIndex = method;
      }
      const searchParams = this.searchParams;
      const pageSQL = `LIMIT ${searchParams.pageSize} OFFSET ${
        (searchParams.pageIndex - 1) * searchParams.pageSize
      } `;
      const orderSQL = `ORDER BY id ${searchParams.sort} `;
      // // 导出sql
      this.downloadExcelSQL = "SELECT * from PANEL " + orderSQL;
      const rowSQL = this.downloadExcelSQL + pageSQL;
      const countSQL = "SELECT COUNT(id) AS totalCount from PANEL ";
      this.$logger(rowSQL);
      this.$db.all(rowSQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: "获取失败",
            desc: err,
          });
        } else {
          if (!res.length && searchParams.pageIndex !== 1) {
            // 该页没数据，又不是第一页，就往上一页翻
            this.getDataList(searchParams.pageIndex - 1);
          } else {
            this.dataList = res;
            console.log(this.dataList);
          }
        }
        this.tableLoading = false;
      });
      this.$logger(countSQL);
      this.$db.get(countSQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: "搜索失败",
            desc: err,
          });
        } else {
          this.dataListTotalCount = res.totalCount;
        }
      });
    },
    // pageSize改变
    getDataListOnPageChange(pageSize) {
      this.search.pageSize = pageSize;
      this.getDataList("search");
    },
    // 双击表格某行
    tableRowDblClick(row) {
      this.view(row);
    },
    // 新增
    add() {
      // this.$refs.form.resetFields();
      this.dialogFormVisible = true;
      this.form = {
        name: "",
      };

      // this.$refs.formVali.resetFields();
      // this.modalParams = this.$options.data().modalParams;
      // this.modalShow = true;
    },
    // 新增确认
    sumbitForm(formName) {
      // this.$refs[formName].resetFields();

      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.form);
          // const modalParams = this.modalParams;
          // 检测品名是否存在
          const SQL = `SELECT COUNT(id) AS totalCount from PANEL WHERE name = '${this.form.name}'`;
          this.$db.get(SQL, (err, res) => {
            if (err) {
              this.$logger(err);
              this.$Notice.error({
                title: "搜索失败",
                desc: err,
              });
            } else {
              if (res.totalCount) {
                this.$Message.warning({
                  content: "Panel has already exist!",
                });
                this.modalBtnLoading = false;
              } else {
                const SQL = `INSERT INTO PANEL (name,create_time,update_time)
          VALUES ('${this.form.name}','${Date.now()}','${Date.now()}')`;
                this.$logger(SQL);
                this.$db.run(SQL, (err) => {
                  if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                      title: "Created Failed",
                      desc: err,
                    });
                  } else {
                    this.$Message.success({
                      content: "Created Successful",
                    });
                    this.getDataList(1);
                  }
                  this.modalBtnLoading = false;
                });
              }
            }
          });
        }
      });
      this.dialogFormVisible = false;
    },

    cancelDialog(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    // Export Json
    export(row) {
      var data = { title: "export" };
      util.saveJSON(data, "1.json");
    },
    // View detail
    view(row) {
      this.centerDialogVisible = true;
      // console.log(this.list)
      this.getList(row.name);
    },
    // Configuration
    config(row) {
      this.$router.push({
        path: `/config/panel/${row.name}`, //config/pannel/123
      });
    },
    // 编辑
    edit(row) {
      // this.$refs.resetFields();
      // this.title=
      this.form = {
        id: row.id,
        name: row.name,
      };
      this.dialogFormVisible = true;
    },
    // 编辑确认
    editConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.modalBtnLoading = true;
          // console.log(this.$refs.formVali)
          // 检测品名是否存在
          const SQL = `SELECT id from PANEL WHERE name = '${this.form.name}'`;
          this.$db.get(SQL, (err, res) => {
            if (err) {
              this.$logger(err);
              this.$Notice.error({
                title: "Fetch Data Failed",
                desc: err,
              });
            } else {
              if (res && res.id !== this.form.id) {
                this.$Message.warning({
                  content: "Name has already exist!",
                });
                this.modalBtnLoading = false;
              } else {
                const SQL = `UPDATE PANEL SET
          name='${this.form.name}'
          ,update_time='${Date.now()}'
          WHERE id = ${this.form.id}`;
                this.$logger(SQL);
                this.$db.run(SQL, (err) => {
                  if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                      title: "Edit Failed",
                      desc: err,
                    });
                  } else {
                    this.dialogFormVisible = false;
                    this.$Message.success({
                      content: "Edit successful",
                    });
                    this.getDataList();
                  }
                  this.modalBtnLoading = false;
                });
              }
            }
          });
        }
      });
    },

    enterConfirm(id) {
      if (id) {
        console.log(id);
        this.editConfirm("form");
      } else {
        console.log("sumbit");
        this.sumbitForm("form");
      }
    },
    // 删除
    del(row) {
      this.modalParams = {
        id: row.id,
        name: row.name,
        input: "",
      };
      this.delModalShow = true;
    },
    //  删除确认
    delConfirm() {
      setTimeout(() => {
        this.$db.serialize(() => {
          this.$db.run("BEGIN");
          // 删除所有明细
          //原生sql语句中字符串字段需要加引号；
          const deleteDetailSQL = `DELETE FROM device WHERE panel_name='${this.modalParams.name}'`;
          this.$logger(deleteDetailSQL);
          this.$db.run(deleteDetailSQL, (err) => {
            if (err) {
              this.$logger(err);
              this.$db.run("ROLLBACK");
              this.$Notice.error({
                title: "Delete device Failed!",
                desc: err,
              });
            }
          });

          const deleteTypeSQL = `DELETE FROM type WHERE panel_name='${this.modalParams.name}'`;
          this.$logger(deleteTypeSQL);
          this.$db.run(deleteTypeSQL, (err) => {
            if (err) {
              this.$logger(err);
              this.$db.run("ROLLBACK");
              this.$Notice.error({
                title: "Delete type Failed!",
                desc: err,
              });
            }
          });          
          const deleteSQL = `DELETE FROM panel WHERE id=${this.modalParams.id}`;
          this.$logger(deleteSQL);
          this.$db.run(deleteSQL, (err) => {
            if (err) {
              this.$logger(err);
              this.$db.run("ROLLBACK");
              this.$Notice.error({
                title: "Delete panel Failed!",
                desc: err,
              });
            }
          });
          this.$db.run("COMMIT");
          this.delModalShow = false;
          this.$Message.success({
            content: "Delete Successful!",
          });
          this.getDataList();
        });
      }, 2000);
    },
  },
  created() {
    this.getDataList("search");
  },
};
</script>
<style >
.my_dialog {
  font-size: 40px;
}
</style>
