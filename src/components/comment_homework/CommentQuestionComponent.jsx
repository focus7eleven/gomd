import React from 'react';
import {Tag,Select,Button} from 'antd';

import {addHttpPrefixToImageUrl} from '../answer_homework/util';
import styles from './CommentQuestionComponent.scss';
import {CommentCanvas} from './CommentCanvas';

const Option = Select.Option;
export const CommentQuestionComponent = React.createClass({
    propTypes : {
        studentNumber:React.PropTypes.string,
        studentName:React.PropTypes.string,
        answer:React.PropTypes.string.isRequired,
        totalScore:React.PropTypes.number.isRequired,

        questionType:React.PropTypes.string.isRequired,
        //setScore:React.PropTypes.func.isRequired,
        //setEvaluation:React.PropTypes.func.isRequired,
        //saveComment:React.PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            url:"",
            index:0
        }
    },
    render() {
        const {studentNumber, studentName, answer, totalScore, questionType} = this.props;
        let scoreList = [];
        for( let i = 0; i <= totalScore; i++ ) {
            scoreList.push(i.toString());
        }
        return (
            <div className={styles.container}>
                {studentName?(
                        <div className={styles.name}>
                            <Tag color="#d9d9d9">{studentName}{studentNumber?"("+studentNumber+")":null}</Tag>
                        </div>
                    ):null}
                <div className={styles.commentView}>
                    <div>解答:</div>
                    <div className={styles.commentItems}>
                        {answer.split("|").map(
                            (v, i) => {
                                return <CommentCanvas className={styles.commentItem} key={i}
                                                      questionType={questionType}
                                                      imageSrc={addHttpPrefixToImageUrl(v)}/>
                            }
                        )}
                    </div>
                </div>
                <div className={styles.scoreView}>
                    <span>得分</span>
                    <Select className={styles.scoreSelect}>
                        {scoreList.map((s,i)=><Option key={i} value={s}>{s}</Option>)}
                    </Select>
                    <span className={styles.evaluteSpan}>评价</span>
                    <Button className={styles.correctButton}>全对</Button>
                    <Button className={styles.halfCorrectButton}>半对</Button>
                    <Button className={styles.wrongButton}>全错</Button>
                </div>
            </div>
        )
    }
});