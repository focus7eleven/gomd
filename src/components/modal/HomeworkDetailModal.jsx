import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import styles from './HomeworkDetailModal.scss';
import {Input,Modal,Row,Col,Card,Icon,Button} from 'antd';
import config from '../../config';
import {ROLE_STUDENT} from '../../constant';

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
          modalVisibility: false,
          answersheetQuestions:[]
      }
  },

  componentDidMount(){
      //获取作业详情
      this.getHomeworkDetail(this.props.homeworkId);
  },

    render(){
    return (
      <Modal width={940} title='作业详情' visible={true} onOk={()=>{this.props.onCancel()}} onCancel={()=>{this.props.onCancel()}} footer={[]}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
              <div className={styles.title}>作业名称：{this.state.homeworkName}</div>
              <div className={styles.footer}>
                <Button type='primary' onClick={()=>{this.props.onCancel()}}>返回</Button>
              </div>
          </div>

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
                                        return <div>{index+1}.<a>{attachment}</a></div>
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
                                    <div>2.<a onClick={this.handleAnswerModalDisplay(true)}>查看答题卡答案</a></div>
                                    : ""
                                }
                            </div>
                        }
                    </Card>
                </Col>
            </Row>



        </div>

      </Modal>
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
    handleAnswerModalDisplay(visibility){

        console.log(this.state.answersheetId);
        console.log(this.props.homeworkId);
        if(visibility){
            fetch(config.api.homework.lookupAnswerSheetAnwser(this.state.answersheetId, this.props.homeworkId),{
                method:'GET',
                headers:{
                    'from':'nodejs',
                    'token':sessionStorage.getItem('accessToken'),
                }
            }).then(res => res.json()).then((json)=>{
                this.setState({modalVisibility: true, answersheetQuestions: json.answersheetQuestions});
            })
        }else {
            this.setState({modalVisibility: false});
        }
    }
})

export default HomeworkDetailModal
