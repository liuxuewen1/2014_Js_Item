
jQuery.fn = jQuery.prototype = {

	jquery: 版本号,

	constructor: 重新指回jQuery对象的constructor属性,

	init(): 初始化和参数管理,

	selector: 存储选择字符串,

	length: this对象的长度 即元素个数,

	toArray: 转换成数组,

	pushStack: 栈操作方法,

	slice: 选取筛选的几个元素（集合截取，返回集合）,

	each: 遍历集合,

	ready: DOM加载完的接口,

	eq: 选取某一个元素,

	first: 选取第一个元素,

	last: 选取最后一个元素,

	map: 返回新集合,

	end: 返回集合前的元素集合,

	//内部使用的方法
	push: ,
	sort: ,
	splice: 

}