// components/car-number/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    item1: ["京", "沪", "浙", "苏", "粤", "鲁", "晋", "冀",
      "豫", "川", "渝", "辽", "吉", "黑", "皖", "鄂",
      "津", "贵", "云", "桂", "琼", "青", "新", "藏",
      "蒙", "宁", "甘", "陕", "闽", "赣", "湘"],
    item2: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
      "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
      "A", "S", "D", "F", "G", "H", "J", "K", "L",
      "Z", "X", "C", "V", "B", "N", "M"],
    hidden1: true,
    hidden2: true,
    carNo: '',
  },
  ready(){
  },
  /**
   * 组件的方法列表
   */
  methods: {
    cha(){
    // 此函数不可删除！！！
    },
    clear(){
      this.setData({
        carNo:'',
        hidden1: false,
        hidden2: true
      }, () => {
        this.triggerEvent('myevent', this.data.carNo);
      })
    },
    //车牌输入获取焦点
    d1: function () {
      var that = this;
      if (that.data.carNo == '') {
        that.setData({
          hidden1: false,
          hidden2: true
        })
      } else {
        that.setData({
          hidden1: true,
          hidden2: false
        })
      }

    },
    //车牌输入失去焦点
    d2: function () {
      var that = this;
      that.triggerEvent('changepla');
      that.setData({
        hidden1: true,
        hidden2: true
      })
    },
    //获取车牌省份
    sheng: function (e) {
      var that = this;
    //  console.log(e.currentTarget.dataset.sh);
      that.setData({
        carNo: e.currentTarget.dataset.sh
      },()=>{
        that.triggerEvent('myevent', that.data.carNo);
      })
      if (that.data.carNo != '') {
        that.setData({
          hidden1: true,
          hidden2: false
        })
      }
    },
    //获取车牌号码
    other: function (e) {
      var that = this;
    //  console.log(e.currentTarget.dataset.ot);
      var carNo = that.data.carNo + e.currentTarget.dataset.ot;
      that.setData({
        carNo: carNo
      },()=>{
        that.triggerEvent('myevent', that.data.carNo);
      })
    },
    //回删车牌
    del: function () {
      var that = this;
      var ss = that.data.carNo;
    //  console.log(ss);
      var s = ss.split('');
   //   console.log(s);
   //   console.log(s.slice(0, -1));
      if (s.slice(0, -1).length == 0) {
        that.setData({
          hidden1: false,
          hidden2: true
        })
      }
    //  console.log(s.join('').slice(0, -1));
      var s = s.join('').slice(0, -1);
      that.setData({
        carNo: s
      }, () => {
        that.triggerEvent('myevent', that.data.carNo);
      })
    //  console.log(that.data.carNo.length);

    },
    //确认输入
    ok: function () {
      var that = this;
      that.setData({
        hidden1: true,
        hidden2: true
      })
    },
  }
})
