(function(){
	var initCfg = {
		// 页大小
	    pageSize:8,
	    //当前页码
	    pno: 1,
	    //总数据条数
	    totalRecords: 0,
	    //是否显示总页数
	    isShowTotalPage: true,
	    //是否显示总记录数
	    isShowTotalRecords: true,
	    //是否显示页码跳转输入框
	    isGoPage: true,
	    // 是否有回调函数
	    hasCallback:false
	};
	function Pagination(config) {
		//赋值
        this.pno = isNaN(config.pno) ? 1 : parseInt(config.pno);
        this.totalRecords = isNaN(config.totalRecords) ? 0 : parseInt(config.totalRecords);
        if (config.pagerid) {this.pagerid = config.pagerid; }
        if (config.pageSize) {this.pageSize = config.pageSize;}else{this.pageSize = initCfg.pageSize;}
        if (config.isShowTotalPage != undefined) { this.isShowTotalPage = config.isShowTotalPage; }else{ this.isShowTotalPage = initCfg.isShowTotalPage;}
        if (config.isShowTotalRecords != undefined) { this.isShowTotalRecords = config.isShowTotalRecords; } else {this.isShowTotalRecords = initCfg.isShowTotalRecords;}
        if (config.isGoPage != undefined) { this.isGoPage = config.isGoPage; } else {this.isGoPage = initCfg.isGoPage;}
        if (config.getLink && typeof (config.getLink) == 'function') { this.getLink = config.getLink; }
        if (config.callback && typeof (config.callback) == 'function') {this.callback = config.callback;this.hasCallback=true;this.getLink = this.getLinkForm;}else{this.hasCallback = initCfg.hasCallback;}
        //验证
        if (this.pno > this.total()) this.pno = this.total();
        if (this.pno < 1) this.pno = 1;
        this.inited = true;
        $("#"+this.pagerid).addClass("ee_pager_ww_xx").on("keydown",function(event){if(event.keyCode == 13){pager.gopage();}});
	}
	Pagination.prototype = {
		/****链接算法****/
	    getLink: function (n) {
	    		return "?pageNo="+n
	    },
	    getLinkForm: function (n) {
	    		return "javascript:void(0);";	
	    },
	    callback: function (no) {
	    		return true;
	    },
	    next:function(){
	    		return (this.pno >= this.total() - 1) ? this.total() : (this.pno + 1);
	    },
	    pre:function(){
	   	 	return (this.pno <= 2) ? 1 : (this.pno - 1);
	    },
	    hasPrv:function(){
	   	 	return (this.pno > 1);
	    },
	    hasNext:function(){
	    	return (this.pno < this.total());
	    },
	    total: function(){
	    		var tmp = (this.totalRecords % this.pageSize == 0 ? this.totalRecords / this.pageSize :Math.ceil(this.totalRecords / this.pageSize));
	    		return (tmp <= 1) ? 1 : tmp;
	    },
	    handlerCallback: function(no){
		    	if (this.hasCallback) {
		    		$("#"+this.pagerid).empty();
		    		this.pno = no;
		    		this.callback(no);
		    		this.generPageHtml();
		    	} else {
		    		return true;
		    	}
	    },
	    //跳转框页面跳转
	    gopage: function () {
	        var str_page = $("#btn_go_input").val();
	        if (isNaN(str_page)) {
	            $("#btn_go_input").val(this.next());
	            return;
	        }
	        var n = parseInt(str_page);
	        if (n < 1 || n >= this.total()) {
	            $("#btn_go_input").val(this.total());
	            n = this.total();
	        }
	        //这里可以按需改window.open
	        if (this.hasCallback) {
	        		this.handlerCallback(n);
	        } else {
	        		window.location = this.getLink(n);	
	        }
    		},
    		//生成分页控件Html
   		generPageHtml: function () {
	        if (!this.inited) {
	            return;
	        }
	        var str_prv = '', str_next = '',str_first = '',str_last = '';
	        if (this.hasPrv()) {
	            str_prv = '<a class="oper" href="' + this.getLink(this.pre()) + '" title="上一页" data-index="'+this.pre()+'">上一页</a>';
	            str_first = '<a class="oper" href="' + this.getLink(1) + '" title="首页" data-index = "1">首页</a>';
	        } else {
	            str_prv = '<span class="disabled oper">上一页</span>';
	            str_first = '<span class="disabled oper">首页</span>';
	        }
	        if (this.hasNext()) {
	            str_next = '<a class="oper" href="' + this.getLink(this.next()) + '" title="下一页" data-index="'+this.next()+'">下一页</a>';
	            str_last = '<a class="oper" href="' + this.getLink(this.total()) + '" title="尾页" data-index="'+this.total()+'">尾页</a>';
	        } else {
	            str_next = '<span class="disabled oper">下一页</span>';
	            str_last = '<span class="disabled oper">尾页</span>';
	        }
	        var total_info = '';
	        if (this.isShowTotalPage || this.isShowTotalRecords) {
	            total_info = '<span>共';
	            if (this.isShowTotalPage) {
	                total_info += this.total() + '页';
	                if (this.isShowTotalRecords) {
	                    total_info += '&nbsp;/&nbsp;';
	                }
	            }
	            if (this.isShowTotalRecords) {
	                total_info += this.totalRecords + '条数据';
	            }
	            total_info += '</span>';
	        }
	        var gopage_info = '';
	        if (this.isGoPage) {
	            gopage_info = '&nbsp;转到<span id="go_page_wrap">' +
						'<input type="text" id="btn_go_input" onkeypress="if((event.charCode > 48 && event.charCode < 58) || event.charCode == 0){return true;}else{return false;}" value="' + this.next() + '" /></span>页'
						+'<input type="button" id="btn_go" value="跳转" />';
	        }
	        //分页处理
	        var str = '';
	        var dot = '<span>...</span>';
	        if (this.total() <= 8) {
	            for (var i = 1; i <= this.total(); i++) {
	                if (this.pno == i) {
	                    str += '<span class="curr">' + i + '</span>';
	                } else {
	                    str += '<a data-index="'+i+'" href="' + this.getLink(i) + '" title="第' + i + '页">' + i + '</a>';
	                }
	            }
	        } else {
	            if (this.pno <= 5) {
	                for (var i = 1; i <= 6; i++) {
	                    if (this.pno == i) {
	                        str += '<span class="curr">' + i + '</span>';
	                    } else {
	                        str += '<a data-index="'+i+'" href="' + this.getLink(i) + '" title="第' + i + '页">' + i + '</a>';
	                    }
	                }
	                str += dot;
	                str+= '<a data-index="'+(this.total() - 1)+'" href="' + this.getLink(this.total() - 1) + '" title="第' + (this.total() - 1) + '页">' + (this.total() - 1) + '</a>';
	                str+= '<a data-index="'+ this.total()+'"  href="' + this.getLink(this.total()) + '" title="第' + (this.total()) + '页">' + (this.total()) + '</a>';
	            } else {
	                str += '<a data-index="1" href="' + this.getLink(1) + '" title="第1页">1</a>';
	                str += '<a data-index="2" href="' + this.getLink(2) + '" title="第2页">2</a>';
	                str += dot;
	                var begin = this.pno - 2;
	                var end = this.pno + 2;
	                if (end > this.total()) {
	                    end = this.total();
	                    begin = end - 4;
	                    if (this.pno - begin < 2) {
	                        begin = begin - 1;
	                    }
	                } else if (end + 1 == this.total()) {
	                    end = this.total();
	                }
	                for (var i = begin; i <= end; i++) {
	                    if (this.pno == i) {
	                        str += '<span class="curr">' + i + '</span>';
	                    } else {
	                        str += '<a data-index="'+i+'" href="' + this.getLink(i) + '" title="第' + i + '页">' + i + '</a>';
	                    }
	                }
	                if (end != this.total()) {
	                    str += dot;
	                    str+= '<a data-index="'+(this.total() - 1)+'" href="' + this.getLink(this.total() - 1) + '" title="第' + (this.total() - 1) + '页">' + (this.total() - 1) + '</a>';
	                    str+= '<a data-index="'+this.total()+'"  href="' + this.getLink(this.total()) + '" title="第' + (this.total()) + '页">' + (this.total()) + '</a>';
	                }
	            }
	        }
	        str = str_first + str_prv + str + str_next + str_last + total_info + gopage_info;
	        $("#" + this.pagerid).html(str);
	        var self = this;
	        $("#btn_go").on("click",function(){
	        		self.gopage();
	        });
	        $("#"+this.pagerid+" a").on("click",function(){
	        		var index = $(this).attr("data-index");
	        		self.handlerCallback(parseInt(index));
	        });
	    }
	}
	window.Pagination = Pagination;	
})();


function getParameter(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
