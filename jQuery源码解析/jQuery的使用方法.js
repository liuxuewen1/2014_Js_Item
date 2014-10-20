
$() 括号里面的用法

立即执行：
$(function(){})
$(document).ready({})

选择元素：
$("li")
$("li",document)
$("li",$(document))
$( $("li") )
$("#div1")

创建元素
$("<li>2222")
$("<li>1111</li>")
$("<li>33</li><li>44</li>")
$("<li>555</li>",{ title:'test', html:"html", css:{ background: '#ccc' } })

jQuery对象的方法：
$().toArray()
$().get()	可传参数（数字）
$().pushStack($())	栈操作，内部使用较多，如 slice() map() eq() 等都是使用这个实现

工具类方法：
$.merge(arr/obj, arr/obj)

$.parseHTML(str, context, true/false)

$.isFunction( obj )

$.makeArray(aDivs)	//将伪数组转换成真的数组对象
$.makeArray(obj1, obj2)	//对JSON格式的伪数组 可以进行合并