/**
 * Created by wuyq on 2017/2/8.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Row,Col,Input,Button} from 'antd';

import config from '../../config';
import {ROLE_STUDENT} from '../../constant';

const HomeworkDetailPage = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState() {
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
      attachments:[]
    }
  },
  getDefaultProps() {
    return {}
  },
  componentWillMount() {
    //获取作业详情
    this.getHomeworkDetail(this.props.params.homeworkId);
  },
  render() {
    return (
      <div>
        <Row gutter={16}>
          <Col span={20} offset={2}>
            <div style={{textAlign:'center'}}>
              <h2>查看作业详情</h2>
            </div>
            <div style={{marginBottom:'20px'}}>
              <Button type="primary" onClick={()=>{this.context.router.goBack()}}>返回</Button>
            </div>
            <div style={{border:'1px solid #E9E9E9',padding:'20px'}}>
              <Row gutter={16}>
                <Col span={6}>
                  <div>
                    <label>学科</label>
                    <Input disabled={true} value={this.state.subjectName}/>
                  </div>
                  <div>
                    <label>年级</label>
                    <Input disabled={true} value={this.state.gradeName}/>
                  </div>
                  <div>
                    <label>学期</label>
                    <Input disabled={true} value={this.state.term}/>
                  </div>
                  <div>
                    <label>名称</label>
                    <Input disabled={true} value={this.state.homeworkName}/>
                  </div>
                  <div>
                    <label>版本</label>
                    <Input disabled={true} value={this.state.version}/>
                  </div>
                  <div>
                    <label>章节</label>
                    <Input disabled={true} value={this.state.textbookUnit}/>
                  </div>
                  <div>
                    <label>课程</label>
                    <Input disabled={true} value={this.state.textbookCourse}/>
                  </div>
                </Col>
                <Col span={8} offset={2}>
                  <div>
                    <label>要求</label>
                    <Input type="textarea" disabled={true} value={this.state.homeworkDesc} rows={14} />
                  </div>
                </Col>
                <Col span={6}>
                  <div>
                    <label>附件</label>
                    <div>
                      {this.state.attachments&&this.state.attachments.length > 0 ?
                        this.state.attachments.map(
                        (attachment) => {
                          return <a>{attachment}</a>
                        }) : <label>无</label>
                      }
                    </div>
                  </div>
                  {this.state.homeworkKind==1?
                    <div>
                      <label>试卷</label>
                      <div><a>{this.state.exampaperName}</a></div>
                    </div>
                    :
                    <div>
                      <label>答题卡</label>
                      <div><a>{this.state.answersheetName}</a></div>
                      {this.props.userInfo && this.props.userInfo.userStyle != ROLE_STUDENT ?
                        <div><a>查看答题卡答案</a></div>
                        : ""
                      }
                    </div>
                  }
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
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
  }
});

function mapStateToProps(state) {
  return {
    userInfo: state.get('user').get('userInfo'),
  }
}
function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeworkDetailPage)
