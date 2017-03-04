import React from 'react';
import {Tag,Row,Col} from 'antd';

import styles from './ContentComponent.scss';
import {isChoiceQuestion,addHttpPrefix,optionIndexName} from '../answer_homework/util';
import {ViewQuestionResultComponent} from './ViewQuestionResultComponent';
import {CommentQuestionComponent} from './CommentQuestionComponent';

export const QuestionModeContentComponent = React.createClass({
    propTypes:{
        question:React.PropTypes.object.isRequired,
        studentResults:React.PropTypes.array.isRequired,

        commentDataChanged:React.PropTypes.func.isRequired,
        saveCommentData:React.PropTypes.func.isRequired,
        clearCommentData:React.PropTypes.func.isRequired,
        setScore:React.PropTypes.func.isRequired,
        setEvaluate:React.PropTypes.func.isRequired,
    },
    render() {
        const { question,studentResults } = this.props;
        return (
            <div>
                {this.renderQuestionContent(question)}
                <div className={styles.divider}>
                    <Tag color="#d9d9d9" className={styles.dividerTag}>学生的解答结果如下</Tag>
                </div>
                {isChoiceQuestion(question.type) ? this.renderChoiceQuestions(studentResults) : this.renderSubjectQuestions(studentResults)}
            </div>
        );
    },
    renderQuestionContent(question) {
        const { content, type, options, drawZone } = question;
        return (
            <div className={styles.question}>
                <h3 className={styles.questionHeader}>题目</h3>
                <div className={styles.questionContent}>
                    <div dangerouslySetInnerHTML={{__html: addHttpPrefix(content)}}></div>
                    { isChoiceQuestion(type) ? (
                            <div>
                                {options.map(
                                    (option,index) => {
                                        return <div key={index}>{optionIndexName[index]}.<span dangerouslySetInnerHTML={{__html: addHttpPrefix(option)}}></span></div>
                                    }
                                )}
                            </div>
                        ) : null }
                    {!isChoiceQuestion(type) && drawZone ? <div dangerouslySetInnerHTML={{__html: addHttpPrefix(drawZone)}}></div> : null }
                </div>
            </div>
        )
    },
    renderChoiceQuestions(studentResults) {
        const { type } = this.props.question;
        return (
            <Row gutter={8}>
                {studentResults.map(
                    (studentResult,index) => {
                        const {studentNo, studentName, answer, right, score} = studentResult;
                        return (
                            <Col key={index} span={6} className={styles.questionResultContainer}>
                                <ViewQuestionResultComponent type={type}
                                                             studentName={studentName}
                                                             studentNumber={studentNo}
                                                             answer={answer}
                                                             right={right}
                                                             score={score}
                                ></ViewQuestionResultComponent>
                            </Col>
                        )
                    }
                )}
            </Row>
        )
    },
    renderSubjectQuestions(studentResults) {
        const { type } = this.props.question;
        return (
            <div>
                {studentResults.map(
                    (studentResult,index) => {
                        const {studentNo, studentName, answer, right, score, studentId} = studentResult;
                        return (
                            <div key={index} className={styles.questionResultContainer}>
                                {right == -1 ? (
                                        <CommentQuestionComponent
                                            studentName={studentName}
                                            studentNumber={studentNo}
                                            answer={answer}
                                            totalScore={studentResult.totalScore}
                                            questionType={type}
                                            commentDataChanged={(i,imgBase64)=>this.props.commentDataChanged(studentId,i,imgBase64)}
                                            saveCommentData={(i)=>this.props.saveCommentData(studentId,i)}
                                            clearCommentData={(i)=>this.props.clearCommentData(studentId,i)}
                                            setScore={(score)=>this.props.setScore(studentId,score)}
                                            setEvaluate={(value)=>this.props.setEvaluate(studentId,value)}
                                        ></CommentQuestionComponent>
                                    ):(
                                        <ViewQuestionResultComponent type={type}
                                                             studentName={studentName}
                                                             studentNumber={studentNo}
                                                             answer={answer}
                                                             right={right}
                                                             score={score}
                                        ></ViewQuestionResultComponent>
                                    )}
                            </div>
                        )
                    }
                )}
            </div>
        )
    }
});