import React from 'react'
import {Icon,Input,Button,Modal} from 'antd'
import {getAnswerSheet} from '../../actions/answer_sheet/main'
import {fromJS,Map,List} from 'immutable'
import {connect} from 'react-redux'
import {findMenuInTree} from '../../reducer/menu'
import PermissionDic from '../../utils/permissionDic'
import {bindActionCreators} from 'redux'
import styles from './AnswerSheetPage.scss'
import TableComponent from '../../components/table/TableComponent'
import _ from 'lodash'

const Search = Input.Search

const AnswerSheetPage = React.createClass({
  _currentMenu:Map({
    authList:List()
  }),

  getInitialState(){
    return {
      searchStr:'',
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
          <Icon type="search" onClick={this.handleDownload.bind(null,text)}/>
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
              <Button className={styles.editButton}type="primary" onClick={this.handleShowEditModal.bind(this,record.key)}>编辑</Button>
              <Button className={styles.deleteButton} type="primary" onClick={this.handleShowDeleteModal.bind(this,record.key)}>删除</Button>
            </div>
          )
        }
      }
    }))
    tableBody = !this.props.answerSheet.get('data').isEmpty()?this.props.answerSheet.get('data').get('result').map((v,key)=> {
      return {
        key:key,
        ...(v.toJS())
      }
    }):List()
    return {
      tableHeader:tableHeader.toJS(),
      tableBody:tableBody.toJS(),
    }
  },

  handleDownload(id){
    console.log(id);
  },

  handleShowEditModal(value){
    console.log(value);
  },

  handleShowDeleteModal(value){
    console.log(value);
  },

  //搜索框输入的change事件
  handleSearchTableData(value){
    this.props.getAnswerSheet('answersheet',value,this.props.answerSheet.get('data').get('nowPage'))
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
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AnswerSheetPage)
