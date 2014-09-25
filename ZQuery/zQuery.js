'use strict';

function $(arg){
	return new ZQuery(arg);
}

function ZQuery(arg){
	
	this.elements = [];		//存元素

	switch(typeof arg){
		case 'function':domReady(arg);	//ready
			break;
		case 'string':
			this.elements = getEle(arg);
			break;
		case 'object':
			break;
	}
}

// ZQuery.prototype.click=function(fn){
// 	for (var i = 0; i < this.elements.length; i++) {
// 		addEvent('click', this.elements[i], fn);
// 	};
// }
var arrEvent=['click', 'mouseover', 'mouseout', 'mouseup', 'mousedown', 'dblclick', 'load', 'scroll', 'change', 'keyup', 'keydown', 'focus', 'resize', 'blur', 'readystatechange', 'contextmenu'];
for (var i = 0; i < arrEvent.length; i++) {
	addEv(arrEvent[i]);
};
function addEv(name){
	ZQuery.prototype[name]=function(fn){
		for (var i = 0; i < this.elements.length; i++) {
			addEvent(name, this.elements[i], fn);
		};
	}
}

ZQuery.prototype.mouseenter=function(fn){
	for (var i = 0; i < this.elements.length; i++) {
		addEvent('mouseover', this.elements[i], function(ev){
			var oFrom=ev.fromElement||ev.relatedTarget;
			if(!this.contains(oFrom)){
				fn && fn.call(this, ev);
			}
		})
	};
	
}


ZQuery.prototype.mouseleave=function(fn){
	for (var i = 0; i < this.elements.length; i++) {
		addEvent('mouseout', this.elements[i], function(ev){
			var to=ev.toElement||ev.relatedTarget;
			if(!this.contains(to)){
				fn && fn.call(this, ev);
			}
		})
	};
}

ZQuery.prototype.hover=function(fnOver, fnOut){
	this.mouseenter(fnOver);
	this.mouseleave(fnOut);
}

//css	.css("width")获取；.css("width","100")设置；.css({'width':'100','height':200})批量设置
ZQuery.prototype.css=function(arg){
	if(arguments.length==1){
		if(typeof arg==='string'){
			//.css("width") 返回第一个元素的样式
			return getStyle(this.elements[0],arg);
		}else if(typeof arg==='object'){
			for(var i=0;i<this.elements.length;i++){
				for(var attr in arg){
					//.css({'width':'100','height':200}) 对所有元素批量设置
					this.elements[i].style[attr]=arg[attr];
				}
			}
		}
	}else if(arguments.length==2){
		for(var i=0;i<this.elements.length;i++){
			var attr=arguments[0];
			var value=arguments[1];
			if(typeof value==='string'){
				//.css("width","100") 对所有元素批量设置
				this.elements[i].style[attr]=value;
			}else if(typeof value==='function'){
				//自定义函数，参数为(index,currentValue); 返回设置的值newValue
				var newValue=value(i, getStyle(this.elements[i], attr));
				this.elements[i].style[attr]=newValue;
			}
		}
	}
}

//attr .attr("value")获取；.attr("value","100")设置；.attr('value':'100','src':200})批量设置
ZQuery.prototype.attr=function(arg){
	if(arguments.length==1){
		if(typeof arg==='string'){
			return this.elements[0].getAttribute(arg);
		}else if(typeof arg==='object'){
			for(var i=0;i<this.elements.length;i++){
				for(var attr in arg){
					this.elements[i].setAttribute(attr,arg[attr]);
				}
				
			}
		}
	}else if(arguments.length==2){
		for(var i=0;i<this.elements.length;i++){
			var attr=arguments[0];
			var value=arguments[1];
			if(typeof value==='string'){
				this.elements[i].setAttribute(attr,value);
			}else if(typeof value==='function'){
				var newValue=value(i, this.elements[i].getAttribute(attr));
				this.elements[i].setAttribute(attr,newValue);
			}
			
		}
	}
}

//html html()获取；html('<div></div>')设置
ZQuery.prototype.html=function(arg){
	if(arguments.length==1){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].innerHTML=arg;
		}
	}else{
		return this.elements[0].innerHTML;
	}
}

//toggle 切换
/*ZQuery.prototype.toggle=function(){
	if(arguments.length==0) return;
	for(var i=0;i<this.elements.length;i++){
		//this.elements[i].n=0;		//属性容易重名、性能差，所以不能用这种形式计数
		addEvent('click',this.elements[i],function(){
			arguments[(this.n++)%arguments.length]();
		});
	}
}*/
ZQuery.prototype.toggle=function(){
	if(arguments.length==0) return;
	var args=arguments;
	var _this=this;
	for(var i=0;i<this.elements.length;i++){
		(function(count){
			//alert(this)	//this由于被function包了一层 所以被改变 ，由于是在严格模式下 所以为undefined
			addEvent('click',_this.elements[i],function(ev){
				//如果这么写 toggle中function内的this为Arguments
				//为什么是Agreements？比如：var arr=[1,'abc',function(){ alert(this===arr); }];
				//arr中function 返回true！原因：arr['abc'] 相当于 arr.'abc' 函数也一样，相当于这个函数是arr的一个方法 故this==arr
				//同理 下面这个是arguments的一个方法 故this为Arguments
				//args[(count++)%args.length](ev);	
				
				//由于addEvent中call了一下，所以这里面的this是当前元素！
				args[(count++)%args.length].call(this,ev);
			});
		})(0);		
	}
}

function getStyle(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];
}

function addEvent(sEv,obj,fn){
	if(obj.addEventListener){
		obj.addEventListener(sEv,function(ev){
			var oEvent=ev || window.event;
			//this值发生改变，通过call将this指向obj
			fn && fn.call(obj, oEvent);	
		},false)
	}else{
		obj.attachEvent('on'+sEv,function(ev){
			var oEvent=ev || window.event;
			//this值发生改变，通过call将this指向obj
			fn && fn.call(obj, oEvent);
		})
	}
}

function removeEvent(sEv,obj,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(sEv,function(){
			fn && fn.call(obj);
		},false);
	}else{
		obj.detachEvent('on'+sEv,function(){
			fn && fn.call(obj);
		})
	}
}

function domReady(fn){
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded',function(){
			fn && fn();
		},false);
	}else{
		// document.write('<script id="lxw_IE_Ready" defer><\/script>');
		// var oReady=document.getElementById('lxw_IE_Ready');
		// oReady.onreadystatechange=function(){
		// 	if(oReady.readyState=='complete' || oReady.readyState=='loaded'){
		// 		fn && fn();
		// 	}
		// }

		document.attachEvent('onreadystatechange',function(){
			if(document.readyState=='complete' || document.readyState=='loaded'){
				fn && fn();
			}
		})

	}
}

function getEle(str){
	var arrStr=str.replace(/^\s+|\s+$/g,'').split(/\s+/);
	var aParent=[document];
	for (var i = 0; i < arrStr.length; i++) {
		aParent=_getByStr(aParent, arrStr[i]);
	};
	return (aParent.length==1 && aParent[0]===document)?[] : aParent;
}

function _getByStr(aParent, str){
	var result=[];
	for (var i = 0; i < aParent.length; i++) {
		switch(str.charAt(0)){
			case '#':result.push(document.getElementById(str.substring(1)));
				break;
			case '.':var arr=getByClass(aParent[i],str.substring(1));
				for (var j = 0; j < arr.length; j++) {
					result.push(arr[j]);
				};
				break;
			default:
				//li
				if(/^[a-z0-9]+$/i.test(str)){
					var arr=aParent[i].getElementsByTagName(str);
					for (var j = 0; j < arr.length; j++) {
						result.push(arr[j]);
					};
				}//li.active
				else if(/^[a-z0-9]+\.\w+$/i.test(str)){
					var aStr=str.split('.');
					var arr=aParent[i].getElementsByTagName(aStr[0]);
					var reg=new RegExp('\\b'+aStr[1]+'\\b');
					for (var j = 0; j < arr.length; j++) {
						if(reg.test(arr[j].className)){
							result.push(arr[j]);
						}
					};
				}//li#id1
				else if(/^[a-z0-9]+\#\w+$/i.test(str)){
					var aStr=str.split('#');
					var arr=aParent[i].getElementsByTagName(aStr[0]);
					for (var j = 0; j < arr.length; j++) {
						if(arr[j].id===aStr[1]){
							result.push(arr[j]);
						}
					};
				}//input[type=hidden]
				else if(/^[a-z0-9]+\[\w+\=.+\]$/i.test(str)){
					var aStr=str.split(/\[|\=|\]/);
					var arr=aParent[i].getElementsByTagName(aStr[0]);
					for (var j = 0; j < arr.length; j++) {
						if(arr[j].getAttribute(aStr[1])===aStr[2]){
							result.push(arr[j]);
						}
					};
				}//li:first li:odd li:eq(3)
				else if(/^[a-z0-9]+:\w+(?:\(\d+\))?$/i.test(str)){
					var aStr=str.split(/:|\(|\)/);
					var arr=aParent[i].getElementsByTagName(aStr[0]);
					switch(aStr[1]){
						case 'first':
							result.push(arr[0]);
							break;	
						case 'odd':
							for (var k = 0; k < arr.length; k+=2) {
								result.push(arr[k]);
							};
							break;
						case 'eq':
							if(arr.length>0){
								var n= Number(aStr[2]);
								n= n<=arr.length-1? n: arr.length-1;
								result.push(arr[n]);
							}		
							break;					
					}
				}
				break;
		}
	};
	return result;
}

function getByClass(obj,attr){
	if(obj.getElementsByClassName){
		return obj.getElementsByClassName(attr);
	}else{
		var arr=[];
		var arrEle=obj.getElementsByTagName('*');
		var reg=new RegExp('\\b'+attr+'\\b');
		for (var i = 0; i < arrEle.length; i++) {
			if(reg.test(arrEle[i].className)){
				arr.push(arrEle[i]);
			}
		};
		return arr;
	}
}
