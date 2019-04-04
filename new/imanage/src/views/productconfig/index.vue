<template>
  <div class="app-container">
    <p class="page-title">保险产品配置</p>
    <div class="search">
      <el-form :inline="true"
               :model="formInline"
               class="demo-form-inline">
        <el-form-item label="关键字"
                      class="keyword-search">
          <el-input v-model="formInline.keyword"
                    width="400"
                    size="mini"
                    @keyup.enter.native="getList"
                    placeholder="请输入名称、简称、ID或供应商"></el-input>

        </el-form-item>
        <el-form-item>
          <el-button type="danger"
                     size="mini"
                     @click="search">查询</el-button>
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
      <el-table-column label="保险产品名称">
        <template slot-scope="scope">
          {{scope.row.product.productName}}
        </template>
      </el-table-column>
      <el-table-column label="保险产品ID">
        <template slot-scope="scope">
          {{scope.row.product.productDm}}
        </template>
      </el-table-column>

      <el-table-column label="供应商">
        <template slot-scope="scope">
          {{scope.row.product.insureCompa}}
        </template>
      </el-table-column>
      <el-table-column prop="insureCertificateNum"
                       width="250"
                       label="险种列表">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.insureTypes">
            {{item.insureDm}}--{{item.insureTypeN}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          {{scope.row.product.modifyTime}}
        </template>
      </el-table-column>
      <el-table-column label="上下架状态">
        <template slot-scope="scope">
          {{scope.row.product.isShelf==1?'上架':'下架'}}
        </template>
      </el-table-column>
      <el-table-column label="上下架时间">
        <template slot-scope="scope">
          {{scope.row.product.shelfTime}}
        </template>
      </el-table-column>
      <el-table-column label="版本">
        <template slot-scope="scope">
          {{scope.row.product.versionFormat}}
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       fixed="right"
                       width="160">
        <template slot-scope="scope">
          <el-button @click="editItem(scope.row)"
                     type="danger"
                     size="mini">{{scope.row.product.id===scope.row.product.lastestId?'编辑':'查看'}}</el-button>
          <el-button @click="proShelf(scope.row)"
                     type="success"
                     size="mini"> {{scope.row.product.isShelf==1?'下架':'上架'}}</el-button>
          <!-- <el-button @click="setScheme(scope.row)"
                     type="primary"
                     size="mini">方案配置</el-button> -->
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

    <!-- 添加险种dialog -->
    <el-dialog title='险种详情'
               width="70%"
               :visible.sync="dialogVisible4">
      <span class="product-idetail">
        <div><span>供应商： </span><span>{{insuranceDetailObj.insureCompa}}</span></div>
        <div><span>产品大类： </span><span>{{insuranceDetailObj.productType}}--{{insuranceDetailObj.productType1}}</span></div>
        <div><span>险种名称： </span><span>{{insuranceDetailObj.insureTypeN}}</span></div>
        <div><span>险种简称： </span><span>{{insuranceDetailObj.insureTypeJ}}</span></div>
        <div><span>主附险： </span><span>{{insuranceDetailObj.mainAtta==1?'附加险':'主险'}}</span></div>
        <div><span>险种代码： </span><span>{{insuranceDetailObj.insureCompa}}</span></div>
        <div><span>险种条款： </span><span><a style="color:red;"
               target="_blank"
               :href="insuranceDetailObj.insureTypeC">点击查看</a></span></div>
        <div><span>费率表： </span><span><a style="color:red;"
               target="_blank"
               :href="insuranceDetailObj.rateTable">点击查看</a></span></div>
        <div><span>保险期间： </span><span>{{insuranceDetailObj.insurePerio}}</span></div>
        <div><span>交费频率： </span><span>{{insuranceDetailObj.payRate}}</span></div>
        <div><span>交费期间： </span><span>{{insuranceDetailObj.payPeriod}}</span></div>
        <div><span>交费方式： </span><span>{{insuranceDetailObj.payType}}</span></div>
        <div><span>犹豫期： </span><span>{{insuranceDetailObj.youyuPeriod}}</span></div>
        <div><span>等待期： </span><span>{{insuranceDetailObj.waitPeriod}}</span></div>
        <div><span>宽限期： </span><span>{{insuranceDetailObj.kxPeriod}}</span></div>
        <div><span>手续费： </span><span>{{insuranceDetailObj.poundage}}</span></div>

      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible4 = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 添加险种dialog -->
    <el-dialog title='方案配置'
               width="80%"
               :visible.sync="dialogVisible5">
      <span>
        <el-table :data="schemeArr"
                  size="mini"
                  border
                  style="width: 100%">
          <el-table-column label="方案名称">
            <template slot-scope="scope">
              <span>{{scope.row.grouding.schemeName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="方案ID">
            <template slot-scope="scope">
              <span>{{scope.row.grouding.schemeId}}</span>
            </template>
          </el-table-column>
          <el-table-column label="方案状态">
            <template slot-scope="scope">
              <span>{{scope.row.grouding.schemeState?scope.row.grouding.schemeState:'--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作时间"
                           width="200">
            <template slot-scope="scope">
              <span>{{scope.row.grouding.optDate?scope.row.grouding.optDate:'--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作人">
            <template slot-scope="scope">
              <span>{{scope.row.grouding.optMan?scope.row.grouding.optMan:'--'}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作"
                           width="160">
            <template slot-scope="scope">
              <el-button type="danger"
                         @click="changeSchemeStatus(scope.row)"
                         size="mini">{{scope.row.grouding.schemeState=='上架'?'下架':'上架'}}</el-button>
            </template>
          </el-table-column>
        </el-table>

      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible5 = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 添加险种dialog -->
    <el-dialog title='添加险种'
               width="80%"
               :visible.sync="dialogVisible2">
      <span>
        <div style="margin-bottom:15px;">
          搜索条件 &nbsp&nbsp<el-input v-model="xzKeyword"
                    style="width:50%"
                    size="mini"
                    placeholder="请输入险种名称、险种代码或备案编号"></el-input>
          <el-button type="primary"
                     @click="searchAllxz"
                     size="mini">搜索</el-button>
        </div>
        <div>
          <el-transfer v-model="arrxzv"
                       :button-texts="['删除', '添加']"
                       :data="arrxz"></el-transfer>
        </div>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary"
                   @click="sureinfo2">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 添加方案dialog -->
    <el-dialog title='添加方案'
               width="80%"
               :visible.sync="dialogVisible3">
      <span>
        <el-form ref="dialogForm"
                 label-width="140px">
          <el-form-item label="方案名称："
                        prop="">
            <el-input v-model="schemeNew.scheme.schemeName"
                      style="width:200px;"
                      placeholder="请输入产品名称"></el-input>
          </el-form-item>
          <!-- <el-form-item label="方案代码："
                        prop="">
            <el-input v-model="schemeNew.scheme.schemeDm"
                      style="width:200px;"
                      placeholder="请输入方案代码"></el-input>
          </el-form-item> -->
          <el-form-item label="可选险种列表："
                        prop="">
            <el-table :data="insureTypesxxx"
                      size="mini"
                      ref="multipleTable"
                      @selection-change="selectInsureTypes1"
                      border
                      style="width: 100%">
              <el-table-column type="selection"
                               width="55">
              </el-table-column>
              <el-table-column prop="insureDm"
                               label="险种&代码">
              </el-table-column>
              <el-table-column prop="insureTypeJ"
                               label="险种简称">
              </el-table-column>
              <el-table-column prop="insureCompa"
                               label="供应商">
              </el-table-column>
              <el-table-column prop="recordNum"
                               label="备案编号">
              </el-table-column>
              <el-table-column label="操作"
                               width="160">
                <template slot-scope="scope">
                  <el-button type="info"
                             @click="showIsuranceDetail(scope.row)"
                             size="mini">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="责任&索赔相关：">
            <div class="premise-box"
                 :key="index"
                 style="margin-bottom:40px;border-bottom:1px solid #ddd;"
                 v-for="(item,index) in schemeNew.preconditions">
              <div>
                <span>保险标的&nbsp&nbsp</span>
                <el-input v-model="item.precondition.preconditionName"
                          size="mini"
                          style="width:200px;margin-right: 15px;"
                          placeholder="请输入保险标的"></el-input>
                <el-button type="info"
                           icon="el-icon-plus"
                           @click="addPrecondition(schemeNew.preconditions)"
                           size="mini">添加</el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           v-if="index!=0"
                           @click="deletItem(schemeNew.preconditions,index)"
                           size="mini">删除</el-button>
              </div>
              <div class="zrsp-box">
                <el-radio-group :value="item.tabPosition"
                                @input="changeInput(index,arguments[0])"
                                style="margin-bottom: 15px;margin-top: 20px;">
                  <el-radio-button label="right">自定义保障责任</el-radio-button>
                  <el-radio-button label="left">自定义保索赔项目</el-radio-button>
                </el-radio-group>

                <div class="zr-box"
                     :key="indexzr"
                     v-for="(itemzr,indexzr) in item.responses"
                     v-if="item.tabPosition=='right'">
                  <span>责任名称&nbsp&nbsp</span>
                  <el-input v-model="itemzr.responseName"
                            size="mini"
                            style="width:300px;"
                            placeholder="请输入责任名称"></el-input>
                  <span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp保额&nbsp&nbsp</span>
                  <el-input v-model="itemzr.responseMoney"
                            size="mini"
                            style="width:100px;margin-right: 15px;"
                            placeholder="请输入保额"></el-input>
                  <el-button type="info"
                             icon="el-icon-plus"
                             @click="addResponse(item.responses)"
                             size="mini">添加</el-button>
                  <el-button type="danger"
                             v-if="indexzr!=0"
                             @click="deletItem(item.responses,indexzr)"
                             icon="el-icon-delete"
                             size="mini">删除</el-button>
                </div>
                <div class="sp-box"
                     :key="indexsp"
                     v-for="(itemsp,indexsp) in item.precondition.claimName"
                     v-if="item.tabPosition=='left'">
                  <span>索赔项目名称&nbsp&nbsp</span>
                  <el-input v-model="itemsp.v"
                            size="mini"
                            style="width:300px;margin-right: 15px;"
                            placeholder="请输入索赔项目名称"></el-input>
                  <span>医学证明提示&nbsp&nbsp</span>
                  <el-input v-model="itemsp.v2"
                            type="textarea"
                            style="width:300px;margin-right: 15px;"
                            placeholder="请输入医学证明提示"></el-input>
                  <el-button type="info"
                             icon="el-icon-plus"
                             @click="addClaimname(item.precondition.claimName)"
                             size="mini">添加</el-button>
                  <el-button type="danger"
                             v-if="indexsp!=0"
                             @click="deletItem(item.precondition.claimName,indexsp)"
                             icon="el-icon-delete"
                             size="mini">删除</el-button>
                </div>
              </div>
            </div>
          </el-form-item>

        </el-form>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary"
                   @click="sureinfo3">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗main -->
    <el-dialog :title='title'
               width="80%"
               :visible.sync="dialogVisible">
      <span>
        <el-form ref="dialogForm"
                 :rules="rules"
                 :model="dialogForm"
                 label-width="120px">
          <el-form-item label="产品名称："
                        prop="">
            <el-input v-model="dialogForm.product.productName"
                      style="width:200px;"
                      placeholder="请输入产品名称"></el-input>
          </el-form-item>
          <el-form-item label="产品简称：">
            <el-input v-model="dialogForm.product.productJc"
                      style="width:200px;"
                      placeholder="请输入产品简称"></el-input>
          </el-form-item>
          <el-form-item label="产品最低价：">
            <el-input v-model="dialogForm.product.floorPrice"
                      style="width:200px;"
                      placeholder="请输入最低价"></el-input>元
          </el-form-item>

          <el-form-item label="供应商："
                        prop="">
            <el-select v-model="dialogForm.product.insureCompa"
                       placeholder="请选择">
              <el-option v-for="(item,index) in companyList"
                         :key="index"
                         :label="item.dictLabel"
                         :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 跳转地址 -->
          <!-- <el-form-item label="对接公司："
                        v-if="title != '新增'">
            <el-input v-model="dialogForm.cooperation.companyName"
                      style="width:200px;"
                      placeholder="请输入对接公司"></el-input>
          </el-form-item> -->
          <el-form-item label="跳转地址：">
            <el-input v-model="dialogForm.product.callbackUrl"
                      style="width:60%;"
                      placeholder="请输入跳转地址"></el-input>
          </el-form-item>

          <el-form-item label="投保须知："
                        prop="">
            <span>
              <el-upload class="avatar-uploader"
                         :data="uploadKey"
                         :action="dataApi"
                         :limit="1"
                         ref="files"
                         :file-list="filelist1"
                         :on-remove="handleRemove"
                         :on-exceed="handleExceed"
                         :on-success="handleAvatarSuccess"
                         :before-upload="beforeAvatarUpload">
                <el-button type="info"
                           size="mini">点击上传</el-button>
              </el-upload>
            </span>
          </el-form-item>

          <el-form-item label="投保声明："
                        prop="">
            <span>
              <el-upload class="avatar-uploader"
                         :data="uploadKey"
                         :action="dataApi"
                         :limit="1"
                         ref="files"
                         :file-list="filelist2"
                         :on-remove="handleRemove2"
                         :on-exceed="handleExceed2"
                         :on-success="handleAvatarSuccess2"
                         :before-upload="beforeAvatarUpload2">
                <el-button type="info"
                           size="mini">点击上传</el-button>
              </el-upload>
            </span>
          </el-form-item>

          <el-form-item label="保障详情："
                        prop="">
            <span>
              <el-upload class="avatar-uploader"
                         :data="uploadKey"
                         :action="dataApi"
                         :limit="1"
                         ref="files"
                         :file-list="filelist3"
                         :on-remove="handleRemove3"
                         :on-exceed="handleExceed3"
                         :on-success="handleAvatarSuccess3"
                         :before-upload="beforeAvatarUpload3">
                <el-button type="info"
                           size="mini">点击上传</el-button>
              </el-upload>
            </span>
          </el-form-item>

          <el-form-item label="商详："
                        prop="">
            <span>
              <el-upload class="avatar-uploader"
                         :data="uploadKey"
                         :action="dataApi"
                         :limit="1"
                         ref="files"
                         :file-list="filelist4"
                         :on-remove="handleRemove4"
                         :on-exceed="handleExceed4"
                         :on-success="handleAvatarSuccess4"
                         :before-upload="beforeAvatarUpload4">
                <el-button type="info"
                           size="mini">点击上传</el-button>
              </el-upload>
            </span>
          </el-form-item>

          <el-form-item label="险种信息：">
            <div>
              <el-button type="primary"
                         @click="showDialog2"
                         size="mini">添加险种</el-button>
            </div>
            <el-table :data="dialogForm.insureTypes"
                      size="mini"
                      border
                      style="width: 100%">
              <el-table-column label="险种条款名称&代码">
                <template slot-scope="scope">
                  <span>{{getInsuranceName(scope.row.insureTypeC)}}--{{scope.row.insureDm}}</span>
                </template>
              </el-table-column>
              <el-table-column label="费率表">
                <template slot-scope="scope">
                  <a :href="scope.row.rateTable"
                     target="_blank">{{scope.row.rateTable}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="insureCompa"
                               label="供应商">
              </el-table-column>
              <el-table-column prop="recordNum"
                               label="备案编号">
              </el-table-column>
              <el-table-column label="操作"
                               width="160">
                <template slot-scope="scope">
                  <el-button type="info"
                             @click="showIsuranceDetail(scope.row)"
                             size="mini">查看</el-button>
                  <el-button type="danger"
                             @click="delInsuranceItem(scope.row,scope.$index)"
                             size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

          </el-form-item>
          <el-form-item label="方案信息：">
            <div>
              <el-button type="primary"
                         @click="showDialog3"
                         size="mini">添加方案</el-button>
            </div>
            <el-table :data="dialogForm.schemes"
                      size="mini"
                      border
                      style="width: 100%">

              <el-table-column label="方案名称">
                <template slot-scope="scope">
                  <span>{{scope.row.scheme.schemeName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="险种名称&代码">
                <template slot-scope="scope">
                  <div v-for="(itemb,index) in scope.row.insureTypes">
                    {{itemb.insureTypeN}}--{{itemb.insureDm}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="保险标的">
                <template slot-scope="scope">
                  <div v-for="(item,index) in scope.row.preconditions"
                       :key="index">{{item.precondition.preconditionName}}</div>
                </template>
              </el-table-column>
              <el-table-column label="保障责任&保额">
                <template slot-scope="scope">
                  <div v-for="(item,index) in scope.row.preconditions"
                       :key="index">
                    <div v-for="(itemi,indexi) in item.responses"
                         :key="indexi">
                      {{itemi.responseName}}--{{itemi.responseMoney}}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="索赔项目">
                <template slot-scope="scope">
                  <div v-for="(item,index) in scope.row.preconditions"
                       :key="index">
                    {{getclaimName(item.precondition.claimName)}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作"
                               width="160">
                <template slot-scope="scope">
                  <el-button type="info"
                             @click="changScheme(scope.row)"
                             size="mini">修改</el-button>
                  <el-button type="danger"
                             @click="deleteScheme(scope.row,scope.$index)"
                             size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

          </el-form-item>

          <el-form-item label="手续费：">
            <el-input v-model="dialogForm.product.seviceFee"
                      style="width:200px;"
                      placeholder="请输入手续费"></el-input>%
          </el-form-item>

          <el-form-item label="适合人群：">
            <el-select v-model="dialogForm.product.suitableCrow"
                       style="width:60%;"
                       multiple
                       placeholder="请选择">
              <el-option v-for="item in peoplesuitList"
                         :key="item.id"
                         :label="item.dictLabel"
                         :value="item.dictLabel">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="产品标签：">
            <!-- <el-select v-model="dialogForm.product.productTag"
            @change="changeproductTag($event)"
                       style="width:60%;margin-bottom:15px;"
                       multiple
                       filterable
                       placeholder="请选择">
              <el-option v-for="item in protagList"
                         :key="item.id"
                         :label="item.dictLabel"
                         :value="item.id">
              </el-option>
            </el-select> -->
            <div class="tags-box"
                 style="width:100%;padding:10px;border: 1px solid #dcdfe6;min-height:60px;margin-bottom:15px;">
              <el-button v-for="(tag,index) in protagList"
                         type="primary"
                         :key="index"
                         size="mini"
                         style=""
                         v-if="tag.show!=1"
                         @click="clickTags(tag)">
                {{tag.dictLabel}}
              </el-button>
            </div>

            <div class="tags-box"
                 style="width:100%;padding:10px;border: 1px solid #dcdfe6;min-height:60px;">
              <el-tag v-for="(tag,index) in protagList"
                      style="margin-right:10px;"
                      v-if="tag.show==1"
                      size="small"
                      :key="index"
                      @close="handleClose(tag)"
                      closable>
                {{tag.dictLabel}}
              </el-tag>
            </div>
          </el-form-item>

          <el-form-item label="h5地址：">
            <el-input v-model="dialogForm.product.h5Url"
                      style="width:60%;"
                      placeholder="请输入h5地址"></el-input>
          </el-form-item>

          <el-form-item label="pc端地址：">
            <el-input v-model="dialogForm.product.pcUrl"
                      style="width:60%;"
                      placeholder="请输入pc端地址"></el-input>
          </el-form-item>

          <el-form-item label="生成新版本："
                        v-if="title=='编辑'">
            <el-radio-group v-model="dialogForm.product.isNewVersion">
              <el-radio :label="1"
                        border>是</el-radio>
              <el-radio :label="0"
                        border>否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="版本备注："
                        v-if="title=='编辑'">
            <el-input v-model="dialogForm.product.versionRemark"
                      style="width:600px;"
                      type="textarea"
                      :autosize="{minRows: 3, maxRows: 6}"
                      placeholder="请填写产品版本备注"></el-input>
          </el-form-item>

        </el-form>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   v-if="showSave"
                   @click="sureinfo">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {

  data() {
    return {
      showSave: true,
      tags: [
        { name: '标签一' },
        { name: '标签二' },
        { name: '标签三' },
        { name: '标签四' },
        { name: '标签五' }
      ],
      peoplesuitList: [],
      protagList: [],


      dialogVisible5: false,
      schemeArr: [],
      insuranceDetailObj: {},
      dialogVisible4: false,
      insureTypesxxx: [],
      tabPosition: 'right',
      companyList: [],
      formInline: {
        keyword: '',
      },
      dialogForm: {
        product: {
          productName: '',
          productJc: '',
          floorPrice: '',
          insureCompa: '',
          insureNotic: '',
          insureDecla: '',
          securityDet: '',
          tradeDetail: '',
          modifyTime: null,
          createTime: null,

          seviceFee: '',
          suitableCrow: [],
          productTag: [],
          h5Url: '',
          pcUrl: '',
          isNewVersion: 1,
          versionRemark: '',

          callbackUrl: '',
        },
        // cooperation: {
        //   companyName: '',
        //   callbackUrl: '',
        // },
        insureTypes: [],
        schemes: [

        ],

      },
      schemeNew: {
        scheme: {
          schemeName: '',
          schemeMoney: '',
          insureType: '',
        },
        insureTypes: [],
        preconditions: [
          {
            precondition: {
              preconditionName: '',
              claimName: [{ v: '', v2: '' }],
            },
            tabPosition: 'right',
            responses: [
              {
                responseName: '',
                responseMoney: '',
              }
            ],
          }
        ]
      },
      rules: {

      },

      title: '新增',
      pageIndex: 1,
      pageSize: 6,
      dataSource: [],
      total: 0,
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      xzKeyword: '',
      arrxzv: [],
      arrxz: [],
      arrxzOrigin: [],


      filelist1: [],
      filelist2: [],
      filelist3: [],
      filelist4: [],
      uploadKey: {
        dict: 'product',
        userId: localStorage.getItem('id'),
        bussId: localStorage.getItem('id'),
      },

      allInsuranceTypes: [],
      isAddScheme: false,
      productId: '',
      // /consul/api/file/v1/upload   /consul/api/upload/v1/upload
      dataApi: `${this.baseUrlupload}/consul/api/file/v1/upload`,

    }
  },
  created() {
    this.getList();
    this.getAlllist();
    this.getAllInsuranceType();
  },
  methods: {
    getclaimName(v) {
      let arr = [];
      v.forEach(item => {
        arr.push(item.v);
      })
      return arr.join(',');
    },

    handleClose(tag) {
      tag.show = 0;
    },
    clickTags(tag) {
      tag.show = 1;
    },

    getAllInsuranceType() {
      this.$get(`${this.baseUrls}/insureType/front/insureType/all`, {
        insure: '',
        pageIndex: 1,
        pageSize: 200,
      }).then((res) => {
        this.allInsuranceTypes = res.data.list;
      })
    },

    changeInput(i, e) {
      const item = { ...this.schemeNew.preconditions[i], tabPosition: e };
      this.schemeNew.preconditions = [...this.schemeNew.preconditions.slice(0, i), item, ...this.schemeNew.preconditions.slice(i + 1)];
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.pageIndex = 1;
      this.getList();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getList();
    },


    handleRemove(file, fileList) {
      this.dialogForm.product.insureNotic = '';
    },
    handleExceed() {
      this.$message({
        type: 'error',
        message: '只能上传一个文件',
      });
    },
    handleAvatarSuccess(res) {
      this.dialogForm.product.insureNotic = res.data;
    },
    beforeAvatarUpload(file) { },

    handleRemove2(file, fileList) {
      this.dialogForm.product.insureDecla = '';
    },
    handleExceed2() {
      this.$message({
        type: 'error',
        message: '只能上传一个文件',
      });
    },
    handleAvatarSuccess2(res) {
      this.dialogForm.product.insureDecla = res.data;
    },
    beforeAvatarUpload2(file) { },

    handleRemove3(file, fileList) {
      this.dialogForm.product.securityDet = '';
    },
    handleExceed3() {
      this.$message({
        type: 'error',
        message: '只能上传一个文件',
      });
    },
    handleAvatarSuccess3(res) {
      this.dialogForm.product.securityDet = res.data;
    },
    beforeAvatarUpload3(file) { },

    handleRemove4(file, fileList) {
      this.dialogForm.product.tradeDetail = '';
    },
    handleExceed4() {
      this.$message({
        type: 'error',
        message: '只能上传一个文件',
      });
    },
    handleAvatarSuccess4(res) {
      this.dialogForm.product.tradeDetail = res.data;
    },
    beforeAvatarUpload4(file) { },

    showIsuranceDetail(row) {
      this.insuranceDetailObj = row;
      this.dialogVisible4 = true;
    },
    delInsuranceItem(row, index) {

      const arr = [...this.dialogForm.schemes];
      for (let index = 0; index < arr.length; index++) {
        for (let index2 = 0; index2 < arr[index].insureTypes.length; index2++) {
          if (row.id == arr[index].insureTypes[index2].id) {
            this.$message({
              message: '该险种已被方案选择，请先修改方案',
              type: 'error',
            });
            return
          }
        }
      }

      this.$confirm('确定修改产品险种信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogForm.insureTypes.splice(index, 1);
      }).catch(() => {
      });

    },

    addDisabled(v) {
      const arr = [...this.dialogForm.schemes];
      for (let index = 0; index < arr.length; index++) {
        for (let index2 = 0; index2 < arr[index].insureTypes.length; index2++) {
          for (let i = 0; i < v.length; i++) {
            const id = v[i].key;
            if (id == arr[index].insureTypes[index2].id) {
              v[i].disabled = true;
            }
          }
        }
      }
      return v;
    },
    getIdsTooriginItypes(arr) {
      if (!arr.length) {
        return [];
      }
      const arr1 = [...this.allInsuranceTypes];
      const _arr = [];

      arr1.forEach(item => {
        arr.forEach(id => {
          if (item.id == id) {
            _arr.push(item);
          }
        })
      })

      return _arr;
    },
    searchAllxz() {
      this.$get(`${this.baseUrls}/insureType/front/insureType/all`, {
        insure: this.xzKeyword.replace(/\s+/g, ''),
        pageIndex: 1,
        pageSize: 200,
      }).then((res) => {
        let list = res.data.list;
        const arr = [];
        const arr2 = [];

        let _arrxzv = [...this.arrxzv];
        let idsTooriginitypes = this.getIdsTooriginItypes(_arrxzv);
        list = list.concat(idsTooriginitypes);

        let list2 = this.resetArr(list);


        list2.forEach((item) => {
          arr.push({
            key: item.id,
            label: `${item.insureDm}--${item.insureTypeN}--${item.insureCompa}`,
          });
          arr2.push(item);
        });

        // this.arrxz = arr;
        this.arrxz = this.addDisabled(arr);
        this.arrxzOrigin = arr2;
      })
    },
    // 新增修改前提
    addPrecondition(arr) {
      arr.push({
        precondition: {
          preconditionName: '',
          claimName: [{ v: '', v2: '' }],
        },
        tabPosition: 'right',
        responses: [
          {
            responseName: '',
            responseMoney: '',
          }
        ],

      });
    },
    addResponse(arr) {
      arr.push({
        responseName: '',
        responseMoney: '',
      });
    },
    addClaimname(arr) {
      arr.push({ v: '', v2: '' });
    },
    deletItem(arr, i) {
      arr.splice(i, 1);
    },
    changScheme(row) {
      this.isAddScheme = false;
      this.schemeNew = row;
      this.schemeNew.preconditions.forEach(item => {
        item.tabPosition = 'right';
      })

      this.insureTypesxxx = [...this.dialogForm.insureTypes];

      let cinsureType2 = [];
      this.insureTypesxxx.forEach((item1, index1) => {
        this.schemeNew.insureTypes.forEach((item2, index2) => {
          if (item1.id == item2.id) {
            cinsureType2.push(index1)
          }
        })
      });
      this.schemeNew.scheme._insureType = cinsureType2;

      // 默认选中
      setTimeout(() => {
        this.schemeNew.scheme._insureType.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(this.insureTypesxxx[row], true);
        });
      }, 500)

      this.dialogVisible3 = true;


    },
    deleteScheme(row, index) {

      if (row.grouding && row.grouding.schemeState === '上架') {
        this.$message({
          type: 'error',
          message: '该方案是上架状态，不能删除',
        });
        return;
      }
      this.$confirm('确定删除该方案吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogForm.schemes.splice(index, 1);
      }).catch(() => {

      });

    },
    selectInsureTypes1(arr) {
      this.schemeNew.insureTypes = arr;
    },

    showDialog3() {
      this.isAddScheme = true;
      if (!this.dialogForm.insureTypes.length) {
        this.$message({
          type: 'error',
          message: '请先添加险种信息',
        });
        return;
      }

      this.insureTypesxxx = [...this.dialogForm.insureTypes];

      this.schemeNew = {
        scheme: {
          schemeName: '',
          schemeMoney: '',
          insureType: '',
          _insureType: [],
        },
        insureTypes: [],
        preconditions: [
          {
            precondition: {
              preconditionName: '',
              claimName: [{ v: '', v2: '' }],
            },
            tabPosition: 'right',
            responses: [
              {
                responseName: '',
                responseMoney: '',
              }
            ],
          }
        ]
      };

      // 默认选中
      setTimeout(() => {
        this.schemeNew.scheme._insureType.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(this.insureTypesxxx[row], true);
        });
      }, 500)
      this.dialogVisible3 = true;
    },
    getInsuranceName(insureTypeC) {
      if (!insureTypeC) {
        return '';
      }
      let arr = insureTypeC.split('/');
      let last = arr[arr.length - 1]
      return last.slice(0, last.indexOf('.'));
    },
    showDialog2() {
      const arr = [...this.dialogForm.insureTypes];
      let _arr = [];
      let _arrIds = [];
      arr.forEach(item => {
        _arr.push({
          key: item.id,
          label: `${item.insureDm}--${item.insureTypeN}--${item.insureCompa}`,
        });
        _arrIds.push(item.id);
      })

      this.arrxzOrigin = [...this.dialogForm.insureTypes];
      // this.arrxz = _arr;
      this.arrxz = this.addDisabled(_arr);
      this.arrxzv = _arrIds;
      this.dialogVisible2 = true;
    },
    sureinfo3() {
      if (!this.schemeNew.scheme.schemeName) {
        this.$message({
          message: '请输入方案名称',
          type: 'error',
        });
        return
      } else if (!this.schemeNew.insureTypes.length) {
        this.$message({
          message: '请选择险种',
          type: 'error',
        });
        return
      }

      for (let index = 0; index < this.schemeNew.preconditions.length; index++) {
        if (!this.schemeNew.preconditions[index].precondition.preconditionName) {
          this.$message({
            message: '保障前提未填写完整',
            type: 'error',
          });
          return
        }


        for (let index1 = 0; index1 < this.schemeNew.preconditions[index].responses.length; index1++) {
          if (!this.schemeNew.preconditions[index].responses[index1].responseName || !this.schemeNew.preconditions[index].responses[index1].responseMoney) {
            this.$message({
              message: '自定义保障责任未填写完整',
              type: 'error',
            });
            return
          }
        }
        for (let index1 = 0; index1 < this.schemeNew.preconditions[index].precondition.claimName.length; index1++) {
          if (!this.schemeNew.preconditions[index].precondition.claimName[index1].v) {
            this.$message({
              message: '自定义索赔项目未填写完整',
              type: 'error',
            });
            return
          } else if (!this.schemeNew.preconditions[index].precondition.claimName[index1].v2) {
            this.$message({
              message: '自定义索赔项目未填写完整',
              type: 'error',
            });
            return
          }
        }
      }


      // 新增才push
      if (this.isAddScheme) {
        this.dialogForm.schemes.push(this.schemeNew);
      }

      this.dialogVisible3 = false;

    },
    sureinfo2() {
      debugger;
      if (!this.arrxzv.length) {
        this.$message({
          message: '未添加险种，不能保存',
          type: 'error',
        });
        return
      }
      const arr = [...this.arrxzOrigin];
      const arr2 = [...this.arrxzv];
      const _arr = [];
      arr.forEach((item, index) => {
        if (arr2.includes(item.id)) {
          _arr.push(item)
        }
      });

      this.dialogForm.insureTypes = this.resetArr(_arr);
      this.dialogVisible2 = false;
    },
    resetArr(arr) {
      let copyArr = [];
      let _arr = [];
      for (let index = 0; index < arr.length; index++) {
        if (!copyArr.includes(arr[index].id)) {
          copyArr.push(arr[index].id)
          _arr.push(arr[index]);
        }
      }

      return _arr;
    },
    search() {
      this.pageIndex = 1;
      this.getList();
    },
    changeproductTag(v) {
    },
    addItem() {
      this.dialogForm = {
        product: {
          productName: '',
          productJc: '',
          floorPrice: '',
          insureCompa: '',
          insureNotic: '',
          insureDecla: '',
          securityDet: '',
          tradeDetail: '',
          seviceFee: '',
          suitableCrow: [],
          productTag: [],
          h5Url: '',
          pcUrl: '',
          isNewVersion: null,
          versionRemark: '',

          callbackUrl: '',
        },
        // cooperation: {
        //   companyName: '',
        //   callbackUrl: '',
        // },
        insureTypes: [],
        schemes: []
      };

      this.protagList.forEach(item => {
        item.show = 0;
      })

      this.filelist1 = [];
      this.filelist2 = [];
      this.filelist3 = [];
      this.filelist4 = [];
      this.title = '新增';

      this.showSave = true;
      this.dialogVisible = true;
    },
    filelistReset(v1, v2) {
      const arr = v1.split('/');
      v2 = [{
        name: arr[arr.length - 1],
        url: this.dialogForm.insureTypeC
      }];
    },
    editItem(row) {
      if (row.product.id == row.product.lastestId) {
        this.showSave = true;
        if (row.product.isShelf) {
          // this.$message({
          //   message: '请先下架产品再编辑',
          //   type: 'error',
          // });
          // return;
          this.showSave = false;
        }
      } else {
        this.showSave = false;
      }



      this.$get(`${this.baseUrls}/insureType/front/productById/one?productId=${row.product.id}`).then((res) => {
        res.data.product.versionRemark = res.data.product.versionRemark ? res.data.product.versionRemark : '';
        res.data.product.isNewVersion = 1;

        if (res.data.product.suitableCrow) {
          let suitableCrowStrs = res.data.product.suitableCrow.split(',');
          res.data.product.suitableCrow = suitableCrowStrs;
        } else {
          res.data.product.suitableCrow = [];
        }

        if (res.data.product.productTag) {
          let productTagStrs = res.data.product.productTag.split(',');
          this.protagList.forEach(item => {
            item.show = 0;
            productTagStrs.forEach(item2 => {
              if (item.dictLabel == item2) {
                item.show = 1;
              }
            })
          })
        }

        let obj = res.data;
        obj.product.insureCompa = Number(obj.product.insureCompa);

        // if (!obj.cooperation) {
        //   obj.cooperation = {
        //     companyName: '',
        //     callbackUrl: '',
        //   };
        // }

        this.dialogForm = obj;
        if (this.dialogForm.product.insureNotic) {
          const arr = this.dialogForm.product.insureNotic.split('/');
          this.filelist1 = [{
            name: arr[arr.length - 1],
            url: this.dialogForm.product.insureTypeC
          }];
        } else {
          this.filelist1 = [];
        }
        if (this.dialogForm.product.insureDecla) {
          const arr = this.dialogForm.product.insureDecla.split('/');
          this.filelist2 = [{
            name: arr[arr.length - 1],
            url: this.dialogForm.product.insureDecla
          }];
        } else {
          this.filelist2 = [];
        }
        if (this.dialogForm.product.securityDet) {
          const arr = this.dialogForm.product.securityDet.split('/');
          this.filelist3 = [{
            name: arr[arr.length - 1],
            url: this.dialogForm.product.securityDet
          }];
        } else {
          this.filelist3 = [];
        }
        if (this.dialogForm.product.tradeDetail) {
          const arr = this.dialogForm.product.tradeDetail.split('/');
          this.filelist4 = [{
            name: arr[arr.length - 1],
            url: this.dialogForm.product.tradeDetail
          }];
        } else {
          this.filelist4 = [];
        }

        // let dialogForm2 = { ...this.dialogForm };
        let dialogForm2 = JSON.parse(JSON.stringify(this.dialogForm));

        dialogForm2.schemes.forEach((item) => {

          item.preconditions.forEach((itemi) => {
            let arr = itemi.precondition.claimName.split(',');
            // let _arr = itemi.precondition.medicalTips.split(',');
            let _arr = itemi.precondition.medicalTips ? itemi.precondition.medicalTips.split(',') : [];
            let arr2 = [];

            for (let index = 0; index < arr.length; index++) {
              const element = arr[index];
              const _element = _arr[index];
              arr2.push({ v: element, v2: _element });

            }

            itemi.precondition.claimName = arr2;
          })
        })
        this.dialogForm = { ...dialogForm2 };


        this.title = '编辑';
        this.dialogVisible = true;
      })

    },

    proShelf(row) {
      let isShelf = row.product.isShelf;
      let str = isShelf == 1 ? '下架' : '上架';
      this.$get(`${this.baseUrlh}/product/front/v1/shelf`, {
        productId: row.product.id,
        isShelf: isShelf == 1 ? 0 : 1,
      }).then((res) => {
        this.$message({
          type: 'success',
          message: `${str}成功`,
        });
        this.getList();
      })

    },

    changeSchemeStatus(row) {
      let str = row.grouding.schemeState == '上架' ? '下架' : '上架';
      this.$post(`${this.baseUrls}/insureType/front/grouding/add`, {
        optMan: localStorage.getItem('username'),
        schemeId: row.scheme.id,
        schemeState: str,
      }).then((res) => {
        this.$message({
          message: `${str}成功`,
          type: 'success',
        });
        // this.dialogVisible5 = false;
        this.setScheme();
      })
    },
    setScheme(row) {
      if (row) {
        this.productId = row.product.id;
      }
      this.$get(`${this.baseUrls}/insureType/front/productById/one?productId=${this.productId}`).then((res) => {
        this.dialogVisible5 = true;
        let schemes = res.data.schemes;
        schemes.forEach((item) => {
          if (!item.grouding) {
            item.grouding = {
              id: item.scheme.id,
              schemeName: item.scheme.schemeName,
              optDate: '',
              optMan: '',
              optDate: '',
              schemeState: '',
            }
          }
        })
        this.schemeArr = schemes;
      })
    },
    sureinfo() {

      let proArr = [...this.protagList];

      let proArr2 = proArr.filter((item) => {
        return item.show == 1;
      })
      this.dialogForm.product.productTag = proArr2;

      if (!this.dialogForm.product.productName) {
        this.$message({
          message: '请输入产品名称',
          type: 'error',
        });
        return
      } else if (!this.dialogForm.product.productJc) {
        this.$message({
          message: '请输入产品简称',
          type: 'error',
        });
        return
      } else if (!this.dialogForm.product.floorPrice) {
        this.$message({
          message: '请输入价格',
          type: 'error',
        });
        return
      } else if (!this.dialogForm.product.insureCompa) {
        this.$message({
          message: '请选择供应商',
          type: 'error',
        });
        return
      } else if (!this.dialogForm.product.insureNotic) {
        this.$message({
          message: '请上传投保须知',
          type: 'error',
        });
        return
      } else if (!this.dialogForm.product.securityDet) {
        this.$message({
          message: '请上传保障详情',
          type: 'error',
        });
        return
      } else if (!this.dialogForm.insureTypes.length) {
        this.$message({
          message: '请添加险种信息',
          type: 'error',
        });
        return
      } else if (!this.dialogForm.schemes.length) {
        this.$message({
          message: '请添加方案信息',
          type: 'error',
        });
        return
      }

      if (this.title == '编辑' && this.dialogForm.product.isNewVersion && !this.dialogForm.product.versionRemark) {
        this.$message.error('已勾选生成新版本，请填写版本备注');
        return
      }

      if (!this.dialogForm.product.suitableCrow.length) {
        this.$message.error('请选择合适人群');
        return
      }

      if (!this.dialogForm.product.productTag.length) {
        this.$message.error('请选择产品标签');
        return
      }

      let obj = JSON.parse(JSON.stringify(this.dialogForm));

      let obj2 = { ...obj }
      let insureName = this.getIds(obj2.insureTypes).join(',');

      obj.schemes.forEach((item) => {
        item.preconditions.forEach((v) => {
          let arr = [...v.precondition.claimName];
          let arrStr = this.getClaimname(arr);
          let _arrStr = this.getClaimname2(arr);

          v.precondition.claimName = arrStr;
          v.precondition.medicalTips = _arrStr;
        })
      });

      obj.product.insureName = insureName;


      // if (this.title == '新增') {
      //   obj.cooperation = null;
      // }

      //new 
      obj.product.suitableCrow = obj.product.suitableCrow.join(',');

      let proTagarr = [];
      obj2.product.productTag.forEach(item => {
        proTagarr.push(item.dictLabel);
      })
      obj.product.productTag = proTagarr.join(',');


      this.$post(`${this.baseUrls}/insureType/front/product/add`, obj).then((res) => {
        this.$message({
          message: this.title == '编辑' ? '编辑成功' : '新增成功',
          type: 'success',
        });
        this.getList();
        this.dialogVisible = false;
      })

    },
    getClaimname(arr) {
      let str = '';
      arr.forEach((item, index) => {
        if (index == 0) {
          str = `${str}${item.v}`;
        } else {
          str = `${str},${item.v}`
        }
      })
      return str;
    },
    getClaimname2(arr) {
      let str = '';
      arr.forEach((item, index) => {
        if (index == 0) {
          str = `${str}${item.v2}`;
        } else {
          str = `${str},${item.v2}`
        }
      })
      return str;
    },
    getIds(arr) {
      let _arr = [];
      for (let index = 0; index < arr.length; index++) {
        _arr.push(arr[index].id);

      }
      return _arr;
    },
    getList() {
      this.$get(`${this.baseUrls}/insureType/front/productByCondition/all`, {
        insure: this.formInline.keyword,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      }).then((res) => {
        this.dataSource = res.data.list;
      })

      this.$get(`${this.baseUrls}/insureType/front/productByCondition/all`, {
        insure: this.formInline.keyword,
        pageIndex: 1,
        pageSize: 500,
      }).then((res) => {
        this.total = res.data.total;
      })

    },
    getAlllist() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'insure_company',
        isValid: 1,
      }).then((res) => {
        this.companyList = res.data;
      })

      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'people_suit',
        isValid: 1,
      }).then((res) => {
        this.peoplesuitList = res.data;
      })

      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'pro_tag',
        isValid: 1,
      }).then((res) => {
        let { data } = res;
        data.forEach((item) => {
          item.show = 0;
        })
        this.protagList = data;
      })
    },
  }
}
</script>

