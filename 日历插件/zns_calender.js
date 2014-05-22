
(function(){
	var oLink=document.createElement("link");
	oLink.href="zns_calender.css";
	oLink.rel="stylesheet";
	document.head.appendChild(oLink);
})();

var zns_Calender=function(id){
	if(typeof id!="string" || id=="") return;
	var oTime=document.getElementById(id);
	
	var oCalender=null;
	
	//生成html代码
	function createHTML(){
		oCalender=document.createElement("div");
		oCalender.className="zns_calender";
		var html="";
		html+="<ul class='ulPage'>";
			html+="<li>";
				html+="<a href='javascript:;' class='pre'>上页</a>";
				html+="<span></span>";
				html+="<a href='javascript:;' class='next'>下页</a>";
			html+="</li>";
		html+="</ul>";
		html+="<ul class='ulWeek'>";
			html+="<li>一</li>";
			html+="<li>二</li>";
			html+="<li>三</li>";
			html+="<li>四</li>";
			html+="<li>五</li>";
			html+="<li>六</li>";
			html+="<li>日</li>";
		html+="</ul>";
		html+="<ul class='ulDate'></ul>";
		oCalender.innerHTML=html;
		
		document.body.appendChild(oCalender);
	}
	createHTML();
	
	var oUlPage=oCalender.children[0],
		oUlWeek=oCalender.children[1],
		oUlDate=oCalender.children[2],
		oPrev=oUlPage.children[0].children[0],
		oNext=oUlPage.children[0].children[2],
		oShow=oUlPage.children[0].children[1],
		oDate=new Date(),
		iMonth=oDate.getMonth();
	
	oTime.onfocus=function(){
		oCalender.style.display="block";
	}
	var isBlock=false;
	oCalender.onmouseover=function(){
		isBlock=true;
	}
	oCalender.onmouseout=function(){
		isBlock=false;
	}
	oTime.onblur=function(){
		if(!isBlock) oCalender.style.display="none";
	}
	
	var timePos=getPos(oTime);
	oCalender.style.left=timePos.left+"px";
	oCalender.style.top=timePos.top+oTime.offsetHeight+2+"px";
	
	function setDateToUl(oDate){
		
		oUlDate.innerHTML="";
		var firstDay=getDateDay(oDate),
			dateNum=getDateNum(oDate),
			tday=(new Date()).getDate(),
			tMonth=(new Date()).getMonth();
		firstDay=firstDay==0?7:firstDay;
		
		//填充月份第一天之前的空白
		for(var i=1;i<firstDay;i++){
			oUlDate.appendChild(createLi(''));
		}
		
		//设置该月每一天的日期
		for(var i=0;i<dateNum;i++){
			var day=i+1;
			var oLi=createLi(day);
			oUlDate.appendChild(oLi);
			
			if(iMonth>tMonth){				//当月之后
				showAfterDay(oLi, day);
			}
			else if(iMonth<tMonth){			//当月之前
				oLi.className="gray";
			}
			else if(iMonth==tMonth){		//当月
				if(day<tday){
					oLi.className="gray";	//当天之前
				}
				else{
					showAfterDay(oLi, day);	//当天及之后
				}
			}
			
		}
		
		//当天及之后的日期显示样式
		function showAfterDay(oLi, day){
			//设置到当前天，计算出是星期几
			oDate.setDate(day);
			var weekDay=oDate.getDay();
			weekDay=weekDay==0?7:weekDay;
			//判断是否是周末
			if(weekDay%6==0 || weekDay%7==0){
				oLi.className="red";
			}
			else{
				oLi.className="black";
			}
			
			var nDate=oDate.getFullYear()+"-"+(oDate.getMonth()+1)+"-"+oDate.getDate();
			oLi.onclick=(function(nDate){
				return function(){
					oTime.value=nDate;
					oCalender.style.display="none";
				}
			})(nDate);
			
		}
		
		//显示年月
		oShow.innerHTML=oDate.getFullYear()+"年"+(oDate.getMonth()+1)+"月";
		
	}
	setDateToUl(oDate);
	
	//绑定上页
	oPrev.onclick=function(){
		var oD=new Date();
		oD.setMonth(--iMonth);
		setDateToUl(oD);
	}
	
	//绑定下页
	oNext.onclick=function(){
		var oD=new Date();
		oD.setMonth(++iMonth);
		setDateToUl(oD);
	}
	
	//创建日期li
	function createLi(text){
		var oLi=document.createElement("li");
		oLi.innerHTML=text;
		return oLi;
	}
	
	//计算某个时间的月份共多少天
	function getDateNum(oDate){
		oDate.setMonth(oDate.getMonth()+1);
		oDate.setDate(0);
		return oDate.getDate();
	}
	//计算某个时间的月份第一天是星期几
	function getDateDay(oDate){
		oDate.setDate(1);
		return oDate.getDay();
	}
	//获取定位Left、Top
	function getPos(obj){
		var l=0,t=0;
		while(obj){
			l+=obj.offsetLeft;
			t+=obj.offsetTop;
			obj=obj.offsetParent;
		}
		return {left:l, top:t};
	}
	
}