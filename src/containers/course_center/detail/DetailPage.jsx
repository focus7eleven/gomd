import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styles from './DetailPage.scss'
import {Row,Col,Card,Icon,Button,Table,Tag} from 'antd'
import VideoModal from '../../../components/modal/VideoModal'
import HomeworkDetailModal from '../../../components/modal/HomeworkDetailModal'
import config,{baseURL} from '../../../config'
import moment from 'moment'

const DetailPage = React.createClass({
  getInitialState(){
    return {
      showVidoeoDetailModal: false,
      showHomeworkDetailModal: false,
    }
  },
  handleBack(){
    this.props.router.goBack()
  },
  handleCheckDetail(currentRow){
    if(currentRow['content_name']=='微课'){
      fetch(config.api.microvideo.getVideoDetailById(currentRow['content_id']),{
        method:'get',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json()).then(res => {
        // const baseURL = 'http://139.224.194.45:8080'
        this.setState({
          showVidoeoDetailModal:true,
          videoUrl:`${baseURL}/${res.url}`
        })
      })
    }else{
      this.setState({
        showHomeworkDetailModal:true,
        homeworkId:currentRow['content_id']
      })
    }
  },
  render(){
    const tableHeader = [{
      title:'序号',
      dataIndex:'num',
      key:'num',
      className:styles.tableColumn,
    },{
      title:'类型',
      dataIndex:'content_name',
      key:'content_name',
      className:styles.tableColumn,
    },{
      title:'名称',
      dataIndex:'name',
      key:'name',
      className:styles.tableColumn,
    },{
      title:'创建时间',
      dataIndex:'create_dt',
      key:'create_dt',
      className:styles.tableColumn,
    },{
      title:'说明',
      dataIndex:'desc2',
      key:'desc2',
      className:styles.tableColumn,
    },{
      title:'操作',
      key:'action',
      className:styles.tableColumn,
      render:(text,record)=>{
        return (<Button onClick={this.handleCheckDetail.bind(this,text)} type='primary'>详情</Button>)
      }
    }]
    const tableBody = this.props.courseCenter.get('courseDetail').get('lessonContentPojoList').map((v,k) => ({
      key:v.get('content_id'),
      num:k+1,
      ...v.toJS()
    })).toJS()
    return (
      <div className={styles.container}>
        <div className={styles.body}>
          <div className={styles.wrapper}>
            <div className={styles.title}>课程名称：{this.props.courseCenter.get('courseDetail').get('name')}</div>
            <div className={styles.footer}>
              <Button type='primary' onClick={this.handleBack}>返回</Button>
            </div>
          </div>
          <Row type='flex' gutter={8} style={{marginBottom:'10px'}}>
            <Col span={15}>
              <Row gutter={8} style={{marginBottom:'10px'}}>
                <Col span={8}>
                <Card style={{height:'138px'}} title={<span><Icon type='appstore'/>学科（版本）</span>} bordered={true}>{`${this.props.courseCenter.get('courseDetail').get('subjectName')}(${this.props.courseCenter.get('courseDetail').get('versionName')})`}</Card>
                </Col>
                <Col span={8}>
                <Card style={{height:'138px'}} title={<span><Icon type='appstore'/>年级（学期）</span>} bordered={true}>{`${this.props.courseCenter.get('courseDetail').get('gradeName')}(${this.props.courseCenter.get('courseDetail').get('term')})`}</Card>
                </Col>
                <Col span={8}>
                <Card style={{height:'138px'}} title={<span><Icon type='appstore'/>上课时间</span>} bordered={true}>{this.props.courseCenter.get('courseDetail').get('createAtAtr')}</Card>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card title={<span><Icon type='appstore'/>章节课程</span>} bordered={true}>{`${this.props.courseCenter.get('courseDetail').get('courseName')}第${this.props.courseCenter.get('courseDetail').get('hourNo')}课时`}</Card>
                </Col>
              </Row>
            </Col>
            <Col span={9}>
            <Card style={{height:'100%'}} title={<span><Icon type='appstore'/>课程说明</span>} bordered={true}>{this.props.courseCenter.get('courseDetail').get('description')}</Card>
            </Col>
          </Row>
          <Row type='flex'>
            <Col span={24}>
              <Table columns={tableHeader} dataSource={tableBody}/>
            </Col>
          </Row>
        </div>

        {this.state.showVidoeoDetailModal?<VideoModal videoUrl={this.state.videoUrl} onCancel={()=>{this.setState({showVidoeoDetailModal:false})}}/>:null}
        {this.state.showHomeworkDetailModal?<HomeworkDetailModal homeworkId={this.state.homeworkId} onCancel={()=>{this.setState({showHomeworkDetailModal:false})}}/>:null}
      </div>
    )
  }
})

function mapStateToProps(state){
  return{
    menu: state.get('menu'),
    courseCenter: state.get('courseCenter'),
  }
}
function mapDispatchToProps(dispatch){
  return {
    // getTableData:bindActionCreators(getTableData,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(DetailPage)
