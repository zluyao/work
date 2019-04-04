<template>
  <div class="claimtwo"
       :class="{'claimtwo-x':isX}">
    <div class="claim-head">
      <img src="../../assets/images/information.png"
           class="img1"
           alt="">
      <img src="../../assets/images/img-step2.png"
           class="img2"
           alt="">
    </div>
    <div class="step-box">
      <img src="../../assets/images/img-2.png"
           alt=""
           class="step-img">
      <p class="step-str">
        填写收款人、联系人信息
      </p>
    </div>

    <div class="item-title item-title1">
      <img src="../../assets/images/title_by.png"
           alt="">
      收款人信息
    </div>

    <div class="item-tab tab-item-two">
      <div class="item-name">收款人是<span class="red">*</span></div>
      <div class="tabs-box">
        <div class="tab-item"
             @click="changeprotectUserType(1)">
          <img v-if="formData.payeeUserType==1"
               class="tab-checked"
               src="../../assets/images/read_icon.png"
               alt="">
          <span v-if="formData.payeeUserType!=1"
                class="tab-unchecked"></span>
          投保人
        </div>
        <div class="tab-item"
             @click="changeprotectUserType(2)">
          <img v-if="formData.payeeUserType==2"
               class="tab-checked"
               src="../../assets/images/read_icon.png"
               alt="">
          <span v-if="formData.payeeUserType!=2"
                class="tab-unchecked"></span>
          被保人
        </div>
        <div class="tab-item"
             @click="changeprotectUserType(4)">
          <img v-if="formData.payeeUserType==4"
               class="tab-checked"
               src="../../assets/images/read_icon.png"
               alt="">
          <span v-if="formData.payeeUserType!=4"
                class="tab-unchecked"></span>
          受益人
        </div>
      </div>
    </div>

    <div class="item-box">
      <div class="item">
        <div class="item-warn"
             v-if="isWarnname">{{warnValuename}}</div>
        <div class="item-name">开户姓名<span class="red">*</span></div>
        <div class="input-box">
          <input type="text"
                 v-model="formData.payeeUserName"
                 @input="nameInputing1"
                 placeholder="请录入姓名"
                 ref="rname"
                 @blur="getBlur('name')"
                 @focus="getFocus('name')"
                 :disabled="formData.payeeUserType==2||formData.payeeUserType==1"
                 maxlength="30">
          <span class="bline"
                v-if="formData.payeeUserType==4"
                :class="{'is-warn':isWarnname}"></span>
          <i v-if="formData.payeeUserName&&isFocusname"
             @click="clearValue('name')"
             class="icon-toubaolurutoubaorenxinxi-baocuo1 iconfont isFocused"></i>
        </div>
      </div>
    </div>

    <div class="item-box">
      <div class="item">
        <div class="item-warn"
             v-if="isWarnbankcode">{{warnValuebankcode}}</div>
        <div class="item-name">银行卡号<span class="red">*</span></div>
        <div class="input-box">
          <input type="text"
                 v-model="formData.bankCardNum"
                 placeholder="请录入银行卡号"
                 @blur="getBlur('bankcode')"
                 @focus="getFocus('bankcode')"
                 ref="rbankcode">
          <span class="bline"
                :class="{'is-warn':isWarnbankcode}"></span>
          <i v-if="isFocusbankcode&&formData.bankCardNum"
             @click="clearValue('bankcode')"
             class="icon-toubaolurutoubaorenxinxi-baocuo1 iconfont isFocused"></i>
        </div>
      </div>
    </div>

    <div class="item-box">
      <div class="item">
        <div class="item-warn"
             v-if="isWarnbankbankname">{{warnValuebankname}}</div>
        <div class="item-name">开户银行<span class="red">*</span></div>
        <div class="input-box">
          <input type="text"
                 v-model="formData.bankName"
                 placeholder="请录入开户银行"
                 @blur="getBlur('bankname')"
                 @focus="getFocus('bankname')"
                 ref="rbankname">
          <span class="bline"
                :class="{'is-warn':isWarnbankbankname}"></span>
          <i v-if="isFocusbankname&&formData.bankName"
             @click="clearValue('bankname')"
             class="icon-toubaolurutoubaorenxinxi-baocuo1 iconfont isFocused"></i>
        </div>
      </div>
    </div>

    <div class="item-box item-boxpr">
      <div class="item">
        <div class="item-name">银行卡正面照片<span class="red">*</span></div>
        <div class="warn-tip">
          <img src="../../assets/images/warn_icon.png"
               alt="">
          <span>请拍照上传领取赔付金的银行卡（卡号面）。</span>
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

            <img @click="deletePic($event,index,srcList1,formData.bankFile)"
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

        </div>
      </div>
    </div>

    <!-- 联系人信息 -->
    <div class="item-title item-title1">
      <img src="../../assets/images/title_by.png"
           alt="">
      联系人信息
    </div>
    <div class="item-tab tab-item-two">
      <div class="item-name">联系人是<span class="red">*</span></div>
      <div class="tabs-box">
        <div class="tab-item"
             @click="changeprotectUserType2(1)">
          <img v-if="formData.linkUserType==1"
               class="tab-checked"
               src="../../assets/images/read_icon.png"
               alt="">
          <span v-if="formData.linkUserType!=1"
                class="tab-unchecked"></span>
          投保人
        </div>
        <div class="tab-item"
             @click="changeprotectUserType2(2)">
          <img v-if="formData.linkUserType==2"
               class="tab-checked"
               src="../../assets/images/read_icon.png"
               alt="">
          <span v-if="formData.linkUserType!=2"
                class="tab-unchecked"></span>
          被保人
        </div>
        <div class="tab-item"
             @click="changeprotectUserType2(4)">
          <img v-if="formData.linkUserType==4"
               class="tab-checked"
               src="../../assets/images/read_icon.png"
               alt="">
          <span v-if="formData.linkUserType!=4"
                class="tab-unchecked"></span>
          受益人
        </div>
      </div>
    </div>

    <div class="item-box">
      <div class="item">
        <div class="item-warn"
             v-if="isWarnname2">{{warnValuename2}}</div>
        <div class="item-name">姓名<span class="red">*</span></div>
        <div class="input-box">
          <input type="text"
                 v-model="formData.linkUserName"
                 @input="nameInputing2"
                 placeholder="请录入姓名"
                 ref="rname2"
                 @blur="getBlur('name2')"
                 @focus="getFocus('name2')"
                 :disabled="formData.linkUserType==2||formData.linkUserType==1"
                 maxlength="30">
          <span class="bline"
                v-if="formData.linkUserType==4"
                :class="{'is-warn':isWarnname2}"></span>
          <i v-if="isFocusname2&&formData.linkUserName"
             @click="clearValue('name2')"
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
                  :disabled="formData.linkUserType==2||formData.linkUserType==1"
                  v-model="formData.linkCerType">
            <option v-for="(item,index) in certificateType"
                    :key="index"
                    :value="item.code">{{item.value}}</option>
          </select>
          <span class="bline"
                v-if="formData.linkUserType==4"></span>
          <i style="bottom: 0.1rem;"
             v-if="formData.linkUserType==4"
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
                 v-model="formData.linkCerNum"
                 @input="codevInputing"
                 placeholder="请录入证件号码"
                 @blur="getBlur('code')"
                 @focus="getFocus('code')"
                 ref="rcode"
                 :disabled="formData.linkUserType==2||formData.linkUserType==1">
          <span class="bline"
                v-if="formData.linkUserType==4"
                :class="{'is-warn':isWarncode}"></span>
          <i v-if="isFocuscode&&formData.linkCerNum"
             @click="clearValue('code')"
             class="icon-toubaolurutoubaorenxinxi-baocuo1 iconfont isFocused"></i>
        </div>
      </div>
    </div>

    <div class="item-box">
      <div class="item">
        <div class="item-warn"
             v-if="isWarnphone">{{warnValuephone}}</div>
        <div class="item-name">手机号码<span class="red">*</span></div>
        <div class="input-box">
          <input type="text"
                 v-model="formData.linkPhoneNum"
                 placeholder="请录入手机号码"
                 @blur="getBlur('phone')"
                 @focus="getFocus('phone')"
                 ref="rphone">
          <span class="bline"
                :class="{'is-warn':isWarnphone}"></span>
          <i v-if="isFocusphone&&formData.linkPhoneNum"
             @click="clearValue('phone')"
             class="icon-toubaolurutoubaorenxinxi-baocuo1 iconfont isFocused"></i>
        </div>
      </div>
    </div>

    <div class="item-box">
      <div class="item">
        <div class="item-warn"
             v-if="isWarnmail">{{warnValuemail}}</div>
        <div class="item-name">电子邮箱<span class="red"></span></div>
        <div class="input-box">
          <input type="text"
                 v-model="formData.linkEmail"
                 placeholder="请录入电子邮箱"
                 @blur="getBlur('mail')"
                 @focus="getFocus('mail')"
                 ref="rmail">
          <span class="bline"
                :class="{'is-warn':isWarnmail}"></span>
          <i v-if="isFocusmail&&formData.linkEmail"
             @click="clearValue('mail')"
             class="icon-toubaolurutoubaorenxinxi-baocuo1 iconfont isFocused"></i>
        </div>
      </div>
    </div>

    <div class="item-box">
      <div class="item">
        <!-- <div class="item-warn">xxxx</div> -->
        <div class="item-name">地址<span class="red">*</span></div>
        <div class="input-box"
             @click="setcityPickershow">
          <div class="city-str"
               style="width:100%;height:100%;color: #333;font-size: 0.3rem;">{{cityValues}}</div>
          <span class="bline"></span>
          <i style="bottom: 0.1rem;"
             class="select-arrow iconfont icon-toubaolurutoubaorenxinxi-dropdown-xia"></i>
        </div>
      </div>
    </div>

    <div class="item-box">
      <div class="item">
        <div class="item-warn"
             v-if="isWarnaddress">{{warnValueaddress}}</div>
        <div class="item-name">详细地址<span class="red">*</span></div>
        <div class="input-box">
          <input type="text"
                 v-model="formData.linkAddress"
                 placeholder="请录入详细地址"
                 @blur="getBlur('address')"
                 @focus="getFocus('address')"
                 ref="raddress">
          <span class="bline"
                :class="{'is-warn':isWarnaddress}"></span>
          <i v-if="isFocusaddress&&formData.linkAddress"
             @click="clearValue('address')"
             class="icon-toubaolurutoubaorenxinxi-baocuo1 iconfont isFocused"></i>
        </div>
      </div>
    </div>

    <mt-popup v-model="regionVisible"
              style="width:100%;"
              position="bottom"
              class="region-popup city-box">
      <div class="city-title">
        <!-- <span class="spl"
              @click="cancelCitypicker">取消</span> -->
        请选择地址
        <!-- <span @click="sureCitypicker"
              class="spr">确定</span> -->
      </div>
      <mt-picker :slots="myAddressSlots"
                 :visibleItemCount="5"
                 @change="onMyAddressChange"></mt-picker>
    </mt-popup>

    <!-- 显示大图 -->
    <div class="bigpic-box"
         v-if="isShowBigpic">
      <img :src="bigSrc"
           alt="">
      <i @click="closeBigpic()"
         class="iconfont bigpic-close icon-toubaolurutoubaorenxinxi-baocuo1"></i>

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

import myaddress from '@lib/city.json'

export default {
  name: 'claimthree',
  components: {
  },
  data() {
    return {
      isX: false,

      isWarnname: false,
      warnValuename: '',
      isFocusname: false,

      isWarnbankcode: false,
      warnValuebankcode: '',
      isFocusbankcode: false,

      isWarnbankbankname: false,
      warnValuebankname: '',
      isFocusbankname: false,

      isWarnname2: false,
      warnValuename2: '',
      isFocusname2: false,

      isWarncode: false,
      warnValuecode: '',
      isFocuscode: false,

      isWarnphone: false,
      warnValuephone: '',
      isFocusphone: false,

      isWarnmail: false,
      warnValuemail: '',
      isFocusmail: false,

      isWarnaddress: false,
      warnValueaddress: '',
      isFocusaddress: false,


      nextWord: '',
      certificateType: [],

      formData2: {
        payeeUserName: '',
        linkUserName: '',
        linkCerType: '',
        linkCerNum: '',
      },
      formData: {
        claimId: '',
        payeeUserType: 1,
        payeeUserId: '',
        payeeUserName: '',
        bankCardNum: '',
        bankName: '',
        bankFile: [],

        openId: localStorage.getItem('openidinsurancemy'),

        linkUserType: 1,
        linkUserId: '',
        linkUserName: '',
        linkCerType: '',
        linkCerNum: '',
        linkPhoneNum: '',
        linkEmail: '',
        linkProvince: '',
        linkCity: '',
        linkArea: '',
        addressCode: '',
        linkAddress: '',
      },

      srcList1: [],
      srcListStr1: [],
      isShowBigpic: false,
      bigSrc: '',

      vname: '',
      isWarnname: true,
      isWarn: false,
      a: '',
      regionVisible: false,
      cityValues: '',
      myAddressSlots: [
        {
          flex: 1,
          defaultIndex: -1,
          values: Object.keys(myaddress),  //省份数组
          className: 'slot1',
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'center'
        },
        {
          divider: true,
          content: '-',
          className: 'slot4'
        },
        {
          flex: 1,
          values: [],
          className: 'slot5',
          textAlign: 'center'
        }
      ],
      billId: '',
      fromChange: '',

      showWarn: false,
      warnPicStr: '',
    }
  },

  created() {
    this.isIPhoneX();

    this.billId = common.getUrlParam('billId');
    this.formData.claimId = common.getUrlParam('claimId');
    this.fromChange = common.getUrlParam('fromChange');

    this.getDetail();

    if (this.fromChange) {
      // this.getDetail2();
      this.nextWord = '确认修改'
    } else {
      this.nextWord = '下一步'
    }

    this.getCertificateType();
  },
  mounted() {
    this.$nextTick(() => {

      const arr = this.formData.addressCode.split(',');
      this.myAddressSlots[0].defaultIndex = Number(arr[0]);
      this.myAddressSlots[2].defaultIndex = Number(arr[1]);
      this.myAddressSlots[4].defaultIndex = Number(arr[2]);
      // 这里的值需要和 data里面 defaultIndex 的值不一样才能够初始化
      //因为我没有看过源码（我猜测是因为数据没有改变，不会触发更新）
    });

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
    getFocus(type) {
      this[`isFocus${type}`] = true;
    },
    getBlur(type) {
      this[`isFocus${type}`] = false;
      let obj = {};
      if (type === 'code') {
        obj = common.rules[`check${type}${this.formData.linkCerType}`](this.formData.linkCerNum);
      } else if (type === 'bankcode') {
        obj = common.rules[`check${type}`](this.formData.bankCardNum);
      } else if (type === 'name') {
        obj = common.rules['checkname'](this.formData.payeeUserName);
      } else if (type === 'bankname') {
        obj = common.rules['checkname'](this.formData.bankName);
      } else if (type === 'name2') {
        obj = common.rules['checkname'](this.formData.linkUserName);
      } else if (type === 'phone') {
        obj = common.rules['checkphone'](this.formData.linkPhoneNum);
      } else if (type === 'address') {

        if (!this.formData.linkAddress) {
          obj = {
            v: false,
            s: '请输入详细地址'
          }
        } else {
          obj = {
            v: true,
            s: ''
          }
        }

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
        this.formData.payeeUserName = '';
      } else if (type == 'bankcode') {
        this.formData.bankCardNum = '';
      } else if (type == 'bankname') {
        this.formData.bankName = '';
      } else if (type == 'name2') {
        this.formData.linkUserName = '';
      } else if (type == 'code') {
        this.formData.linkCerNum = '';
      } else if (type == 'phone') {
        this.formData.linkPhoneNum = '';
      } else if (type == 'mail') {
        this.formData.linkEmail = '';
      } else if (type == 'address') {
        this.formData.linkAddress = '';
      }

      this.$refs[`r${type}`].focus();
    },

    onMyAddressChange(picker, values) {

      if (myaddress[values[0]]) {  //这个判断类似于v-if的效果（可以不加，但是vue会报错，很不爽）
        picker.setSlotValues(1, Object.keys(myaddress[values[0]])); // Object.keys()会返回一个数组，当前省的数组
        picker.setSlotValues(2, myaddress[values[0]][values[1]]); // 区/县数据就是一个数组

        const c1 = picker.getSlotValue(0);
        const c1s = picker.getSlotValues(0);
        const c2 = picker.getSlotValue(1);
        const c2s = picker.getSlotValues(1);
        const c3 = picker.getSlotValue(2);
        const c3s = picker.getSlotValues(2);

        if (c1 && c1s && c2 && c2s && c3 && c3s) {
          // this.formData.addressCode = [c1s.indexOf(c1), c2s.indexOf(c2), c3s.indexOf(c3)];
          this.formData.addressCode = `${c1s.indexOf(c1)},${c2s.indexOf(c2)},${c3s.indexOf(c3)}`;
        }

        this.cityValues = values.join('-');

        this.formData.linkProvince = values[0];
        this.formData.linkCity = values[1];
        this.formData.linkArea = values[2];
      }
    },
    cancelCitypicker() {
      this.regionVisible = false;
    },
    sureCitypicker() {
      this.regionVisible = false;
    },
    setcityPickershow() {
      this.regionVisible = true;
    },
    hideWarn() {
      setTimeout(() => {
        this.showWarn = false;
      }, 1500);
    },
    fileChange(el) {
      const files = el.target.files;

      const len = files.length + this.srcListStr1.length + this.srcList1.length;
      if (len > 1) {
        this.warnPicStr = '最多能上传1张图片';
        this.showWarn = true;
        this.hideWarn();
        return false;
      }


      for (let index = 0; index < files.length; index++) {
        this.formData.bankFile.push(files[index]);
      }
      this.fileList(files, this.srcList1);

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
    chooseType() {
      const len = this.srcListStr1.length + this.srcList1.length;
      if (len == 1) {
        this.warnPicStr = '最多能上传1张图片';
        this.showWarn = true;
        this.hideWarn();
        return false;
      }

      document.getElementById('upload_file').click();
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
    nameInputing1() {
      this.formData2.payeeUserName = this.formData.payeeUserName;
    },
    nameInputing2() {
      this.formData2.linkUserName = this.formData.linkUserName;
    },
    codeTypechange() {
      this.formData2.linkCerType = this.formData.linkCerType;
    },
    codevInputing(v) {
      this.formData2.linkCerNum = this.formData.linkCerNum;
    },
    changeprotectUserType(v) {
      this.formData.payeeUserType = v;
      this.getDetail(1);
      if (this.formData.payeeUserType == 2 || this.formData.payeeUserType == 1) {
        this.isWarnname = false;
        this.warnValuename = '';
        this.isWarnbankcode = false;
        this.warnValuebankcode = '';
        this.isWarnbankbankname = false;
        this.warnValuebankname = '';
        this.isWarnname2 = false;
        this.warnValuename2 = '';
        this.isWarncode = false;
        this.warnValuecode = '';
        this.isWarnphone = false;
        this.warnValuephone = '';
        this.isWarnaddress = false;
        this.warnValueaddress = '';
      } else {
        this.formData.payeeUserName = this.formData2.payeeUserName;
      }
    },
    changeprotectUserType2(v) {
      this.formData.linkUserType = v;
      if (this.formData.linkUserType == 2 || this.formData.linkUserType == 1) {
        this.isWarnname = false;
        this.warnValuename = '';
        this.isWarnbankcode = false;
        this.warnValuebankcode = '';
        this.isWarnbankbankname = false;
        this.warnValuebankname = '';
        this.isWarnname2 = false;
        this.warnValuename2 = '';
        this.isWarncode = false;
        this.warnValuecode = '';
        this.isWarnphone = false;
        this.warnValuephone = '';
        this.isWarnaddress = false;
        this.warnValueaddress = '';
      } else {
        this.formData.linkUserName = this.formData2.linkUserName;
        this.formData.linkCerType = this.formData2.linkCerType;
        this.formData.linkCerNum = this.formData2.linkCerNum;
      }
      this.getDetail(1);
    },
    getDetail2() {
      common.http.get('/api/secret/claim/v1/claimDetail', {
        claimId: this.formData.claimId,
      }).then((res) => {
        const { data } = res;

        if (data.claimState == 1) {
          return
        }

        if (!data.bankFile || data.bankFile === 'null') {
          this.srcListStr1 = [];
        } else {
          this.srcListStr1 = data.bankFile.split(',');
        }

        this.formData.payeeUserType = data.payeeUserType;
        this.formData.payeeUserId = data.payeeUserId;
        this.formData.payeeUserName = data.payeeUserName;
        this.formData.bankCardNum = data.bankCardNum;
        this.formData.bankName = data.bankName;

        this.formData.linkUserType = data.linkUserType;
        this.formData.linkUserId = data.linkUserId;
        this.formData.linkUserName = data.linkUserName;
        this.formData.linkCerType = data.linkCerType;
        this.formData.linkCerNum = data.linkCerNum;
        this.formData.linkPhoneNum = data.linkPhoneNum;
        this.formData.linkEmail = data.linkEmail;
        this.formData.linkProvince = data.linkProvince;
        this.formData.linkEmail = data.linkEmail;
        this.formData.linkCity = data.linkCity;
        this.formData.linkArea = data.linkArea;
        this.formData.addressCode = data.addressCode;
        this.formData.linkAddress = data.linkAddress;

        const arr = this.formData.addressCode.split(',');
        this.myAddressSlots[0].defaultIndex = Number(arr[0]);
        this.myAddressSlots[2].defaultIndex = Number(arr[1]);
        this.myAddressSlots[4].defaultIndex = Number(arr[2]);


        // 是否是受益人
        if (this.formData.payeeUserType == 4) {
          this.formData2.payeeUserName = this.formData.payeeUserName;
        }
        if (this.formData.linkUserType == 4) {
          this.formData2.linkUserName = this.formData.linkUserName;
          this.formData2.linkCerType = this.formData.linkCerType;
          this.formData2.linkCerNum = this.formData.linkCerNum;
        }


      })

    },
    getDetail(ischangetype) {
      common.http.get('/api/secret/bill/v1/billDetail', {
        billId: this.billId,
      }).then((res) => {
        const userVoList = res.data.userVoList[0];
        if (ischangetype) {
          if (this.formData.linkUserType == 2) {
            this.formData.linkCerNum = userVoList.protectedCertificateNum;
            this.formData.linkCerType = userVoList.protectedCertificateType;
            this.formData.linkUserName = userVoList.protectedUserName;
          } else if (this.formData.linkUserType == 1) {
            this.formData.linkCerNum = res.data.insureCertificateNum;
            this.formData.linkCerType = res.data.insureCertificateType;
            this.formData.linkUserName = res.data.insureUserName;
          }

          if (this.formData.payeeUserType == 2) {
            this.formData.payeeUserName = userVoList.protectedUserName;

          } else if (this.formData.payeeUserType == 1) {
            this.formData.payeeUserName = res.data.insureUserName;
          }
          return
        }


        if (!this.fromChange) {
          if (this.formData.linkUserType == 2) {
            this.formData.linkCerNum = userVoList.protectedCertificateNum;
            this.formData.linkCerType = userVoList.protectedCertificateType;
            this.formData.linkUserId = userVoList.protectedUserId;
            this.formData.linkUserName = userVoList.protectedUserName;
          } else if (this.formData.linkUserType == 1) {
            this.formData.linkCerNum = res.data.insureCertificateNum;
            this.formData.linkCerType = res.data.insureCertificateType;
            this.formData.linkUserId = res.data.insureLoginId;
            this.formData.linkUserName = res.data.insureUserName;
          }

          if (this.formData.payeeUserType == 2) {
            this.formData.payeeUserId = userVoList.protectedUserId;
            this.formData.payeeUserName = userVoList.protectedUserName;

          } else if (this.formData.payeeUserType == 1) {
            this.formData.payeeUserName = res.data.insureUserName;
            this.formData.payeeUserId = res.data.insureLoginId;
          }

          this.formData.addressCode = '0,0,0';
          const arr = this.formData.addressCode.split(',');
          this.myAddressSlots[0].defaultIndex = Number(arr[0]);
          this.myAddressSlots[2].defaultIndex = Number(arr[1]);
          this.myAddressSlots[4].defaultIndex = Number(arr[2]);
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

        // 是否是受益人
        if (this.formData.payeeUserType == 4) {
          this.formData2.payeeUserName = this.formData.payeeUserName;
        }
        if (this.formData.linkUserType == 4) {
          this.formData2.linkUserName = this.formData.linkUserName;
          this.formData2.linkCerType = this.formData.linkCerType;
          this.formData2.linkCerNum = this.formData.linkCerNum;
        }

      })
    },
    getCertificateType() {
      common.http.get('/api/secret/common/v1/certificateType').then((res) => {
        this.certificateType = res.data;
      });
    },
    checkSure() {

      if (!common.rules.checkname(this.formData.payeeUserName).v) {
        this.isWarnname = true;
        this.warnValuename = common.rules.checkname(this.formData.payeeUserName).s;
        return false;
      }

      if (!common.rules.checkbankcode(this.formData.bankCardNum).v) {
        this.isWarnbankcode = true;
        this.warnValuebankcode = common.rules.checkbankcode(this.formData.bankCardNum).s;
        return false;
      }

      if (!common.rules.checkname(this.formData.bankName).v) {
        this.isWarnbankbankname = true;
        this.warnValuebankname = common.rules.checkname(this.formData.bankName).s;
        return false;
      }

      if (!common.rules.checkname(this.formData.linkUserName).v) {
        this.isWarnname2 = true;
        this.warnValuename2 = common.rules.checkname(this.formData.linkUserName).s;
        return false;
      }

      if (!common.rules.checkphone(this.formData.linkPhoneNum).v) {
        this.isWarnphone = true;
        this.warnValuephone = common.rules.checkphone(this.formData.linkPhoneNum).s;
        return false;
      }

      if (!this.formData.linkAddress) {
        this.isWarnaddress = true;
        this.warnValueaddress = '请输入详细地址';
        return false;
      }

      if (!common.rules[`checkcode${this.formData.linkCerType}`](this.formData.linkCerNum).v) {
        this.isWarncode = true;
        this.warnValuecode = common.rules[`checkcode${this.formData.linkCerType}`](this.formData.linkCerNum).s;
        return false;
      }

      const len1 = this.formData.bankFile.length + this.srcListStr1.length;
      if (!len1) {
        this.showWarn = true;
        this.warnPicStr = '请上传银行卡卡号面';
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
      const array1 = this.formData.bankFile;
      formData.append('openId', this.formData.openId);
      formData.append('claimId', this.formData.claimId);
      formData.append('payeeUserType', this.formData.payeeUserType);
      formData.append('payeeUserId', this.formData.payeeUserId);
      formData.append('payeeUserName', this.formData.payeeUserName);
      formData.append('bankCardNum', this.formData.bankCardNum);
      formData.append('bankName', this.formData.bankName);

      for (let index = 0; index < array1.length; index++) {
        formData.append('bankFile', array1[index]);

      }

      formData.append('linkUserType', this.formData.linkUserType);
      formData.append('linkUserId', this.formData.linkUserId);
      formData.append('linkUserName', this.formData.linkUserName);
      formData.append('linkCerType', this.formData.linkCerType);
      formData.append('linkCerNum', this.formData.linkCerNum);
      formData.append('linkPhoneNum', this.formData.linkPhoneNum);
      formData.append('linkEmail', this.formData.linkEmail);
      formData.append('linkProvince', this.formData.linkProvince);
      formData.append('linkCity', this.formData.linkCity);
      formData.append('linkArea', this.formData.linkArea);
      formData.append('addressCode', this.formData.addressCode);
      formData.append('linkAddress', this.formData.linkAddress);

      if (this.srcListStr1.length) {
        formData.append('bankFileOld', this.srcListStr1.join(','));
      }

      common.http.post('/api/secret/claim/v1/saveClaimSecond', formData)
        .then((res) => {
          window.location.href = `./claimthree.html?claimId=${this.formData.claimId}`;
        })

    },
  },
  components: {
  },
}
</script>
<style scoped lang="less">
.claimtwo {
  padding-bottom: 1.98rem;
}
.claimtwo-x{
  padding-bottom: 2.32rem;
}
.item-title {
  height: 0.72rem;
  line-height: 0.72rem;
  position: relative;
  padding-left: 0.6rem;
  font-size: 0.36rem;
  color: #333;
  font-weight: 700;
  > img {
    position: absolute;
    width: 0.36rem;
    height: 0.72rem;
    top: 0;
    left: 0;
  }
}
.item-title1 {
  margin-top: 0.4rem;
}
.pic-box {
  padding-right: 0.6rem;
  .item-pic {
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

.city-box {
  .city-title {
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
    font-size: 0.32rem;
    color: #000;
    border-bottom: 1px solid #eee;
    > span {
      height: 100%;
      padding: 0 0.2rem;
    }
    .spl {
      float: left;
    }
    .spr {
      float: right;
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
</style>
