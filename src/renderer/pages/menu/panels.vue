<template>
  <div>
    <div>
      <h1 style="display: inline">My Panels</h1>
      <el-button
        type="primary"
        icon="el-icon-circle-plus"
        style="float: right; display: inline"
        @click="add"
        >Create</el-button
      >
      <br />
      <br />
    </div>

    <Table
      border
      stripe
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
    <Modal
      v-model="modalShow"
      :mask-closable="false"
      :title="modalTitle"
      @on-cancel="modalShow = false"
    >
      <div>
        <Form
          ref="formVali"
          :model="modalParams"
          :rules="ruleValidate"
          label-position="right"
          :label-width="130"
          @keydown.native.enter.prevent="enterConfirm(modalParams.id)"
        >
          <FormItem label="Panel Name" prop="name">
            <Input
              v-model="modalParams.name"
              placeholder="Required, length is lower than 100"
              style="width: 250px"
            ></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="modalShow = false"> Cancel </Button>
        <Button
          type="primary"
          v-if="!modalParams.id"
          :loading="modalBtnLoading"
          @click="addConfirm"
          >Save
        </Button>
        <Button
          type="primary"
          v-if="modalParams.id"
          @click="editConfirm"
          :loading="modalBtnLoading"
          >Save
        </Button>
      </div>
    </Modal>

    <Modal
      v-model="delModalShow"
      title="Delete Panel"
      :loading="loading"
      @on-ok="delConfirm"
      width="370"
    >
      <h4>确定删除？</h4>
    </Modal>

  </div>
</template>
<script>
import util from "../../utils/util";

export default {
  data() {
    return {
      // loading
      downloadExcelLoading: false,
      modalBtnLoading: false,
      tableLoading: false,
      loading: true,
      search: {
        name: "",
        remark: "",
        sort: "DESC",
        totalMax: null,
        totalMin: null,
        buyPriceMax: null,
        buyPriceMin: null,
        sellPriceMax: null,
        sellPriceMin: null,
        pageIndex: 1,
        pageSize: 10,
      },
      searchParams: {},
      dataList: [],
      dataListTotalCount: 0,
      dataList_table_column: [
        {
          title: "Panel Name",
          key: "name",
          align: "center",
          // minWidth: 200,
        },
        {
          title: "Last Update",
          key: "update_time",
          align: "center",
          // minWidth: 150,
          render: (h, params) => {
            return h("span", util.dateFilter(params.row.update_time));
          },
        },
        {
          title: "Operation",
          key: "action",
          // width: 130,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              h("Button", {
                props: {
                  type: "primary",
                  size: "small",
                  icon: "upload",
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
                  size: "small",
                  icon: "ios-list-outline",
                },
                attrs: {
                  title: "View",
                },
                style: {
                  "margin-left": "5px",
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
                  size: "small",
                  icon: "settings",
                },
                attrs: {
                  title: "Configuration",
                },
                style: {
                  "margin-left": "5px",
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
                  size: "small",
                  icon: "edit",
                },
                attrs: {
                  title: "Edit",
                },
                style: {
                  "margin-left": "5px",
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
      modalShow: false,
      modalParams: {
        name: "",
        standard_buy_unit_price: "",
        standard_sell_unit_price: "",
        remark: "",
      },
      delModalShow: false,
      ruleValidate: {
        name: [
          { required: true, message: "Please input panel name" },
          { max: 100, message: "Panel Name is lower than 100 chars" },
        ],
      },
      downloadExcelSQL: "",
    };
  },
  computed: {
    modalTitle() {
      return this.modalParams.id ? "Edit Panel" : "New Panel";
    },
  },
  methods: {
    // 清空该项输入
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
      this.direct(row);
    },
    // 新增
    add() {
      // console.log(this.$refs);
      this.$refs.formVali.resetFields();
      this.modalParams = this.$options.data().modalParams;
      this.modalShow = true;
    },
    // 新增确认
    addConfirm() {
      this.modalBtnLoading = true;
      setTimeout(() =>{
      this.$refs.formVali.validate((valid) => {
        if (valid) {
          const modalParams = this.modalParams;
          // 检测品名是否存在
          const SQL = `SELECT COUNT(id) AS totalCount from PANEL WHERE name = '${modalParams.name}'`;
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
          VALUES ('${modalParams.name}','${Date.now()}','${Date.now()}')`;
                this.$logger(SQL);
                this.$db.run(SQL, (err) => {
                  if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                      title: "Created Failed",
                      desc: err,
                    });
                  } else {
                    this.modalShow = false;
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
      },2000)
      
    },
    // Export Json
    export(row) {
      this.$router.push({
        // name:'export',
        // params:row.id
        path: `/export/panel/${row.name}`,
      });
    },
    // View detail
    view(row) {
      this.$router.push({
        path: `/view/panel/${row.name}`,
        query: {
          goods_id: row.id,
        },
      });
    },
    // Configuration
    config(row) {
      this.$router.push({
        path: `/config/panel/${row.name}`, //config/pannel/123
      });
    },
    // 编辑
    edit(row) {
      this.$refs.formVali.resetFields();
      this.modalParams = {
        id: row.id,
        name: row.name,
      };
      this.modalShow = true;
    },
    // 编辑确认
    editConfirm() {
      this.$refs.formVali.validate((valid) => {
        if (valid) {
          this.modalBtnLoading = true;
          const modalParams = this.modalParams;
          // 检测品名是否存在
          const SQL = `SELECT id from PANEL WHERE name = '${modalParams.name}'`;
          this.$db.get(SQL, (err, res) => {
            if (err) {
              this.$logger(err);
              this.$Notice.error({
                title: "Fetch Data Failed",
                desc: err,
              });
            } else {
              if (res && res.id !== modalParams.id) {
                this.$Message.warning({
                  content: "Name has already exist!",
                });
                this.modalBtnLoading = false;
              } else {
                const SQL = `UPDATE PANEL SET
          name='${modalParams.name}'
          ,update_time='${Date.now()}'
          WHERE id = ${modalParams.id}`;
                this.$logger(SQL);
                this.$db.run(SQL, (err) => {
                  if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                      title: "Edit Failed",
                      desc: err,
                    });
                  } else {
                    this.modalShow = false;
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
        this.editConfirm();
      } else {
        this.addConfirm();
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
<style lang="less">
</style>
