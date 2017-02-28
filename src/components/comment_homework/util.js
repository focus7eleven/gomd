/**
 * Created by wuyq on 2017/2/22.
 */


export const getBorderColor = (right,score,answer) => {
    if( answer == undefined || answer == "" ) {
        return '#6FCEFF';//未提交
    }
    switch (right) {
        case 1: //正确
            return '#44DAA8';
        case 0:
            if( score == 0 ) {
                return '#F26259';//错误
            } else {
                return '#FFB615';//半对
            }
        case -1: //未批改
        default:
            return '#C688B9';
    }
}

export const getBackgroudColor = (right,score,answer) => {
    if( answer == undefined || answer == "" ) {
        return '#E6F7FF';//未提交
    }

    switch (right) {
        case 1: //正确
            return '#E7F9F2';
        case 0:
            if( score == 0 ) {
                return '#FFE0DE';//错误
            } else {
                return '#FFF7E0';//半对
            }
        case -1://未批改
        default:
            return '#FFECFB';
    }
}