import React from 'react'
import {notification,Icon,Input,Button,Modal} from 'antd'
import {getSheetDetail,getSheetQuestion,editAnswerSheet,getAnswerSheet,downloadSheet} from '../../actions/answer_sheet/main'
import {fromJS,Map,List} from 'immutable'
import {connect} from 'react-redux'
import {findMenuInTree} from '../../reducer/menu'
import PermissionDic from '../../utils/permissionDic'
import {bindActionCreators} from 'redux'
import styles from './AnswerSheetPage.scss'
import TableComponent from '../../components/table/TableComponent'
import _ from 'lodash'
import Sheet from '../../components/answer_sheet/Sheet.jsx'

const Search = Input.Search
const confirm = Modal.confirm

const AnswerSheetPage = React.createClass({
  _currentMenu:Map({
    authList:List()
  }),

  getInitialState(){
    return {
      searchStr: '',
      editModalVisibility: false,
      sheetName: '',
      sheetId: 0,
      questions: fromJS([]),
    }
  },

  componentWillMount(){
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'answersheet')
    }
  },

  getTableData(){
    let tableHeader = List()
    let tableBody = List()
    let authList = this._currentMenu.get('authList')
    tableHeader = fromJS([{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      className:styles.tableColumn,
    },{
      title: '答题卡名称',
      dataIndex: 'answersheet_name',
      key: 'answersheet_name',
      className:styles.tableColumn,
    },{
      title: '创建人',
      dataIndex: 'create_user_name',
      key: 'create_user_name',
      className:styles.tableColumn,
    },{
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      className:styles.tableColumn,
    },{
      title: '查看',
      dataIndex: 'answersheet_id',
      key: 'answersheet_id',
      className:styles.tableColumn,
      render: (text,record) => {
        return (
          <Icon type="search" style={{cursor: 'pointer'}} onClick={this.handleDownload.bind(null,text)}/>
        )
      }
    },{
      title: '详细',
      dataIndex: 'answersheet_id',
      key: 'detail',
      className:styles.tableColumn,
      render: (text,record) => {
        return (
          <Icon type="bars" style={{cursor: 'pointer'}} onClick={this.handleCheckDetail.bind(null,record)}/>
        )
      }
    }])
    tableHeader = tableHeader.concat(authList.filter(v => (v.get('authUrl').split('/')[2] != 'view')&&(v.get('authUrl').split('/')[2] != 'add')).map( v => {
      return {
        title: PermissionDic[v.get('authUrl').split('/')[2]],
        dataIndex: v.get('authUrl').split('/')[2],
        key: v.get('authUrl').split('/')[2],
        className:styles.editColumn,
        render:(text,record) => {
          return (
            <div>
              <Button className={styles.editButton}type="primary" onClick={this.handleShowEditModal.bind(this,record)}>编辑</Button>
              <Button className={styles.deleteButton} type="primary" onClick={this.handleShowDeleteModal.bind(this,record.answersheet_id)}>删除</Button>
            </div>
          )
        }
      }
    }))
    tableBody = !this.props.answerSheet.get('data').isEmpty()?this.props.answerSheet.get('data').get('result').map((v,key)=> {
      return {
        key:key+1,
        ...(v.toJS())
      }
    }):List()
    return {
      tableHeader:tableHeader.toJS(),
      tableBody:tableBody.toJS(),
    }
  },

  handleDownload(id){
    this.props.downloadSheet(id);
  },

  handleCheckDetail(record){
    const result = this.props.getSheetQuestion(record.answersheet_id)
    result.then((res)=>{
      if(res.type==="GET_SHEET_QUESTION_SUCCESS"){
        const immutableQuestions = this.handleConvertParams(res.data)
        this.setState({detailModalVisibility: true, questions: immutableQuestions, sheetName: record.answersheet_name})
      }else{
        notification.error({message:'系统错误',description: res.result})
      }
    })
  },

  handleShowEditModal(value){
    this.setState({editModalVisibility: true, sheetName: value.answersheet_name, sheetId: value.answersheet_id})
  },

  handleCloseEditModal(){
    this.setState({editModalVisibility: false})
  },

  handleShowDeleteModal(value){
    const that = this
    confirm({
      title: '确定删除这条记录吗？',
      content: '删除后不可恢复',
      onOk() {
        that.props.editAnswerSheet(value,"delete")
      },
      onCancel() {},
    });
  },

  handleSaveAnswerSheet(){
    const {sheetId,sheetName} = this.state;
    this.props.editAnswerSheet(sheetId,"edit",sheetName)
  },

  handleSheetNameChange(e){
    this.setState({sheetName: e.target.value})
  },

  //搜索框输入的change事件
  handleSearchTableData(value){
    this.props.getAnswerSheet('answersheet',value,this.props.answerSheet.get('data').get('nowPage'))
  },

  handleCloseDetailModal(){
    this.setState({detailModalVisibility: false});
  },

  handleEnterEditSheet(){

  },

  handleConvertParams(questions){
    let result = fromJS([])
    console.log("before: ",questions);
    questions.map((item,index)=>{
      let afterConvert = {}
      afterConvert['isChild'] = item.child_question_flag
      const title = item.question_title.split('、')
      afterConvert['questionTitle'] = title[title.length-1]
      const subTitle = item.child_question_title.split(' ')
      afterConvert['childQuestionTitle'] = subTitle[subTitle.length-1]
      afterConvert['questionType'] = item.question_type
      afterConvert['questionNum'] = item.question_num
      afterConvert['optionType'] = item.option_type
      afterConvert['optionNum'] = item.option_num
      const width = item.answer_width.split('|')
      afterConvert['answerWidth'] = width[0]
      const height = item.answer_height.split('|')
      afterConvert['answerHeight'] = height[0]
      result = result.push(fromJS(afterConvert))
    })
    console.log("after: ",result.toJS());
    return result
  },

  renderSheetDetailModal(){
    const {questions,sheetName,detailModalVisibility} = this.state
    // const immutableQuestions = this.handleConvertParams(questions)
    console.log(questions.toJS());
    return (
      <Modal width={1000} title="答题卡详情" visible={detailModalVisibility} footer={[
        <Button key="close" size="large" type="primary" onClick={this.handleCloseDetailModal}>关闭</Button>,
        <Button key="edit" size="large" type="primary" onClick={this.handleEnterEditSheet}>编辑</Button>,
      ]}>
        <Sheet questions={questions} sheetName={sheetName}></Sheet>
      </Modal>
    )
  },

  renderEditTitleModal(){
    const {editModalVisibility, sheetName} = this.state
    return (
      <Modal title="编辑答题卡" visible={editModalVisibility} onOk={this.handleSaveAnswerSheet} onCancel={this.handleCloseEditModal}>
        <div className={styles.editModal}>
          <span>答题卡名称:</span>
          <Input value={sheetName} onChange={this.handleSheetNameChange} placeholder="请输入答题卡名称"></Input>
        </div>
      </Modal>
    )
  },

  render(){
    const tableData = this.getTableData()
    const {workspace} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
          </div>
          <Search style={{width: '260px'}} placeholder="请输入答题卡名称" value={this.state.searchStr} onChange={(e)=>{this.setState({searchStr:e.target.value})}} onSearch={this.handleSearchTableData} />
        </div>
        <div className={styles.body}>
          <TableComponent tableData={tableData} pageType="answersheet" searchStr={this.state.searchStr} dataType="answerSheet"></TableComponent>
        </div>
        {this.renderEditTitleModal()}
        {this.renderSheetDetailModal()}
      </div>
    )
  }
})

function mapStateToProps(state){
  return{
    menu:state.get('menu'),
    answerSheet: state.get('answerSheet')
  }
}
function mapDispatchToProps(dispatch){
  return {
    getAnswerSheet: bindActionCreators(getAnswerSheet,dispatch),
    downloadSheet: bindActionCreators(downloadSheet,dispatch),
    editAnswerSheet: bindActionCreators(editAnswerSheet,dispatch),
    getSheetDetail: bindActionCreators(getSheetDetail,dispatch),
    getSheetQuestion: bindActionCreators(getSheetQuestion,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AnswerSheetPage)
