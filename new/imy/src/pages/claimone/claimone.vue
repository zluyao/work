<template>
  <div class="claimone"
       :class="{'claimone-x':isX}">
    <div class="claim-head">
      <img src="../../assets/images/information.png"
           class="img1"
           alt="">
      <img src="../../assets/images/img-step1.png"
           class="img2"
           alt="">
    </div>
    <div class="step-box">
      <img src="../../assets/images/img-1.png"
           alt=""
           class="step-img">
      <p class="step-str">
        填写出险信息
      </p>
    </div>

    <div class="pname-box">
      <div class="pname-title">
        <span>保险产品<span class="red">*</span></span>
        <div class="view-dzbd"
             @click="isShowemailbox=true">获取理赔申请相关文件 <i class="iconfont icon-chanpintoubaojieshaoye-likegoumai"></i></div>
      </div>
      <p class="pname-value">{{insureProduct}}（{{insureSchemeName}}）</p>
    </div>

    <div class="item-tab">
      <div class="item-name">为谁报案<span class="red">*</span></div>
      <div class="tabs-box">
        <div class="tab-item"
             @click="changeprotectUserType(2)">
          <img v-if="formData.protectUserType==2"
               class="tab-checked"
               src="../../assets/images/read_icon.png"
               alt="">
          <span v-if="formData.protectUserType!=2"
                class="tab-unchecked"></span>
          被保人
        </div>
        <div class="tab-item"
             @click="changeprotectUserType(3)">
          <img v-if="formData.protectUserType==3"
               class="tab-checked"
               src="../../assets/images/read_icon.png"
               alt="">
          <span v-if="formData.protectUserType!=3"
                class="tab-unchecked"></span>
          附带被保人
        </div>
        <div class="tab-item"
             @click="changeprotectUserType(1)">
          <img v-if="formData.protectUserType==1"
               class="tab-checked"
               src="../../assets/images/read_icon.png"
               alt="">
          <span v-if="formData.protectUserType!=1"
                class="tab-unchecked"></span>
          投保人
        </div>
      </div>
    </div>

    <div class="item-box">
      <div class="item">
        <div class="item-warn"
             v-if="isWarnname">{{warnValuename}}</div>
        <div class="item-name">{{formData.protectUserType==2?'被保人姓名':formData.protectUserType==3?'附带被保人姓名':'投保人姓名'}}<span class="red">*</span></div>
        <div class="input-box">
          <input type="text"
                 v-model="formData.protectUserName"
                 @input="nameInputing"
                 placeholder="请录入姓名"
                 @blur="getBlur('name')"
                 @focus="getFocus('name')"
                 ref="rname"
                 :disabled="formData.protectUserType==2||formData.protectUserType==1"
                 maxlength="30">
          <span class="bline"
                v-if="formData.protectUserType==3"
                :class="{'is-warn':isWarnname}"></span>
          <i v-if="isFocusname&&formData.protectUserName"
             @click="clearValue('name')"
             class="icon-toubaolurutoubaorenxinxi-baocuo1 iconfont isFocused"></i>
        </div>
      </div>
    </div>

    <div class="item-box">
      <div class="item">
        <div class="item-name">证件类型<span class="red">*</span></div>
        <div class="input-box">
          <select name=""
                  @change="codeTypechange"
                  :disabled="formData.protectUserType==2||formData.protectUserType==1"
                  v-model="formData.protectCerType">
            <option v-for="(item,index) in certificateType"
                    :key="index"
                    :value="item.code">{{item.value}}</option>
          </select>
          <span class="bline"
                v-if="formData.protectUserType==3"></span>
          <i v-if="formData.protectUserType==3"
             class="select-arrow iconfont icon-toubaolurutoubaorenxinxi-dropdown-xia"></i>
        </div>
      </div>
    </div>

    <div class="item-box">
      <div class="item">
        <div class="item-warn"
             v-if="isWarncode">{{warnValuecode}}</div>
        <div class="item-name">证件号码<span class="red">*</span></div>
        <div class="input-box">
          <input type="text"
                 v-model="formData.protectCerNum"
                 placeholder="请录入证件号码"
                 @input="codevInputing"
                 @blur="getBlur('code')"
                 @focus="getFocus('code')"
                 ref="rcode"
                 :disabled="formData.protectUserType==2||formData.protectUserType==1"
                 maxlength="30">
          <span class="bline"
                v-if="formData.protectUserType==3"
                :class="{'is-warn':isWarncode}"></span>
          <i v-if="isFocuscode&&formData.protectCerNum"
             @click="clearValue('code')"
             class="icon-toubaolurutoubaorenxinxi-baocuo1 iconfont isFocused"></i>
        </div>
      </div>
    </div>

    <div class="item-box item-boxpr">
      <div class="item">
        <div class="item-name">{{formData.protectUserType==2?'被保人身份证明':formData.protectUserType==3?'附带被保人身份证明':'投保人身份证明'}}<span class="red">*</span></div>
        <div class="warn-tip">
          <img src="../../assets/images/warn_icon.png"
               alt="">
          <span>身份证明包括身份证、户口本、护照，当被保人是新生儿时上传《出生医学证明》。</span>
        </div>
        <div class="pic-box clear-fixed">

          <div style="display: none">
            <input @change="fileChange($event)"
                   type="file"
                   accept="image/*"
                   id="upload_file"
                   multiple />
          </div>

          <!-- 修改编辑时候的图片数组 -->
          <div class="item-pic item-picsrc"
               @click="showBigPic(item)"
               :key="index"
               v-for="(item,index) in srcListStr1">
            <img class="pic-value"
                 :src="item"
                 alt="">

            <img @click="deletePic($event,index,srcListStr1)"
                 class="delete-pic"
                 src="../../assets/images/icon-delete.png"
                 alt="">
          </div>

          <div class="item-pic item-picsrc"
               @click="showBigPic(item)"
               :key="index"
               v-for="(item,index) in srcList1">
            <img class="pic-value"
                 :src="item"
                 alt="">

            <img @click="deletePic($event,index,srcList1,formData.identityFile)"
                 class="delete-pic"
                 src="../../assets/images/icon-delete.png"
                 alt="">
          </div>
          <div class="item-pic"
               @click="chooseType">
            <img class="pic-defalut"
                 src="../../assets/images/icon-photo.png"
                 alt="">
            <p class="word-defalut">拍照上传</p>
          </div>
          <div class="item-pic"
               @click="showPicsl">
            <img class="pic-defalut"
                 src="../../assets/images/icon-idcard.png"
                 alt="">
            <p class="word-defalut">示例</p>
          </div>
        </div>
      </div>
    </div>

    <div class="item-box item-boxpr"
         v-if="(isNotadult&&formData.protectUserType==2)||formData.protectUserType==3">
      <div class="item">
        <div class="item-name item-jhr">监护人证明<span class="red">*</span>
          <!-- <div class="get-mail"
               @click="isShowemailbox=true">获取理赔申请相关文件
            <i class="iconfont icon-chanpintoubaojieshaoye-likegoumai"></i>
          </div> -->
        </div>
        <div class="warn-tip">
          <img src="../../assets/images/warn_icon.png"
               alt="">
          <span>当被保人未成年或失去民事权利时需要上传监护人证明</span>
        </div>
        <div class="pic-box clear-fixed">

          <div style="display: none">
            <input @change="fileChange2($event)"
                   type="file"
                   accept="image/*"
                   id="upload_file2"
                   multiple />
          </div>

          <!-- 修改编辑时候的图片数组 -->
          <div class="item-pic item-picsrc"
               @click="showBigPic(item)"
               :key="index"
               v-for="(item,index) in srcListStr2">
            <img class="pic-value"
                 :src="item"
                 alt="">

            <img @click="deletePic($event,index,srcListStr2)"
                 class="delete-pic"
                 src="../../assets/images/icon-delete.png"
                 alt="">
          </div>

          <div class="item-pic item-picsrc"
               @click="showBigPic(item)"
               :key="index"
               v-for="(item,index) in srcList2">
            <img class="pic-value"
                 :src="item"
                 alt="">

            <img @click="deletePic($event,index,srcList2,formData.guardianFile)"
                 class="delete-pic"
                 src="../../assets/images/icon-delete.png"
                 alt="">
          </div>
          <div class="item-pic"
               @click="chooseType2">
            <img class="pic-defalut"
                 src="../../assets/images/icon-photo.png"
                 alt="">
            <p class="word-defalut">拍照上传</p>
          </div>

        </div>
      </div>
    </div>

    <div class="item-box">
      <div class="item">
        <div class="item-warn"
             v-if="isWarnclaim">{{warnValueclaim}}</div>
        <div class="item-name">索赔项目<span class="red">*</span></div>
        <div class="input-box">
          <select name=""
                  @change="changeclaimProject"
                  v-model="formData.claimProject">
            <option v-for="(item,index) in claimNames"
                    :key="index"
                    :value="item">{{item}}</option>
          </select>
          <span class="bline"
                :class="{'is-warn':isWarnclaim}"></span>
          <i class="select-arrow iconfont icon-toubaolurutoubaorenxinxi-dropdown-xia"></i>
        </div>
      </div>
    </div>

    <div class="item-box">
      <div class="item">
        <div class="item-warn"
             v-if="isWarnoccurtime">{{warnValueoccurtime}}</div>
        <div class="item-name">出险时间<span class="red">*</span></div>
        <div class="input-box">
          <div class="birthday"
               id="datey"
               :class="{'nothasBirth':!formData.occurTime}"
               @click="setDate">{{formData.occurTime?formData.occurTime:'请录入出险时间'}}</div>
          <span class="bline"
                :class="{'is-warn':isWarnoccurtime}"></span>
          <i class="select-arrow iconfont icon-toubaolurutoubaorenxinxi-dropdown-xia"></i>
        </div>
      </div>
    </div>

    <div class="item-box">
      <div class="item">
        <!-- <div class="item-warn">xxxx</div> -->
        <div class="item-name">索赔事由<span class="red">*</span></div>
        <div class="input-box input-boxtextarea">

          <div class="sl-word"
               v-if="isShowSlword">被保险人 XXX 于 XXXX 年 xx 月 xx 日在 xxx 医院进行 xxx 手 术，XXXX 年 XXX 月 XX 日，因手术意外（或麻醉意外）导 致 XXX“索赔项目”</div>
          <textarea class="textarea-sy"
                    v-model="formData.reason"
                    placeholder="请录入索赔事由"
                    ref="rsy"></textarea>
          <div class="sl-btn"
               @click="changeShowslword"
               :class="{'sl-btn-dark':isShowSlword}">示例</div>
        </div>
      </div>
    </div>

    <div class="item-box item-boxpr">
      <div class="item">
        <div class="item-name">医疗证明<span class="red">*</span></div>
        <div class="warn-tip">
          <img src="../../assets/images/warn_icon.png"
               alt="">
          <span>{{tipIndex==100?'请上传相关医疗证明':claimNamesTips[tipIndex]}}</span>
        </div>
        <div class="pic-box clear-fixed">

          <div style="display: none">
            <input @change="fileChange3($event)"
                   name="file"
                   type="file"
                   accept="image/*"
                   id="upload_file3"
                   multiple />
          </div>

          <!-- 修改编辑时候的图片数组 -->
          <div class="item-pic item-picsrc"
               @click="showBigPic(item)"
               :key="index"
               v-for="(item,index) in srcListStr3">
            <img class="pic-value"
                 :src="item"
                 alt="">

            <img @click="deletePic($event,index,srcListStr3)"
                 class="delete-pic"
                 src="../../assets/images/icon-delete.png"
                 alt="">
          </div>

          <div class="item-pic item-picsrc"
               @click="showBigPic(item)"
               :key="index"
               v-for="(item,index) in srcList3">
            <img class="pic-value"
                 :src="item"
                 alt="">

            <img @click="deletePic($event,index,srcList3,formData.medicalFile)"
                 class="delete-pic"
                 src="../../assets/images/icon-delete.png"
                 alt="">
          </div>
          <div class="item-pic"
               @click="chooseType3">
            <img class="pic-defalut"
                 src="../../assets/images/icon-photo.png"
                 alt="">
            <p class="word-defalut">拍照上传</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 上传示例 -->
    <div class="sl-box"
         v-if="isShowPicsl">
      <div class="sl-inner">
        <img src="../../assets/images/pic-sl.png"
             alt="">
        <span class="sl-close"
              @click="closePicsl"></span>
      </div>
    </div>

    <!-- 显示大图 -->
    <div class="bigpic-box"
         v-if="isShowBigpic">
      <img :src="bigSrc"
           alt="">
      <i @click="closeBigpic()"
         class="iconfont bigpic-close icon-toubaolurutoubaorenxinxi-baocuo1"></i>

    </div>

    <awesome-picker ref="picker3"
                    :type="picker3.type"
                    :anchor="picker3.anchor"
                    @confirm="handlePicker3Confirm">
    </awesome-picker>
    <!-- :class="{'email-box2':isMialFocus}" -->
    <div class="email-box"
         v-if="isShowemailbox">
      <div class="inner-box"
           :class="{'inner-box2':isMialFocus2}">
        <p class="inner-title">发送邮箱获得以下资料</p>
        <img src="../../assets/images/hasdzzbd.png"
             alt="">
        <p class="inner-content">意外险索赔申请书、人身险监护人证明书、太平洋保险医疗意外理赔处理方案（理赔资料）、电子保单、条款</p>
        <div class="email-inputbox email-inputbox-warn">
          <input placeholder="发送邮箱获取资料"
                 type="text"
                 @focus="emailFb(1)"
                 @blur="emailFb(2)"
                 v-model="emailValue"
                 name=""
                 id="">
          <i v-if="isMialFocus&&emailValue"
             @click="emailValue = ''"
             class="icon-toubaolurutoubaorenxinxi-baocuo1 iconfont isFocused"></i>
          <span class="warn-word">{{emailWarnWord}}</span>
        </div>
        <div class="send-btn"
             @click="sendEmail">发送</div>
        <div class="close-btn"
             @click="isShowemailbox = false"><i class="iconfont icon-toubaolurutoubaorenxinxi-baocuo1"></i></div>
      </div>
    </div>

    <div class="warn-box"
         v-if="showWarn">
      <div class="warn-text">
        <span class="warn-y"></span>
        <span>{{warnPicStr}}</span>
      </div>
    </div>

    <div class="foot-btns"
         :class="{'foot-btns-x':isX}">
      <a href="tel:057156757519">
        <div class="kf-btn">
          <img src="../../assets/images/iconcustomerservice.png"
               alt="">
          <span>咨询客服</span>
        </div>
      </a>
      <div class="sq-btn"
           @click="nextStep"><span>{{nextWord}}</span><i class="iconfont icon-chanpintoubaojieshaoye-likegoumai"></i></div>
    </div>
  </div>

</template>

<script>
import common from '@lib/common';

import VConsole from 'vconsole/dist/vconsole.min.js' //import vconsole
// let vConsole = new VConsole() // 初始化

export default {
  name: 'claimone',
  data() {
    return {
      isX: false,
      emailWarnWord: '',
      emailValue: '',
      isShowemailbox: false,
      isMialFocus: false,
      isMialFocus2: false,

      insureBeginDate: '',
      isNotadult: false,
      warnPicStr: '',
      showWarn: false,
      nextWord: '',

      isWarnname: false,
      warnValuename: '',
      isFocusname: false,

      isWarncode: false,
      warnValuecode: '',
      isFocuscode: false,

      isWarnclaim: false,
      warnValueclaim: '',

      isWarnoccurtime: false,
      warnValueoccurtime: '',



      isWarn: true,
      picker3: {
        anchor: [],
        type: 'date'
      },
      billId: '',
      schemeId: '',
      fromChange: '',
      certificateType: [],
      claimNames: [],
      claimNamesTips: [],

      srcList1: [],
      srcList2: [],
      srcList3: [],

      srcListStr1: [],
      srcListStr2: [],
      srcListStr3: [],

      formData2: {
        protectCerNum: '',
        protectCerType: '',
        protectUserName: '',
      },

      formData: {
        billId: '',
        claimId: '',
        claimProject: '',
        identityFile: [],
        guardianFile: [],
        medicalFile: [],
        occurTime: '',
        openId: localStorage.getItem('openidinsurancemy'),
        protectCerNum: '',
        protectCerType: '',
        protectUserName: '',
        protectUserId: '',
        protectUserType: 2,
        reason: '',
      },

      isShowSlword: false,
      isShowPicsl: false,
      isShowBigpic: false,
      bigSrc: '',

      insureSchemeName: '',
      insureProduct: '',

      tipIndex: 100,
    }
  },
  created() {
    this.isIPhoneX();

    this.fromChange = common.getUrlParam('fromChange');
    this.billId = common.getUrlParam('billId');
    // this.schemeId = common.getUrlParam('insureSchemeId');
    this.schemeId = Number(localStorage.getItem('insureSchemeId'));
    this.formData.claimId = common.getUrlParam('claimId');
    this.formData.billId = common.getUrlParam('billId');

    this.getDetail();

    if (this.fromChange) {
      // this.getDetail2();
      this.nextWord = '确认修改'
    } else {
      this.nextWord = '下一步'
    }

    this.getCertificateType();
    this.getClaimNames();
  },
  mounted() {

  },
  methods: {
    isIPhoneX() {
      let u = navigator.userAgent;
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isIOS && screen.height == 812 && screen.width == 375) {
        this.isX = true;
      } else {
        this.isX = false;
      }
    },
    emailFb(type) {
      let u = navigator.userAgent;
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      if (type == 1) {
        this.isMialFocus = true
        if (isAndroid) {
          this.isMialFocus2 = true;
        }
      } else {
        this.isMialFocus = false;
        if (isAndroid) {
          this.isMialFocus2 = false;
        }
      }
    },
    sendEmail() {
      if (!common.rules.checkemail(this.emailValue).v) {
        this.emailWarnWord = common.rules.checkemail(this.emailValue).s;
      } else {
        this.emailWarnWord = '';
        common.http.get('/api/secret/claim/v1/sendFiles', {
          email: this.emailValue,
          billId: this.billId,
        }).then((res) => {
          this.showWarn = true;
          this.warnPicStr = '发送成功';
          this.hideWarn();
          this.isShowemailbox = false;
        })
      }
    },
    //校验
    getFocus(type) {
      this[`isFocus${type}`] = true;
    },
    getBlur(type) {
      this[`isFocus${type}`] = false;
      let obj = {};
      if (type === 'code') {
        obj = common.rules[`check${type}${this.formData.protectCerType}`](this.formData.protectCerNum);
      } else if (type === 'name') {
        obj = common.rules[`check${type}`](this.formData.protectUserName);
      }

      if (!obj.v) {
        this[`isWarn${type}`] = true;
        this[`warnValue${type}`] = obj.s;
      } else {
        this[`isWarn${type}`] = false;
        this[`warnValue${type}`] = '';
      }
    },
    clearValue(type) {
      if (type == 'name') {
        this.formData.protectUserName = '';
      } else if (type == 'code') {
        this.formData.protectCerNum = '';
      }

      this.$refs[`r${type}`].focus();
    },



    fileChange(el) {
      const files = el.target.files;
      if (!this.checkFileslength(files, this.srcListStr1, this.srcList1, 1)) {
        return
      }

      this.fileList(files, this.srcList1);

      for (let index = 0; index < files.length; index++) {
        this.formData.identityFile.push(files[index]);
      }
    },
    chooseType() {

      if (!this.checkFileslength([], this.srcListStr1, this.srcList1, 1, true)) {
        return
      }
      document.getElementById('upload_file').click();
    },
    fileChange2(el) {
      const files = el.target.files;
      if (!this.checkFileslength(files, this.srcListStr2, this.srcList2, 2)) {
        return
      }
      for (let index = 0; index < files.length; index++) {
        this.formData.guardianFile.push(files[index]);
      }
      this.fileList(files, this.srcList2);
    },
    chooseType2() {
      if (!this.checkFileslength([], this.srcListStr2, this.srcList2, 2, true)) {
        return
      }
      document.getElementById('upload_file2').click();
    },
    fileChange3(el) {
      const files = el.target.files;
      if (!this.checkFileslength(files, this.srcListStr3, this.srcList3, 3)) {
        return
      }
      for (let index = 0; index < files.length; index++) {
        this.formData.medicalFile.push(files[index]);
      }
      this.fileList(files, this.srcList3);
    },
    hideWarn() {
      setTimeout(() => {
        this.showWarn = false;
      }, 1500);
    },
    checkFileslength(files, srcListStr, srcList, type, isClick) {
      const len = files.length + srcListStr.length + srcList.length;
      if (isClick) {
        if (type == 3) {
          if (len == 6) {
            this.warnPicStr = '最多能上传6张图片';
            this.showWarn = true;
            this.hideWarn();
            return false;
          } else {
            this.warnPicStr = '';
            this.showWarn = false;
            return true;
          }
        } else {
          if (len == 3) {
            this.warnPicStr = '最多能上传3张图片';
            this.showWarn = true;
            this.hideWarn();
            return false;
          } else {
            this.warnPicStr = '';
            this.showWarn = false;
            return true;
          }
        }
      } else {
        if (type == 3) {
          if (len > 6) {
            this.warnPicStr = '最多能上传6张图片';
            this.showWarn = true;
            this.hideWarn();
            return false;
          } else {
            this.warnPicStr = '';
            this.showWarn = false;
            return true;
          }
        } else {
          if (len > 3) {
            this.warnPicStr = '最多能上传3张图片';
            this.showWarn = true;
            this.hideWarn();
            return false;
          } else {
            this.warnPicStr = '';
            this.showWarn = false;
            return true;
          }
        }
      }

    },
    chooseType3() {
      if (!this.checkFileslength([], this.srcListStr3, this.srcList3, 3, true)) {
        return
      }
      document.getElementById('upload_file3').click();
    },
    fileList(files, srcList) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = function (e) {
          srcList.push(e.target.result);
        }
      }
    },
    deletePic(e, i, arrSrclist, arrFormFile) {
      e.stopPropagation();
      arrSrclist.splice(i, 1);
      if (arrFormFile) {
        arrFormFile.splice(i, 1);
      }
    },

    showBigPic(src) {
      this.isShowBigpic = true;
      this.bigSrc = src;
    },
    closeBigpic() {
      this.isShowBigpic = false;
    },

    nameInputing(v) {
      this.formData2.protectUserName = this.formData.protectUserName;
    },
    codeTypechange() {
      this.formData2.protectCerType = this.formData.protectCerType;
    },
    codevInputing(v) {
      this.formData2.protectCerNum = this.formData.protectCerNum;
    },
    changeprotectUserType(v) {

      this.formData.protectUserType = v;
      if (this.formData.protectUserType == 2 || this.formData.protectUserType == 1) {
        this.isWarnname = false;
        this.warnValuename = '';
        this.isWarncode = false;
        this.warnValuecode = '';
        this.isWarnclaim = false;
        this.warnValueclaim = '';
        this.isWarnoccurtime = false;
        this.warnValueoccurtime = '';
      } else {
        this.formData.protectCerNum = this.formData2.protectCerNum;
        this.formData.protectCerType = this.formData2.protectCerType;
        this.formData.protectUserName = this.formData2.protectUserName;
      }
      this.getDetail(1);
    },
    getClaimNames() {
      common.http.get('/api/secret/claim/v1/getClaimName', {
        schemeId: this.schemeId,
      }).then((res) => {
        let { claimList, medicalList } = res.data;
        let arr = [];
        claimList.forEach(item => {
          let arr2 = item.split(',');
          arr2.forEach(v => {
            arr.push(v);
          })
        })
        this.claimNames = arr;

        let _arr = [];
        medicalList.forEach(item => {
          let arr2 = item.split(',');
          arr2.forEach(v => {
            _arr.push(v);
          })
        })
        this.claimNamesTips = _arr;
      });
    },
    getCertificateType() {
      common.http.get('/api/secret/common/v1/certificateType').then((res) => {
        this.certificateType = res.data;
      });
    },
    getDetail2() {
      common.http.get('/api/secret/claim/v1/claimDetail', {
        claimId: this.formData.claimId,
      }).then((res) => {
        const { data } = res;

        if (!data.identityFile || data.identityFile === 'null') {
          this.srcListStr1 = [];
          // this.formData.identityFileOld = null;
        } else {
          this.srcListStr1 = data.identityFile.split(',');
          // this.formData.identityFileOld = data.identityFile;
        }
        if (!data.guardianFile || data.guardianFile === 'null') {
          this.srcListStr2 = [];
        } else {
          this.srcListStr2 = data.guardianFile.split(',');
        }
        if (!data.medicalFile || data.medicalFile === 'null') {
          this.srcListStr3 = [];
        } else {
          this.srcListStr3 = data.medicalFile.split(',');
        }


        this.formData.claimProject = data.claimProject;
        this.formData.occurTime = data.occurTime;
        this.formData.protectCerNum = data.protectCerNum;
        this.formData.protectCerType = data.protectCerType;
        this.formData.protectUserId = data.protectUserId;
        this.formData.protectUserName = data.protectUserName;
        this.formData.protectUserType = data.protectUserType;
        this.formData.reason = data.reason;

        // 是否是附带被保人
        if (this.formData.protectUserType == 3) {
          this.formData2.protectCerNum = this.formData.protectCerNum;
          this.formData2.protectCerType = this.formData.protectCerType;
          this.formData2.protectUserName = this.formData.protectUserName;
        }

      })
    },
    toPdf() {
      window.location.href = `./noticedetail.html?hasUrl=${this.insureUrl}`;
    },
    getDetail(ischangetype) {
      common.http.get('/api/secret/bill/v1/billDetail', {
        billId: this.billId,
      }).then((res) => {
        if (ischangetype) {
          if (this.formData.protectUserType == 2) {
            const userVoList = res.data.userVoList[0];
            this.formData.protectCerNum = userVoList.protectedCertificateNum;
            this.formData.protectCerType = userVoList.protectedCertificateType;
            this.formData.protectUserName = userVoList.protectedUserName;
          } else if (this.formData.protectUserType == 1) {
            this.formData.protectCerNum = res.data.insureCertificateNum;
            this.formData.protectCerType = res.data.insureCertificateType;
            this.formData.protectUserName = res.data.insureUserName;
          }
          return;
        }


        this.insureUrl = res.data.insureUrl;

        if (res.data.userVoList.protectedCertificateType == 1) {
          const today = new Date();
          const thisYear = today.getFullYear();
          let year = res.data.userVoList.protectedCertificateNum.slice(6, 10);
          if (thisYear - year < 18) {
            this.isNotadult = true;
          }
        }

        // 出险时间
        let timeSec = new Date(res.data.insureBeginDate);
        const timeSecYear = timeSec.getFullYear();
        const timeSecMonth = timeSec.getMonth() + 1;
        const timeSecDay = timeSec.getDate();
        let insureBeginDate = `${timeSecYear}-${timeSecMonth}-${timeSecDay}`;
        this.insureBeginDate = insureBeginDate;

        this.insureProduct = res.data.insureProduct;
        this.insureSchemeName = res.data.schemeName;


        if (!this.fromChange) {
          if (this.formData.protectUserType == 2) {
            const userVoList = res.data.userVoList[0];
            this.formData.protectCerNum = userVoList.protectedCertificateNum;
            this.formData.protectCerType = userVoList.protectedCertificateType;
            this.formData.protectUserName = userVoList.protectedUserName;
            this.formData.protectUserId = userVoList.protectedUserId;
          } else if (this.formData.protectUserType == 1) {
            this.formData.protectCerNum = res.data.insureCertificateNum;
            this.formData.protectCerType = res.data.insureCertificateType;
            this.formData.protectUserName = res.data.insureUserName;
            this.formData.protectUserId = res.data.insureLoginId;
          }
        }


        if (this.fromChange) {
          this.getDetail2();
        } else {
          common.http.get('/api/secret/claim/v1/getClaiming', {
            billId: this.billId,
          }).then((res) => {
            if (res.data) {
              this.formData.claimId = res.data;
              this.getDetail2();
            }
          })
        }

        // 是否是附带被保人
        if (this.formData.protectUserType == 3) {
          this.formData2.protectCerNum = this.formData.protectCerNum;
          this.formData2.protectCerType = this.formData.protectCerType;
          this.formData2.protectUserName = this.formData.protectUserName;
        }

      })
    },

    reTime(arr) {
      if (!arr.length) {
        return '';
      }
      const a = arr[0].value.slice(0, arr[0].value.length - 1);
      const b = arr[1].value.slice(0, arr[1].value.length - 1);
      const c = arr[2].value.slice(0, arr[2].value.length - 1);
      const y = a;
      const m = Number(b) < 10 ? `0${b}` : b;
      const d = Number(c) < 10 ? `0${c}` : c;
      return `${y}-${m}-${d}`;
    },
    changeclaimProject(v) {
      const arr = [...this.claimNames];
      this.tipIndex = arr.indexOf(this.formData.claimProject);

      if (this.formData.claimProject) {
        this.isWarnclaim = false;
        this.warnValueclaim = '';
      }
    },
    checkCxtime(t1, t2) {
      if (!t2) {
        return false
      }
      let arr1 = t1.split('-');
      let arr2 = t2.split('-');
      arr1 = arr1.map(v => parseInt(v));
      arr2 = arr2.map(v => parseInt(v));
      if (arr2[0] < arr1[0]) {
        return false
      } else if (arr2[0] == arr1[0] && arr2[1] < arr1[1]) {
        return false
      } else if (arr2[0] == arr1[0] && arr2[1] == arr1[1] && arr2[2] < arr1[2]) {
        return false
      }
      return true
    },
    handlePicker3Confirm(v) {
      this.picker3.anchor = v;
      this.formData.occurTime = this.reTime(v);


      if (!this.checkCxtime(this.insureBeginDate, this.formData.occurTime)) {
        this.isWarnoccurtime = true;
        this.warnValueoccurtime = '出险时间必须晚于保单生效时间';
        return;
      }

      this.isWarnoccurtime = false;
      this.warnValueoccurtime = '';
    },
    setDate() {
      this.$refs.picker3.show()
    },
    checkSure() {
      if (!common.rules.checkname(this.formData.protectUserName).v) {
        this.isWarnname = true;
        this.warnValuename = common.rules.checkname(this.formData.protectUserName).s;
        return false;
      }

      if (!common.rules[`checkcode${this.formData.protectCerType}`](this.formData.protectCerNum).v) {
        this.isWarncode = true;
        this.warnValuecode = common.rules[`checkcode${this.formData.protectCerType}`](this.formData.protectCerNum).s;
        return false;
      }

      const len1 = this.formData.identityFile.length + this.srcListStr1.length;
      let str = '';
      if (this.formData.protectUserType == 2) {
        str = '被保人'
      } else if (this.formData.protectUserType == 3) {
        str = '附带被保人'
      } else if (this.formData.protectUserType == 1) {
        str = '投保人'
      }
      if (!len1) {
        this.showWarn = true;
        this.warnPicStr = `请上传${str}身份证明`;
        this.hideWarn();
        return false;
      }

      // 是否有这个监护证明校验
      if ((this.isNotadult && this.formData.protectUserType == 2) || this.formData.protectUserType == 3) {
        const len2 = this.formData.guardianFile.length + this.srcListStr2.length;
        if (!len2) {
          this.showWarn = true;
          this.warnPicStr = '请上传监护人证明';
          this.hideWarn();
          return false;
        }
      }


      if (!this.formData.claimProject) {
        this.isWarnclaim = true;
        this.warnValueclaim = '请选择索赔项目';
        return false;
      }

      // 出险时间
      if (!this.formData.occurTime) {
        this.isWarnoccurtime = true;
        this.warnValueoccurtime = '请选择出险时间';
        return false;
      } else {
        if (!this.checkCxtime(this.insureBeginDate, this.formData.occurTime)) {
          this.isWarnoccurtime = true;
          this.warnValueoccurtime = '出险时间必须晚于保单生效时间';
          return false;
        }
      }



      if (!this.formData.reason) {
        this.showWarn = true;
        this.warnPicStr = '请输入索赔事由';
        this.hideWarn();
        return false;
      }

      const len3 = this.formData.medicalFile.length + this.srcListStr3.length;
      if (!len3) {
        this.showWarn = true;
        this.warnPicStr = '请上传相关医疗证明';
        this.hideWarn();
        return false;
      }

      return true;

    },

    nextStep() {

      if (!this.checkSure()) {
        return;
      }

      let formData = new FormData();
      const array1 = this.formData.guardianFile;
      const array2 = this.formData.identityFile;
      const array3 = this.formData.medicalFile;
      formData.append('billId', this.formData.billId);
      formData.append('claimId', this.formData.claimId);
      formData.append('claimProject', this.formData.claimProject);
      for (let index = 0; index < array1.length; index++) {
        formData.append('guardianFile', array1[index]);

      }
      for (let index = 0; index < array2.length; index++) {
        formData.append('identityFile', array2[index]);

      }
      for (let index = 0; index < array3.length; index++) {
        formData.append('medicalFile', array3[index]);

      }
      formData.append('occurTime', this.formData.occurTime);
      formData.append('openId', this.formData.openId);
      formData.append('protectCerNum', this.formData.protectCerNum);
      formData.append('protectCerType', this.formData.protectCerType);
      formData.append('protectUserId', this.formData.protectUserId);
      formData.append('protectUserName', this.formData.protectUserName);
      formData.append('protectUserType', this.formData.protectUserType);
      formData.append('reason', this.formData.reason);

      if (this.srcListStr1.length) {
        formData.append('identityFileOld', this.srcListStr1.join(','));
      }
      if (this.srcListStr2.length) {
        formData.append('guardianFileOld', this.srcListStr2.join(','));
      }
      if (this.srcListStr3.length) {
        formData.append('medicalFileOld', this.srcListStr3.join(','));
      }

      common.http.post('/api/secret/claim/v1/saveClaimFirst', formData)
        .then((res) => {
          if (this.fromChange) {
            window.location.href = `./claimthree.html?claimId=${this.formData.claimId}`;
          } else {
            window.location.href = `./claimtwo.html?billId=${this.billId}&claimId=${res.data}`;
          }
        })

    },
    closePicsl() {
      this.isShowPicsl = false;
    },
    showPicsl() {
      this.isShowPicsl = true;
    },
    changeShowslword() {
      this.isShowSlword = !this.isShowSlword;
      if (!this.isShowSlword) {
        this.$refs.rsy.focus();
      }
    },
  },
  components: {
  },
}
</script>
<style scoped lang="less">
.claimone {
  padding-bottom: 0.98rem;
}

.claimone-X {
  padding-bottom: 1.32rem;
}
.pname-box {
  margin: 0.4rem auto;
  padding-left: 0.6rem;
  .pname-title {
    height: 0.34rem;
    line-height: 0.34rem;
    color: #666;
    font-size: 0.24rem;
    position: relative;
    margin-bottom: 0.2rem;
    .view-dzbd {
      position: absolute;
      height: 0.34rem;
      top: 0;
      right: 0.4rem;
      color: #ff5757;
      > i {
        padding-left: 0.1rem;
        font-size: 0.2rem;
      }
    }
  }
  .pname-value {
    height: 0.42rem;
    line-height: 0.42rem;
    color: #333;
    font-size: 0.3rem;
  }
}

.pic-box {
  padding-right: 0.6rem;
  .item-pic {
    position: relative;
    float: left;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 0.08rem;
    border: 0.04rem solid rgba(239, 239, 239, 1);
    position: relative;
    text-align: center;
    padding-top: 0.2rem;
    margin-right: 0.3rem;
    margin-bottom: 0.3rem;
    .pic-defalut {
      width: 0.8rem;
      height: 0.8rem;
      // margin-bottom: 0.02rem;
    }
    .word-defalut {
      line-height: 0.34rem;
      font-size: 0.24rem;
      color: #666;
    }
    .pic-value {
      width: 100%;
      height: 100%;
    }
    .delete-pic {
      position: absolute;
      top: -0.12rem;
      right: -0.24rem;
      width: 0.54rem;
      height: 0.54rem;
    }
  }
  .item-picsrc {
    padding-top: 0;
  }
}

.item-box .input-boxtextarea {
  height: unset;
  padding-bottom: 0;
  padding: 0.2rem;
  position: relative;
  border: 1px solid rgba(209, 215, 226, 1);
  border-radius: 0.08rem;
}
.item-box .input-box > .textarea-sy {
  display: block;
  width: 100%;
  height: 3.6rem;
  font-size: 0.28rem;
}
.sl-word {
  position: absolute;
  z-index: 1500;
  top: 0.2rem;
  left: 0.2rem;
  width: 5.9rem;
  max-height: 2.8rem;
  overflow-y: scroll;
  padding: 0.25rem;
  background: #f8f8f8;
  color: #999;
  font-size: 0.28rem;
  line-height: 0.4rem;
  border-radius: 0.08rem;
}
.sl-btn {
  position: absolute;
  bottom: 0.3rem;
  right: 0.3rem;
  width: 1rem;
  height: 0.6rem;
  font-size: 0.26rem;
  line-height: 0.6rem;
  text-align: center;
  color: #ff5757;
  background: rgba(255, 87, 87, 0.1);
  border-radius: 0.3rem;
}
.sl-btn-dark {
  background: #f5f5f5;
  color: #999;
}

.sl-box {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(77, 77, 77, 0.9);
  padding-top: 1.32rem;
  .sl-inner {
    width: 6.3rem;
    height: 8.86rem;
    margin: auto;
    position: relative;
    > img {
      width: 100%;
      height: 100%;
    }
    .sl-close {
      position: absolute;
      width: 0.5rem;
      height: 0.5rem;
      top: 0.3rem;
      right: 0.3rem;
    }
  }
}

.bigpic-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3500;
  background: #1a1a1a;
  > img {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    transform: translateY(-50%);
  }
  .bigpic-close {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    color: #ccc;
    font-size: 0.26rem;
  }
}

.item-jhr {
  position: relative;
  .get-mail {
    position: absolute;
    height: 0.34rem;
    top: 0;
    right: 0.4rem;
    color: #ff5757;
    > i {
      padding-left: 0.1rem;
      font-size: 0.2rem;
    }
  }
}
</style>
