import React from 'react';
import {connect} from 'react-redux';
import {Icon,Button} from 'antd';
import {fromJS,List} from 'immutable';

import config from '../../config';
import styles from './AnswerHomeworkPage.scss';
import {QuestionAnswerResult} from '../../components/answer_homework/AnswerHomeworkComponent';
import {httpFetchGet} from '../../utils/http-utils';
import {isChoiceQuestion,optionIndexName} from '../../components/answer_homework/util';

/**
 * 学生->我的试卷->查看结果
 */
const HomeworkAnswerResultPage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            homeworkName:"",
            gradeName:"",
            subjectName:"",
            publishTime:"",
            questionList:List(),
        }
    },
    componentWillMount() {
        this.getHomeworkInfoWithKey();
    },
    render() {
        const { homeworkName, gradeName, subjectName, publishTime, questionList } = this.state;
        return (
            <div>
                <div className={styles.mainHeader}>
                    <Icon type="desktop" />
                    <span>查看答题结果</span>
                </div>
                <div className={styles.subHeader}>
                    作业名称:{homeworkName} | 年级:{gradeName} | 学科:{subjectName} | 布置时间:{publishTime}
                </div>
                <div className={styles.rightActionItems}>
                    <Button className={styles.rightActionItem + " " + styles.backButton} icon="rollback" onClick={()=>{this.backTo()}}>返回</Button>
                </div>
                <div className={styles.questionList}>
                    {questionList.map(
                        (question, index) => {
                            return this.renderQuestionAnswerResult(question,index);
                        }
                    )}
                </div>
            </div>
        );
    },
    getHomeworkInfoWithKey() {
        const { homeworkClassId } = this.props.location.state;
        httpFetchGet(config.api.homework.answerHomework.getPaperAndAnswerWithKey(homeworkClassId))
            .then(
                result => {
                    let questionList = result.questions.filter(
                        (question) => {
                            return question.answerType == 0;
                        }
                    ).map((question) => {
                        const options = isChoiceQuestion(question.type) ?
                            question.options.map((option) => {
                                return option.optionContent;
                            })
                            : null;
                        let correctAnswer = "";
                        //得到标准答案
                        if( isChoiceQuestion(question.type) ) {
                            //客观题：选择题
                            let correctAnswerTemp = [];
                            question.options.forEach(
                                (option,index) => {
                                    if( option.isAnswer == "1" ) {
                                        correctAnswerTemp.push(optionIndexName[index]);
                                    }
                                }
                            );
                            correctAnswer = correctAnswerTemp.join(",");
                        } else {
                            //主观题
                            let correctAnswerTemp = "";
                            question.options.forEach(
                                (option) => {
                                    correctAnswerTemp += option.optionContent;
                                }
                            );
                            correctAnswer = correctAnswerTemp;
                        }
                        return {
                            questionId: question.questionId,
                            type: question.type, //题目类型
                            content: question.questionContent, //题目内容
                            answer: [{answer:question.answer,right:question.right}], //答题情况
                            drawZone: question.drawZone,
                            options: options,
                            correctAnswer:correctAnswer
                        };
                    });
                    result.questions.filter(
                        (question) => {
                            return question.answerType == 1;
                        }
                    ).forEach(
                        (question) => {
                            questionList[question.index-1].answer.push({answer:question.answer,right:question.right})
                        }
                    );

                    this.setState({
                        homeworkName: result.name,
                        gradeName: result.gradeName,
                        subjectName: result.subjectName,
                        publishTime: result.createTime,
                        questionList: fromJS(questionList)
                    });
                }
            ).catch(()=>{})
    },
    renderQuestionAnswerResult(question, index) {
        const {content,options,answer,type, correctAnswer,drawZone} = question.toJS();
        return <QuestionAnswerResult key={index}
                                     index={index}
                                     type={type}
                                     content={content}
                                     drawZone={drawZone}
                                     options={options}
                                     correctAnswer={correctAnswer}
                                     answer={answer}
        ></QuestionAnswerResult>;
    },
    backTo() {
        this.context.router.goBack();
    }
});

function mapStateToProps(state) {
    return {
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeworkAnswerResultPage)