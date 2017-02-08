/**
 * Created by wuyq on 2017/1/19.
 */
/* 将对象形式的参数转化为url形式的  */
export function getUrlParams(objectParam) {
    let paramArray = [];
    for( let key in objectParam ) {
        if( objectParam[key] != null && objectParam[key] != "" ) {
            paramArray.push(key+"="+encodeURIComponent(objectParam[key]));
        }
    }
    return paramArray.join("&");
}
