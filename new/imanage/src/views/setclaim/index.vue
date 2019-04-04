<template>
  <div class="app-container">
    <p class="page-title">理赔模板配置</p>
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
      <el-table-column label="产品名称">
        <template slot-scope="scope">
          {{scope.row.product.productName}}
        </template>
      </el-table-column>
      <el-table-column label="产品代码">
        <template slot-scope="scope">
          {{scope.row.product.productDm}}
        </template>
      </el-table-column>

      <el-table-column label="供应商">
        <template slot-scope="scope">
          {{scope.row.product.insureCompa}}
        </template>
      </el-table-column>

      <el-table-column label="方案名称">
        <template slot-scope="scope">
          {{scope.row.scheme.schemeName}}
        </template>
      </el-table-column>
      <el-table-column prop="insureCertificateNum"
                       width="250"
                       label="险种列表">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.insureTypes">
            {{item.insureTypeN}}&{{item.insureDm}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="配置状态">
        <template slot-scope="scope">
          {{scope.row.templateOther?'已配置':'未配置'}}
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.templateOther?scope.row.templateOther.createTime:'--'}}
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="scope">
          {{scope.row.templateOther?scope.row.templateOther.modifyTime:'--'}}
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       fixed="right"
                       width="100">
        <template slot-scope="scope">
          <el-button @click="setTemp(scope.row)"
                     type="danger"
                     size="mini">配置</el-button>

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

    <!-- 弹窗 -->
    <el-dialog title='配置理赔方案'
               width="70%"
               v-if="dialogForm"
               :visible.sync="dialogVisible">
      <span>
        <el-form ref="dialogForm"
                 :rules="rules"
                 :model="dialogForm"
                 label-width="170px">

          <el-form-item label="产品名称："
                        size="mini">
            <el-input v-model="productName"
                      :disabled="true"
                      style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="方案名称："
                        size="mini">
            <el-input v-model="schemeName"
                      :disabled="true"
                      style="width:200px;"></el-input>
          </el-form-item>

          <h3 style="color:red;">出险信息</h3>

          <el-form-item label="为谁报案："
                        size="mini">
            <el-radio-group v-model="dialogForm.danger012">
              <el-radio-button :label="0">被保人</el-radio-button>
              <el-radio-button :label="1">附带被保人</el-radio-button>
              <el-radio-button :label="2">投保人</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <!-- 出险信息1  -->
          <div class="abox1"
               v-show="dialogForm.danger012===0">
            <el-form-item label="是否展示本角色："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[0].danger_ishow">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <h4 style="padding-left:20px;">配置出险人属性</h4>
            <el-form-item label="姓名："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[0].danger_property_name">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件类型："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[0].danger_property_certifcate_type">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件号："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[0].danger_property_certifcate_number">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="被保人身份证明："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[0].danger_property_insured_identity">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传提示语："
                          prop="insureTypeN">
              <el-input v-model="dialogForm.templateInsurers[0].danger_property_photo_upload_tip"
                        type="textarea"
                        style="width:200px;"
                        placeholder="请输入"></el-input>
            </el-form-item>
            <h4 style="padding-left:20px;">配置出险人的监护人</h4>
            <el-form-item label="监护人证明："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[0].danger_guardian_certificate">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传提示语："
                          prop="insureTypeN">
              <el-input v-model="dialogForm.templateInsurers[0].danger_guardian_photo_upload_tip"
                        type="textarea"
                        style="width:200px;"
                        placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="医疗证明："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[0].danger_claim_medical_certificate">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传提示语："
                          prop="insureTypeN">
              <el-input v-model="dialogForm.templateInsurers[0].danger_claim_medical_upload_tip"
                        type="textarea"
                        style="width:200px;"
                        placeholder="请输入"></el-input>
            </el-form-item>

            <h4 style="padding-left:20px;">配置出险人索赔项目</h4>
            <el-form-item label="索赔项目展示："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[0].danger_claims_program">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="索赔项目内容：">
              <el-select multiple
                         v-model="dialogForm.templateInsurers[0].danger_claims_program_content"
                         placeholder="请选择">
                <el-option v-for="(item,index) in claimList"
                           :key="index"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>

            <h4 style="padding-left:20px;">配置出险时间</h4>
            <el-form-item label="出险时间："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[0].danger_time">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <h4 style="padding-left:20px;">配置索赔事由</h4>
            <el-form-item label="索赔事由："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[0].danger_claim_reason">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="填写索赔示例："
                          prop="insureTypeN">
              <el-input v-model="dialogForm.templateInsurers[0].danger_claim_reason_example"
                        type="textarea"
                        style="width:200px;"
                        placeholder="请输入"></el-input>
            </el-form-item>

            <h4 style="padding-left:20px;">配置第三方赔偿</h4>
            <el-form-item label="是否引入第三方赔偿："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[0].danger_third_compensation">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <!-- 出险信息2 -->
          <div class="abox1"
               v-show="dialogForm.danger012===1">
            <el-form-item label="是否展示本角色："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[1].danger_ishow">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <h4 style="padding-left:20px;">配置出险人属性</h4>
            <el-form-item label="姓名："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[1].danger_property_name">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件类型："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[1].danger_property_certifcate_type">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件号："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[1].danger_property_certifcate_number">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="附带被保人身份证明："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[1].danger_property_insured_identity">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传提示语："
                          prop="insureTypeN">
              <el-input v-model="dialogForm.templateInsurers[1].danger_property_photo_upload_tip"
                        type="textarea"
                        style="width:200px;"
                        placeholder="请输入"></el-input>
            </el-form-item>
            <h4 style="padding-left:20px;">配置出险人的监护人</h4>
            <el-form-item label="监护人证明："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[1].danger_guardian_certificate">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传提示语："
                          prop="insureTypeN">
              <el-input v-model="dialogForm.templateInsurers[1].danger_guardian_photo_upload_tip"
                        type="textarea"
                        style="width:200px;"
                        placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="医疗证明："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[1].danger_claim_medical_certificate">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传提示语："
                          prop="insureTypeN">
              <el-input v-model="dialogForm.templateInsurers[1].danger_claim_medical_upload_tip"
                        type="textarea"
                        style="width:200px;"
                        placeholder="请输入"></el-input>
            </el-form-item>

            <h4 style="padding-left:20px;">配置出险人索赔项目</h4>
            <el-form-item label="索赔项目展示："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[1].danger_claims_program">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="索赔项目内容：">
              <el-select multiple
                         v-model="dialogForm.templateInsurers[1].danger_claims_program_content"
                         placeholder="请选择">
                <el-option v-for="(item,index) in claimList"
                           :key="index"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>

            <h4 style="padding-left:20px;">配置出险时间</h4>
            <el-form-item label="出险时间："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[1].danger_time">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <h4 style="padding-left:20px;">配置索赔事由</h4>
            <el-form-item label="索赔事由："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[1].danger_claim_reason">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="填写索赔示例："
                          prop="insureTypeN">
              <el-input v-model="dialogForm.templateInsurers[1].danger_claim_reason_example"
                        type="textarea"
                        style="width:200px;"
                        placeholder="请输入"></el-input>
            </el-form-item>

            <h4 style="padding-left:20px;">配置第三方赔偿</h4>
            <el-form-item label="是否引入第三方赔偿："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[1].danger_third_compensation">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <!-- 出险信息3 -->
          <div class="abox1"
               v-show="dialogForm.danger012===2">
            <el-form-item label="是否展示本角色："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[2].danger_ishow">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <h4 style="padding-left:20px;">配置出险人属性</h4>
            <el-form-item label="姓名："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[2].danger_property_name">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件类型："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[2].danger_property_certifcate_type">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件号："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[2].danger_property_certifcate_number">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="投保人身份证明："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[2].danger_property_insured_identity">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传提示语："
                          prop="insureTypeN">
              <el-input v-model="dialogForm.templateInsurers[2].danger_property_photo_upload_tip"
                        type="textarea"
                        style="width:200px;"
                        placeholder="请输入"></el-input>
            </el-form-item>
            <h4 style="padding-left:20px;">配置出险人的监护人</h4>
            <el-form-item label="监护人证明："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[2].danger_guardian_certificate">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传提示语："
                          prop="insureTypeN">
              <el-input v-model="dialogForm.templateInsurers[2].danger_guardian_photo_upload_tip"
                        type="textarea"
                        style="width:200px;"
                        placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="医疗证明："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[2].danger_claim_medical_certificate">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传提示语："
                          prop="insureTypeN">
              <el-input v-model="dialogForm.templateInsurers[2].danger_claim_medical_upload_tip"
                        type="textarea"
                        style="width:200px;"
                        placeholder="请输入"></el-input>
            </el-form-item>

            <h4 style="padding-left:20px;">配置出险人索赔项目</h4>
            <el-form-item label="索赔项目展示："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[2].danger_claims_program">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="索赔项目内容：">
              <el-select multiple
                         v-model="dialogForm.templateInsurers[2].danger_claims_program_content"
                         placeholder="请选择">
                <el-option v-for="(item,index) in claimList"
                           :key="index"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>

            <h4 style="padding-left:20px;">配置出险时间</h4>
            <el-form-item label="出险时间："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[2].danger_time">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <h4 style="padding-left:20px;">配置索赔事由</h4>
            <el-form-item label="索赔事由："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[2].danger_claim_reason">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="填写索赔示例："
                          prop="insureTypeN">
              <el-input v-model="dialogForm.templateInsurers[2].danger_claim_reason_example"
                        type="textarea"
                        style="width:200px;"
                        placeholder="请输入"></el-input>
            </el-form-item>

            <h4 style="padding-left:20px;">配置第三方赔偿</h4>
            <el-form-item label="是否引入第三方赔偿："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateInsurers[2].danger_third_compensation">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <!-- //收款人信息  -->
          <h3 style="color:red;">收款人信息</h3>
          <el-form-item label="收款人是："
                        size="mini">
            <el-radio-group v-model="dialogForm.payment012">
              <el-radio-button :label="0">投保人</el-radio-button>
              <el-radio-button :label="1">被保人</el-radio-button>
              <el-radio-button :label="2">收益人</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <!-- 收款人信息1  -->
          <div class="bbox1"
               v-show="dialogForm.payment012===0">
            <el-form-item label="是否展示本角色："
                          size="mini">
              <el-radio-group v-model="dialogForm.templatePayments[0].payment_ishow">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <h4 style="padding-left:20px;">配置收款人属性</h4>
            <el-form-item label="开户姓名："
                          size="mini">
              <el-radio-group v-model="dialogForm.templatePayments[0].payment_account_name">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="开户银行："
                          size="mini">
              <el-radio-group v-model="dialogForm.templatePayments[0].payment_account_bank">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="银行卡号："
                          size="mini">
              <el-radio-group v-model="dialogForm.templatePayments[0].payment_account_bank_number">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="拍照上传银行卡正面："
                          size="mini">
              <el-radio-group v-model="dialogForm.templatePayments[0].payment_account_photo">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传提示语："
                          prop="insureTypeN">
              <el-input v-model="dialogForm.templatePayments[0].payment_account_photo_tip"
                        type="textarea"
                        style="width:200px;"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </div>

          <!-- 收款人信息2  -->
          <div class="bbox1"
               v-show="dialogForm.payment012===1">
            <el-form-item label="是否展示本角色："
                          size="mini">
              <el-radio-group v-model="dialogForm.templatePayments[1].payment_ishow">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <h4 style="padding-left:20px;">配置收款人属性</h4>
            <el-form-item label="开户姓名："
                          size="mini">
              <el-radio-group v-model="dialogForm.templatePayments[1].payment_account_name">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="开户银行："
                          size="mini">
              <el-radio-group v-model="dialogForm.templatePayments[1].payment_account_bank">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="银行卡号："
                          size="mini">
              <el-radio-group v-model="dialogForm.templatePayments[1].payment_account_bank_number">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="拍照上传银行卡正面："
                          size="mini">
              <el-radio-group v-model="dialogForm.templatePayments[1].payment_account_photo">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传提示语："
                          prop="insureTypeN">
              <el-input v-model="dialogForm.templatePayments[1].payment_account_photo_tip"
                        type="textarea"
                        style="width:200px;"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </div>

          <!-- 收款人信息3  -->
          <div class="bbox1"
               v-show="dialogForm.payment012===2">
            <el-form-item label="是否展示本角色："
                          size="mini">
              <el-radio-group v-model="dialogForm.templatePayments[2].payment_ishow">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <h4 style="padding-left:20px;">配置收款人属性</h4>
            <el-form-item label="开户姓名："
                          size="mini">
              <el-radio-group v-model="dialogForm.templatePayments[2].payment_account_name">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="开户银行："
                          size="mini">
              <el-radio-group v-model="dialogForm.templatePayments[2].payment_account_bank">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="银行卡号："
                          size="mini">
              <el-radio-group v-model="dialogForm.templatePayments[2].payment_account_bank_number">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="拍照上传银行卡正面："
                          size="mini">
              <el-radio-group v-model="dialogForm.templatePayments[2].payment_account_photo">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传提示语："
                          prop="insureTypeN">
              <el-input v-model="dialogForm.templatePayments[2].payment_account_photo_tip"
                        type="textarea"
                        style="width:200px;"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </div>

          <!-- 联系人信息 -->
          <h3 style="color:red;">联系人信息</h3>
          <el-form-item label="联系人是："
                        size="mini">
            <el-radio-group v-model="dialogForm.contact012">
              <el-radio-button :label="0">投保人</el-radio-button>
              <el-radio-button :label="1">被保人</el-radio-button>
              <el-radio-button :label="2">收益人</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <!-- 联系人信息1 -->
          <div class="cbox1"
               v-show="dialogForm.contact012===0">
            <el-form-item label="是否展示本角色："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[0].contact_ishow">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <h4 style="padding-left:20px;">配置联系人属性</h4>
            <el-form-item label="姓名："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[0].contact_property_name">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件类型："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[0].contact_property_certifcate_type">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件号："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[0].contact_property_certifcate_number">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机号："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[0].contact_property_phone">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="电子邮箱："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[0].contact_property_email">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="联系地址："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[0].contact_property_address">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <!-- 联系人信息2 -->
          <div class="cbox1"
               v-show="dialogForm.contact012===1">
            <el-form-item label="是否展示本角色："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[1].contact_ishow">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <h4 style="padding-left:20px;">配置联系人属性</h4>
            <el-form-item label="姓名："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[1].contact_property_name">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件类型："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[1].contact_property_certifcate_type">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件号："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[1].contact_property_certifcate_number">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机号："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[1].contact_property_phone">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="电子邮箱："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[1].contact_property_email">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="联系地址："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[1].contact_property_address">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <!-- 联系人信息2 -->
          <div class="cbox1"
               v-show="dialogForm.contact012===2">
            <el-form-item label="是否展示本角色："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[2].contact_ishow">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <h4 style="padding-left:20px;">配置联系人属性</h4>
            <el-form-item label="姓名："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[2].contact_property_name">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件类型："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[2].contact_property_certifcate_type">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件号："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[2].contact_property_certifcate_number">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机号："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[2].contact_property_phone">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="电子邮箱："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[2].contact_property_email">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="联系地址："
                          size="mini">
              <el-radio-group v-model="dialogForm.templateContacts[2].contact_property_address">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <!--  -->
          <h3 style="color:red;">配置《理赔申请书》</h3>
          <el-form-item label="理赔申请书：">
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

          <el-form-item label="医疗证明上传：">
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
    this.dialogFormInitial = () => ({
      contact012: 0,
      danger012: 0,
      payment012: 0,
      templateChoice: {
        contact_choice: '',//,隔开
        payment_choice: '',
        danger_choice: '',
        scheme_id: this.schemeId,
      },
      templateOther: {
        claim_application: '',
        claim_guardian_upload: '',
        scheme_id: this.schemeId,
        modifyTime: null,
        createTime: null,
      },
      templateContacts: [
        {
          contact_type: 0,
          contact_ishow: '0',
          contact_property_name: '0',
          contact_property_certifcate_type: '0',
          contact_property_certifcate_number: '0',
          contact_property_phone: '0',
          contact_property_email: '0',
          contact_property_address: '0',
          scheme_id: this.schemeId,
        },
        {
          contact_type: 1,
          contact_ishow: '0',
          contact_property_address: '0',
          contact_property_certifcate_number: '0',
          contact_property_certifcate_type: '0',
          contact_property_email: '0',
          contact_property_name: '0',
          contact_property_phone: '0',
          scheme_id: this.schemeId,
        },
        {
          contact_type: 2,
          contact_ishow: '0',
          contact_property_address: '0',
          contact_property_certifcate_number: '0',
          contact_property_certifcate_type: '0',
          contact_property_email: '0',
          contact_property_name: '0',
          contact_property_phone: '0',
          scheme_id: this.schemeId,
        }
      ],
      templatePayments: [
        {
          payment_type: 0,
          payment_ishow: '0',
          payment_account_bank: '0',
          payment_account_bank_number: '0',
          payment_account_name: '0',
          payment_account_photo: '0',
          payment_account_photo_tip: '',
          scheme_id: this.schemeId,
        },
        {
          payment_type: 1,
          payment_ishow: '0',
          payment_account_name: '0',
          payment_account_bank: '0',
          payment_account_bank_number: '0',
          payment_account_photo: '0',
          payment_account_photo_tip: '',
          scheme_id: this.schemeId,
        },
        {
          payment_type: 2,
          payment_ishow: '0',
          payment_account_bank: '0',
          payment_account_bank_number: '0',
          payment_account_name: '0',
          payment_account_photo: '0',
          payment_account_photo_tip: '',
          scheme_id: this.schemeId,
        },
      ],
      templateInsurers: [
        {
          danger_type: 0,
          danger_ishow: '0',
          danger_property_name: '0',
          danger_property_certifcate_type: '0',
          danger_property_certifcate_number: '0',
          danger_property_insured_identity: '0',
          danger_property_photo_upload_tip: '',
          danger_guardian_certificate: '0',
          danger_guardian_photo_upload_tip: '',
          danger_claim_medical_certificate: '0',
          danger_claim_medical_upload_tip: '',
          danger_claims_program: '0',
          danger_claims_program_content: [],//索赔内容
          danger_time: '0',
          danger_claim_reason: '0',
          danger_claim_reason_example: '',
          danger_third_compensation: '0',
          scheme_id: this.schemeId,
        },
        {
          danger_type: 1,
          danger_ishow: '0',
          danger_property_name: '0',
          danger_property_certifcate_type: '0',
          danger_property_certifcate_number: '0',
          danger_property_insured_identity: '0',
          danger_property_photo_upload_tip: '',

          danger_guardian_certificate: '0',
          danger_guardian_photo_upload_tip: '',
          danger_claim_medical_certificate: '0',
          danger_claim_medical_upload_tip: '',
          danger_claims_program: '0',
          danger_claims_program_content: [],//索赔内容
          danger_time: '0',
          danger_claim_reason: '0',
          danger_claim_reason_example: '',
          danger_third_compensation: '0',
          scheme_id: this.schemeId,
        },
        {
          danger_type: 2,
          danger_ishow: '0',
          danger_property_name: '0',
          danger_property_certifcate_type: '0',
          danger_property_certifcate_number: '0',
          danger_property_insured_identity: '0',
          danger_property_photo_upload_tip: '',
          danger_guardian_certificate: '0',
          danger_guardian_photo_upload_tip: '',
          danger_claim_medical_certificate: '0',
          danger_claim_medical_upload_tip: '',
          danger_claims_program: '0',
          danger_claims_program_content: [],//索赔内容
          danger_time: '0',
          danger_claim_reason: '0',
          danger_claim_reason_example: '',
          danger_third_compensation: '0',
          scheme_id: this.schemeId,
        }
      ],

    });

    return {
      formInline: {
        keyword: '',
      },
      pageIndex: 1,
      pageSize: 6,
      dataSource: [],
      total: 0,

      productName: '',
      schemeName: '',
      schemeId: '',
      claimList: [],
      dialogForm: null,
      rules: {},
      dialogVisible: false,

      filelist1: [],
      filelist2: [],
      uploadKey: {
        dict: 'claim',
        userId: localStorage.getItem('id'),
        bussId: localStorage.getItem('id'),
      },
      dataApi: `${this.baseUrlupload}/consul/api/file/v1/upload`,
    }
  },
  created() {
    this.getList();


  },
  methods: {
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
      this.dialogForm.templateOther.claim_application = '';
    },
    handleExceed() {
      this.$message({
        type: 'error',
        message: '只能上传一个文件',
      });
    },
    handleAvatarSuccess(res) {
      this.dialogForm.templateOther.claim_application = res.data;
    },
    beforeAvatarUpload(file) { },
    // 
    handleRemove2(file, fileList) {
      this.dialogForm.templateOther.claim_guardian_upload = '';
    },
    handleExceed2() {
      this.$message({
        type: 'error',
        message: '只能上传一个文件',
      });
    },
    handleAvatarSuccess2(res) {
      this.dialogForm.templateOther.claim_guardian_upload = res.data;
    },
    beforeAvatarUpload2(file) { },


    sureinfo() {
      let obj = JSON.parse(JSON.stringify(this.dialogForm));

      let { templateContacts, templatePayments, templateInsurers } = obj;
      let _templateContacts = [], _templatePayments = [], _templateInsurers = [];
      let contact_choice = [], payment_choice = [], danger_choice = [];

      templateContacts.forEach((item) => {
        if (item.contact_ishow === '1') {
          _templateContacts.push(item);
          contact_choice.push(item.contact_type);
        }
      })
      templatePayments.forEach((item) => {
        if (item.payment_ishow === '1') {
          _templatePayments.push(item);
          payment_choice.push(item.payment_type);
        }
      })
      templateInsurers.forEach((item) => {
        if (item.danger_ishow === '1') {
          _templateInsurers.push(item);
          danger_choice.push(item.danger_type);
        }
      })

      _templateInsurers.forEach(item => {
        item.danger_claims_program_content = item.danger_claims_program_content.join(',');
      })

      obj.templateChoice.contact_choice = contact_choice.join(',');
      obj.templateChoice.payment_choice = payment_choice.join(',');
      obj.templateChoice.danger_choice = danger_choice.join(',');
      obj.templateContacts = _templateContacts;
      obj.templatePayments = _templatePayments;
      obj.templateInsurers = _templateInsurers;

      if (this.checkData(obj)) {
        this.$post(`${this.baseUrls}/claimTemplate/front/claimTemplate/add`, obj).then((res) => {
          this.$message({
            type: 'success',
            message: '配置成功',
          });
          this.dialogVisible = false;
          this.getList();
        })
      }
    },
    checkData(obj) {
      let flag = true;
      if (obj.templateChoice.danger_choice === '') {
        this.$message({
          type: 'error',
          message: '至少选择一个报案人',
        });
        flag = false;
        return
      }
      if (obj.templateChoice.payment_choice === '') {
        this.$message({
          type: 'error',
          message: '至少选择一个收款人',
        });
        flag = false;
        return

      }
      if (obj.templateChoice.danger_choice === '') {
        this.$message({
          type: 'error',
          message: '至少选择一个联系人',
        });
        flag = false;
        return false;
      }


      obj.templateInsurers.forEach(item => {
        if (item.danger_property_insured_identity === '1' && item.danger_property_photo_upload_tip === '') {
          let str = '';
          if (item.danger_type === 0) {
            str = '被保人身份证明上传提示语不能为空';
          } else if (item.danger_type === 1) {
            str = '附带被保人身份证明上传提示语不能为空';
          } else if (item.danger_type === 2) {
            str = '投保人身份证明上传提示语不能为空';
          }
          this.$message({
            type: 'error',
            message: str,
          });
          flag = false;
          return;
        } else if (item.danger_guardian_certificate === '1' && item.danger_guardian_photo_upload_tip === '') {
          let str = '';
          if (item.danger_type === 0) {
            str = '被保人监护人证明上传提示语不能为空';
          } else if (item.danger_type === 1) {
            str = '附带被保人监护人证明上传提示语不能为空';
          } else if (item.danger_type === 2) {
            str = '投保人监护人证明上传提示语不能为空';
          }
          this.$message({
            type: 'error',
            message: str,
          });
          flag = false;
          return;
        } else if (item.danger_claim_medical_certificate === '1' && item.danger_claim_medical_upload_tip === '') {
          let str = '';
          if (item.danger_type === 0) {
            str = '被保人医疗证明上传提示语不能为空';
          } else if (item.danger_type === 1) {
            str = '附带被保人医疗证明上传提示语不能为空';
          } else if (item.danger_type === 2) {
            str = '投保人医疗证明上传提示语不能为空';
          }
          this.$message({
            type: 'error',
            message: str,
          });
          flag = false;
          return;
        } else if (item.danger_claims_program === '1' && item.danger_claims_program_content === '') {
          let str = '';
          if (item.danger_type === 0) {
            str = '被保人索赔项目内容不能为空';
          } else if (item.danger_type === 1) {
            str = '附带被保人索赔项目内容不能为空';
          } else if (item.danger_type === 2) {
            str = '投保人索赔项目内容不能为空';
          }
          this.$message({
            type: 'error',
            message: str,
          });
          flag = false;
          return;
        } else if (item.danger_claim_reason === '1' && item.danger_claim_reason_example === '') {
          let str = '';
          if (item.danger_type === 0) {
            str = '被保人索赔示例不能为空';
          } else if (item.danger_type === 1) {
            str = '附带被保人索赔示例不能为空';
          } else if (item.danger_type === 2) {
            str = '投保人索赔示例不能为空';
          }
          this.$message({
            type: 'error',
            message: str,
          });
          flag = false;
          return;
        }
      })

      obj.templatePayments.forEach(item => {
        if (item.payment_account_photo === '1' && item.payment_account_photo_tip === '') {
          let str = '';
          if (item.payment_type === 0) {
            str = '投保人银行卡上传提示语不能为空';
          } else if (item.payment_type === 1) {
            str = '被保人银行卡上传提示语不能为空';
          } else if (item.payment_type === 2) {
            str = '收益人银行卡上传提示语不能为空';
          }
          this.$message({
            type: 'error',
            message: str,
          });
          flag = false;
          return;
        }
      })

      if (obj.templateOther.claim_application === '') {
        this.$message({
          type: 'error',
          message: '理赔申请书必须上传',
        });
        flag = false;
      }

      return flag;
    },
    setTemp(row) {
      this.productName = row.product.productName;
      this.schemeName = row.scheme.schemeName;
      this.schemeId = row.scheme.id;

      this.$get(`${this.baseUrls}/claimTemplate/front/claimTemplate/all?schemeId=${this.schemeId}`)
        .then((res) => {
          if (JSON.stringify(res.data) === '{}') {
            this.dialogForm = this.dialogFormInitial();
            this.filelist1 = [];
            this.filelist2 = [];
          } else {
            let obj = res.data;

            const arrFile = obj.templateOther.claim_application.split('/');
            this.filelist1 = [{
              name: arrFile[arrFile.length - 1],
              url: obj.templateOther.claim_application
            }];

            if (obj.templateOther.claim_guardian_upload === '') {
              this.filelist2 = [];
            } else {
              const arrFile2 = obj.templateOther.claim_guardian_upload.split('/');
              this.filelist2 = [{
                name: arrFile2[arrFile2.length - 1],
                url: obj.templateOther.claim_guardian_upload
              }];
            }



            let obj2 = this.dialogFormInitial();
            obj2.templateChoice = obj.templateChoice;
            obj2.templateOther = obj.templateOther;

            obj.templateContacts.forEach(item => {
              if (item.contact_type === 0) {
                obj2.templateContacts[0] = item;
              } else if (item.contact_type === 1) {
                obj2.templateContacts[1] = item;
              } else if (item.contact_type === 2) {
                obj2.templateContacts[2] = item;
              }
            })

            obj.templatePayments.forEach(item => {
              if (item.payment_type === 0) {
                obj2.templatePayments[0] = item;
              } else if (item.payment_type === 1) {
                obj2.templatePayments[1] = item;
              } else if (item.payment_type === 2) {
                obj2.templatePayments[2] = item;
              }
            })

            obj.templateInsurers.forEach(item => {
              let arr = [];
              if (item.danger_claims_program_content) {
                arr = item.danger_claims_program_content.split(',');
              }
              item.danger_claims_program_content = arr;

              if (item.danger_type === 0) {
                obj2.templateInsurers[0] = item;
              } else if (item.danger_type === 1) {
                obj2.templateInsurers[1] = item;
              } else if (item.danger_type === 2) {
                obj2.templateInsurers[2] = item;
              }
            })

            obj2.templateOther.modifyTime = null;

            this.dialogForm = obj2;

          }
        })

      this.getclaimList();

      this.dialogVisible = true;
    },
    search() {
      this.pageIndex = 1;
      this.getList();
    },
    getclaimList() {
      this.$get(`${this.baseUrls}/claimTemplate/front/claimName/all?schemeId=${this.schemeId}`).then((res) => {
        let data = res.data;
        let arr = [];
        data.forEach(item => {
          let arr2 = item.split(',');
          arr2.forEach(v => {
            arr.push(v);
          })
        })
        this.claimList = arr;
      })
    },
    getList() {
      this.$get(`${this.baseUrls}/insureType/front/schemeProductByCondition/all`, {
        insure: this.formInline.keyword,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      }).then((res) => {
        this.dataSource = res.data.list;
      })

      this.$get(`${this.baseUrls}/insureType/front/schemeProductByCondition/all`, {
        insure: this.formInline.keyword,
        pageIndex: 1,
        pageSize: 500,
      }).then((res) => {
        this.total = res.data.total;
      })
    },
  }
}
</script>
