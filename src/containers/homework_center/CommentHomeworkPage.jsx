/**
 * 老师->批改作业 批改订正
 */
import React from 'react';
import {connect} from 'react-redux';
import {List,fromJS} from 'immutable';
import {Icon,Button,Checkbox,Row,Col,Spin} from 'antd';

import {QuestionListComponent, StudentListComponent,QuestionModeContentComponent,StudentModeContentComponent} from '../../components/comment_homework/CommentHomeworkComponent';
import styles from './CommentHomeworkPage.scss';
import {httpFetchGet,httpFetchPost} from '../../utils/http-utils';
import config from '../../config';
import {isChoiceQuestion} from '../../components/answer_homework/util';

const MODE_QUESTION = 0;
const MODE_STUDENT = 1;

const CommentHomeworkPage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            getCompleted:false,
            homeworkName:"",
            gradeName:"",
            subjectName:"",
            publishTime:"",

            skipChoiceQuestion:true,
            skipCommentedQuestion:true,
            commentMode:MODE_QUESTION,  //question or student
            //skipChoiceQuestion:false,
            //skipCommentedQuestion:false,
            //commentMode:MODE_STUDENT,  //question or student

            questionList:List(),
            selectedQuestionIndex:0,

            studentAnswers:List(),
            selectedStudentIndex:0,

        }
    },
    componentWillMount() {
      this.getContent();
    },
    render() {
      const  {getCompleted} = this.state;
      return (
          <div>
              {getCompleted?this.renderContent():<div className={styles.loading}><Spin size="large" /></div>}
          </div>
      );
    },
    renderContent() {
        const { homeworkName, gradeName, subjectName, publishTime, commentMode,skipCommentedQuestion,skipChoiceQuestion}= this.state;
        const { answerType } = this.props.location.state;

        return (
            <div className={styles.container}>
                <div className={styles.mainHeader}>
                    <Icon type="solution" />
                    <span>{answerType==0?"批改作业":"批改订正"}</span>
                </div>
                <div className={styles.subHeader}>
                    作业名称:{homeworkName} | 年级:{gradeName} | 学科:{subjectName} | 布置时间:{publishTime}
                </div>
                <div className={styles.rightActionItems}>
                    <Checkbox className={styles.rightActionItem} onChange={(e)=>{this.setChoiceMode(e)}} checked={skipChoiceQuestion}>跳过选择题</Checkbox>
                    <Checkbox className={styles.rightActionItem} onChange={(e)=>{this.setCommentMode(e)}} checked={skipCommentedQuestion}>跳过已批改</Checkbox>
                    <Button className={styles.rightActionItem + " " + styles.backButton} icon="swap" onClick={()=>this.changeMode()}>{commentMode == MODE_QUESTION ? "题目模式" : "学生模式"}</Button>
                    <Button className={styles.rightActionItem + " " + styles.backButton} icon="rollback" onClick={()=>{this.backTo()}}>返回</Button>
                </div>
                {commentMode == MODE_QUESTION? this.renderContentQuestionMode(): this.renderContentStudentMode()}
            </div>
        );
    },
    renderContentQuestionMode() {
        const {selectedQuestionIndex} = this.state;

        let questionList = this.getVisibleQuestion("ALL");

        const selectedQuestion = questionList[selectedQuestionIndex];
        const selectedQuestionStudentResults = this.getVisibleStudent(selectedQuestion)
            .map(
                (student) => {
                    const questionAnswer = student.answers[selectedQuestion.index-1];
                    const answer = List(questionAnswer.answer.split("|"))
                        .mergeWith((prev,next)=> next.length>0?next:prev, questionAnswer.comment?questionAnswer.comment.split("|"):[""])
                        .toJS().join("|");
                    return {
                        studentNo:student.studentNo,
                        studentName:student.studentName,
                        answer:answer,
                        right:questionAnswer.right,
                        score:questionAnswer.score,
                        totalScore:selectedQuestion.totalScore,
                    }
                }
            );
        return (
            <div>
                {questionList.length > 0 ? (
                        <Row className={styles.contentContainer}>
                            <Col span={3} className={styles.leftContent}>
                                <QuestionListComponent questionList={questionList}
                                                       selectedQuestionIndex={selectedQuestionIndex}
                                                       onClick={(index) => {
                                                           this.questionOnClick(index)
                                                       }}/>
                            </Col>
                            <Col span={21} className={styles.rightContent}>
                                <QuestionModeContentComponent question={selectedQuestion}
                                                              studentResults={selectedQuestionStudentResults}/>
                                <div className={styles.centerAction}>
                                    <Button onClick={() => this.nextQuestion()} type="primary">下一题</Button>
                                </div>
                            </Col>
                        </Row>
                    ) : this.renderEmptyContent()}
            </div>
        );
    },
    renderContentStudentMode() {
        const {selectedStudentIndex} = this.state;

        let studentAnswers = this.getVisibleStudent("ALL");

        const selectedStudent = studentAnswers[selectedStudentIndex];
        const selectedQuestionList = this.getVisibleQuestion(selectedStudent)
            .map(
                (question) => {
                    const questionAnswer = selectedStudent.answers[question.index-1];
                    const answer = List(questionAnswer.answer.split("|"))
                        .mergeWith((prev,next)=> next.length>0?next:prev, questionAnswer.comment?questionAnswer.comment.split("|"):[""])
                        .toJS().join("|")
                    return {
                        ...question,
                        answer:answer,
                        right:questionAnswer.right,
                        score:questionAnswer.score,
                    }
                }
            );
        return (
            <div>
                {studentAnswers.length > 0 ? (
                        <Row className={styles.contentContainer}>
                            <Col span={3} className={styles.leftContent}>
                                <StudentListComponent studentList={studentAnswers}
                                                      selectedStudentIndex={selectedStudentIndex}
                                                      onClick={(index) => {
                                                          this.studentOnClick(index)
                                                      }}/>
                            </Col>
                            <Col span={21} className={styles.rightContent}>
                                <StudentModeContentComponent questionList={selectedQuestionList}/>
                                <div className={styles.centerAction}>
                                    <Button onClick={() => this.nextStudent()} type="primary">下一学生</Button>
                                </div>
                            </Col>
                        </Row>
                    ) : this.renderEmptyContent()}
            </div>
        );
    },
    renderEmptyContent() {
        return (
            <div className={styles.emptyContentContainer}>
                <h2>符合要求的题目/学生不存在</h2>
            </div>
        )
    },
    changeMode() {
      this.setState({
          commentMode : this.state.commentMode == MODE_QUESTION ? MODE_STUDENT : MODE_QUESTION,
      });
    },
    setChoiceMode(e) {
        const checked = e.target.checked;
        this.setState({
            skipChoiceQuestion:checked,
            skipCommentedQuestion:checked?this.state.skipCommentedQuestion:false,
            selectedQuestionIndex:0,
            selectedStudentIndex:0
        })
    },
    setCommentMode(e) {
        const checked = e.target.checked;
        this.setState({
            skipCommentedQuestion:checked,
            skipChoiceQuestion:checked?true:this.state.skipChoiceQuestion,
            selectedQuestionIndex:0,
            selectedStudentIndex:0,
        })
    },
    questionOnClick(index) {
      this.setState({
          selectedQuestionIndex:index
      });
    },
    studentOnClick(index) {
        this.setState({
            selectStudentIndex:index
        });
    },
    nextQuestion() {
        let selectedQuestionIndex = this.state.selectedQuestionIndex + 1;
        const questionList = this.getVisibleQuestion("ALL");

        if( selectedQuestionIndex == questionList.length ) {
            selectedQuestionIndex=0;
        }
        this.setState({
            selectedQuestionIndex:selectedQuestionIndex
        });
    },
    nextStudent() {
        let selectedStudentIndex = this.state.selectedStudentIndex + 1;
        const studentAnswers = this.getVisibleStudent("ALL");

        if( selectedStudentIndex == studentAnswers.length ) {
            selectedStudentIndex=0;
        }
        this.setState({
            selectedStudentIndex:selectedStudentIndex
        });
    },
    backTo() {
        this.context.router.goBack();
    },
    getContent() {
        const { homeworkClassId, answerType } = this.props.location.state;
        httpFetchGet(config.api.homework.commentHomework.getExampaperAndStudentAnswer(homeworkClassId,answerType),{})
            .then(
                result => {
                    const questionList = result.questionList.map(
                        (question) => {
                            const options = question.optionPojoList.map((option)=>option.content);
                            return {
                                index:question.questionNo,
                                type:question.kind,
                                content:question.examination,
                                drawZone:question.drawZone,
                                options:options,
                                totalScore:question.score,
                            };
                        }
                    );
                    const studentAnswers = result.studentAnswers;
                    this.setState({
                        getCompleted:true,
                        homeworkName:result.homeworkInfo.homeworkName,
                        gradeName:result.homeworkInfo.gradeName,
                        subjectName:result.homeworkInfo.subjectName,
                        publishTime:result.homeworkInfo.createTime,
                        questionList:fromJS(questionList),
                        studentAnswers:fromJS(studentAnswers),
                    });
                }
            ).catch(
                ()=>{
                    this.setState({
                        getCompleted:true,
                    });
                }
            );
    },
    getVisibleQuestion(student) {
        const {skipChoiceQuestion,skipCommentedQuestion,questionList,studentAnswers} = this.state;
        return questionList.toJS().filter(
            (question) => {
                if( skipChoiceQuestion && isChoiceQuestion(question.type) ) {
                    return false;
                }
                if( skipCommentedQuestion ) {
                    if( student == "ALL" ) {
                        let result = false;
                        studentAnswers.toJS().forEach(
                            (studentAnswer) => {
                                if( studentAnswer.answers[question.index-1].answer
                                    && studentAnswer.answers[question.index-1].right == -1 ) {
                                    result = true;
                                }
                            }
                        )
                        return result;
                    } else {
                        if( student
                            && student.answers[question.index-1].answer
                            && student.answers[question.index-1].right == -1 ) {
                            return true;
                        }
                        return false;
                    }
                }
                return true;
            }
        );
    },
    getVisibleStudent(selectedQuestion) {
        const {skipCommentedQuestion,questionList,studentAnswers} = this.state;
        return studentAnswers.toJS().filter(
            (studentAnswer) => {
                if( skipCommentedQuestion ) {
                    if( selectedQuestion == "ALL" ) {
                        let result = false;
                        questionList.toJS().forEach(
                            (question) => {
                                if( studentAnswer.answers[question.index-1].answer && studentAnswer.answers[question.index-1].right == -1) {
                                    result = true;
                                }
                            }
                        )
                        return result;
                    } else {
                       if( selectedQuestion &&
                           studentAnswer.answers[selectedQuestion.index-1].answer
                           && studentAnswer.answers[selectedQuestion.index-1].right == -1 ) {
                           return true;
                       }
                        return false;

                    }
                }
                return true;
            }
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentHomeworkPage)