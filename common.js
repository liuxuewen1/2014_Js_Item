
//�õ�Ԫ��ĳ������ֵ����px��
function getAttr(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];		
}
	
//�õ�obj�Ķ�λ����
function getPos(obj){
	var l=0,t=0;
	while(obj){
		l+=obj.offsetLeft;
		t+=obj.offsetTop;
		obj=obj.offsetParent;
	}
	return {left:l, top:t};
}
