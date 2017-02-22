import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styles from './DetailPage.scss'
import {Row,Col,Card,Icon,Button,Table,Tag} from 'antd'
import VideoModal from '../../../components/modal/VideoModal'
import HomeworkDetailModal from '../../../components/modal/HomeworkDetailModal'
import config from '../../../config'
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
        const baseURL = 'http://139.224.194.45:8080'
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
    const tableBody = this.props.courseCenter.get('courseDetail').get('lessonContentPojoList').map(v => ({
      key:v.get('content_id'),
      ...v.toJS()
    })).toJS()
    return (
      <div className={styles.container}>
        <div className={styles.body}>
          <div className={styles.title}>课程内容</div>
          <Row type='flex' gutter={8} style={{marginBottom:'10px'}}>
            <Col span={5}>
              <Card title={<span><Icon type='appstore'/>学科</span>} bordered={true}>{this.props.courseCenter.get('courseDetail').get('subjectName')}</Card>
            </Col>
            <Col span={5}>
              <Card title={<span><Icon type='tags'/>版本</span>} bordered={true}>{this.props.courseCenter.get('courseDetail').get('versionName')}</Card>
            </Col>
            <Col span={5}>
              <Card title={<span><Icon type='bars'/>年级</span>} bordered={true}>{this.props.courseCenter.get('courseDetail').get('gradeName')}</Card>
            </Col>
            <Col span={5}>
              <Card title={<span><Icon type='retweet'/>学期</span>} bordered={true}>{this.props.courseCenter.get('courseDetail').get('term')}</Card>
            </Col>
            <Col span={4}>
              <Card title={<span><Icon type='calendar'/>上课时间</span>} bordered={true}>{this.props.courseCenter.get('courseDetail').get('createAtAtr')}</Card>
            </Col>
          </Row>
          <Row type='flex' gutter={8} style={{marginBottom:'10px'}}>
            <Col span={9}>
              <Card title={<span><Icon type='book'/>章节课程</span>} bordered={true}>{`${this.props.courseCenter.get('courseDetail').get('courseName')}第${this.props.courseCenter.get('courseDetail').get('hourNo')}课时`}</Card>
            </Col>
            <Col span={15}>
              <Card title={<span><Icon type='edit'/>课程名称</span>} bordered={true}>{this.props.courseCenter.get('courseDetail').get('name')}</Card>
            </Col>
          </Row>
          <Row type='flex' gutter={8} style={{marginBottom:'10px'}}>
            <Col span={24}>
              <Card title={<span><Icon type='plus'/>课程说明</span>} bordered={true}></Card>
            </Col>
          </Row>
          <Row type='flex'>
            <Col span={24}>
              <Table columns={tableHeader} dataSource={tableBody}/>
            </Col>
          </Row>
        </div>
        <div className={styles.footer}>
          <Button type='primary' onClick={this.handleBack}>返回</Button>
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
