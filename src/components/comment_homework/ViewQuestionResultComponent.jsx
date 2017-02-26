import React from 'react';

import {Input} from 'antd';

import {getBorderColor,getBackgroudColor} from './util';
import {getChoiceAnswerString,isChoiceQuestion,addHttpPrefix, addHttpPrefixToImageUrl} from '../answer_homework/util';
import {Picturewall} from '../answer_homework/Picturewall';
import styles from './ViewQuestionResultComponent.scss';

export const ViewQuestionResultComponent = React.createClass({
    propTypes : {
        type:React.PropTypes.string.isRequired,
        studentNumber:React.PropTypes.string,
        studentName:React.PropTypes.string.isRequired,
        answer:React.PropTypes.string,
        score:React.PropTypes.number,
        right:React.PropTypes.number,
    },
    render() {
        const {type, studentNumber, studentName, answer, right, score} = this.props;

        let imageList = [];
        if( !isChoiceQuestion(type) ) {
            imageList = answer.split("|").map((image, i) => {
                return {
                    name: i + '.png',
                    url: addHttpPrefixToImageUrl(image)
                };
            });
        }
        return (
            <div className={styles.container} style={{borderColor:getBorderColor(right,score,answer)}}>
                {studentName?(
                        <div className={styles.name} style={{backgroundColor:getBackgroudColor(right,score,answer)}}>
                            {studentName}{studentNumber?"("+studentNumber+")":null}
                        </div>
                    ):null}
                {isChoiceQuestion(type)?(
                    <div className={styles.answerView}>
                        <span>解答:</span>
                        <span className={styles.answer}>{answer?getChoiceAnswerString(answer):"未提交"}</span>
                    </div>
                    ):(
                        <div className={styles.answerViewImage}>
                            <span>解答:</span>
                            <Picturewall imageList={imageList}/>
                        </div>
                    )}
                <div className={styles.scoreView}>
                    <span>得分:</span>
                    <Input className={styles.score} disabled={true} value={score?score:0}/>
                </div>
            </div>
        )
    }
});