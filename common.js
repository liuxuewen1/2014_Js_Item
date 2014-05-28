
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

//绑定事件
function addEvent(obj,sEv,fn){
	if(obj.attachEvent){
		obj.attachEvent('on'+sEv,fn);
	}else{
		obj.addEventListener(sEv,fn,false);
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
