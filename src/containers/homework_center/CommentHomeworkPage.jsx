/**
 * 老师->批改作业 批改订正
 */
import React from 'react';
import {connect} from 'react-redux';
import {List,fromJS,Map} from 'immutable';
import {Icon,Button,Checkbox,Row,Col,Spin,notification} from 'antd';

import {QuestionListComponent, StudentListComponent,QuestionModeContentComponent,StudentModeContentComponent} from '../../components/comment_homework/CommentHomeworkComponent';
import styles from './CommentHomeworkPage.scss';
import {httpFetchGet,httpFetchPost} from '../../utils/http-utils';
import config from '../../config';
import {isChoiceQuestion,QUESTION_TYPE_FILL_IN_BLANK} from '../../components/answer_homework/util';

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
                        .mergeWith((prev,next)=> next.length>0?next:prev, questionAnswer.commentTemp?questionAnswer.commentTemp.split("|"):[""])
                        .join("|");
                    return {
                        studentId:student.studentId,
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
                                                              studentResults={selectedQuestionStudentResults}
                                                              commentDataChanged={
                                                                  (studentId,i,imgBase64)=> this.commentDataChanged(studentId,selectedQuestion.questionId,i,imgBase64)
                                                              }
                                                              saveCommentData={
                                                                  (studentId,i) => this.saveCommentData(studentId,selectedQuestion.questionId,i)
                                                              }
                                                              clearCommentData={
                                                                  (studentId,i) => this.clearCommentData(studentId,selectedQuestion.questionId,i)
                                                              }
                                                              setScore={
                                                                  (studentId,score) => this.setScore(studentId,selectedQuestion.questionId,score)
                                                              }
                                                              setEvaluate={
                                                                  (studentId,value) => this.setEvaluate(studentId,selectedQuestion.questionId,value)
                                                              }

                                />
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
                        .mergeWith((prev,next)=> next.length>0?next:prev, questionAnswer.commentTemp?questionAnswer.commentTemp.split("|"):[""])
                        .join("|")
                    return {
                        ...question,
                        studentId:selectedStudent.studentId,
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
                                <StudentModeContentComponent questionList={selectedQuestionList}
                                                             commentDataChanged={
                                                                 (questionId,i,imgBase64)=> this.commentDataChanged(selectedStudent.studentId,questionId,i,imgBase64)
                                                             }
                                                             saveCommentData={
                                                                 (questionId,i) => this.saveCommentData(selectedStudent.studentId,questionId,i)
                                                             }
                                                             clearCommentData={
                                                                 (questionId,i) => this.clearCommentData(selectedStudent.studentId,questionId,i)
                                                             }
                                                             setScore={
                                                                 (questionId,score) => this.setScore(selectedStudent.studentId,questionId,score)
                                                             }
                                                             setEvaluate={
                                                                 (questionId,value) => this.setEvaluate(selectedStudent.studentId,questionId,value)
                                                             }
                                />
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
                                questionId:question.id,
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
    },
    commentDataChanged(studentId,questionId,index,imgBase64){
        const studentAnswers = this.state.studentAnswers.map(
            (studentAnswer) => {
                if( studentAnswer.get("studentId") == studentId ) {
                    const answers = studentAnswer.get("answers").map(
                        (answer) => {
                            if( answer.get("questionId") == questionId ) {
                                let commentTempArray = (answer.get("commentTemp") || "").split("|");
                                commentTempArray[index] = imgBase64;
                                return answer.merge({commentTemp: commentTempArray.join("|")})
                            } else {
                                return answer;
                            }
                        }
                    );
                    return studentAnswer.merge({answers:answers});
                } else {
                    return studentAnswer;
                }
            }
        );

        this.setState({
            studentAnswers:studentAnswers
        })
    },
    saveCommentData(studentId,questionId,commentIndex){
        const {studentIndex, questionIndex} = this.findStudentAndQuestionIndex(studentId,questionId);

        this.uploadCommentResult(studentIndex,
            questionIndex,
            {comment:this.state.studentAnswers.getIn([studentIndex, "answers", questionIndex,"commentTemp"],"")},
            (commentUrl)=>{
                const commentTemp = this.state.studentAnswers
                    .getIn([studentIndex, "answers", questionIndex,"commentTemp"],"")
                    .split("|")
                    .map((v,i)=>{i==commentIndex?"":v})
                    .join("|");
                const studentAnswers = this.state.studentAnswers
                    .setIn([studentIndex,"answers",questionIndex,"comment"],commentUrl)
                    .setIn([studentIndex,"answers",questionIndex,"commentTemp"],commentTemp);
                this.setState({
                    studentAnswers:studentAnswers
                });
            }
        );
    },
    clearCommentData(studentId,questionId,commentIndex){
        const {studentIndex, questionIndex} = this.findStudentAndQuestionIndex(studentId,questionId);

        const comment = this.state.studentAnswers
            .getIn([studentIndex, "answers", questionIndex,"commentTemp"],"")
            .split("|").map((v,i)=>{i==commentIndex?"":v}).join("|");
        this.uploadCommentResult(studentIndex,
            questionIndex,
            {comment:comment},
            (commentUrl)=>{
                const studentAnswers = this.state.studentAnswers
                    .setIn([studentIndex,"answers",questionIndex,"comment"],commentUrl)
                    .setIn([studentIndex,"answers",questionIndex,"commentTemp"],comment);
                this.setState({
                    studentAnswers:studentAnswers
                });
            }
        );
    },
    setScore(studentId,questionId,score){

    },
    setEvaluate(studentId,questionId,value){

    },
    uploadCommentResult(studentIndex,questionIndex,additonalParam,callback) {
        const { homeworkClassId, answerType, homeworkId } = this.props.location.state;

        let questionIds = [];
        const questionType = this.state.questionList.getIn([questionIndex,"type"]);
        if( questionType == QUESTION_TYPE_FILL_IN_BLANK ) {
            questionIds = this.state.questionList
                .filter((question) => question.get("type") == QUESTION_TYPE_FILL_IN_BLANK)
                .map((question)=>question.get("questionId"))
                .toJS();
        } else {
            questionIds.push(this.state.questionList.getIn([questionIndex,"questionId"]));
        }
        const studentId = this.state.studentAnswers.getIn([studentIndex,"studentId"]);
        const studentAnswer = this.state.studentAnswers.getIn([studentIndex,"answers",questionIndex]);

        let formData = new FormData();
        formData.append("homeworkClassId", homeworkClassId);
        formData.append("homeworkId", homeworkId);
        formData.append("answerType", answerType);
        questionIds.forEach(
            (id)=> { formData.append("questionIds",id) }
        );
        formData.append("studentId", studentId);
        formData.append("score", additonalParam.score?additonalParam.score:studentAnswer.get("score"));
        formData.append("right", additonalParam.right?additonalParam.right:studentAnswer.get("right"));
        //String[] correctFiles
        const commentArray = this.mergeComment(studentAnswer.get("comment"), additonalParam.comment)
            .split("|");
        commentArray.forEach(
            (comment) => {
                if( comment.startsWith("data:image/png;base64,")) {
                    formData.append("correctFiles", "base64:"+comment.replace(/^(data).+base64,/,""));
                } else {
                    formData.append("correctFiles", "url"+comment);
                }

            }
        );

        httpFetchPost(config.api.homework.commentHomework.uploadCommentResult,formData)
            .then(
                (result) => {
                    if( result.title == "TITLE_FAILURE" ) {
                        const message = "批改学生:"+this.state.studentAnswers.getIn([studentIndex,"studentName"])+
                            "的第"+this.state.questionList.getIn([questionIndex,"index"])+"题失败:" +
                                result.result;
                        notification.error({
                            message:"失败",
                            description:message,
                            duration:10,
                        });
                    } else {
                        const studentAnswers = this.state.studentAnswers
                            .setIn([studentIndex, "answers", questionIndex], studentAnswer.merge(Map(additonalParam)));
                        this.setState({
                            studentAnswers: studentAnswers
                        }, () => {
                            if (callback) {
                                callback(result.resultData);
                            }
                        });

                    }
                }
            )
            .catch(()=>{})
    },
    findStudentAndQuestionIndex(studentId, questionId) {
        let studentIndex = undefined;
        let questionIndex = undefined;
        this.state.studentAnswers.forEach(
            (studentAnswer, stuI) => {
                if( studentAnswer.get("studentId") == studentId) {
                    studentIndex = stuI;
                    studentAnswer.get("answers").forEach(
                        (answer, queI) => {
                            if( answer.get("questionId") == questionId ) {
                                questionIndex = queI;
                                return false;
                            }
                        }
                    );
                    return false;
                }
            }
        )
        return {studentIndex:studentIndex, questionIndex:questionIndex};
    },
    mergeComment(p,n) {
        if( p == null && n == null ) {
            return "";
        }else if( p == null ) {
            return n;
        } else if( n == null ) {
            return p;
        } else {
            return List((p || "").split("|"))
                .mergeWith((prev,next)=> next.length>0?next:prev, List((n||"").split("|")))
                .join("|");
        }
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