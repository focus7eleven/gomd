import React from 'react';
import {connect} from 'react-redux';
import {Icon,Button,notification} from 'antd';
import {fromJS,List} from 'immutable';

import config from '../../config';
import {ChoiceQuestion,SubjectiveQuestion} from '../../components/answer_homework/AnswerHomeworkComponent';
import styles from './AnswerHomeworkPage.scss';
import {QUESTION_TYPE_FILL_IN_BLANK} from '../../components/answer_homework/util';
import {httpFetchGet,httpFetchPost} from '../../utils/http-utils';

/**
 * 学生->我的试卷->在线答题
 */
const AnswerHomeworkPage = React.createClass({
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
    this.getHomeworkInfo();
  },
  render() {
    const { homeworkName, gradeName, subjectName, publishTime, questionList } = this.state;
    const { answerType } = this.props.location.state;
    return (
      <div>
        <div className={styles.mainHeader}>
          <Icon type="desktop" />
          <span>{answerType==0?"在线答题":"在线订正"}</span>
        </div>
        <div className={styles.subHeader}>
          作业名称:{homeworkName} | 年级:{gradeName} | 学科:{subjectName} | 布置时间:{publishTime}
        </div>
        <div className={styles.rightActionItems}>
          <Button className={styles.rightActionItem + " " + styles.commitButton} icon="upload" onClick={this.commitHomework}>提交</Button>
          <Button className={styles.rightActionItem + " " + styles.backButton} icon="rollback" onClick={()=>{this.backTo()}}>返回</Button>
        </div>
        <div className={styles.questionList}>
          {questionList.map(
            (question, index) => {
              switch (question.get("type")) {
                case "01":  {/*单选题*/}
                case "02":  {/*判断题*/}
                case "03":  {/*多选题*/}
                  return this.renderChoiceQuestion(question,index);
                  break;
                case "04":  {/*填空题*/}
                case "05":  {/*简答题*/}
                case "06":  {/*英语作文*/}
                case "07":  {/*语文作文*/}
                  return this.renderSubjectiveQuestion(question,index);
                  break;
                default:
                  return <div></div>;
                  break;
              }

            }
          )}
        </div>
      </div>
    );
  },
  getHomeworkInfo() {
    const { homeworkClassId, answerType } = this.props.location.state;
    httpFetchGet(config.api.homework.answerHomework.getPaperAndAnswer(homeworkClassId))
      .then(
        result => {

          let questionListTemp = [];
          //answerType 0 表示第一次答题  1表示订正
          if( answerType == 0 ) {
            questionListTemp = result.questions.filter((question) => {
                return question.answerType == 0;
              }
            );
          } else {
            //错题列表的答题列表
            const questionReviseAnswerList = result.questions.filter((question) => {
                return question.answerType == 1;
              }
            );
            //错题列表
            questionListTemp = result.questions.filter(
              (question) => {
                return question.answerType == 0 && question.right == 0;
              }
            ).map(
              (question) => {
                let answer = "";
                questionReviseAnswerList.forEach(
                  (question1) => {
                    if( question1.index == question.index ) {
                      answer = question1.answer;
                    }
                  });
                question.answer = answer;
                return question;
              }
            );

          }
          const questionList = questionListTemp.map((question) => {
            const options = question.options.map((option) => {
              return option.optionContent;
            });
            return {
              questionId: question.questionId,
              type: question.type, //题目类型
              content: question.questionContent, //题目内容
              answer: question.answer, //答题情况
              drawZone: question.drawZone,
              options: options
            };
          });
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
  renderChoiceQuestion(question, index) {
    const {content,options,answer,type} = question.toJS();
    return (
      <ChoiceQuestion key={index} index={index} type={type} content={content} options={options}
                      answer={parseInt(answer)} onChange={(answer)=>this.changeChoiceAnswer(index,answer)} />
    );
  },
  changeChoiceAnswer(index, answer) {
    const question = this.state.questionList.get(index);
    const { questionId } = question.toJS();
    const { homeworkClassId, homeworkId, answerType } = this.props.location.state;

    let formData = new FormData();
    formData.append("questionIds", questionId);
    formData.append("homeworkClassId", homeworkClassId);
    formData.append("homeworkId", homeworkId);
    formData.append("answer", answer);
    formData.append("answerType", answerType);
    httpFetchPost(config.api.homework.answerHomework.uploadAnswer, formData)
      .then(
        result => {
          if (result.title == "Success") {
            this.setState({
              questionList: this.state.questionList.set(index, question.set("answer", answer))
            });
          } else {
            notification.error({
              message: "提交第" + (index + 1) + "题失败",
              description: result.result,
              duration: 10,
            });
          }
        }
      ).catch(
        () => {}
      )
  },
  renderSubjectiveQuestion(question,index) {
    const {content,drawZone, answer,type} = question.toJS();
    return (
      <SubjectiveQuestion key={index} index={index} content={content} type={type} drawZone={drawZone}
                    answer={answer} handleUpload={(files)=>this.uploadSubjectiveAnswer(index,files)}
                    handleRemove={(imgIndex)=>this.removeSubjectiveAnswer(index, imgIndex)}></SubjectiveQuestion>
    )
  },
  uploadSubjectiveAnswer(index, files) {
    const question = this.state.questionList.get(index);
    const { questionId, type } = question.toJS();
    const { homeworkClassId, homeworkId, answerType } = this.props.location.state;

    let formData = new FormData();
    if( type == QUESTION_TYPE_FILL_IN_BLANK ) {
      //填空题
      this.state.questionList.forEach((question) => {
        if( question.get("type") == QUESTION_TYPE_FILL_IN_BLANK ) {
          formData.append("questionIds", question.get("questionId"));
        }
      })
    } else {
      formData.append("questionIds", questionId);
    }
    formData.append("homeworkClassId", homeworkClassId);
    formData.append("homeworkId", homeworkId);
    formData.append("answerType", answerType);
    for( let i = 0; i < files.length; i++ ) {
      formData.append("answerFiles", files[i]);
    }

    httpFetchPost(config.api.homework.answerHomework.uploadAnswer, formData)
      .then(
        result => {
          if (result.title == "Success") {
            if (type == QUESTION_TYPE_FILL_IN_BLANK) {
              this.batchUpdateFillInBlanks(result.resultData);
            } else {
              this.setState({
                questionList: this.state.questionList.setIn([index, "answer"], result.resultData)
              });
            }
          } else {
            notification.error({
              message: "提交第" + (index + 1) + "题失败",
              description: result.result,
              duration: 10,
            });
          }
        }
      ).catch(
        () => {}
      )
  },
  removeSubjectiveAnswer(index, imgIndex) {
    const question = this.state.questionList.get(index);
    const { questionId, type, answer } = question.toJS();
    const { homeworkClassId, homeworkId, answerType } = this.props.location.state;

    const fileArray = answer.split("|");
    const deletedFile = fileArray.splice(imgIndex, 1);
    const lastAnswer = fileArray.join("|");
    let formData = new FormData();
    if( type == QUESTION_TYPE_FILL_IN_BLANK ) {
      //填空题
      this.state.questionList.forEach((question) => {
        if( question.get("type") == QUESTION_TYPE_FILL_IN_BLANK ) {
          formData.append("questionIds", question.get("questionId"));
        }
      })
    } else {
      formData.append("questionIds", questionId);
    }
    formData.append("homeworkClassId", homeworkClassId);
    formData.append("homeworkId", homeworkId);
    formData.append("answerType", answerType);
    formData.append("deletedFiles", deletedFile);
    formData.append("answer", lastAnswer);
    httpFetchPost(config.api.homework.answerHomework.uploadAnswer, formData)
      .then(
        result => {
          if (result.title == "Success") {
            if (type == QUESTION_TYPE_FILL_IN_BLANK) {
              this.batchUpdateFillInBlanks(lastAnswer);
            } else {
              this.setState({
                questionList: this.state.questionList.setIn([index, "answer"], lastAnswer)
              });
            }

          } else {
            notification.error({
              message: "提交第" + (index + 1) + "题失败",
              description: result.result,
              duration: 0,
            });
          }
        }
      ).catch(
        () => {
        }
      );
  },
  commitHomework() {
    if( this.checkHomework() == true ) {
      const { homeworkClassId, homeworkId, answerType } = this.props.location.state;
      //提交作业
      if( answerType == 0 ) {
        //第一次答题
        let formData = new FormData();
        formData.append("homeworkId",homeworkId);
        formData.append("homeworkClassId",homeworkClassId);
        httpFetchPost(config.api.homework.answerHomework.submitHomework, formData)
        .then(result => {
          if( result.title == "Success" ) {
            notification.success({ message:"提交成功",description:"作业提交成功" });
            this.backTo();
          } else {
            notification.error({
              message:"提交失败",
              description:result.result,
              duration:10,
            });
          }
        }).catch(()=>{});
      } else {
        //订正
        //目前订正没有做所谓的提交，学生一旦订正，老师就可以看到
        this.backTo();
      }
    }
  },
  checkHomework() {
    let valid = true;
    let alertMessage = "";
    this.state.questionList.forEach(
      (question, index) => {
        if( question.get("answer") == "" || question.get("answer") == undefined ) { //未答题
          valid = false;
          alertMessage = alertMessage + "第"+(index+1)+"题;"
        }
      }
    );
    if( !valid ) {
      notification.error({
        message:"无法提交",
        description:(
          <div>
            <div>下面的题目没打完，无法提交!</div>
            <div>{alertMessage}</div>
          </div>
        ),
        duration:10,
      });
    }
    return valid;
  },
  batchUpdateFillInBlanks(answer) {
    this.setState({
      questionList: this.state.questionList.map(
        (question) => {
          if( question.get("type") == QUESTION_TYPE_FILL_IN_BLANK ) {
            return question.merge({"answer":answer});
          } else {
            return question;
          }
        }
      )
    });
  },
  backTo() {
    this.context.router.goBack();
  }
})

function mapStateToProps(state) {
  return {
  }
}
function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerHomeworkPage)