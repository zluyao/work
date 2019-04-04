<template>
  <div class="app-container">
    <p class="page-title">字典配置</p>

    <div class="zd-box">
      <p class="zd-title">供应商管理</p>
      <div class="edit-box">
        <el-form ref="dialogForm1"
                 :inline="true"
                 :model="dialogForm1">
          <el-form-item label="供应商：">
            <el-input v-model="dialogForm1.dictLabel"
                      size="mini"
                      placeholder="请输入供应商"></el-input>
          </el-form-item>
          <el-form-item label="ID规则：">
            <el-input v-model="dialogForm1.dictAb"
                      size="mini"
                      placeholder="请输入ID规则"></el-input>
          </el-form-item>

          <el-form-item label="logo图标：">
            <el-upload class="avatar-uploader avatar-uploader2"
                       :data="uploadKey"
                       :action="dataApi"
                       :limit="1"
                       ref="files"
                       :show-file-list="false"
                       :on-success="handleAvatarSuccess">
              <img v-if="dialogForm1.dictImg"
                   :src="dialogForm1.dictImg"
                   class="avatar">
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <el-button type="danger"
                       size="mini"
                       @click="addData(1)">添加</el-button>
            <el-button type="primary"
                       size="mini"
                       @click="clearData(1)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box"
           style="width: 80%">
        <el-table :data="dataSource1"
                  size="mini"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="dictLabel"
                           label="供应商">
          </el-table-column>
          <el-table-column prop="dictAb"
                           label="ID生成规则">
          </el-table-column>
          <el-table-column label="logo图标">
            <template slot-scope="scope">
              <img :src="scope.row.dictImg"
                   class="table-img"
                   alt="">
            </template>
          </el-table-column>
          <el-table-column label="是否可用"
                           width="200">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.isValid"
                              @change="changeIsValid($event,scope.row,1)">
                <el-radio :label="1"
                          size="mini"
                          border>是</el-radio>
                <el-radio :label="0"
                          size="mini"
                          border>否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button @click="editInfob(scope.row)"
                         type="danger"
                         size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 交费频率管理 -->
    <div class="zd-box">
      <p class="zd-title">交费频率管理</p>
      <div class="edit-box">
        <el-form ref="dialogForm2"
                 :inline="true"
                 :model="dialogForm2">
          <el-form-item label="交费频率：">
            <el-input v-model="dialogForm2.dictLabel"
                      size="mini"
                      placeholder="请输入交费频率"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="danger"
                       size="mini"
                       @click="addData(2)">添加</el-button>
            <el-button type="primary"
                       size="mini"
                       @click="clearData(2)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box"
           style="width: 80%">
        <el-table :data="dataSource2"
                  size="mini"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="dictLabel"
                           label="交费频率">
          </el-table-column>

          <el-table-column label="是否可用"
                           width="200">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.isValid"
                              @change="changeIsValid($event,scope.row,2)">
                <el-radio :label="1"
                          size="mini"
                          border>是</el-radio>
                <el-radio :label="0"
                          size="mini"
                          border>否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button @click="editInfoa(scope.row)"
                         type="danger"
                         size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 交费频率管理 -->

    <!-- 交费期间管理 -->
    <div class="zd-box">
      <p class="zd-title">交费期间管理</p>
      <div class="edit-box">
        <el-form ref="dialogForm3"
                 :inline="true"
                 :model="dialogForm3">
          <el-form-item label="交费期间：">
            <el-input v-model="dialogForm3.dictLabel"
                      size="mini"
                      placeholder="请输入交费期间"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="danger"
                       size="mini"
                       @click="addData(3)">添加</el-button>
            <el-button type="primary"
                       size="mini"
                       @click="clearData(3)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box"
           style="width: 80%">
        <el-table :data="dataSource3"
                  size="mini"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="dictLabel"
                           label="交费期间">
          </el-table-column>

          <el-table-column label="是否可用"
                           width="200">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.isValid"
                              @change="changeIsValid($event,scope.row,3)">
                <el-radio :label="1"
                          size="mini"
                          border>是</el-radio>
                <el-radio :label="0"
                          size="mini"
                          border>否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button @click="editInfoa(scope.row)"
                         type="danger"
                         size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 交费期间管理 -->

    <!-- 交费方式管理 -->
    <div class="zd-box">
      <p class="zd-title">交费方式管理</p>
      <div class="edit-box">
        <el-form ref="dialogForm10"
                 :inline="true"
                 :model="dialogForm10">
          <el-form-item label="交费方式：">
            <el-input v-model="dialogForm10.dictLabel"
                      size="mini"
                      placeholder="请输入交费方式"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="danger"
                       size="mini"
                       @click="addData(10)">添加</el-button>
            <el-button type="primary"
                       size="mini"
                       @click="clearData(10)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box"
           style="width: 80%">
        <el-table :data="dataSource10"
                  size="mini"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="dictLabel"
                           label="交费方式">
          </el-table-column>

          <el-table-column label="是否可用"
                           width="200">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.isValid"
                              @change="changeIsValid($event,scope.row,10)">
                <el-radio :label="1"
                          size="mini"
                          border>是</el-radio>
                <el-radio :label="0"
                          size="mini"
                          border>否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button @click="editInfoa(scope.row)"
                         type="danger"
                         size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 犹豫期管理 -->

    <!-- 犹豫期管理 -->
    <div class="zd-box">
      <p class="zd-title">犹豫期管理</p>
      <div class="edit-box">
        <el-form ref="dialogForm4"
                 :inline="true"
                 :model="dialogForm4">
          <el-form-item label="交费期间：">
            <el-input v-model="dialogForm4.dictLabel"
                      size="mini"
                      placeholder="请输入犹豫期"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="danger"
                       size="mini"
                       @click="addData(4)">添加</el-button>
            <el-button type="primary"
                       size="mini"
                       @click="clearData(4)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box"
           style="width: 80%">
        <el-table :data="dataSource4"
                  size="mini"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="dictLabel"
                           label="犹豫期">
          </el-table-column>

          <el-table-column label="是否可用"
                           width="200">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.isValid"
                              @change="changeIsValid($event,scope.row,4)">
                <el-radio :label="1"
                          size="mini"
                          border>是</el-radio>
                <el-radio :label="0"
                          size="mini"
                          border>否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button @click="editInfoa(scope.row)"
                         type="danger"
                         size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 犹豫期管理 -->

    <!-- 宽限期管理 -->
    <div class="zd-box">
      <p class="zd-title">宽限期管理</p>
      <div class="edit-box">
        <el-form ref="dialogForm5"
                 :inline="true"
                 :model="dialogForm5">
          <el-form-item label="宽限期：">
            <el-input v-model="dialogForm5.dictLabel"
                      size="mini"
                      placeholder="请输入宽限期"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="danger"
                       size="mini"
                       @click="addData(5)">添加</el-button>
            <el-button type="primary"
                       size="mini"
                       @click="clearData(5)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box"
           style="width: 80%">
        <el-table :data="dataSource5"
                  size="mini"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="dictLabel"
                           label="宽限期">
          </el-table-column>

          <el-table-column label="是否可用"
                           width="200">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.isValid"
                              @change="changeIsValid($event,scope.row,5)">
                <el-radio :label="1"
                          size="mini"
                          border>是</el-radio>
                <el-radio :label="0"
                          size="mini"
                          border>否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button @click="editInfoa(scope.row)"
                         type="danger"
                         size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 宽限期管理 -->

    <!-- 等待期管理 -->
    <div class="zd-box">
      <p class="zd-title">等待期管理</p>
      <div class="edit-box">
        <el-form ref="dialogForm6"
                 :inline="true"
                 :model="dialogForm6">
          <el-form-item label="等待期：">
            <el-input v-model="dialogForm6.dictLabel"
                      size="mini"
                      placeholder="请输入等待期"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="danger"
                       size="mini"
                       @click="addData(6)">添加</el-button>
            <el-button type="primary"
                       size="mini"
                       @click="clearData(6)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box"
           style="width: 80%">
        <el-table :data="dataSource6"
                  size="mini"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="dictLabel"
                           label="等待期">
          </el-table-column>

          <el-table-column label="是否可用"
                           width="200">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.isValid"
                              @change="changeIsValid($event,scope.row,6)">
                <el-radio :label="1"
                          size="mini"
                          border>是</el-radio>
                <el-radio :label="0"
                          size="mini"
                          border>否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button @click="editInfoa(scope.row)"
                         type="danger"
                         size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 等待期管理 -->

    <!-- 适合人群管理 -->
    <div class="zd-box">
      <p class="zd-title">适合人群管理</p>
      <div class="edit-box">
        <el-form ref="dialogForm7"
                 :inline="true"
                 :model="dialogForm7">
          <el-form-item label="适合人群：">
            <el-input v-model="dialogForm7.dictLabel"
                      size="mini"
                      placeholder="请输入适合人群"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="danger"
                       size="mini"
                       @click="addData(7)">添加</el-button>
            <el-button type="primary"
                       size="mini"
                       @click="clearData(7)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box"
           style="width: 80%">
        <el-table :data="dataSource7"
                  size="mini"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="dictLabel"
                           label="适合人群">
          </el-table-column>

          <el-table-column label="是否可用"
                           width="200">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.isValid"
                              @change="changeIsValid($event,scope.row,7)">
                <el-radio :label="1"
                          size="mini"
                          border>是</el-radio>
                <el-radio :label="0"
                          size="mini"
                          border>否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button @click="editInfoa(scope.row)"
                         type="danger"
                         size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 适合人群管理 -->

    <!-- 产品标签管理 -->
    <div class="zd-box">
      <p class="zd-title">产品标签管理</p>
      <div class="edit-box">
        <el-form ref="dialogForm8"
                 :inline="true"
                 :model="dialogForm8">
          <el-form-item label="产品标签：">
            <el-input v-model="dialogForm8.dictLabel"
                      size="mini"
                      placeholder="请输入产品标签"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="danger"
                       size="mini"
                       @click="addData(8)">添加</el-button>
            <el-button type="primary"
                       size="mini"
                       @click="clearData(8)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box"
           style="width: 80%">
        <el-table :data="dataSource8"
                  size="mini"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="dictLabel"
                           label="产品标签">
          </el-table-column>

          <el-table-column label="是否可用"
                           width="200">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.isValid"
                              @change="changeIsValid($event,scope.row,8)">
                <el-radio :label="1"
                          size="mini"
                          border>是</el-radio>
                <el-radio :label="0"
                          size="mini"
                          border>否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button @click="editInfoa(scope.row)"
                         type="danger"
                         size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 产品标签管理 -->

    <!-- 产品标签管理 -->
    <div class="zd-box">
      <p class="zd-title">产品服务标签管理</p>
      <div class="edit-box">
        <el-form ref="dialogForm9"
                 :inline="true"
                 :model="dialogForm9">
          <el-form-item label="产品服务标签：">
            <el-input v-model="dialogForm9.dictLabel"
                      size="mini"
                      placeholder="请输入产品服务标签"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="danger"
                       size="mini"
                       @click="addData(9)">添加</el-button>
            <el-button type="primary"
                       size="mini"
                       @click="clearData(9)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box"
           style="width: 80%">
        <el-table :data="dataSource9"
                  size="mini"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="dictLabel"
                           label="产品服务标签">
          </el-table-column>

          <el-table-column label="是否可用"
                           width="200">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.isValid"
                              @change="changeIsValid($event,scope.row,9)">
                <el-radio :label="1"
                          size="mini"
                          border>是</el-radio>
                <el-radio :label="0"
                          size="mini"
                          border>否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button @click="editInfoa(scope.row)"
                         type="danger"
                         size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 产品服务标签管理 -->

    <!-- 医学证明提示管理 -->
    <!-- <div class="zd-box">
      <p class="zd-title">医学证明提示管理</p>
      <div class="edit-box">
        <el-form ref="dialogForm11"
                 :inline="true"
                 :model="dialogForm11">
          <el-form-item label="医学证明提示：">
            <el-input v-model="dialogForm11.dictLabel"
                      size="mini"
                      placeholder="请输入医学证明提示"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="danger"
                       size="mini"
                       @click="addData(11)">添加</el-button>
            <el-button type="primary"
                       size="mini"
                       @click="clearData(11)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box"
           style="width: 80%">
        <el-table :data="dataSource11"
                  size="mini"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="dictLabel"
                           label="提示">
          </el-table-column>

          <el-table-column label="是否可用"
                           width="200">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.isValid"
                              @change="changeIsValid($event,scope.row,11)">
                <el-radio :label="1"
                          border>是</el-radio>
                <el-radio :label="0"
                          type="mini"
                          border>否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div> -->
    <!-- 医学证明提示管理 -->

    <!-- 产品一级类目管理 -->
    <div class="zd-box">
      <p class="zd-title">产品一级类目管理</p>
      <div class="edit-box">
        <el-form ref="dialogForm12"
                 :inline="true"
                 :model="dialogForm12">
          <el-form-item label="产品一级类目：">
            <el-input v-model="dialogForm12.dictLabel"
                      size="mini"
                      placeholder="请输入产品一级类目"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="danger"
                       size="mini"
                       @click="addData(12)">添加</el-button>
            <el-button type="primary"
                       size="mini"
                       @click="clearData(12)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box"
           style="width: 80%">
        <el-table :data="dataSource12"
                  size="mini"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="dictLabel"
                           label="类目名称">
          </el-table-column>
          <el-table-column prop="id"
                           label="id">
          </el-table-column>

          <el-table-column label="是否可用"
                           width="200">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.isValid"
                              @change="changeIsValid($event,scope.row,12)">
                <el-radio :label="1"
                          size="mini"
                          border>是</el-radio>
                <el-radio :label="0"
                          size="mini"
                          border>否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button @click="editInfoa(scope.row)"
                         type="danger"
                         size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 产品一级类目管理 -->

    <!-- 产品二级类目健康险子类管理 -->
    <div class="zd-box">
      <p class="zd-title">产品二级类目管理</p>
      <div class="edit-box">
        <el-form ref="dialogForm13"
                 :inline="true"
                 :model="dialogForm13">
          <el-form-item label="二级类目名称：">
            <el-input v-model="dialogForm13.dictLabel"
                      size="mini"
                      placeholder="请输入二级类目名称"></el-input>
          </el-form-item>

          <el-form-item label="父类Id：">
            <el-input v-model="dialogForm13.parentId"
                      size="mini"
                      placeholder="请输入父类Id"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="danger"
                       size="mini"
                       @click="addData(13)">添加</el-button>
            <el-button type="primary"
                       size="mini"
                       @click="clearData(13)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box"
           style="width: 80%">
        <el-table :data="dataSource13"
                  size="mini"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="dictLabel"
                           label="二级类目名称">
          </el-table-column>

          <el-table-column prop="parentId"
                           label="父类ID">
          </el-table-column>

          <el-table-column label="是否可用"
                           width="180">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.isValid"
                              @change="changeIsValid($event,scope.row,13)">
                <el-radio :label="1"
                          size="mini"
                          border>是</el-radio>
                <el-radio :label="0"
                          size="mini"
                          border>否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button @click="editInfoa(scope.row)"
                         type="danger"
                         size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 二级类目健康险管理 -->

    <el-dialog title='编辑'
               width="465px"
               center
               :visible.sync="dialogVisiblea">
      <span>
        <el-form :inline="true"
                 :model="formInlinea"
                 class="demo-form-inline">
          <el-form-item label="字典值"
                        class="keyword-search">
            <el-input v-model="formInlinea.dictLabel"
                      width="50"
                      size="mini"
                      placeholder=""></el-input>

          </el-form-item>
        </el-form>
      </span>
      <span>
        <el-button size="mini"
                   @click="dialogVisiblea = false">取 消</el-button>
        <el-button type="primary"
                   size="mini"
                   @click="editDataa()">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog title='编辑'
               width="465px"
               center
               :visible.sync="dialogVisibleb">
      <span>
        <el-form :inline="true"
                 :model="formInlineb"
                 class="demo-form-inline">
          <el-form-item label="字典值"
                        class="keyword-search">
            <el-input v-model="formInlineb.dictLabel"
                      width="50"
                      size="mini"
                      placeholder=""></el-input>

          </el-form-item>
          <el-form-item label="ID规则"
                        class="keyword-search">
            <el-input v-model="formInlineb.dictAb"
                      width="50"
                      size="mini"
                      placeholder=""></el-input>

          </el-form-item>

          <el-form-item label="logo图标：">
            <el-upload class="avatar-uploader avatar-uploader2"
                       :data="uploadKey"
                       :action="dataApi"
                       :limit="1"
                       ref="files2"
                       :show-file-list="false"
                       :on-success="handleAvatarSuccess2">
              <img v-if="formInlineb.dictImg"
                   :src="formInlineb.dictImg"
                   class="avatar">
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </span>
      <span>
        <el-button size="mini"
                   @click="dialogVisibleb = false">取 消</el-button>
        <el-button type="primary"
                   size="mini"
                   @click="editDatab()">保 存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

export default {
  filters: {

  },
  data() {
    return {
      uploadKey: {
        dict: 'zd',
        userId: localStorage.getItem('id'),
        bussId: localStorage.getItem('id'),
      },
      dataApi: `${this.baseUrlupload}/consul/api/file/v1/upload`,

      dataSource1: [],
      dialogForm1: {
        dictLabel: '',
        dictType: 'insure_company',
        isValid: 1,
        dictAb: '',
        dictImg: '',
      },

      dataSource2: [],
      dialogForm2: {
        dictLabel: '',
        dictType: 'pay_rate',
        isValid: 1,
      },

      dataSource3: [],
      dialogForm3: {
        dictLabel: '',
        dictType: 'pay_period',
        isValid: 1,
      },

      dataSource4: [],
      dialogForm4: {
        dictLabel: '',
        dictType: 'youyu_period',
        isValid: 1,
      },

      dataSource5: [],
      dialogForm5: {
        dictLabel: '',
        dictType: 'kx_period',
        isValid: 1,
      },

      dataSource6: [],
      dialogForm6: {
        dictLabel: '',
        dictType: 'wait_period',
        isValid: 1,
      },

      dataSource7: [],
      dialogForm7: {
        dictLabel: '',
        dictType: 'people_suit',
        isValid: 1,
      },

      dataSource8: [],
      dialogForm8: {
        dictLabel: '',
        dictType: 'pro_tag',
        isValid: 1,
      },

      dataSource9: [],
      dialogForm9: {
        dictLabel: '',
        dictType: 'serv_tag',
        isValid: 1,
      },

      dataSource10: [],
      dialogForm10: {
        dictLabel: '',
        dictType: 'pay_type',
        isValid: 1,
      },

      dataSource11: [],
      dialogForm11: {
        dictLabel: '',
        dictType: 'mec_tip',
        isValid: 1,
      },

      dataSource12: [],
      dialogForm12: {
        dictLabel: '',
        dictType: 'insure_type_one',
        isValid: 1,
      },

      dataSource13: [],
      dialogForm13: {
        dictLabel: '',
        parentId: '',
        dictType: 'insure_type_two',
        isValid: 1,
      },

      dialogVisiblea: false,
      formInlinea: {
        dictLabel: '',
      },

      dialogVisibleb: false,
      formInlineb: {
        dictLabel: '',
        dictType: '',
        isValid: '',
        dictAb: '',
        dictImg: '',
        dictId: '',
      },
    }
  },

  methods: {
    editInfoa(row) {
      this.formInlinea = JSON.parse(JSON.stringify(row));
      this.formInlinea.dictId = this.formInlinea.id;
      this.dialogVisiblea = true;
    },
    editInfob(row) {
      this.formInlineb = JSON.parse(JSON.stringify(row));
      this.formInlineb.dictId = this.formInlineb.id;
      console.log(this.formInlineb,222);
      this.dialogVisibleb = true;
    },
    handleAvatarSuccess(res) {
      this.dialogForm1.dictImg = res.data;
    },
    handleAvatarSuccess2(res) {
      this.formInlineb.dictImg = res.data;
    },
    editDatab() {
      this.$get(`${this.baseUrlh}/dictData/front/v1/saveDict`, this.formInlineb).then((res) => {
        this.init()
        this.$message({
          type: 'success',
          message: '修改成功',
        });
        this.dialogVisibleb = false;
      })
    },
    editDataa() {
      this.$get(`${this.baseUrlh}/dictData/front/v1/saveDict`, this.formInlinea).then((res) => {
        this.init()
        this.$message({
          type: 'success',
          message: '修改成功',
        });
        this.dialogVisiblea = false;
      })
    },
    addData(type) {
      if (type == 1) {
        if (!this.dialogForm1.dictLabel || !this.dialogForm1.dictAb || !this.dialogForm1.dictImg) {
          this.$message({
            type: 'error',
            message: '填写不完整',
          });
          return
        }
        this.$get(`${this.baseUrlh}/dictData/front/v1/saveDict`, this.dialogForm1).then((res) => {
          this.getList1()
        })
      } else {
        if (type == 13 || type == 14 || type == 15 || type == 16) {
          if (!this[`dialogForm${type}`].dictLabel || !this[`dialogForm${type}`].parentId) {
            this.$message({
              type: 'error',
              message: '填写不完整',
            });
            return
          }
        } else {
          if (!this[`dialogForm${type}`].dictLabel) {
            this.$message({
              type: 'error',
              message: '填写不完整',
            });
            return
          }
        }

        this.$get(`${this.baseUrlh}/dictData/front/v1/saveDict`, this[`dialogForm${type}`]).then((res) => {
          this[`getList${type}`]()
        })
      }


    },
    changeIsValid(e, row, type) {
      if (type == 1) {
        this.$get(`${this.baseUrlh}/dictData/front/v1/saveDict`, {
          dictLabel: row.dictLabel,
          dictType: row.dictType,
          isValid: e,
          dictAb: row.dictAb,
          dictImg: row.dictImg,
          dictId: row.id,
        }).then((res) => {
          this.getList1()
        })
      } else if (type == 13 || type == 14 || type == 15 || type == 16) {
        this.$get(`${this.baseUrlh}/dictData/front/v1/saveDict`, {
          dictLabel: row.dictLabel,
          dictType: row.dictType,
          isValid: e,
          dictId: row.id,
          parentId: row.parentId,
        }).then((res) => {
          this[`getList${type}`]()
        })
      } else {
        this.$get(`${this.baseUrlh}/dictData/front/v1/saveDict`, {
          dictLabel: row.dictLabel,
          dictType: row.dictType,
          isValid: e,
          dictId: row.id,
        }).then((res) => {
          this[`getList${type}`]()
        })
      }

    },
    clearData(type) {
      if (type == 1) {
        this.dialogForm1 = {
          dictLabel: '',
          dictType: 'insure_company',
          isValid: 1,
          dictAb: '',
          dictImg: ''
        };
      } else {
        this[`dialogForm${type}`].dictLabel = '';
      }
    },


    getList1() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'insure_company',
        isValid: '',
      }).then((res) => {
        this.dataSource1 = res.data;
      })
    },
    getList2() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'pay_rate',
        isValid: '',
      }).then((res) => {
        this.dataSource2 = res.data;
      })
    },
    getList3() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'pay_period',
        isValid: '',
      }).then((res) => {
        this.dataSource3 = res.data;
      })
    },
    getList4() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'youyu_period',
        isValid: '',
      }).then((res) => {
        this.dataSource4 = res.data;
      })
    },
    getList5() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'kx_period',
        isValid: '',
      }).then((res) => {
        this.dataSource5 = res.data;
      })
    },
    getList6() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'wait_period',
        isValid: '',
      }).then((res) => {
        this.dataSource6 = res.data;
      })
    },
    getList7() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'people_suit',
        isValid: '',
      }).then((res) => {
        this.dataSource7 = res.data;
      })
    },
    getList8() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'pro_tag',
        isValid: '',
      }).then((res) => {
        this.dataSource8 = res.data;
      })
    },
    getList9() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'serv_tag',
        isValid: '',
      }).then((res) => {
        this.dataSource9 = res.data;
      })
    },

    getList10() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'pay_type',
        isValid: '',
      }).then((res) => {
        this.dataSource10 = res.data;
      })
    },

    getList11() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'mec_tip',
        isValid: '',
      }).then((res) => {
        this.dataSource11 = res.data;
      })
    },

    //产品一二级配置
    getList12() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'insure_type_one',
        isValid: '',
      }).then((res) => {
        this.dataSource12 = res.data;
      })
    },

    getList13() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'insure_type_two',
        isValid: '',
      }).then((res) => {
        this.dataSource13 = res.data;
      })
    },

    init() {
      this.getList1();
      this.getList2();
      this.getList3();
      this.getList4();
      this.getList5();
      this.getList6();
      this.getList7();
      this.getList8();
      this.getList9();
      this.getList10();
      this.getList11();

      this.getList12();
      this.getList13();
    },

  },

  created() {
    this.init();
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
.zd-box {
  margin: 15px 0 25px;
}
.zd-title {
  padding-bottom: 10px;
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 20px;
}

.avatar-uploader2 .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader2 .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader2 .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 42px;
  line-height: 42px;
  text-align: center;
}
.avatar-uploader2 .avatar {
  width: 150px;
  height: 42px;
  display: block;
}
.table-img {
  height: 50px;
}
</style>
