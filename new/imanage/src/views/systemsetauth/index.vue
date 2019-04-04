<template>
  <div class="app-container setjs-box">
    <p class="page-title">角色管理</p>
    <div class="search search2">
      <el-form :inline="true"
               :model="formInline"
               class="demo-form-inline">
        <el-form-item label="角色名称"
                      class="keyword-search">
          <el-input v-model="formInline.queryStr"
                    width="250"
                    size="mini"
                    placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger"
                     size="mini"
                     @click="search">搜索</el-button>
          <el-button type="success"
                     size="mini"
                     @click="reSetsearch">重置</el-button>
          <el-button type="primary"
                     size="mini"
                     @click="addItem">新增</el-button>
        </el-form-item>

      </el-form>
    </div>

    <el-table :data="dataSource"
              stripe
              border
              style="width: 100%">
      <el-table-column type="index"
                       width="50">
      </el-table-column>
      <el-table-column prop="roleName"
                       label="角色名称">
      </el-table-column>
      <el-table-column prop="gmtCreateStr"
                       width="180"
                       label="生效时间">
      </el-table-column>
      <el-table-column label="操作"
                       fixed="right"
                       width="280">
        <template slot-scope="scope">
          <el-button @click="editItem(scope.row)"
                     type="primary"
                     size="mini">编辑</el-button>
          <el-button @click="deleteItem(scope.row)"
                     type="danger"
                     size="mini">删除</el-button>
          <el-button @click="configMenu(scope.row)"
                     type="primary"
                     size="mini">配置菜单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page-pagination">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageIndex"
                     :page-sizes="[6,10,20,30,50]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

    <!-- 弹窗2 -->
    <el-dialog title='配置菜单'
               width="85%"
               :close-on-click-modal="false"
               :visible.sync="dialogVisible2">
      <span>
        <div class="menuone item-menu"
             :key="index"
             v-for="(item,index) in menus">
          <div class="my-box">
            <span class="item-name">{{item.priName}}</span>
            <el-checkbox v-model="item.checked"
                         @change="changeOne(item,1)"></el-checkbox>
            <span class="menus-add-minus"
                  @click="changeIsopen1menu(item)">
              <i class="el-icon-plus"
                 v-if="!item.isopen1"></i>
              <i class="el-icon-minus"
                 v-if="item.isopen1"></i>
            </span>
            <!-- <span class="btns">
              按钮
              <i class="el-icon-plus"></i>
              <i class="el-icon-minus"
                 v-if="false"></i>
            </span>
            <span class="zds">
              字段
              <i class="el-icon-plus"></i>
              <i class="el-icon-minus"
                 v-if="false"></i>
            </span> -->
          </div>
          <div class="son-list"
               v-if="item.children&&item.children.length&&item.isopen1">

            <div class="son-item"
                 :key="indexs"
                 v-for="(items,indexs) in item.children">
              <div class="my-box">
                <span class="item-name">{{items.priName}}</span>
                <el-checkbox v-model="items.checked"
                             @change="changeOne(items,5,item)"></el-checkbox>

                <span class="btns"
                      @click="changeIsopen2btn(items)">
                  按钮
                  <i class="el-icon-plus"
                     v-if="!items.isopen2"></i>
                  <i class="el-icon-minus"
                     v-if="items.isopen2"></i>
                </span>
                <span class="zds"
                      @click="changeIsopen3zd(items)">
                  字段
                  <i class="el-icon-plus"
                     v-if="!items.isopen3"></i>
                  <i class="el-icon-minus"
                     v-if="items.isopen3"></i>
                </span>
              </div>

              <div class="btns-box"
                   v-if="items.btns&&items.btns.length&&items.isopen2">
                <div class="btn-item"
                     :key="indexbtn"
                     v-for="(itembtn,indexbtn) in items.btns">
                  <div class="my-box">
                    <span class="item-name">{{itembtn.priName}}</span>
                    <el-checkbox v-model="itembtn.checked"
                                 @change="changeOne(itembtn,2,items)"></el-checkbox>
                  </div>
                </div>
              </div>
              <div class="zds-box"
                   v-if="items.zds&&items.zds.length&&items.isopen3">
                <div class="zd-item"
                     :key="indexzd"
                     v-for="(itemzd,indexzd) in items.zds">
                  <div class="my-box">
                    <span class="item-name">{{itemzd.priName}}</span>
                    <el-checkbox v-model="itemzd.checked"
                                 @change="changeOne(itemzd,3,items)"></el-checkbox>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </span>
    </el-dialog>

    <!-- 弹窗 -->
    <el-dialog :title='title'
               width="60%"
               :visible.sync="dialogVisible">
      <span>
        <el-form ref="dialogForm"
                 :rules="rules"
                 :model="dialogForm"
                 label-width="120px">

          <el-form-item label="角色名称："
                        prop="roleName">
            <el-input v-model="dialogForm.roleName"
                      style="width:250px;"
                      placeholder="请输入角色名称"></el-input>
          </el-form-item>

        </el-form>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="sureinfo">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {

  data() {
    return {

      dialogVisible2: false,

      roleType: localStorage.getItem('roleType'),

      formInline: {
        queryStr: '',
      },
      dialogForm: {
        roleName: '',
        id: '',
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
      },
      title: '新增',
      pageIndex: 1,
      pageSize: 6,
      dataSource: [],
      total: 0,
      dialogVisible: false,

      userId: '',

      roleId: '',
      menus: [],
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleSizeChange(v) {
      this.pageSize = v;
      this.getList();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getList();
    },

    search() {
      this.pageIndex = 1;
      this.getList();
    },
    reSetsearch() {
      this.formInline = {
        queryStr: '',
      };
    },

    addItem() {
      this.dialogForm = {
        roleName: '',
        id: '',
      };
      this.title = '新增'
      this.dialogVisible = true;
    },
    configMenu(row) {
      this.roleId = row.id;

      this.getListOnemenu();

    },
    // 查二级菜单
    changeIsopen1menu(item) {
      item.isopen1 = !item.isopen1;
      if (!item.isopen1) {
        return
      }
      this.getListTwomenu(item);

    },
    // 查按钮
    changeIsopen2btn(items) {
      items.isopen2 = !items.isopen2;
      if (!items.isopen2) {
        return
      }
      this.getListThreemenu(items, 2);
    },
    // 查字段
    changeIsopen3zd(items) {
      items.isopen3 = !items.isopen3;
      if (!items.isopen3) {
        return
      }
      this.getListThreemenu(items, 3);
    },

    changeOne(item, type, itemparent) {
      // 一级菜单 二级  按钮 字段是否选中

      if (type == 1) {
        if (!item.checked) {
          for (let i = 0; i < item.children.length; i++) {
            if (item.children[i].checked) {
              item.checked = true;
              this.$message.error('请先取消勾选该菜单下的二级菜单，再来操作此项');
              return
            }
          }
        }
      }

      if (type == 5) {
        if (!itemparent.checked) {
          item.checked = false;
          this.$message.error('请先勾选一级菜单，再来操作此项');
          return
        }
      }

      this.$get(`${this.baseUrls}/privilege/front/admin/v1/selectPrivilege`, {
        roleId: this.roleId,
        privilegeId: item.privilegeId,
      }).then((res) => {

      })
    },

    getListOnemenu() {
      // 查一级菜单
      this.$get(`${this.baseUrls}/privilege/front/admin/v1/queryByRole`, {
        roleId: this.roleId,
        parentId: 0,
      }).then((res) => {
        this.dialogVisible2 = true;
        let arr = res.data['1'];
        arr.forEach(ele => {
          ele.children = [];
          ele.checked = ele.rolePriId ? true : false;
          ele.isopen1 = false;

        });
        this.menus = arr;
      })
    },
    getListTwomenu(item) {
      // 查二级菜单
      this.$get(`${this.baseUrls}/privilege/front/admin/v1/queryByRole`, {
        roleId: this.roleId,
        parentId: item.privilegeId,
      }).then((res) => {
        let arr = res.data['1'];
        arr.forEach(ele => {
          ele.checked = ele.rolePriId ? true : false;
          ele.isopen1 = false;
          ele.isopen2 = false;
          ele.isopen3 = false;
          ele.btns = [];
          ele.zds = [];
        });
        item.children = arr;
      })
    },
    getListThreemenu(items, type) {
      // 查二级的按钮和菜单
      this.$get(`${this.baseUrls}/privilege/front/admin/v1/queryByRole`, {
        roleId: this.roleId,
        parentId: items.privilegeId,
      }).then((res) => {

        let arr2 = res.data && res.data['2'] ? res.data['2'] : [];
        let arr3 = res.data && res.data['3'] ? res.data['3'] : [];

        arr2.forEach(ele => {
          ele.checked = ele.rolePriId ? true : false;
        });

        arr3.forEach(ele => {
          ele.checked = ele.rolePriId ? true : false;
        });

        if (type == 2) {
          items.btns = arr2;
        }
        if (type == 3) {
          items.zds = arr3;
        }

      })
    },

    deleteItem(row) {
      this.$confirm('确定删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$get(`${this.baseUrls}/privilege/front/admin/v1/deleteRole?roleId=${row.id}`).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        })
      })
    },
    editItem(row) {
      this.title = '编辑';
      this.dialogForm = row;
      this.dialogVisible = true;

    },
    sureinfo() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.$get(`${this.baseUrlh}/privilege/front/admin/v1/saveRole`, {
            roleName: this.dialogForm.roleName,
            roleId: this.dialogForm.id,
          }).then((res) => {
            this.dialogVisible = false;
            if (this.title == '新增') {
              this.$message.success('新增成功');
            } else {
              this.$message.success('修改成功');
            }
            this.getList();
          })
        } else {
          return false;
        }
      });
    },
    getList() {
      this.$get(`${this.baseUrlh}/privilege/front/admin/v1/queryRole`, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        queryStr: this.formInline.queryStr.replace(/\s+/g, ''),
      }).then((res) => {
        this.dataSource = res.data;
        this.total = res.totalCount;
      })
    },
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.edit-point-pic {
  width: 25px;
  height: 25px;
  cursor: pointer;
}
.edit-point-inp {
  width: 50%;
  position: relative;
  top: -10px;
  background: transparent;
  height: 100%;
  border: none;
  outline: none;
}

.setjs-box {
  -webkit-user-select: none;
  .item-menu {
    padding: 8px 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    .my-box {
      > * {
        display: inline-block;
        vertical-align: middle;
      }
      .menus-add-minus {
        margin-left: 40px;
        cursor: pointer;
      }
      .item-name {
        width: 200px;
      }
      .btns {
        margin: 0 50px 0 50px;
        cursor: pointer;
      }
      .zds {
        cursor: pointer;
      }
    }
    .son-list {
      background: #e8d32f;
    }
    .son-item {
      padding-top: 5px;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      .my-box {
        .item-name {
          padding-left: 20px;
        }
        .btns {
          margin-left: 108px;
        }
      }

      .btns-box {
        background: #f56c6c;
        .btn-item {
          padding-top: 5px;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }
        .my-box {
          .item-name {
            padding-left: 40px;
          }
        }
      }
      .zds-box {
        background: #67c23a;
        .zd-item {
          padding-top: 5px;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }
        .my-box {
          .item-name {
            padding-left: 40px;
          }
        }
      }
    }
  }
}
</style>

