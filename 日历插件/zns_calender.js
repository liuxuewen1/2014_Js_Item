
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
	
	//����html����
	function createHTML(){
		oCalender=document.createElement("div");
		oCalender.className="zns_calender";
		var html="";
		html+="<ul class='ulPage'>";
			html+="<li>";
				html+="<a href='javascript:;' class='pre'>��ҳ</a>";
				html+="<span></span>";
				html+="<a href='javascript:;' class='next'>��ҳ</a>";
			html+="</li>";
		html+="</ul>";
		html+="<ul class='ulWeek'>";
			html+="<li>һ</li>";
			html+="<li>��</li>";
			html+="<li>��</li>";
			html+="<li>��</li>";
			html+="<li>��</li>";
			html+="<li>��</li>";
			html+="<li>��</li>";
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
		
		//����·ݵ�һ��֮ǰ�Ŀհ�
		for(var i=1;i<firstDay;i++){
			oUlDate.appendChild(createLi(''));
		}
		
		//���ø���ÿһ�������
		for(var i=0;i<dateNum;i++){
			var day=i+1;
			var oLi=createLi(day);
			oUlDate.appendChild(oLi);
			
			if(iMonth>tMonth){				//����֮��
				showAfterDay(oLi, day);
			}
			else if(iMonth<tMonth){			//����֮ǰ
				oLi.className="gray";
			}
			else if(iMonth==tMonth){		//����
				if(day<tday){
					oLi.className="gray";	//����֮ǰ
				}
				else{
					showAfterDay(oLi, day);	//���켰֮��
				}
			}
			
		}
		
		//���켰֮���������ʾ��ʽ
		function showAfterDay(oLi, day){
			//���õ���ǰ�죬����������ڼ�
			oDate.setDate(day);
			var weekDay=oDate.getDay();
			weekDay=weekDay==0?7:weekDay;
			//�ж��Ƿ�����ĩ
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
		
		//��ʾ����
		oShow.innerHTML=oDate.getFullYear()+"��"+(oDate.getMonth()+1)+"��";
		
	}
	setDateToUl(oDate);
	
	//����ҳ
	oPrev.onclick=function(){
		var oD=new Date();
		oD.setMonth(--iMonth);
		setDateToUl(oD);
	}
	
	//����ҳ
	oNext.onclick=function(){
		var oD=new Date();
		oD.setMonth(++iMonth);
		setDateToUl(oD);
	}
	
	//��������li
	function createLi(text){
		var oLi=document.createElement("li");
		oLi.innerHTML=text;
		return oLi;
	}
	
	//����ĳ��ʱ����·ݹ�������
	function getDateNum(oDate){
		oDate.setMonth(oDate.getMonth()+1);
		oDate.setDate(0);
		return oDate.getDate();
	}
	//����ĳ��ʱ����·ݵ�һ�������ڼ�
	function getDateDay(oDate){
		oDate.setDate(1);
		return oDate.getDay();
	}
	//��ȡ��λLeft��Top
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