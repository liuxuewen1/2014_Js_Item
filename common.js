
//查询obj是否是oParent的子级元素
function isChild(oParent,obj){
	while(obj){
		if(obj===oParent) return true;
		obj=obj.parentNode;
	}
	return false;
}

//addEvent绑定事件
function addEvent(obj,sEv,fn){
	if(obj.attachEvent){
		//兼容IE8及以下
		return obj.attachEvent('on'+sEv,fn);
	}else{
		//兼容IE9+、FF、Chrome
		return obj.addEventListener(sEv,fn,false);
	}
}

//domReady事件
function domReady(fn){
	if(document.addEventListener){
		//FF Chrome IE9+
		document.addEventListener('DOMContentLoaded',function(){
			fn && fn();												  
		},false);
		
	}else{
		//IE8及以下
		document.write("<script id='lxw_IE_Ready' defer><\/script>");
		var oScript=document.getElementById('lxw_IE_Ready');
		addEvent(oScript,'readystatechange',function(){
			if(oScript.readyState=='complete'){
				fn && fn();
			}										 
		});
		
	}
	
}

//鼠标滚轮事件
function mouseWheel(obj,fn){
	if(navigator.userAgent.toLowerCase().indexOf("firefox")!=-1){
	
		//FF中的滚轮事件是DOMMouseScroll，这是一个DOM事件，而DOM事件必须绑定才能使用
		//oEvent.detail：>0 向下滚动；<0 向上滚动	跟onmousewheel中的wheelDelta正好相反
		addEvent(obj,'DOMMouseScroll',function(ev){
			var oEvent=ev||event;
			var bDown=oEvent.detail>0?true:false;
			fn && fn(bDown);
		});
		
	}else{
		//onmousewheel兼容Chrome、IE	
		//oEvent.wheelDelta：>0 向上滚动；<0 向下滚动
		addEvent(obj,'mousewheel',function(ev){
			var oEvent=ev||event;
			var bDown=oEvent.wheelDelta>0?false:true;
			fn && fn(bDown);
		});
		
	}
	
}

//得到属性值（可能带px）
function getAttr(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];		
}
	
//获取定位left、top距离
function getPos(obj){
	var l=0,t=0;
	while(obj){
		l+=obj.offsetLeft;
		t+=obj.offsetTop;
		obj=obj.offsetParent;
	}
	return {left:l, top:t};
}

//2014-6-15 对cookie的操作
function addCookie(name,value,iDay){
	if(!iDay) return;
	
	var oDate=new Date();
	oDate.setDate(oDate.getDate()+iDay);
	document.cookie=name+'='+value+';path=/;expires='+oDate;
}
function getCookie(name){
	var cookies=document.cookie.split('; ');
	for(var i=0,len=cookies.length;i<len;i++){
		var arr=cookies[i].split('=');
		if(arr[0]==name) return arr[1];
	}
	return '';
}
functioin delCookie(name){
	addCookie(name,'',-1);
}

//2014-6-20 原生态Ajax写法
function ajax(obj){
	//建立Ajax对象
	if(window.XMLHttpRequest){
		var oAjax=new XMLHttpRequest();
	}else{
		var oAjax=new ActionXObject("Microsoft.XMLHTTP");
	}
	//打开连接、发送消息
	switch(obj.type.toLowerCase()){
		case "get":
			oAjax.open("GET",obj.url+'?'+jsonToURL(obj.data),true);
			oAjax.send();
			break;
		case "post":
			oAjax.open("GET",obj.url,true);
			oAjax.setRequestHeader("content-type","application/x-www-form-urlencoded");
			oAjax.send(jsonToURL(obj.data));
			break;
	}
	//通讯信息
	oAjax.onreadystatechange=function(){
		//0：准备 1：Ajax对象准备完毕 2：接收完成，数据-编码-加密 3：解析数据 4：完成
		if(oAjax.readyState!=4) return;
		//200~300：成功 304：未修改
		if(oAjax.status>=200 && oAjax.status<300 || oAjax.status==304){
			obj.succFn && obj.succFn(oAjax.responseText);
		}else{
			obj.failFn && obj.failFn(oAjax.status);
		}
		clearTimeout(timer);
	}
	
	//超时
	!obj.timeout && (obj.timeout==3000);
	var timer=setTimeout(function(){
		alert("网络超时");
		oAjax.onreadystatechange=null;
	},obj.timeout*1000);
}
function jsonToURL(json){
	var arr=[];
	json.t=Math.random();
	for(var key in json){
		arr.push(key+'='+json[key]);
	}
	return arr.join('&');
}











