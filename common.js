
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
		obj.attachEvent('on'+sEv,fn);
	}else{
		//兼容IE9+、FF、Chrome
		obj.addEventListener(sEv,fn,false);
	}
}

//解绑事件
function removeEvent(obj,sEv,fn){
	if(obj.detachEvent){
		obj.detachEvent('on'+sEv,fn);
	}else{
		obj.removeEventListener(sEv,fn,true);
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
	//参数默认值设置
	obj=obj || {};
	if(!obj.url){
		alert('URL必填，请求失败');
		return;
	}
	obj.type=obj.type || 'GET';
	obj.data=obj.data || {};
	obj.timeout=obj.timeout || 3;

	//1、建立oAjax对象
	//XMLHttpRequest兼容IE7、IE7+、FF、Chrome等各种浏览器
	if(window.XMLHttpRequest){
		var oAjax=new XMLHttpRequest();
	}else{
		//兼容IE5、IE6
		var oAjax=new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	//2、打开连接、发送请求
	switch(obj.type.toLowerCase()){
		case 'get':
			oAjax.open('GET',obj.url+'?'+jsonToURL(obj.data),true);
			oAjax.send();
			break;
		case 'post':
			oAjax.open('POST',obj.url,true);
			//post时需要设置请求头
			oAjax.setRequestHeader('content-type','application/x-www-form-urlencoded');
			oAjax.send(jsonToURL(obj.data));
			break;
	}
	
	//如果有正在加载函数 执行
	obj.loadingFn && obj.loadingFn();
	
	//3、监听事件：是否成功返回回来数据
	oAjax.onreadystatechange=function(){
		//readyState：0-准备状态；1-ajax准备完毕；2-接收完毕；3-正在解析；4-数据接受完成
		if(oAjax.readyState!=4) return;
		
		//请求完成，如果有完成函数 执行
		obj.completeFn && obj.completeFn();
		
		//status：2开头表示成功；304表示文件未修改-成功
		if(oAjax.status>=200 && oAjax.status<300 || oAjax.status==304){
			//成功，清除超时定时器
			clearTimeout(timer);
			
			//responseText：请求到的数据（常用）
			//responseXML：请求到的xml数据（很少用），然后在succFn中跟使用DOM一样解析XML使用，稍麻烦
			obj.succFn && obj.succFn(oAjax.responseText);
		}else{
			//失败，清除超时定时器
			clearTimeout(timer);
			
			obj.failFn && obj.failFn(oAjax.status);
		}
		
	}
	
	//设置超时时间
	var timer=setTimeout(function(){
		oAjax.onreadystatechange=null;
		alert('请求超时');
	},obj.timeout*1000);
}

function jsonToURL(json){
	json=json || {};
	json.t=Math.random();
	var arr=[];
	for(var key in json){
		arr.push(key+'='+json[key]);
	}
	return arr.join('&');
}

//2014-06-24 跨域请求jsonp
function jsonp(url){
	var oS=document.createElement('script');
	oS.src=url;
	document.getElementsByTagName('head')[0].appendChild(oS);
}










