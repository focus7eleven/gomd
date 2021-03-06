import React from 'react'
import {Icon,Table,Button} from 'antd'
import {getWorkspaceData} from '../../actions/workspace'
import {getTableData} from '../../actions/course_center/main'
import {getExampaper} from '../../actions/exampaper_action/main'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styles from './TableComponent.scss'

const TableComponent = React.createClass({
  propTypes: {
    tableData: React.PropTypes.object.isRequired,
    pageType: React.PropTypes.string.isRequired,
    searchStr: React.PropTypes.string.isRequired,
    // 与reducer挂钩
    dataType: React.PropTypes.string.isRequired,
  },

  render(){
    const {tableData,pageType,searchStr,getWorkspaceData,getTableData,dataType,getExampaper} = this.props;
    let workspace
    if(dataType=='baseInfo'){
      workspace = this.props.baseInfo
    }else if(dataType=='courseCenter'){
      workspace = this.props.courseCenter
    }else if(dataType=='exampaper'){
      workspace = this.props.exampaper
    }
    return (
      <div>
      <div className={styles.wrapper}>
        <Table
          rowClassName={(record,index)=>index%2?styles.tableDarkRow:styles.tableLightRow}
          bordered
          columns={tableData.tableHeader}
          dataSource={tableData.tableBody}
          pagination={
            !workspace.get('data').isEmpty() ?
              {
                total:workspace.get('data').get('totalCount'),
                pageSize:workspace.get('data').get('pageShow'),
                current:workspace.get('data').get('nowPage'),
                showQuickJumper:true,
                onChange:(page)=>{
                  if(dataType=='baseInfo'){
                    getWorkspaceData(pageType,page,this.props.workspace.get('data').get('pageShow'),searchStr)
                  }else if(dataType=='courseCenter'){
                    getTableData(pageType,'',page)
                  }else if(dataType=='exampaper'){
                    getExampaper(pageType,'',page)
                  }
                },
                onShowSizeChange:(current,size)=>{
                  if(dataType=='baseInfo'){
                  }else if(dataType=='courseCenter'){
                  }
                }
              }
              :
              null
          }
        />
        <div className={styles.tableMsg}>
          当前条目{workspace.get('data').get('start')}
          -{parseInt(workspace.get('data').get('start'))
          +parseInt(workspace.get('data').get('pageShow'))}
          /总条目{workspace.get('data').get('totalCount')}
        </div>
      </div>
      </div>
    )
  }
})

function mapStateToProps(state){
  return{
    baseInfo:state.get('workspace'),
    courseCenter:state.get('courseCenter'),
    exampaper:state.get('exampaper'),
  }
}

function mapDispatchToProps(dispatch){
  return {
    getWorkspaceData:bindActionCreators(getWorkspaceData,dispatch),
    getTableData:bindActionCreators(getTableData,dispatch),
    getExampaper:bindActionCreators(getExampaper,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TableComponent)
