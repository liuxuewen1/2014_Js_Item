
//  version:  v - 1.10.2

//匿名函数子自行
//为什么增加undefined参数？在ie8以下，undefined可以被改变，保险起见 初始化一下

(function(window, undefined){

	(21 , 117) 		定义变量和函数 jQuery 等 

	(119 , 309)		prototype：给jQuery对象增加一些方法和属性 （jQuery是一个面向对象的库）

	(314 , 376)		extend：JQ的继承方法

	(378 , 915)		jQuery.extend({})扩展工具方法和属性，JQ和原生对象都可用 如：$.trim()：静态方法

	(1012 , 2980)	Sizzle：实现复杂选择器功能 如：$("ul li:eq(0) input[type=button]")

	(3015 , 3177)	Callbacks：回调对象：对函数的统一管理
	function fn1(){ alert(1); }
	function fn2(){ alert(2); }
	var cb=$.Callbacks();
	cb.add(fn1);
	cb.add(fn2);
	cb.fire();		//分别调用fn1、fn2

	(3178 , 3318)	Deferred：延迟对象：对异步的统一管理	
	var dfd=$.Deferred();
	//先弹出1，然后触发done方法执行，弹出2
	setTimeout(function(){
		alert(1);
		dfd.resolve();
	});

	dfd.done(function(){ alert(2); })

	(3319 , 3563)	support：功能检测，通过判断功能（不是判断浏览器）来确定使用哪种方法

	(3565 , 3900)	data() 数据缓存
	$("#div1").data("name", "hello");	//添加数据
	$("#div1").data("name")				//获取数据

	(3901 , 4046)	queue 队列管理，animate用到它了

	(4056 , 4705)	attr() addClass() val()	等 对元素属性的操作

	(4706 , 5700)	on() trigger()等  事件操作相关方法

	(5701 , 6793)	DOM 操作：添加、删除、获取、包装、DOM筛选

	(6794 , 7454)	css()：针对样式操作

	(7455 , 8813)	提交的数据和ajax、跨域操作 ajax() load() getJson()

	(8814 , 9545)	运动的方法 animate等

	(9546 , 9762)	offset() 位置与尺寸的方法

	(9767 , 9787)	JQ支持模块化的功能	

	//jQuery 匿名函数中的变量 挂到 window上，给外面使用$、jQuery调用提供接口
	(9775)			window.$ = window.jQuery = jQuery;	


})(window)