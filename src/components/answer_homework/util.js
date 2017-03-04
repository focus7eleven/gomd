/**
 * Created by wuyq on 2017/2/15.
 */
import {baseURL} from '../../config';

export const QUESTION_TYPE_SINGLE_CHOICE = "01";
export const QUESTION_TYPE_TF_CHOICE = "02";
export const QUESTION_TYPE_MULTI_CHOICE = "03";
export const QUESTION_TYPE_FILL_IN_BLANK = "04";
export const QUESTION_TYPE_SHORT_ANSWER = "05";
export const QUESTION_TYPE_ENGLIST_COMPOSITION = "06";
export const QUESTION_TYPE_CHINESE_COMPOSITION = "07";


export const QUESTION_TYPE_NAME = {
    "01": "单选题",
    "02": "判断题",
    "03": "多选题",
    "04": "填空题",
    "05": "简答题(计算题)",
    "06": "英语作文",
    "07": "语文作文",
}

export const addHttpPrefix = function (content) {
    if (content != null)
        return content.replace(new RegExp(/src="\/|src="(?!http:\/\/)/g), 'src="' + baseURL + '/');
}

export const addHttpPrefixAndImageWidth = function (content,width) {
    if (content != null)
        return content.replace(new RegExp(/src="\/|src="(?!http:\/\/)/g), 'src="' + baseURL + '/')
            .replace(new RegExp(/<img /g),'<img width='+width.toString()+' ');
}

export const addHttpPrefixToImageUrl = function (imageUrl) {
    return imageUrl.startsWith("http://") || imageUrl.startsWith("data:image/png;base64,") ? imageUrl : baseURL + "/" + imageUrl;
}

export const optionIndexName = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

export const getReviseResult = function(right)
{
    switch (right) {
        case 0 :
            return "错误";
            break;
        case 1:
            return "正确";
            break;
        case -1:
        default:
            return "未批改";
            break;
    }
}
export const getReviseTagColor = function(right)
{
    switch (right) {
        case 0 :
            return "pink-inverse";
            break;
        case 1:
            return "green-inverse";
            break;
        case -1:
        default:
            return "yellow-inverse";
            break;
    }
}
export const getChoiceAnswerString = function(answer) {
    let result = [];
    for( let index = 0; index < optionIndexName.length; index++ ) {
        const value = Math.pow(2,index);
        if( answer < value ) {
            break;
        }
        if( (answer & value) == value ) {
            result.push(optionIndexName[index]);
        }
    }
    return result.join(",");
}

export const isChoiceQuestion = function(type) {
    return type=="01"||type=="02"||type=="03";
}
