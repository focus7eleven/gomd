import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import styles from './HomeworkDetailModal.scss';
import {Input,Modal,Row,Col,Card,Icon,Button} from 'antd';
import config from '../../config';
import {ROLE_STUDENT} from '../../constant';

const AnswersheetAnswer = React.createClass({

    getDefaultProps:function(){
        return{
            questions: []
        }
    },

    render() {

        var ol = [];
        var olStyle = {
            listStyleType: "decimal",
            paddingLeft: "25px"
        };
        var homeworkName = this.props.title;
        this.props.questions.forEach(function(question) {
            var title = question.question_title;
            var optionType = question.option_type;
            var questionType = question.question_type;
            var rows = [];
            //rows.push(<ol>);
            if (questionType == "xuanze" || questionType == "panduan" || questionType == "duoxuan") {
                var anwserText = [];
                var en_zimu = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
                var shuzi = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
                var dui_cuo = ["对", "错", "", "", "", "", "", "", ""];
                var t_f = ["T", "F", "", "", "", "", "", "", ""];
                var gou_cha = ["√", "×", "", "", "", "", "", "", ""];
                if (optionType == "en_zimu"){
                    anwserText = en_zimu;
                }
                else if (optionType == "shuzi") {
                    anwserText = shuzi;
                }
                else if (optionType == "dui_cuo") {
                    anwserText = dui_cuo;
                }
                else if (optionType == "t_f") {
                    anwserText = t_f;
                }
                else if (optionType == "gou_cha") {
                    anwserText = gou_cha;
                } else {
                    anwserText = [];
                }

                var num = question.option_num;

                question.answers.forEach(function(anwser){
                    rows.push(

                        <li style={{marginTop:"10px"}}>
                            { num > 0 && <Button type={((anwser.key & 0x01) == 0x01)?"primary":""} style={{marginLeft:"10px"}}>{anwserText[0]}</Button> }
                            { num > 1 && <Button type={((anwser.key & 0x02) == 0x02)?"primary":""} style={{marginLeft:"10px"}}>{anwserText[1]}</Button> }
                            { num > 2 && <Button type={((anwser.key & 0x04) == 0x04)?"primary":""} style={{marginLeft: "10px"}}>{anwserText[2]}</Button> }
                            { num > 3 && <Button type={((anwser.key & 0x08) == 0x08)?"primary":""} style={{marginLeft: "10px"}}>{anwserText[3]}</Button> }
                            { num > 4 && <Button type={((anwser.key & 0x10) == 0x10)?"primary":""} style={{marginLeft: "10px"}}>{anwserText[4]}</Button> }
                            { num > 5 && <Button type={((anwser.key & 0x20) == 0x20)?"primary":""} style={{marginLeft: "10px"}}>{anwserText[5]}</Button> }
                            { num > 6 && <Button type={((anwser.key & 0x40) == 0x40)?"primary":""} style={{marginLeft: "10px"}}>{anwserText[6]}</Button> }
                            { num > 7 && <Button type={((anwser.key & 0x80) == 0x80)?"primary":""} style={{marginLeft: "10px"}}>{anwserText[7]}</Button> }
                            { num > 8 && <Button type={((anwser.key & 0x100) == 0x100)?"primary":""} style={{marginLeft: "10px"}}>{anwserText[8]}</Button> }
                        </li>

                    );
                })
                ol.push(<p style={{marginTop:"10px"}}>{title}</p>);
                ol.push(<ol style={olStyle}>{rows}</ol>);
            } else {
                question.answers.forEach(function(anwser){
                    rows.push(
                        <li style={{marginTop: "10px"}}>
                            <img style={{marginLeft:"10px"}} src={"http://139.224.194.45:8080" + anwser.key} width="100%" height=""/>
                        </li>
                    );
                })
                ol.push(<p  style={{marginTop:"10px"}}>{title}</p>);
                ol.push(<ol style={olStyle}>{rows}</ol>);
            }

        });

        return (
            <div>
                <div style={{textAlign:'center'}}> <span style={{fontSize:16}}>{homeworkName}</span></div>
                {ol}</div>
        );
    }
})

const HomeworkDetailModal = React.createClass({
  getDefaultProps(){
    return {
      homeworkId:'',
      userInfo:'',
      onCancel:()=>{},
    }
  },

  getInitialState(){
      return {
          subjectName:"",
          gradeName:"",
          term:"",
          homeworkName:"",
          version:"",
          textbookUnit:"",
          textbookCourse:"",
          homeworkDesc:"",
          homeworkKind:1,
          answersheetId:"",
          answersheetName:"",
          exampaperId:"",
          exampaperName:"",
          attachments:[],
          showHomeworkDetail: true,
          questionAnswerModalVisility:false,
          answersheetQuestions:[]
      }
  },

  componentDidMount(){
      //获取作业详情
      this.getHomeworkDetail(this.props.homeworkId);
  },
    renderAnwserModal() {
        return (
            <Modal
                title="作业答案"
                //title={this.state.homeworkName}
                visible={this.state.questionAnswerModalVisility}
                onOk={this.handleAnswerModalDisplay.bind(this,false)}
                onCancel={this.handleAnswerModalDisplay.bind(this,false)}
                width="50%"
                footer={[
        <Button key="submit" type="primary" size="large" onClick={this.handleAnswerModalDisplay.bind(this,false)}>
			返回
        </Button>,
      ]}>
                <div>
                    <AnswersheetAnswer title={this.state.homeworkName} questions={this.state.answersheetQuestions} />
                </div>
            </Modal>
        )
    },
    handleAnswerModalDisplay(homeworkVisibility){

        console.log(this.state.answersheetId);
        console.log(this.props.homeworkId);
        if(homeworkVisibility){
            fetch(config.api.homework.lookupAnswerSheetAnwser(this.state.answersheetId, this.props.homeworkId),{
                method:'GET',
                headers:{
                    'from':'nodejs',
                    'token':sessionStorage.getItem('accessToken'),
                }
            }).then(res => res.json()).then((json)=>{
                this.setState({showHomeworkDetail: false, questionAnswerModalVisility:true,answersheetQuestions: json.answersheetQuestions});
            })
        }else {
            this.setState({showHomeworkDetail: true,questionAnswerModalVisility: false});
        }
    },
    render(){
    return (
        <div>
      <Modal width={940} title='作业详情' visible={this.state.showHomeworkDetail} onOk={()=>{this.props.onCancel()}} onCancel={()=>{this.props.onCancel()}} footer={[]}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
              <div className={styles.title}><span style={{fontSize:16}}>作业名称作业名称：{this.state.homeworkName}</span>  <div style={{float:'right'}}><Button type='primary' style={{right:0}} onClick={()=>{this.props.onCancel()}}>返回</Button></div></div>
          </div>
          <br/>
          <Row type='flex' gutter={8} style={{marginBottom:'10px'}}>
            <Col span={6}>
              <Card style={{height:'100px'}} title={<span><Icon type='appstore'/>学科（版本）</span>} bordered={true}><span>{this.state.subjectName}</span><span>(</span><span>{this.state.version}</span><span>)</span></Card>
            </Col>
            <Col span={6}>
              <Card style={{height:'100px'}} title={<span><Icon type='appstore'/>年级（学期）</span>} bordered={true}><span>{this.state.gradeName}</span><span>(</span><span>{this.state.term}</span><span>)</span></Card>
            </Col>
            <Col span={12}>
              <Card style={{height:'100px'}} title={<span><Icon type='appstore'/>章节课程</span>} bordered={true}><span>{this.state.textbookUnit}</span><span>   </span><span>{this.state.textbookCourse}</span></Card>
            </Col>
          </Row>

            <Row type='flex' gutter={8} style={{marginBottom:'10px'}}>
                <Col span={24}>
                    <Card style={{height:'100px'}} title={<span><Icon type='appstore'/>作业要求</span>} bordered={true}>{this.state.homeworkDesc}</Card>
                </Col>
            </Row>

            <Row type='flex' gutter={8} style={{marginBottom:'10px'}}>
                <Col span={12}>
                    <Card style={{height:'180px'}} title={<span><Icon type='appstore'/>附件</span>} bordered={true}>
                        <div>
                            {this.state.attachments&&this.state.attachments.length > 0 ?
                                this.state.attachments.map(
                                    (attachment,index) => {
                                        return <div>{index+1}.<a href={baseURL + '/media/homework/' + this.props.params.homeworkId + '/attach/'+ attachment}>{attachment}</a></div>
                                    }) : <label>无</label>
                            }
                        </div>
                    </Card>

                </Col>
                <Col span={12}>
                    <Card style={{height:'180px'}} title={<span><Icon type='appstore'/>电子试卷/答题卡</span>} bordered={true}>
                        {this.state.homeworkKind==1?
                            <div>
                                <div>1.<a>{this.state.exampaperName}</a></div>
                            </div>
                            :
                            <div>
                                <div>1.<a onClick={()=>this.handleDownloadAnswersheet(this.props.homeworkId)}>查看答题卡</a></div>
                                {/* 学生不能查看答题卡答案 */}
                                {this.props.userInfo && this.props.userInfo.userStyle != ROLE_STUDENT ?
                                    <div>2.<a onClick={()=>this.handleAnswerModalDisplay(true)}>查看答题卡答案</a></div>
                                    : ""
                                }
                            </div>
                        }
                    </Card>
                </Col>
            </Row>
        </div>
      </Modal>
        {this.renderAnwserModal()}
        </div>
    )
  },
    handleDownloadAnswersheet(homeworkId){
        return fetch(config.api.homework.downloadAnswersheet(homeworkId),{
            method:'post',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
            },
        }).then(res => res.blob()).then(res => {
            let linkId = 'answersheetPdf_' + homeworkId;

            let link=document.createElement('a');
            link.href=window.URL.createObjectURL(res);
            link.download="答题卡_"+homeworkId+".pdf";
            link.id=linkId;
            link.click();
        })
    },

    getHomeworkDetail(homeworkId) {
        fetch(config.api.homework.getHomeworkDetail2(homeworkId),{
            method:'get',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken')
            }
        }).then(res => res.json()).then(homework => {
            this.setState({
                subjectName:homework.subject,
                gradeName:homework.gradeName,
                term:homework.term,
                homeworkName:homework.homework_name,
                version:homework.textbook_version,
                textbookUnit:homework.textbook_unit,
                textbookCourse:homework.textbook_course,
                homeworkDesc:homework.homework_desc,
                homeworkKind:homework.homeworkKind,

                answersheetId:homework.answersheet_id,
                answersheetName:homework.answersheet_name,
                exampaperId:homework.examPaperId,
                exampaperName:homework.examPaperName,

                attachments:homework.attachments
            })
        })
    },

});

export default HomeworkDetailModal
