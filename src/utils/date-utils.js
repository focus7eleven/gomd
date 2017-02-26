/*
日期相关函数
 */

// 对Date的扩展，将 Date 转化为指定格式的String
//参数
//  value : Date()或者number类型的日期值
//  format: 需要转化的日期格式
//    月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//    年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//    例子：
// convertDateToString(new Date(), "yyyy-MM-dd hh:mm:ss.S")
// convertDateToString(new Date(), "yyyy-MM-dd hh:mm:ss.S")
export const convertDateToString = (value, format) => {
    let date;
    let result;
    if( typeof value == "number" ) {
        date = new Date(value);
    } else {
        date = value;
    }

    const o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };

    result = format;
    if (/(y+)/.test(result)) result = result.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for( let k in o) {
        if (new RegExp("(" + k + ")").test(result)) result = result.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return result;
}