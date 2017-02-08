import React from 'react'
import styles from './NormalGroupPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon,Input,Table,Button,Modal,Form} from 'antd'
import PermissionDic from '../../../utils/permissionDic'
import {getWorkspaceData} from '../../../actions/workspace'
import {fromJS,Map,List} from 'immutable'
import {findMenuInTree} from '../../../reducer/menu'

const FormItem = Form.Item
const Search = Input.Search
const confirm = Modal.confirm

const NormalGroupPage = React.createClass({
  _currentMenu:Map({
    authList:List()
  }),

  contextTypes: {
    router: React.PropTypes.object
  },

  getInitialState(){
    return {
      searchStr: "",
    }
  },

  componentWillMount(){
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'normalgroup')
    }
  },

  getTableData(){
    let tableHeader = List()
    let tableBody = List()
    let authList = this._currentMenu.get('authList')
    console.log(authList.toJS());
    tableHeader = fromJS([{
      title: '名称',
      dataIndex: 'groupName',
      key: 'groupName',
      className:styles.tableColumn,
    },{
      title: '类型',
      dataIndex: 'groupTypeName',
      key: 'groupTypeName',
      className:styles.tableColumn,
    },{
      title: '学校',
      dataIndex: 'schoolName',
      key: 'schoolName',
      className:styles.tableColumn,
    },{
      title: '班级',
      dataIndex: 'className',
      key: 'className',
      className:styles.tableColumn,
    },{
      title: '备注',
      dataIndex: 'gorupDesc',
      key: 'gorupDesc',
      className:styles.tableColumn,
    },{
      title: '人员',
      dataIndex: 'memberCount',
      key: 'memberCount',
      className:styles.tableColumn,
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
              <Button className={styles.editButton} type="primary" onClick={this.handleEditGroup.bind(this,record.key)}>编辑</Button>
              <Button className={styles.deleteButton} type="primary" onClick={this.handleDeleteGroup.bind(this,record.key)}>删除</Button>
            </div>
          )
        }
      }
    }))
    tableBody = !this.props.workspace.get('data').isEmpty()?this.props.workspace.get('data').get('result').map( (v,key) => {
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

  handleAddGroup(){

  },

  handleSearchStrChanged(e){
    this.setState({searchStr: e.target.value});
  },

  handleSearchTableData(value){
    this.props.getWorkspaceData('normalgroup',this.props.workspace.get('data').get('nowPage'),this.props.workspace.get('data').get('pageShow'),value)
  },

  handleEditGroup(key){
    console.log(key);
  },

  handleDeleteGroup(key){
    console.log(key);
  },

  render(){
    const tableData = this.getTableData()
    const {workspace} = this.props

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerOperation}>
            {
              this._currentMenu.get('authList').find((v)=>v.get('authName')=='增加') ?
              <Button data-action="add" type="primary" className={styles.operationButton} onClick={this.handleAddGroup}>
                新建
              </Button>:<div></div>
            }
        </div>
          <Search style={{width:'260px'}} placeholder="请输入群组名称" value={this.state.searchStr} onChange={this.handleSearchStrChanged} onSearch={this.handleSearchTableData} />
        </div>
        <div className={styles.body}>
          <div className={styles.wrapper}>
            <Table
              rowClassName={(record,index)=>index%2?styles.tableDarkRow:styles.tableLightRow}
              bordered
              columns={tableData.tableHeader}
              dataSource={tableData.tableBody}
              pagination={
                !this.props.workspace.get('data').isEmpty() ?
                  {
                    total:this.props.workspace.get('data').get('totalCount'),
                    pageSize:this.props.workspace.get('data').get('pageShow'),
                    current:this.props.workspace.get('data').get('nowPage'),
                    showQuickJumper:true,
                    onChange:(page)=>{
                      this.props.getWorkspaceData('normalgroup',page,this.props.workspace.get('data').get('pageShow'),this.state.searchStr)
                    }
                  }
                  :
                  null
                }
              />
            <div className={styles.tableMsg}>当前条目{workspace.get('data').get('start')}-{parseInt(workspace.get('data').get('start'))+parseInt(workspace.get('data').get('pageShow'))}/总条目{workspace.get('data').get('totalCount')}</div>
          </div>
        </div>
      </div>
    )
  }
})

function mapStateToProps(state){
  return{
    menu:state.get('menu'),
    workspace:state.get('workspace')
  }
}
function mapDispatchToProps(dispatch){
  return {
    getWorkspaceData:bindActionCreators(getWorkspaceData,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(NormalGroupPage))
