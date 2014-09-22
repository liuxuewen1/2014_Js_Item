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

