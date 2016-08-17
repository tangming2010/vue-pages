<template>
  <div id="app" class="container">
    <page @page-change="changePage" :cur="currentPageNo" :all="totalPage"></page>
  </div>
</template>

<script>
import "../static/bootstrap.min.css";
import page from './components/Page';

export default {
  components: {
    page
  },
  data: function(){
  	return {
  		currentPageNo:1,
  		totalPage:1
  	};
  },
  ready: function(){
	 this.$http.get("static/page.json").then((res) => {
	      this.currentPageNo = res.data.pageNo;
	      var totalRecord = res.data.totalRecord;
	      var pageSize = res.data.pageSize;
	      this.totalPage  = (totalRecord % pageSize) == 0 ? parseInt(totalRecord / pageSize) : parseInt(totalRecord / pageSize) +1 ;
	    }, (res) => {
	      console.error(res);
	    });
	},
  methods: {
  	changePage: function(pageNo){
  		//TODO:这里请求数据
  		this.currentPageNo = pageNo;
  		setTimeout(() => {
  			if (this.currentPageNo < this.totalPage )
  				this.currentPageNo = pageNo + 1;
  		},400);
  	}
  }
}
</script>

<style>
html {
  height: 100%;
}
#app {
  margin-top: 600px; 
}
</style>
