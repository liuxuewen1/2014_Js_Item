
jQuery(function(){ })	

	↓	判断参数为function

jQuery(document).ready(function(){ })	//实例方法

	↓	调用jQuery的ready实例方法
	↓	ready实际调用的是下面的方法
	↓	jQuery.ready.promise()中绑定ready事件

jQuery.ready.promise().done(fn)

	↓	jQuery.ready.promise中绑定 DOMContentLoaded、onreadystatechange、onload
	↓	如果DOM加载完毕，执行completed方法（JQ库中的私有方法）

completed

	↓	先解除绑定的DOMContentLoaded、onreadystatechange、onload事件
	↓	再执行jQuery的ready工具方法（静态方法）

jQuery.ready()

	↓	会判断有没有holdReady需要ready方法延迟执行

readyList.resolveWith 通知readyList（也就是jQuery.Deferred()延时对象）可以执行传进来的fn函数
