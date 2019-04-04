<template>
  <div class="app-container">
    <p class="page-title">菜单管理</p>
    <div class="search search2">
      <el-form :inline="true"
               :model="formInline"
               class="demo-form-inline">
        <el-form-item>

          <el-button type="primary"
                     size="mini"
                     @click="addItem">新增</el-button>
        </el-form-item>

      </el-form>
    </div>

    <el-table :data="dataSource"
              border
              :row-class-name="tableRowClassName"
              style="width: 100%">
      <el-table-column prop="priName"
                       label="菜单名称">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.parentId == 0"
                  type="success">{{scope.row.priName}}</el-tag>
          <el-tag v-else
                  type="danger">{{scope.row.priName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="priIcon"
                       label="菜单icon">

      </el-table-column>
      <el-table-column prop="sort"
                       width="100"
                       label="排序">
      </el-table-column>
      <el-table-column prop="parentId"
                       width="100"
                       label="父类ID">
      </el-table-column>
      <el-table-column prop="id"
                       width="100"
                       label="ID">
      </el-table-column>
      <el-table-column prop="priCode"
                       label="地址">
      </el-table-column>
      <el-table-column label="操作"
                       width="160">
        <template slot-scope="scope">
          <el-button type="primary"
                     @click="changeinfo(scope.row)"
                     size="mini">编辑</el-button>
          <el-button @click="deleteinfo(scope.row)"
                     type="danger"
                     size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->
    <el-dialog :title='title'
               width="60%"
               :visible.sync="dialogVisible">
      <span>
        <el-form ref="dialogForm"
                 :rules="rules"
                 :model="dialogForm"
                 label-width="120px">

          <el-form-item label="菜单名字："
                        prop="priName">
            <el-input v-model="dialogForm.priName"
                      style="width:250px;"
                      placeholder=""></el-input>
          </el-form-item>

          <el-form-item label="菜单icon：">
            <el-input v-model="dialogForm.priIcon"
                      style="width:250px;"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="排序："
                        prop="sort">
            <el-input v-model="dialogForm.sort"
                      style="width:250px;"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="父类ID："
                        prop="parentId">
            <el-input v-model="dialogForm.parentId"
                      style="width:250px;"
                      placeholder=""></el-input>
          </el-form-item>

          <el-form-item label="地址："
                        prop="priCode">
            <el-input v-model="dialogForm.priCode"
                      style="width:250px;"
                      placeholder=""></el-input>
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
      formInline2: {
        queryStr: '',
        isDist: '',
        isSale: '',
      },
      pageIndex2: 1,
      pageSize2: 6,
      dataSource2: [],
      total2: 0,

      roleType: localStorage.getItem('roleType'),

      formInline: {
        nameType: '',
        nameStr: '',
        phoneNum: '',
        isOpen: '',
        type: '',
      },
      dialogForm: {
        priName: '',
        priIcon: '',
        sort: '',
        parentId: '',
        priCode: '',
      },
      rules: {
        priName: [
          { required: true, message: '请输入菜单名字', trigger: 'blur' },
        ],
        sort: [
          { required: true, message: '请输入菜单排序', trigger: 'blur' },
        ],
        parentId: [
          { required: true, message: '请输入父类ID', trigger: 'blur' },
        ],
        priCode: [
          { required: true, message: '请输入菜单地址', trigger: 'blur' },
        ],
      },
      title: '新增',
      pageIndex: 1,
      pageSize: 6,
      dataSource: [],
      total: 0,
      dialogVisible: false,

      userId: '',
    }
  },
  created() {
    this.getList();
  },
  methods: {
    changeinfo(row) {
      this.dialogForm = row;
      this.title = '编辑'
      this.dialogVisible = true;
    },
    deleteinfo(row) {
      this.$confirm('确定删除该菜单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$get(`${this.baseUrls}/privilege/front/admin/v1/deletePrivilege?privilegeId=${row.id}`).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        })
      })
    },

    tableRowClassName(row) {
      if (row.row.parentId == 0) {
        return 'info-row';
      }
      return '';
    },

    addItem() {
      this.dialogForm = {
        id: '',
        priName: '',
        priIcon: '',
        sort: '',
        parentId: '',
        priCode: '',
      };
      this.title = '新增'
      this.dialogVisible = true;
    },

    sureinfo() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.$post(`${this.baseUrlh}/privilege/front/admin/v1/savePrivilege`, {
            privilegeId: this.dialogForm.id,
            priName: this.dialogForm.priName,
            priIcon: this.dialogForm.priIcon,
            sort: this.dialogForm.sort,
            parentId: this.dialogForm.parentId,
            priCode: this.dialogForm.priCode,
            priType: 1,
          }).then((res) => {
            this.dialogVisible = false;
            this.$message.success(`${this.title}成功`);
            this.getList();
          })
        } else {
          return false;
        }
      });
    },
    getList() {

      // this.dataSource = [
      //   {
      //     title: '系统设置',
      //     priIcon: 'setting',
      //     sort: 0,
      //     pid: 0,
      //     id: 3,
      //     path: '/system'
      //   },
      //   {
      //     title: '菜单管理',
      //     priIcon: '',
      //     sort: 0,
      //     pid: 3,
      //     id: 13,
      //     path: 'systemsetmenu'
      //   },
      //   {
      //     title: '角色管理',
      //     priIcon: '',
      //     sort: 1,
      //     pid: 3,
      //     id: 10,
      //     path: 'systemsetauth'
      //   }
      // ];

      this.$get(`${this.baseUrlh}/privilege/front/admin/v1/priList`, {
        queryStr: '',
        pageIndex: 1,
        pageSize: 500,
      }).then((res) => {
        this.dataSource = res.data;
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
</style>

