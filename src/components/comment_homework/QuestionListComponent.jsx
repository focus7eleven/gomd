import React from 'react';
import {Icon} from 'antd';

import styles from './ListComponent.scss'
import {QUESTION_TYPE_NAME} from '../answer_homework/util';

export const QuestionListComponent = React.createClass({
    propTypes: {
        questionList:React.PropTypes.array.isRequired, // [{index:1,type:"01"},...]
        selectedQuestionIndex:React.PropTypes.number.isRequired,
        onClick:React.PropTypes.func.isRequired,
    },
    render() {
        const {questionList, selectedQuestionIndex} = this.props;
        return (
            <div>
                <div className={styles.header}>
                    <Icon type="file-text" />
                </div>
                <div className={styles.listItems}>
                    {questionList.map(
                        (question, index) => {
                            return (
                                <div key={index}
                                     className={selectedQuestionIndex == index ? styles.listItem2 : styles.listItem}
                                     onClick={() => {
                                         this.props.onClick(index)
                                     }}>
                                    题目{question.index}({QUESTION_TYPE_NAME[question.type]})
                                </div>
                            )
                        }
                    )}
                </div>
            </div>
        )
    }
});