<template>
    <div class="page-util between">
      <div class="pages" :class="displayStyle">
        <a href="javascript:void(0);" class="fixedit" :class="{'disableBtn':isFirstPage}" @click="resetFirst">First</a>
        <a href="javascript:void(0);" class="fixedit" :class="{'disableBtn':isFirstPage}" @click="preview">Preview</a>
        <template v-for="item in items">
          <a href="javascript:void(0);" :class = "{'current':item.checked}" v-if="item.isItem" @click="changeCurrentPage(item.pageNo)">{{item.pageNo}}</a>
          <span v-if="!item.isItem">...</span>
        </template>
        <a href="javascript:void(0)" class="fixedit" :class = "{'disableBtn':isLastPage}" @click="next">Next</a>
        <a href="javascript:void(0)" class="fixedit" :class = "{'disableBtn':isLastPage}" @click="resetLast">Last</a>
      </div>  
      <div class="jump" :class="displayStyle">
        <span>共&nbsp;{{all}}&nbsp;页，到第</span>
        <input type="number" value="{{cur}}" v-model="jumpNo" @keyup.enter="jump"/>
        <a href="javascript:void(0)" @click = "jump">跳转</a>
      </div>
    </div>
</template>

<script>
import '../../static/bootstrap.min.css';
import Vue from "vue";
import VueResource from "vue-resource";

Vue.use(VueResource);

export default {
  data () {
    return {
      jumpNo:1,
      isWatch:false,
      displayType:1
    }
  },
  props: {
    cur:{type: Number, default:1},
    all: {type:Number, default:1}
  },
  created: function() {
    this.jumpNo = this.cur;
  },
  watch: {
    cur: function(val, oldVal){
        if (this.isWatch)
          this.$dispatch("page-change",val);
    }
  },
  computed: {
    isFirstPage: function(){
      if(this.cur <= 1){
        return true;
      }else{
        return false;
      }
    },
    isLastPage: function(){
      if (this.cur >= this.all) {
        return true;
      }else {
        return false;
      }
    },
    displayStyle: function(){
      if (this.displayType == 2) {
        return "around";
      } else if (this.displayType == 3) {
        return "center";
      }else {
        return "between";
      }
    },
    items: function() {
      var items = [];
      var limitPage = 10;
      if (this.all <= limitPage) {
        this.displayType = 3;
        for (var i = 1; i <= this.all ; i++) {
            if (i == this.cur) {
              items.push({pageNo:i, checked: true, isItem:true});
            }else {
              items.push({pageNo:i, checked: false, isItem:true});
            }
        }
      } else {
        if (this.cur <= limitPage - 3) {
          this.displayType = 2;
          for (var i = 1; i <= limitPage - 2 ; i++) {
            if (i == this.cur) {
              items.push({pageNo:i, checked: true, isItem:true});
            }else {
              items.push({pageNo:i, checked: false, isItem:true});
            }
          }
          items.push({pageNo:0, checked: false, isItem: false});
          items.push({pageNo:this.all - 1, checked: false, isItem: true});
          items.push({pageNo:this.all, checked: false, isItem: true});
        } else {
          items.push({pageNo:1, checked: false, isItem: true});
          items.push({pageNo:2, checked: false, isItem: true});
          items.push({pageNo:0, checked: false, isItem: false});
          if((this.cur + (limitPage - 3)) >= this.all){
            this.displayType = 2;
            for (var i = this.all - (limitPage - 2); i <= this.all; i++) {
              if (i == this.cur) {
                items.push({pageNo:i, checked: true, isItem:true});
              }else {
                items.push({pageNo:i, checked: false, isItem:true});
              }
            }
          }else {
            this.displayType = 1;
            var beginIndex = this.cur - 2;
            var endIndex = this.cur + 2;
            for (var i = beginIndex; i <= endIndex; i++){
              if (i == this.cur) {
                items.push({pageNo:i, checked: true, isItem:true});
              }else {
                items.push({pageNo:i, checked: false, isItem:true});
              }
            }
            items.push({pageNo:0, checked: false, isItem: false});
            items.push({pageNo:this.all - 1, checked: false, isItem: true});
            items.push({pageNo:this.all, checked: false, isItem: true});
          }
        } 
      }
      return items;
    }
  },
  methods: {
    changeCurrentPage: function(val) {
      this.cur = val;
      this.isWatch = true;
    },
    resetFirst: function(){
      this.cur = 1;
      this.isWatch = true;
    },
    resetLast: function() {
      this.cur = this.all;
      this.isWatch = true;
    },
    jump:function() {
      if (this.jumpNo >=1 && this.jumpNo <= this.all) {
          this.cur = parseInt(this.jumpNo);
          this.isWatch = true;
      }else {
          this.jumpNo = this.cur;
      }
    },
    next:function() {
      if(!this.isLastPage) {
        this.isWatch = true;
        this.cur++;
      }
    },
    preview:function(){
       if(!this.isFirstPage){
          this.cur--;
          this.isWatch = true;
       }
        
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .page-util {
      width: 1024px;
      height: 50px;
      display: flex;
      font-size: 12px;
      margin: 0 auto;
    }
    .center {
      justify-content: center;
    }
    .around {
      justify-content: space-around;
    }
    .between {
      justify-content: space-between;
    }
    .page-util>div {
      height: 100%;
      display: flex;
    }
    .pages {
      width: 82%;
      align-items:center;
    }
    .jump {
      width: 18%;
      align-items: center;
    }
    .pages a {
      display: block;     
      width: 66px;
      text-align: center;
      height: 40px;
      line-height: 40px;
      border:1px solid lightblue;
      border-radius: 4px;
      margin-left: 8px;
    }
    .pages span {
      display: block;
      height: 40px;
      line-height: 40px;
      margin-left: 8px;
    }
    .pages a:nth-child(1) {
      margin-left: 0px;
    }
    .pages .fixedit {
       flex-shrink: 0;
    }
    .jump input {
      width: 40px;
      flex-shrink: 0;
      height: 60%;
      text-align: center;
      border: 1px solid lightblue;
      margin-left: 6px;
    }
    .jump span:first-child {
      margin-left: 10px; 
      width: 81px;
      flex-shrink: 0;
    }
    .jump a {
      margin-left: 8px;
      font-weight: bold;
    }
    .current {
      background-color: #428bca;
      color: white;
    }
    a.disableBtn {
      color: lightgray;
      border: 1px solid lightgray;
      cursor: default;
      text-decoration: none;
    }
</style>
