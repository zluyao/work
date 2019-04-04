<template>
  <div class="app-container">
    <p class="page-title">微店模板</p>

    <div class="wd-listbox">
      <el-form ref="form"
               :inline="true"
               size="mini"
               label-width="70px">
        <div>
          <el-form-item style="float:right;">
            <el-button type="primary"
                       @click="addShop">新增</el-button>
          </el-form-item>
        </div>
      </el-form>

      <el-table :data="dataSource"
                stripe
                border
                style="width: 100%">

        <el-table-column prop="shopName"
                         width=""
                         label="微店模板名称">
        </el-table-column>
        <el-table-column prop="gmtModifyStr"
                         width=""
                         label="更新时间">
        </el-table-column>

        <el-table-column width=""
                         label="微店模板二维码">
          <template slot-scope="scope">
            <qrcode class="img-ewm"
                    :value="originUrl+'&id='+scope.row.id"
                    :options="{ size: 360 }"></qrcode>
            <p style="padding-left: 6px;position: relative;top: -5px;">右键复制</p>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         fixed="right"
                         width="550">
          <template slot-scope="scope">
            <el-button @click="copyUrlShop(scope.row.id)"
                       type="info"
                       size="mini">复制链接</el-button>
            <el-button @click="preViewShop"
                       type="success"
                       size="mini">预览</el-button>
            <el-button @click="editShop(scope.row.id)"
                       type="primary"
                       size="mini">编辑</el-button>
            <el-button @click="copyTemplateShop(scope.row.id)"
                       type="primary"
                       size="mini">复制模板</el-button>
            <el-button @click="deleteShop(scope.row.id)"
                       type="danger"
                       size="mini">删除模板</el-button>
            <el-button @click="distribShop(scope.row.id)"
                       type="primary"
                       v-if="authBtn.distribution"
                       size="mini">分配模板</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title='微店模板'
               width="1220px"
               class="edit-allbox"
               top="5vh"
               :lock-scroll="true"
               center
               :close-on-click-modal="false"
               :visible.sync="isEdit">
      <span>

        <div class="wd-editbox">
          <ul class="left-box">
            <li class="tab-item"
                :class="{'active':tabIndex==1}"
                @click="changeTab(1)">
              <img class="tab-img"
                   v-if="tabIndex==1"
                   src="../../assets/images/icon_wd_dh_active.png"
                   alt="">
              <img class="tab-img"
                   v-else
                   src="../../assets/images/icon_wd_dh.png"
                   alt="">
              <p class="tab-name">导航栏</p>
            </li>
            <li class="tab-item"
                :class="{'active':tabIndex==2}"
                @click="changeTab(2)">
              <img class="tab-img"
                   v-if="tabIndex==2"
                   src="../../assets/images/icon_wd_tg_active.png"
                   alt="">
              <img class="tab-img"
                   v-else
                   src="../../assets/images/icon_wd_tg.png"
                   alt="">
              <p class="tab-name">推广位</p>
            </li>
            <li class="tab-item"
                :class="{'active':tabIndex==3}"
                @click="changeTab(3)">
              <img class="tab-img"
                   v-if="tabIndex==3"
                   src="../../assets/images/icon_wd_fw_active.png"
                   alt="">
              <img class="tab-img"
                   v-else
                   src="../../assets/images/icon_wd_fw.png"
                   alt="">
              <p class="tab-name">服务栏</p>
            </li>
            <li class="tab-item"
                :class="{'active':tabIndex==4}"
                @click="changeTab(4)">
              <img class="tab-img"
                   v-if="tabIndex==4"
                   src="../../assets/images/icon_wd_lb_active.png"
                   alt="">
              <img class="tab-img"
                   v-else
                   src="../../assets/images/icon_wd_lb.png"
                   alt="">
              <p class="tab-name">产品列表</p>
            </li>
            <li class="tab-item"
                :class="{'active':tabIndex==5}"
                @click="changeTab(5)">
              <img class="tab-img"
                   v-if="tabIndex==5"
                   src="../../assets/images/icon_wd_fx_active.png"
                   alt="">
              <img class="tab-img"
                   v-else
                   src="../../assets/images/icon_wd_fx.png"
                   alt="">
              <p class="tab-name">分享设置</p>
            </li>
          </ul>
          <div class="middle-box">
            <img src="../../assets/images/showpic1.png"
                 v-if="tabIndex==1"
                 alt="">
            <img src="../../assets/images/showpic2.png"
                 v-if="tabIndex==2"
                 alt="">
            <img src="../../assets/images/showpic3.png"
                 v-if="tabIndex==3"
                 alt="">
            <img src="../../assets/images/showpic4.png"
                 v-if="tabIndex==4"
                 alt="">
            <img src="../../assets/images/showpic5.png"
                 v-if="tabIndex==5"
                 alt="">
          </div>

          <!-- box1 -->
          <div class="right-box right-box1"
               v-if="tabIndex==1">
            <div class="wd-lineitem">
              <p class="item-left"><span class="need">*</span>微店名称：</p>
              <div class="item-right item-right40">
                <el-input placeholder="请输入微店名称"
                          v-model="dialogForm1.shopName"
                          clearable>
                </el-input>
              </div>
            </div>

            <div class="wd-lineitem">
              <p class="item-left">左侧按钮图标：</p>
              <div class="item-right">
                <el-upload class="avatar-uploader "
                           :data="uploadKey"
                           :action="dataApi"
                           ref="files"
                           :show-file-list="false"
                           :on-success="handleAvatarSuccess"
                           :before-upload="beforeAvatarUpload">
                  <el-button size="small"
                             type="danger">点击上传</el-button>
                </el-upload>
                <p class="upload-tip">图片尺寸建议为40*40px，透明底，.png格式</p>
                <div class="pic-box-icon"
                     v-if="dialogForm1.leftIcon">
                  <img :src="dialogForm1.leftIcon"
                       alt="">
                  <img class="delete"
                       @click="deleteIcon1"
                       src="../../assets/images/delete.png"
                       alt="">
                </div>
              </div>
            </div>
            <div class="wd-lineitem">
              <p class="item-left">左侧按钮跳转地址：</p>
              <div class="item-right item-right40">
                <el-input placeholder="请输入左侧按钮跳转地址"
                          v-model="dialogForm1.leftIconUrl"
                          clearable>
                </el-input>
              </div>
            </div>

            <div class="wd-lineitem">
              <p class="item-left">右侧按钮图标：</p>
              <div class="item-right">
                <el-upload class="avatar-uploader "
                           :data="uploadKey"
                           :action="dataApi"
                           ref="files"
                           :show-file-list="false"
                           :on-success="handleAvatarSuccess2"
                           :before-upload="beforeAvatarUpload2">
                  <el-button size="small"
                             type="danger">点击上传</el-button>
                </el-upload>
                <p class="upload-tip">图片尺寸建议为40*40px，透明底，.png格式</p>
                <div class="pic-box-icon"
                     v-if="dialogForm1.rightIcon">
                  <img :src="dialogForm1.rightIcon"
                       alt="">
                  <img class="delete"
                       @click="deleteIcon2"
                       src="../../assets/images/delete.png"
                       alt="">
                </div>
              </div>
            </div>
            <div class="wd-lineitem">
              <p class="item-left">右侧按钮跳转地址：</p>
              <div class="item-right item-right40">
                <el-input placeholder="请输入右侧按钮跳转地址"
                          v-model="dialogForm1.rightIconUrl"
                          clearable>
                </el-input>
              </div>
            </div>
            <div class="wd-lineitem">
              <div class="item-right">
                <p class="nextStep"
                   @click="sureBtn1">下一步</p>
                <p class="nextStep reset"
                   @click="resetData1">重置</p>
              </div>
            </div>
          </div>
          <!-- box2 -->
          <div class="right-box right-box2"
               v-if="tabIndex==2">
            <div class="wd-lineitem">
              <p class="item-left"><span class="need">*</span>推广图：</p>
              <div class="item-right item-righttgt">
                <p class="tgt-tip">图片尺寸建议为670*270px，支持.png/.jpg格式</p>
                <div class="pic-box-img"
                     :key="index"
                     v-for="(item,index) in dialogForm2">
                  <img :src="item.banner"
                       alt="">
                  <img class="delete"
                       @click="deleteIconBanner(item.id)"
                       src="../../assets/images/delete.png"
                       alt="">
                </div>
              </div>
            </div>
            <div class="wd-lineitem">
              <div class="item-right item-right40">
                <div class="add-tgt-btn"
                     @click="showAddtgimg">
                  +&nbsp&nbsp新增推广图
                </div>
              </div>
            </div>
            <div class="wd-lineitem mt30">
              <div class="item-right">
                <p class="nextStep"
                   @click="sureBtn2">下一步</p>
                <p class="nextStep reset"
                   @click="resetData2">重置</p>
              </div>
            </div>
          </div>
          <!-- box3 -->
          <div class="right-box right-box3"
               v-if="tabIndex==3">
            <div class="">
              <div style="padding:0 5px;">
                <el-table :data="dataSource3"
                          stripe
                          border
                          size="mini"
                          style="width: 100%">

                  <el-table-column prop="dictLabel"
                                   width="80"
                                   label="服务名称">
                  </el-table-column>
                  <el-table-column prop="rename"
                                   width="160"
                                   label="重命名">
                    <template slot-scope="scope">
                      <input type="text"
                             class="edit-point-inp"
                             :disabled="!scope.row.canEdit"
                             v-model="scope.row.rename">
                      <span v-if="scope.row.isOpen">
                        <img v-if="scope.row.canEdit"
                             class="edit-point-pic"
                             @click="editPoint(scope.row,2,scope)"
                             src="../../assets/images/savewd.png"
                             alt="">
                        <img class="edit-point-pic"
                             @click="editPoint(scope.row,1,scope)"
                             v-if="!scope.row.canEdit"
                             src="../../assets/images/edit.png"
                             alt="">
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="dictAb"
                                   width=""
                                   label="说明">
                    <template slot-scope="scope">
                      {{scope.row.dictAb}} <el-tag :type="scope.row.isOpen?'danger':'info'">{{scope.row.isOpen?'已开通':'未开通'}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作"
                                   fixed="right"
                                   width="90">
                    <template slot-scope="scope">
                      <el-switch v-model="scope.row.isOpen"
                                 active-color="#FF5757"
                                 @change="openService(scope.row)"
                                 inactive-color="#BFC5D1">
                      </el-switch>
                      {{scope.row.isOpen?'关闭':'开通'}}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <div class="wd-lineitem mt30"
                 style="padding-left:5px;">
              <div class="item-right">
                <p class="nextStep"
                   @click="sureBtn3">下一步</p>
              </div>
            </div>

          </div>
          <!-- box4 -->
          <div class="right-box right-box4"
               v-if="tabIndex==4">
            <div class="title-line">
              <span>分类</span>
            </div>
            <div class="tabs-box">
              <p class="tabs-title">分类：</p>
              <div class="tab-item">
                <span class="tab-name-new"
                      @click="addClassify">+ 新增</span>
              </div>
              <div class="tab-item"
                   :key="index"
                   v-for="(item,index) in classifyList">
                <span class="tab-name"
                      @click="toggleClassifyTab(item)"
                      :class="{'active':classifyIndex==item.id}">{{item.classifyName}}</span>
                <img v-if="classifyIndex==item.id"
                     @click="deleteClassify(item)"
                     src="../../assets/images/delete.png"
                     alt="">
                <img v-else
                     @click="deleteClassify(item)"
                     src="../../assets/images/delete_dark.png"
                     alt="">
              </div>
            </div>

            <div class="midbox4"
                 v-if="isClickNew||isClickTab">
              <div class="midbox4-inner">
                <div class="search-box"
                     v-if="isClickNew||isClickTab">
                  <p class="search-title-word">分类标题：</p>
                  <div class="search-box-inner">
                    <el-input placeholder=""
                              v-model="classifyName"
                              clearable>
                    </el-input>

                  </div>
                  <span class="search-sure"
                        @click="saveClassify">确定</span>
                </div>

                <div class="title-line2"
                     v-if="isClickTab">
                  <span>产品</span>
                </div>
                <ul class="pro-listbox"
                    v-if="isClickTab">
                  <li :key="index"
                      v-for="(item,index) in proList">
                    <div class="pro-number">产品{{index+1}}</div>
                    <div class="pro-detail">
                      <img :src="item.banner"
                           alt="">
                      <p class="title ellipsis">{{item.productName}}</p>
                      <p class="zy ellipsis">{{item.summary}}</p>
                      <p class="price">{{item.price}}起</p>
                    </div>
                    <div class="pro-btns">
                      <img class="edit-pro"
                           @click="editPro(item)"
                           src="../../assets/images/edit.png"
                           alt="">
                      <img class="delete-pro"
                           @click="deletePro(item)"
                           src="../../assets/images/delete_pro.png"
                           alt="">
                    </div>
                  </li>
                </ul>
                <div class="show-addrpro"
                     v-if="isClickTab"
                     @click="dialogVisibleaddsp=true">+ 新增保险商品</div>
              </div>

            </div>
            <div class="wd-lineitem"
                 style="margin-top: 30px;margin-bottom:0;padding-left: 165px;">
              <div class="item-right">
                <p class="nextStep"
                   @click="sureBtn4">下一步</p>
                <p class="nextStep reset"
                   @click="resetData3">重置</p>
              </div>
            </div>
          </div>
          <!-- box5 -->
          <div class="right-box right-box5"
               v-if="tabIndex==5">
            <div class="wd-lineitem">
              <p class="item-left"><span class="need">*</span>分享标题：</p>
              <div class="item-right item-right40">
                <el-input :disabled="true"
                          v-model="dialogForm5.shareTitle"
                          clearable>
                </el-input>
              </div>
            </div>
            <div class="wd-lineitem">
              <p class="item-left"><span class="need">*</span>分享摘要：</p>
              <div class="item-right item-right40">
                <el-input placeholder="请输入分享摘要，100个字内"
                          type="textarea"
                          :autosize="{ minRows: 7, maxRows: 7 }"
                          :maxlength="100"
                          v-model="dialogForm5.shareRemark"
                          clearable>
                </el-input>
              </div>
            </div>

            <div class="wd-lineitem">
              <p class="item-left"><span class="need">*</span>分享图标：</p>
              <div class="item-right">
                <el-upload class="avatar-uploader "
                           :data="uploadKey"
                           :action="dataApi"
                           ref="files"
                           :show-file-list="false"
                           :on-success="handleAvatarSuccess5"
                           :before-upload="beforeAvatarUpload5">
                  <el-button size="small"
                             type="danger">点击上传</el-button>
                </el-upload>
                <p class="upload-tip">图片尺寸建议为200*200px，支持.png/.jpg格式</p>
                <div class="pic-box-icon pic-box-icon100"
                     v-if="dialogForm5.shareIcon">
                  <img :src="dialogForm5.shareIcon"
                       alt="">
                  <img class="delete"
                       @click="deleteIcon5"
                       src="../../assets/images/delete.png"
                       alt="">
                </div>
              </div>
            </div>
            <div class="wd-lineitem mt30">
              <div class="item-right">
                <p class="nextStep"
                   @click="sureBtn5">保存</p>
              </div>
            </div>
          </div>

          <div class="close-btn"
               @click="hideEditBox">
            <svg-icon icon-class="delete" />
          </div>

          <!-- dialog添加商品 -->
          <el-dialog title='添加商品'
                     width="40%"
                     class="addpro-dialog"
                     top="25vh"
                     center
                     :append-to-body="true"
                     :visible.sync="dialogVisibleaddsp">
            <span>
              <div class="add-zdy"
                   @click="showAddsp()">
                自定义商品
              </div>
              <p class="p1">编辑新的自定义商品</p>
              <div class="add-mysp"
                   @click="showAddspmy">
                选择我的商品
              </div>
              <p class="p2">在已有商品库中进行选择</p>
            </span>

          </el-dialog>

          <!-- dialog上传推广图 -->
          <el-dialog title='上传推广图'
                     width="46%"
                     center
                     :append-to-body="true"
                     :visible.sync="dialogVisibleaddtimg">
            <span>
              <div class="wd-lineitem">
                <p class="item-left"><span class="need">*</span>上传图片：</p>
                <div class="item-right">
                  <el-upload class="avatar-uploader "
                             :data="uploadKey"
                             :action="dataApi"
                             ref="files"
                             :show-file-list="false"
                             :on-success="handleAvatarSuccessaddtimg"
                             :before-upload="beforeAvatarUploadaddtimg">
                    <el-button size="small"
                               type="danger">点击上传</el-button>
                  </el-upload>
                  <p class="upload-tip">图片尺寸建议为670*270px，支持.png/.jpg格式</p>
                  <div class="pic-box-icon"
                       v-if="dialogFormaddtimg.banner">
                    <img :src="dialogFormaddtimg.banner"
                         alt="">
                    <img class="delete"
                         @click="deleteIconaddtimg"
                         src="../../assets/images/delete.png"
                         alt="">
                  </div>
                </div>
              </div>
              <div class="wd-lineitem">
                <p class="item-left">跳转地址：</p>
                <div class="item-right item-right40">
                  <el-input placeholder="请输入banner跳转地址"
                            v-model="dialogFormaddtimg.bannerUrl"
                            clearable>
                  </el-input>
                </div>
              </div>
            </span>
            <span>
              <div class="addtgimg-box"
                   @click="sureBtnBanner">
                <img src="../../assets/images/wd_sure_btn.png"
                     alt="">
              </div>
            </span>
          </el-dialog>

          <!-- 添加商品 选择我的商品 -->
          <el-dialog title='我的商品'
                     width="80%"
                     center
                     :append-to-body="true"
                     :visible.sync="dialogVisiblemysp">
            <span>
              <ul class="one-box">
                <li @click="getTwolist('all')"
                    :class="{'active':parentId=='all'}">全部</li>
                <li v-for="(item,index) in oneList"
                    :key="index"
                    :class="{'active':parentId==item.dictValue}"
                    @click="getTwolist(item)">
                  {{item.dictLabel}}
                </li>
              </ul>
              <ul class="two-box"
                  v-if="isShowtwobox">
                <li @click="getProductlist('all')"
                    :class="{'active':sonId=='all'}">全部</li>
                <li v-for="(item,index) in twoList"
                    :key="index"
                    :class="{'active':sonId==item.dictValue}"
                    @click="getProductlist(item.dictValue)">
                  {{item.dictLabel}}
                </li>
              </ul>
              <div style="padding-left:40px;">
                <p style="padding:10px 0;">共{{dataSourcePro.length}}款</p>
                <el-table :data="dataSourcePro"
                          stripe
                          border
                          style="width: 100%">

                  <el-table-column prop="productName"
                                   label="商品名称">
                  </el-table-column>
                  <el-table-column prop="floorPrice"
                                   label="起始价">
                  </el-table-column>
                  <el-table-column prop="inversePoint"
                                   label="返点率(%)">
                  </el-table-column>
                  <el-table-column label="操作"
                                   fixed="right"
                                   width="160">
                    <template slot-scope="scope">
                      <el-button @click="showAddsp(scope.row)"
                                 type="danger"
                                 size="mini">添加</el-button>

                    </template>
                  </el-table-column>
                </el-table>
              </div>

            </span>

          </el-dialog>

          <!-- dialog 编辑商品 -->
          <el-dialog title='编辑商品'
                     width="46%"
                     center
                     :append-to-body="true"
                     :visible.sync="dialogVisibleeditsp">
            <span>
              <div class="wd-lineitem">
                <p class="item-left"><span class="need">*</span>商品名称：</p>
                <div class="item-right item-right40">
                  <el-input placeholder="请输入商品名称"
                            v-model="dialogFormsp.productName"
                            clearable>
                  </el-input>
                </div>
              </div>
              <div class="wd-lineitem">
                <p class="item-left"><span class="need">*</span>商品摘要：</p>
                <div class="item-right item-right40">
                  <el-input placeholder="请输入商品摘要"
                            v-model="dialogFormsp.summary"
                            clearable>
                  </el-input>
                </div>
              </div>
              <div class="wd-lineitem">
                <p class="item-left"><span class="need">*</span>商品价格：</p>
                <div class="item-right item-right40">
                  <el-input placeholder="请输入商品价格"
                            style="width:90%;"
                            :disabled="!!sourceId"
                            v-model="dialogFormsp.price"
                            clearable>
                  </el-input>元起
                </div>
              </div>
              <div class="wd-lineitem">
                <p class="item-left"><span class="need">*</span>商品banner：</p>
                <div class="item-right">
                  <el-upload class="avatar-uploader "
                             :data="uploadKey"
                             :action="dataApi"
                             ref="files"
                             :show-file-list="false"
                             :on-success="handleAvatarSuccesseditsp"
                             :before-upload="beforeAvatarUploadeditsp">
                    <el-button size="small"
                               type="danger">点击上传</el-button>
                  </el-upload>
                  <p class="upload-tip">图片尺寸建议为85*85px，支持.png/.jpg格式</p>
                  <div class="pic-box-icon"
                       style="width: 85px;height:85px;"
                       v-if="dialogFormsp.banner">
                    <img :src="dialogFormsp.banner"
                         alt="">
                    <img class="delete"
                         @click="deleteIconeditsp"
                         src="../../assets/images/delete.png"
                         alt="">
                  </div>
                </div>
              </div>
              <div class="wd-lineitem">
                <p class="item-left"><span class="need">*</span>banner跳转地址：</p>
                <div class="item-right item-right40">
                  <el-input placeholder="请输入banner跳转地址"
                            :disabled="!!sourceId"
                            v-model="dialogFormsp.link"
                            clearable>
                  </el-input>
                </div>
              </div>
            </span>
            <span>
              <div class="addtgimg-box">
                <img @click="savePro"
                     src="../../assets/images/wd_sure_btn.png"
                     alt="">
              </div>
            </span>
          </el-dialog>

        </div>
      </span>
    </el-dialog>

    <!-- 预览 -->
    <el-dialog title='预览'
               width="465px"
               top="2vh"
               center
               :visible.sync="dialogVisiblepreview">
      <span>
        <img src="../../assets/images/preview.png"
             alt="">
      </span>
    </el-dialog>

    <!-- 可分配用户 -->
    <el-dialog title='分配微店模板'
               width="70%"
               top="5vh"
               center
               :visible.sync="dialogVisibleprsons">
      <span>
        <div style="margin:0 auto 20px auto;width:430px">
          <el-input v-model="formInline.nameStr"
                    style="width:300px"
                    size="mini"
                    placeholder="请输入真实姓名"></el-input>
          <el-button type="primary"
                     @click="searchSons"
                     size="mini">搜索</el-button>
          <el-button type="danger"
                     @click="formInline.nameStr=''"
                     size="mini">重置</el-button>
        </div>
        <el-table :data="dataSourceson"
                  stripe
                  border
                  style="width: 100%">
          <el-table-column prop="phoneNum"
                           label="联系人电话">
          </el-table-column>

          <el-table-column prop="name"
                           label="真实姓名">
          </el-table-column>
          <el-table-column width="100"
                           label="账户状态">
            <template slot-scope="scope">
              {{scope.row.isOpen==1?'已开通':'已冻结'}}
            </template>
          </el-table-column>
          <el-table-column prop="companyName"
                           label="主体全称">
          </el-table-column>
          <el-table-column prop="typeStr"
                           width="110"
                           label="账户分类">
          </el-table-column>
          <el-table-column prop="createTime"
                           width="180"
                           label="创建时间">
          </el-table-column>

          <el-table-column label="操作"
                           fixed="right"
                           width="120">
            <template slot-scope="scope">
              <el-button @click="distributeItem(scope.row)"
                         type="primary"
                         size="mini">分配</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="page-pagination">
          <el-pagination @size-change="handleSizeChangeson"
                         @current-change="handleCurrentChangeson"
                         :current-page="pageIndexson"
                         :page-sizes="[6,10,20,30,50]"
                         :page-size="pageSizeson"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="totalson">
          </el-pagination>
        </div>

      </span>
    </el-dialog>

    <textarea id="input"
              style="position: absolute;right: 5000px;"
              class="input"></textarea>
  </div>
</template>

<script>
import qrcode from '@xkeshi/vue-qrcode';
export default {
  data() {
    return {
      uploadKey: {
        dict: 'wd',
        userId: localStorage.getItem('id'),
        bussId: localStorage.getItem('id'),
      },
      dataApi: `${this.baseUrlupload}/consul/api/file/v1/upload`,
      fileList2: [],

      dialogVisiblepreview: false,

      tabIndex: 1,
      isEdit: false,

      dialogFormaddtimg: {
        banner: '',
        bannerUrl: '',
      },
      dialogVisibleaddtimg: false,

      dataSource3: [],

      dialogForm1: {
        shopName: '',
        leftIcon: '',
        leftIconUrl: '',
        rightIcon: '',
        rightIconUrl: '',
      },
      dialogForm2: [

      ],

      // box4
      isClickNew: false,
      isClickTab: false,
      classifyId: '',
      classifyName: '',
      classifyIndex: 0,
      classifyList: [
      ],
      proList: [],
      dialogVisibleaddsp: false,
      dialogVisibleeditsp: false,
      dialogFormsp: {
        productName: '',
        summary: '',
        price: '',
        banner: '',
        link: '',
      },
      shopProductId: '',
      sourceId: '',

      dialogVisiblemysp: false,
      oneList: [],
      twoList: [],
      parentId: 'all',
      sonId: 'all',
      isShowtwobox: false,
      dataSourcePro: [],


      // box5
      dialogForm5: {
        shareTitle: '',
        shareRemark: '',
        shareIcon: '',
        shopId: '',
      },

      pageNo: 1,
      pageSize: 6,
      dataSource: [],
      total: 0,

      shopDetail: {

      },
      shopServiceList: [],
      allServiceList: [],
      shopId: '',

      supplierUserId: localStorage.getItem('id'),

      originUrl: '',

      dialogVisibleprsons: false,
      formInline: {
        nameType: 1,
        nameStr: '',
        phoneNum: '',
        isOpen: '',
        type: '',
      },
      pageIndexson: 1,
      pageSizeson: 6,
      dataSourceson: [],
      totalson: 0,

      authBtn:{},

    }
  },
  components: {
    qrcode
  },
  created() {
    if (location.origin.indexOf('insurance.helianwap') != -1) {
      this.originUrl = `http://insurance.helianwap.com/insurancemy/smallshop.html?userId=${this.supplierUserId}`;
    } else {
      this.originUrl = `http://t.helianshare.com:10000/insurancemy/smallshop.html?userId=${this.supplierUserId}`;
    }
    this.getAuthInfo();
    this.getList();
    this.getAllServiceList();
  },
  methods: {
    getAuthInfo() {
      let str = this.$route.path.split('/')[this.$route.path.split('/').length - 1];
      const menus = JSON.parse(localStorage.getItem('menus'));
      let id = '';
      for (let i = 0; i < menus.length; i++) {
        for (let j = 0; j < menus[i].children.length; j++) {
          if (menus[i].children[j].path == str) {
            id = menus[i].children[j].id
            break
          }
        }
      }

      this.$get(`${this.baseUrlh}/privilege/front/admin/v1/queryPriByUser`, {
        parentId: id,
        priType: 2,
      }).then((res) => {
        this.authBtn = res.data;

      })

    },
    hideEditBox() {
      this.getList();
      this.isEdit = false;
    },
    async editShop(shopId) {
      this.isEdit = true;
      this.shopId = shopId;
      this.tabIndex = 1;

      await this.getShopDetail();
    },
    getShopDetail() {
      return this.$get(`${this.baseUrls}/shop/front/admin/v1/shopDetail`, {
        shopId: this.shopId,
      }).then((res) => {
        this.shopDetail = res.data;

        this.dialogForm1.shopName = this.shopDetail.shopName;
        this.dialogForm1.leftIcon = this.shopDetail.leftIcon ? this.shopDetail.leftIcon : '';
        this.dialogForm1.leftIconUrl = this.shopDetail.leftIconUrl ? this.shopDetail.leftIconUrl : '';
        this.dialogForm1.rightIcon = this.shopDetail.rightIcon ? this.shopDetail.rightIcon : '';
        this.dialogForm1.rightIconUrl = this.shopDetail.rightIconUrl ? this.shopDetail.rightIconUrl : '';

        this.dialogForm2 = this.shopDetail.shopBannerList;

        this.shopServiceList = this.shopDetail.shopServiceList
        if (this.tabIndex == 3) {
          this.getList3();
        }

        this.classifyList = this.shopDetail.shopClassifyList;

        this.dialogForm5.shareTitle = this.shopDetail.shareTitle ? this.shopDetail.shareTitle : '';
        this.dialogForm5.shareRemark = this.shopDetail.shareRemark ? this.shopDetail.shareRemark : '';
        this.dialogForm5.shareIcon = this.shopDetail.shareIcon ? this.shopDetail.shareIcon : '';
      })
    },
    beforeAvatarUpload(file) {
      if (file.type.indexOf('image') == -1) {
        this.$message({
          type: 'error',
          message: '只能上传图片',
        });
        return false;
      }
    },
    handleAvatarSuccess(res) {
      this.dialogForm1.leftIcon = res.data;
    },
    beforeAvatarUpload2(file) {
      if (file.type.indexOf('image') == -1) {
        this.$message({
          type: 'error',
          message: '只能上传图片',
        });
        return false;
      }
    },
    handleAvatarSuccess2(res) {
      this.dialogForm1.rightIcon = res.data;
    },
    beforeAvatarUploadaddtimg(file) {
      if (file.type.indexOf('image') == -1) {
        this.$message({
          type: 'error',
          message: '只能上传图片',
        });
        return false;
      }
    },
    handleAvatarSuccessaddtimg(res) {
      this.dialogFormaddtimg.banner = res.data;
    },

    beforeAvatarUpload5(file) {
      if (file.type.indexOf('image') == -1) {
        this.$message({
          type: 'error',
          message: '只能上传图片',
        });
        return false;
      }
    },
    handleAvatarSuccess5(res) {
      this.dialogForm5.shareIcon = res.data;
    },
    beforeAvatarUploadeditsp(file) {
      if (file.type.indexOf('image') == -1) {
        this.$message({
          type: 'error',
          message: '只能上传图片',
        });
        return false;
      }
    },
    handleAvatarSuccesseditsp(res) {
      this.dialogFormsp.banner = res.data;
    },

    // 删除一张轮播图
    deleteIconBanner(bannerId) {
      this.$get(`${this.baseUrls}/shop/front/admin/v1/deleteBanner`, {
        bannerId: bannerId,
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '删除成功'
        });
        this.getShopDetail();
      })

    },
    deleteIcon1() {
      this.dialogForm1.leftIcon = '';
    },
    deleteIcon2() {
      this.dialogForm1.rightIcon = '';
    },
    deleteIconaddtimg() {
      this.dialogFormaddtimg.banner = '';
    },
    deleteIcon5() {
      this.dialogForm5.shareIcon = '';
    },
    deleteIconeditsp() {
      this.dialogFormsp.banner = '';
    },

    showAddtgimg() {
      if (this.dialogForm2.length == 5) {
        this.$message({
          type: 'error',
          message: '最多只能上传5张推广位图片'
        });
        return
      }
      this.dialogVisibleaddtimg = true;
      this.dialogFormaddtimg.banner = '';
      this.dialogFormaddtimg.bannerUrl = '';
    },
    getProList() {
      this.$get(`${this.baseUrls}/shop/front/admin/v1/queryByClassify`, {
        classifyId: this.classifyId,
        shopId: this.shopId,
      }).then((res) => {
        this.proList = res.data;
      })
    },

    getOnelist() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'insure_type_one',
        isValid: 1,
      }).then((res) => {
        this.oneList = res.data;
      })
    },

    getTwolist(v) {
      this.sonId = 'all';
      if (v == 'all') {
        this.parentId = v;
        this.getProductlist(this.sonId);
        this.twoList = [];
        this.isShowtwobox = false;
        return;
      }
      this.parentId = v.dictValue;
      this.getProductlist(this.sonId);
      this.isShowtwobox = true;
      this.$get(`${this.baseUrls}/dictData/front/v1/getByParentId`, {
        parentId: v.id,
      }).then((res) => {
        this.twoList = res.data;
      })
    },
    getProductlist(v) {
      this.sonId = v;
      let typeOne = this.parentId == 'all' ? '' : this.parentId;
      let typeTwo = this.sonId == 'all' ? '' : this.sonId;

      this.$get(`${this.baseUrlh}/mygood/front/v1/myGoodList`, {
        queryStr: '',
        typeOne: typeOne,
        typeTwo: typeTwo,
        orderBy: 'floor_price desc',
      }).then((res) => {
        this.dataSourcePro = res.data;

      })
    },
    showAddspmy() {
      this.dialogVisiblemysp = true;
      this.shopProductId = '';

      this.getOnelist();
      this.getProductlist('all');
    },
    showAddsp(item) {
      this.dialogVisibleeditsp = true;
      this.shopProductId = '';
      console.log(444, item);
      if (item) {
        this.sourceId = item.productId;
        this.dialogFormsp.productName = item.productName;
        this.dialogFormsp.summary = '';
        this.dialogFormsp.price = item.floorPrice;
        this.dialogFormsp.banner = '';
        this.dialogFormsp.link = `${item.h5Url}?supplierUserId=${this.supplierUserId}`;

      } else {
        this.sourceId = '';
        this.dialogFormsp = {
          productName: '',
          summary: '',
          price: '',
          banner: '',
          link: '',
        };
        // console.log(222,this.dialogFormsp);
      }
    },
    deletePro(item) {
      this.$post(`${this.baseUrls}/shop/front/admin/v1/saveProduct`, {
        shopProductId: item.id,
        classifyId: this.classifyId,
        shopId: this.shopId,
        isDelete: 1,
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '删除成功'
        });
        this.getProList();
      })

    },
    editPro(item) {
      this.dialogFormsp = { ...item };
      this.sourceId = item.sourceId ? item.sourceId : '';
      this.shopProductId = item.id;
      this.dialogVisibleeditsp = true;
    },
    savePro() {
      if (!this.dialogFormsp.productName) {
        this.$message({
          type: 'error',
          message: '商品名称不能为空'
        });
        return
      }
      if (!this.dialogFormsp.summary) {
        this.$message({
          type: 'error',
          message: '商品摘要不能为空'
        });
        return
      }
      let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
      if (!reg.test(this.dialogFormsp.price)) {
        this.$message({
          type: 'error',
          message: '价格输入不合法'
        });
        return
      }
      if (!this.dialogFormsp.banner) {
        this.$message({
          type: 'error',
          message: '商品banner不能为空'
        });
        return
      }
      if (!this.dialogFormsp.link) {
        this.$message({
          type: 'error',
          message: '跳转地址不能为空'
        });
        return
      }


      this.$post(`${this.baseUrls}/shop/front/admin/v1/saveProduct`, {
        productName: this.dialogFormsp.productName,
        summary: this.dialogFormsp.summary,
        price: this.dialogFormsp.price,
        banner: this.dialogFormsp.banner,
        link: this.dialogFormsp.link,
        shopProductId: this.shopProductId,
        classifyId: this.classifyId,
        shopId: this.shopId,
        sourceId: this.sourceId,
        isDelete: '',
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        });
        this.dialogVisibleeditsp = false;
        this.dialogVisibleaddsp = false;
        this.dialogVisiblemysp = false;
        this.getProList();
      })

    },
    addClassify() {
      this.isClickNew = true;
      this.isClickTab = false;
      this.classifyIndex = 0;
      this.classifyName = '';
      this.classifyId = '';
    },
    toggleClassifyTab(item) {
      this.classifyIndex = item.id;
      this.isClickNew = false;
      this.isClickTab = true;
      this.classifyName = item.classifyName;
      this.classifyId = item.id;

      this.getProList();
    },

    deleteClassify(item) {
      this.$confirm('此操作将删除分类及其对应的产品列表，确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$get(`${this.baseUrls}/shop/front/admin/v1/saveClassify`, {
          classifyId: item.id,
          classifyName: item.classifyName,
          shopId: this.shopId,
          isDelete: 1,
        }).then(async (res) => {
          this.$message({
            type: 'success',
            message: '删除成功',
          });
          await this.getShopDetail();
          if (this.classifyIndex == item.id) {
            if (this.classifyList.length) {
              this.toggleClassifyTab(this.classifyList[0]);
            } else {
              this.isClickNew = false;
              this.isClickTab = false;
              this.classifyIndex = 0;
            }
          }
        })
      }).catch(() => { });
    },
    saveClassify() {
      if (!this.classifyName) {
        this.$message({
          type: 'error',
          message: '分类名称不能为空'
        });
        return
      }

      if (this.classifyName == '全部') {
        this.$message({
          type: 'error',
          message: '系统已存在全部分类'
        });
        return
      }

      this.$get(`${this.baseUrls}/shop/front/admin/v1/saveClassify`, {
        classifyId: this.classifyId,
        classifyName: this.classifyName,
        shopId: this.shopId,
        isDelete: '',
      }).then(async (res) => {
        this.$message({
          type: 'success',
          message: this.isClickNew ? '新增分类成功' : '编辑分类成功',
        });
        await this.getShopDetail();

        if (this.isClickNew) {
          this.toggleClassifyTab(this.classifyList[this.classifyList.length - 1]);
        }
      })
    },

    // 确定保存
    sureBtnBanner() {
      if (!this.dialogFormaddtimg.banner) {
        this.$message({
          type: 'error',
          message: '图片不能为空'
        });
        return
      }
      this.$get(`${this.baseUrls}/shop/front/admin/v1/saveBanner`, {
        banner: this.dialogFormaddtimg.banner,
        bannerUrl: this.dialogFormaddtimg.bannerUrl,
        shopId: this.shopId,
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        });
        this.dialogVisibleaddtimg = false;

        this.getShopDetail();
      })
    },
    sureBtn2() {
      if (!this.dialogForm2.length) {
        this.$message({
          type: 'error',
          message: '请上传至少一张推广图'
        });
        return
      }
      this.$message({
        type: 'success',
        message: '保存成功'
      });
      this.getShopDetail();
      this.tabIndex = 3;
    },
    sureBtn3() {
      this.tabIndex = 4;
    },
    sureBtn4() {
      this.tabIndex = 5;
    },
    sureBtn5() {
      if (!this.dialogForm5.shareRemark) {
        this.$message({
          type: 'error',
          message: '分享摘要不能为空'
        });
        return
      }
      if (!this.dialogForm5.shareIcon) {
        this.$message({
          type: 'error',
          message: '分享图标不能为空'
        });
        return
      }

      this.$get(`${this.baseUrls}/shop/front/admin/v1/saveShare`, {
        shareTitle: this.dialogForm5.shareTitle,
        shareRemark: this.dialogForm5.shareRemark,
        shareIcon: this.dialogForm5.shareIcon,
        shopId: this.shopId,
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        });
        this.isEdit = false;
        this.getList()
      })
    },
    sureBtn1() {
      if (!this.dialogForm1.shopName) {
        this.$message({
          type: 'error',
          message: '微店名称不能为空'
        });
        return
      }
      this.$post(`${this.baseUrls}/shop/front/admin/v1/saveNavigation`, {
        shopName: this.dialogForm1.shopName,
        leftIcon: this.dialogForm1.leftIcon,
        leftIconUrl: this.dialogForm1.leftIconUrl,
        rightIcon: this.dialogForm1.rightIcon,
        rightIconUrl: this.dialogForm1.rightIconUrl,
        shopId: this.shopId,
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        });
        this.tabIndex = 2;
        this.shopId = res.data;
      })
    },

    resetData1() {
      this.dialogForm1 = {
        shopName: '',
        leftIcon: '',
        leftIconUrl: '',
        rightIcon: '',
        rightIconUrl: '',
      };
    },
    resetData2() {
      this.$confirm('确定要重置推广位信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$get(`${this.baseUrls}/shop/front/admin/v1/resetBanner`, {
          shopId: this.shopId,
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '已重置'
          });
          this.getShopDetail();
        })
      }).catch(() => { });
    },
    resetData3() {
      this.$confirm('确定要重置产品列表信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$get(`${this.baseUrls}/shop/front/admin/v1/resetClassify`, {
          shopId: this.shopId,
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '已重置'
          });
          this.getShopDetail();
        })
      })
    },

    editPoint(row, type, scope) {
      if (type == 1) {
        this.dataSource3[scope.$index].canEdit = true;
        this.dataSource3 = [...this.dataSource3];
      } else {
        if (!row.rename) {
          this.$message({
            type: 'error',
            message: '重命名不能为空'
          });
          return
        }

        let reg = /^[\u4e00-\u9fa5]{1,4}$/;
        if (!reg.test(row.rename)) {
          this.$message({
            type: 'error',
            message: '重命名不合法，只能是不超过四个字的汉字'
          });
          return
        }

        this.$get(`${this.baseUrls}/shop/front/admin/v1/saveService`, {
          shopId: this.shopId,
          serviceId: row.id,
          serviceName: row.rename,
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '名称修改成功'
          });
          this.dataSource3[scope.$index].canEditEdit = false;
          this.dataSource3 = [...this.dataSource3];
        })
      }
    },

    async changeTab(index) {
      if (index == this.tabIndex) {
        return;
      }
      if (!this.shopId && index != 1) {
        this.$message({
          type: 'error',
          message: '新模板请先填写导航栏'
        });
        return
      }
      this.tabIndex = index;

      await this.getShopDetail();

      if (this.tabIndex == 4) {
        this.isClickNew = false;
        this.isClickTab = false;
        this.classifyIndex = 0;
      }
    },
    getAllServiceList() {
      this.$get(`${this.baseUrls}/dictData/front/dictData/all`, {
        dictType: 'shop_service'
      }).then((res) => {

        res.data.forEach(ele => {
          ele.rename = ele.dictLabel;
          ele.isOpen = false;
        })

        this.allServiceList = res.data;
      })
    },
    openService(row) {
      this.$get(`${this.baseUrls}/shop/front/admin/v1/saveService`, {
        shopId: this.shopId,
        serviceId: row.id,
        serviceName: row.isOpen ? row.dictLabel : '',
      }).then((res) => {
        this.$message({
          type: 'success',
          message: row.isOpen ? '开通成功' : '关闭成功'
        });
      })
    },
    getList3() {
      if (this.shopServiceList.length) {
        this.allServiceList.forEach(ele => {
          this.shopServiceList.forEach(item => {
            if (ele.id == item.serviceId) {
              ele.rename = item.serviceName;
              if (item.isOpen) {
                ele.isOpen = true;
              }
            }
          })
        })
      } else {
        this.allServiceList.forEach(ele => {
          ele.isOpen = false;
        })
      }

      this.dataSource3 = this.allServiceList;
    },
    addShop() {
      this.shopId = '';
      this.shopDetail = {
        leftIcon: '',
        leftIconUrl: '',
        rightIcon: '',
        rightIconUrl: '',
        shopName: '',
        shareIcon: '',
        shareRemark: '',
        shareTitle: '',
        shopBannerList: [],
        shopClassifyList: [],
        shopServiceList: [],
      };

      this.dialogForm1.shopName = this.shopDetail.shopName;
      this.dialogForm1.leftIcon = this.shopDetail.leftIcon ? this.shopDetail.leftIcon : '';
      this.dialogForm1.leftIconUrl = this.shopDetail.leftIconUrl ? this.shopDetail.leftIconUrl : '';
      this.dialogForm1.rightIcon = this.shopDetail.rightIcon ? this.shopDetail.rightIcon : '';
      this.dialogForm1.rightIconUrl = this.shopDetail.rightIconUrl ? this.shopDetail.rightIconUrl : '';

      this.dialogForm2 = this.shopDetail.shopBannerList;

      this.shopServiceList = this.shopDetail.shopServiceList
      this.getList3();

      this.classifyList = this.shopDetail.shopClassifyList;

      this.dialogForm5.shareTitle = this.shopDetail.shareTitle ? this.shopDetail.shareTitle : '';
      this.dialogForm5.shareRemark = this.shopDetail.shareRemark ? this.shopDetail.shareRemark : '';
      this.dialogForm5.shareIcon = this.shopDetail.shareIcon ? this.shopDetail.shareIcon : '';


      this.tabIndex = 1;
      this.isEdit = true;
    },
    getList() {
      this.$get(`${this.baseUrls}/shop/front/admin/v1/shopList`, {
        pageIndex: 1,
        pageSize: 100,
      }).then((res) => {
        this.dataSource = res.data;
      })
    },

    preViewShop() {
      this.dialogVisiblepreview = true;
    },
    copyUrlShop(id) {
      let input = document.getElementById('input');
      input.value = `${this.originUrl}&id=${id}`;
      input.select();
      document.execCommand("copy");
      this.$message({
        type: 'success',
        message: '链接复制成功',
      });
    },
    copyTemplateShop(id) {
      this.$get(`${this.baseUrls}/shop/front/admin/v1/copyShop`, {
        shopId: id,
      }).then((res) => {
        this.shopId = res.data;
        this.isEdit = true;
        this.tabIndex = 1;
        this.getShopDetail();
      })
    },
    deleteShop(id) {
      this.$get(`${this.baseUrls}/shop/front/admin/v1/deleteShop`, {
        shopId: id,
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '删除成功',
        });
        this.getList()
      })
    },
    searchSons() {
      this.getListSons();
    },
    distribShop(id) {
      this.shopId = id;
      this.getListSons();
      this.dialogVisibleprsons = true;
    },
    distributeItem(row) {
      this.$get(`${this.baseUrls}/shop/front/admin/v1/copyShop`, {
        shopId: this.shopId,
        userId: row.userId,
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '微店模板分配成功',
        });
      })
    },
    getListSons() {
      this.$get(`${this.baseUrlh}/user/front/v1/subAccountList`, {
        pageIndex: this.pageIndexson,
        pageSize: this.pageSizeson,
        parentId: localStorage.getItem('id'),
        nameType: this.formInline.nameType,
        nameStr: this.formInline.nameStr.replace(/\s+/g, ''),
        phoneNum: this.formInline.phoneNum.replace(/\s+/g, ''),
        isOpen: this.formInline.isOpen,
        type: this.formInline.type,
      }).then((res) => {
        this.dataSourceson = res.data;
        this.totalson = res.totalCount;
      })
    },
    handleSizeChangeson(v) {
      this.pageSizeson = v;
      this.getListSons();
    },
    handleCurrentChangeson(v) {
      this.pageIndexson = v;
      this.getListSons();
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  overflow-x: auto;
}
.wd-editbox {
  width: 1220px;
  height: 800px;
  background: #fff;
  box-shadow: 0px 2px 10px 5px rgba(212, 216, 227, 0.15);
  position: relative;
  &::after {
    content: "";
    display: block;
    height: 0;
    clear: both;
  }
  .left-box,
  .middle-box,
  .right-box {
    height: 800px;
    float: left;
  }
  .left-box {
    width: 100px;
    .tab-item {
      cursor: pointer;
      height: 100px;
      text-align: center;
      padding-top: 28px;
      .tab-img {
        width: 20px;
        height: 20px;
      }
      .tab-name {
        margin-top: 7px;
        font-size: 14px;
        color: #8f9298;
      }
    }
    .tab-item.active {
      background: linear-gradient(
        90deg,
        rgba(247, 127, 102, 1) 0%,
        rgba(255, 87, 87, 1) 100%
      );
      position: relative;
      .tab-name {
        color: #fff;
        font-weight: 700;
      }
      &::after {
        content: "";
        position: absolute;
        top: 43px;
        right: 0;
        width: 20px;
        height: 14px;
        border-top: 7px solid transparent;
        border-left: 10px solid transparent;
        border-bottom: 7px solid transparent;
        border-right: 10px solid #fff;
      }
    }
  }
  .middle-box {
    width: 452px;
    background: #f4f4f4;
    padding: 38px 0 0 20px;
    > img {
      width: 411px;
      height: 760px;
    }
  }
  .right-box {
    width: 668px;
    padding-top: 80px;
  }
  .close-btn {
    position: absolute;
    font-size: 25px;
    cursor: pointer;
    color: #666;
    top: 5px;
    right: 18px;
    svg {
      width: 18px;
      height: 18px;
    }
  }
}

.wd-editbox .right-box4 {
  padding-top: 35px;
  .title-line {
    height: 20px;
    line-height: 20px;
    padding-left: 40px;
    color: #212135;
    font-size: 14px;
    position: relative;
    margin-bottom: 10px;
    &::after {
      content: "";
      position: absolute;
      width: 528px;
      height: 1px;
      background: #eee;
      left: 78px;
      top: 9px;
    }
  }
  .tabs-box {
    position: relative;
    margin-bottom: 12px;
    padding-left: 165px;
    font-size: 14px;
    overflow: hidden;
    .tabs-title {
      position: absolute;
      line-height: 30px;
      height: 30px;
      color: #666;
      top: 0;
      left: 110px;
    }
    .tab-item {
      height: 30px;
      line-height: 30px;
      margin-right: 20px;
      margin-bottom: 5px;
      float: left;
      cursor: pointer;
      .tab-name {
        padding: 5px 10px;
        background: #cecece;
        color: #fff;
        border-radius: 4px;
        margin-right: 0px;
      }
      .tab-name-new {
        padding: 5px 10px;
        color: #ff5757;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 6px 10px 0px rgba(255, 87, 87, 0.1);
        border: 1px solid rgba(255, 87, 87, 1);
      }
      .tab-name.active {
        background: #ff7979;
      }
      > img {
        width: 20px;
        height: 20px;
      }
      > * {
        vertical-align: middle;
      }
    }
  }

  .midbox4 {
    font-size: 14px;
    padding: 0 28px 0 40px;
    .midbox4-inner {
      padding: 20px 0;
      background: #f9f9fa;
      .search-box {
        padding-left: 126px;
        position: relative;

        .search-title-word {
          width: 126px;
          color: #666;
          line-height: 40px;
          height: 40px;
          position: absolute;
          top: 0;
          left: 0;
          padding-right: 23px;
          text-align: right;
        }
        .search-box-inner {
          width: 360px;
          height: 40px;
          line-height: 40px;
          display: inline-block;
          vertical-align: middle;
          margin-right: 10px;
        }
        .search-sure {
          display: inline-block;
          cursor: pointer;
          width: 64px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #fff;
          background: #ff5757;
          box-shadow: 0px 8px 10px 0px rgba(0, 0, 0, 0.1);
        }
      }

      .title-line2 {
        height: 20px;
        line-height: 20px;
        padding-left: 66px;
        color: #212135;
        font-size: 14px;
        position: relative;
        margin-bottom: 25px;
        margin-top: 20px;
        &::after {
          content: "";
          position: absolute;
          width: 480px;
          height: 1px;
          background: #eee;
          left: 109px;
          top: 9px;
        }
      }

      .pro-listbox {
        max-height: 366px;
        overflow-y: auto;
        > li {
          height: 112px;
          margin-bottom: 10px;
          > * {
            display: inline-block;
            vertical-align: middle;
            height: 100%;
          }
          .pro-number {
            width: 126px;
            padding-left: 66px;
            color: #666;
          }
          .pro-detail {
            width: 360px;
            background: #fff;
            border: 1px solid rgba(238, 238, 238, 1);
            padding: 13px 0 14px 126px;
            position: relative;
            > img {
              width: 85px;
              height: 85px;
              position: absolute;
              left: 19px;
              top: 13px;
            }
            > .title {
              color: #333;
              height: 23px;
              line-height: 23px;
              font-size: 18px;
              font-weight: 700;
            }
            > .zy {
              height: 23px;
              line-height: 23px;
              color: #333;
              font-size: 16px;
              margin-top: 9px;
              margin-bottom: 8px;
            }
            > .price {
              font-size: 16px;
              color: #ff5757;
              font-weight: 700;
            }
          }
          .pro-btns {
            width: 70px;
            padding-left: 18px;
            line-height: 112px;
            > img {
              width: 20px;
              height: 20px;
              cursor: pointer;
            }
            .edit-pro {
              margin-right: 8px;
            }
          }
        }
      }
      .show-addrpro {
        cursor: pointer;
        height: 40px;
        width: 360px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 10px 18px 0px rgba(255, 87, 87, 0.1);
        border: 1px solid rgba(255, 87, 87, 1);
        color: #ff5757;
        font-size: 14px;
        line-height: 40px;
        text-align: center;
        margin-left: 126px;
        margin-top: 10px;
      }
    }
  }
}

//.@at-root
.wd-lineitem {
  // height: 40px;
  line-height: 40px;
  margin-bottom: 30px;
  overflow: hidden;
  position: relative;
  width: 530px;
  padding-left: 170px;
  .item-left {
    position: absolute;
    top: 0;
    left: 0;
    width: 150px;
    height: 40px;
    line-height: 40px;
    text-align: right;
    font-size: 14px;
    color: #666;
    > .need {
      color: #ff5757;
      padding-right: 8px;
    }
  }
  .item-right {
    width: 360px;
    overflow: hidden;
  }
  .item-right2 {
    height: 40px;
  }
  .item-righttgt {
    .tgt-tip {
      font-size: 14px;
      color: #bbb;
      padding: 10px 0;
      line-height: normal;
    }
  }
  .upload-tip {
    font-size: 14px;
    color: #bbb;
    padding: 10px 0;
    line-height: normal;
  }
  .pic-box-icon,
  .pic-box-img {
    width: 40px;
    height: 40px;
    position: relative;
    .delete {
      position: absolute;
      cursor: pointer;
      width: 20px;
      height: 20px;
      top: -10px;
      right: -10px;
    }
    > img {
      width: 100%;
      height: 100%;
    }
  }
  .pic-box-img {
    width: 134px;
    height: 54px;
    margin-bottom: 20px;
    margin-right: 20px;
    display: inline-block;
  }
  .pic-box-icon100 {
    width: 100px;
    height: 100px;
  }
  .add-tgt-btn {
    cursor: pointer;
    height: 100%;
    width: 100%;
    line-height: 40px;
    text-align: center;
    color: #ff5757;
    font-size: 14px;
    box-shadow: 0px 10px 18px 0px rgba(255, 87, 87, 0.1);
    border: 1px solid rgba(255, 87, 87, 1);
  }
  .nextStep {
    width: 140px;
    float: left;
    margin-right: 20px;
    height: 50px;
    cursor: pointer;
    background: #ff5757;
    text-align: center;
    line-height: 50px;
    color: #fff;
    font-size: 14px;
    border-radius: 3px;
  }
  .reset {
    background: rgba(250, 250, 250, 1);
    border: 1px solid rgba(238, 238, 238, 1);
    color: #666;
  }
}
.mt30 {
  margin-top: 60px;
}

.addtgimg-box {
  text-align: center;
  > img {
    width: 68px;
    height: 68px;
    cursor: pointer;
  }
}

.edit-point-pic {
  width: 22px;
  height: 22px;
  cursor: pointer;
  position: relative;
  top: 3px;
}
.edit-point-inp {
  width: 77%;
  position: relative;
  top: -3px;
  background: transparent;
  height: 100%;
  border: none;
  outline: none;
}

.addpro-dialog {
  .add-zdy,
  .add-mysp {
    width: 114px;
    cursor: pointer;
    color: #ff5757;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    height: 30px;
    margin: 30px auto 10px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 10px 0px rgba(255, 87, 87, 0.1);
    border: 1px solid rgba(255, 87, 87, 1);
  }
  .p1,
  .p2 {
    color: #bbbbbb;
    font-size: 14px;
    text-align: center;
  }
}

//mygoods
.one-box {
  height: 86px;
  padding: 30px 0 20px 40px;
  overflow: hidden;

  > li {
    cursor: pointer;
    float: left;
    height: 36px;
    line-height: 36px;
    text-align: center;
    padding: 0 16px;

    margin-right: 18px;
    font-size: 14px;
    color: #8f9298;
  }
  > li.active {
    font-weight: 700;
    color: #fff;
    background: linear-gradient(
      90deg,
      rgba(247, 127, 102, 1) 0%,
      rgba(255, 87, 87, 1) 100%
    );
    border-radius: 4px;
  }
}

.two-box {
  height: 86px;
  padding: 30px 0 30px 50px;
  overflow: hidden;
  border-top: 1px solid #eeeeef;
  > li {
    cursor: pointer;
    float: left;
    height: 26px;
    text-align: center;
    padding: 0 6px 12px;
    margin-right: 38px;
    font-size: 14px;
    color: #8f9298;
    position: relative;
  }
  > li.active {
    font-weight: 700;
    color: #ff5757;
    border-bottom: 2px solid #ff5757;
  }
}

.img-ewm {
  width: 70px;
  height: 70px;
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  //background-color: #F5F5F5;
}
/*内层轨道，滚动条中间部分 */
::-webkit-scrollbar-track-piece {
  background-color: rgba(0, 0, 0, 0.2);
  -webkit-border-radius: 6px;
}
/* 滚动条里面的小方块，能向上向下移动*/
::-webkit-scrollbar-thumb:vertical {
  height: 5px;
  background-color: rgba(125, 125, 125, 0.7);
  -webkit-border-radius: 6px;
}
/* 滚动条里面的小方块，能向左向右移动*/
::-webkit-scrollbar-thumb:horizontal {
  width: 5px;
  background-color: rgba(125, 125, 125, 0.7);
  -webkit-border-radius: 6px;
}
/*当焦点不在当前区域滑块的状态*/
::-webkit-scrollbar-thumb:window-inactive {
}
</style>

