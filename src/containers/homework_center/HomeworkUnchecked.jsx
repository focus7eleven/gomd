/**
 * Created by wuyq on 2017/1/19.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {Button} from 'antd';
import {fromJS} from 'immutable';

import {CustomTable} from '../../components/table/CustomTable';
import config from '../../config';
import permissionDic from '../../utils/permissionDic';
import {ROLE_TEACHER} from '../../constant';
import {getGradeOptions,getSubjectOptions,getVersionOptions} from '../../actions/homework_action/main'
import {AssignHomeworkModal} from './AssignHomeworkModal';
//import {findMenuInTree} from '../../reducer/menu';
import styles from './HomeworkUnchecked.scss'

const HomeworkUnchecked = React.createClass({
	contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState(){
    return {
      type: "",
      pageUrl: "",

      gradeOptionList:[],
      termOptionList:[{key:"上学期",value:"上学期"},{key:"下学期",value:"下学期"}],
      subjectOptionList:[],
      versionOptionList:[],

    }
  },
  getDefaultProps() {
    return {};
  },
  componentWillMount(){
    this.setState({
      type: this.props.params.type,
      pageUrl: this.getSearchUrl(this.props.params.type)
    });
    this.props.getGradeOptions();
    this.props.getSubjectOptions();
    this.props.getVersionOptions();
    //if(!this.props.menu.get('data').isEmpty()){
    //    this._currentMenu = findMenuInTree(this.props.menu.get('data'),this.state.type);
    //}
  },

  componentWillReceiveProps(nextProps){
    this.setState({
      gradeOptionList: nextProps.homeworkCenter.get('gradeOptions').map((grade) => {
        return { key: grade.gradeId, value: grade.gradeName};
      }),
      subjectOptionList: nextProps.homeworkCenter.get('subjectOptions').map((subject) => {
        return { key: subject.subject_id, value: subject.subject_name};
      }),
      versionOptionList: nextProps.homeworkCenter.get('versionOptions').map((version) => {
      return { key: version.id, value: version.text};
    }),
    })

    if (this.props.params.type != nextProps.params.type) {
      this.setState({
        type:nextProps.params.type,
        pageUrl:this.getSearchUrl(nextProps.params.type)
      });
    }
  },
  render() {
    const columns = this.getTableHeader();
    const filters = [
      {key:"gradeId", type:"select",placeholder:"所有年级",options:this.state.gradeOptionList},
      {key:"term", type:"select",placeholder:"所有学期",options:this.state.termOptionList},
      {key:"subjectId", type:"select",placeholder:"所有学科",options:this.state.subjectOptionList},
      {key:"version", type:"select",placeholder:"所有版本",options:this.state.versionOptionList},
      {key:"search", type:"input",placeholder:"请输入作业名称"}
    ];

    return (
      <div> {/* 过滤+表格+分页 */}
        <CustomTable columns={columns} showIndex={true} pageUrl={this.state.pageUrl}
                     filters={filters} ref="uncheckedTable"></CustomTable>
      </div>
    );
  },
  getTableHeader() {
    let tableHeader = fromJS([
      {
        title: '作业名称', dataIndex: 'homework_name', key: 'homework_name',
        render: (text, record) => {
          //return <a onClick={() => console.log(record.homework_name)}>{text}</a>
		  return <a onClick={() => {this.context.router.push(`/index/homework/homework_detail/`+record.homework_id)}}>{text}</a>
        }
      },
      {title: '创建时间', dataIndex: 'create_dt', key: 'create_dt'},
      {title: '发布人', dataIndex: 'create_user_name', key: 'create_user_name'},
      {title: '学科', dataIndex: 'subject', key: 'subject'},
      {title: '年级', dataIndex: 'gradeName', key: 'gradeName'},
      {title: '学期', dataIndex: 'term', key: 'term'},
      {title: '版本', dataIndex: 'textbook_version', key: 'textbook_version'},
      {title: permissionDic['edit'], dataIndex: 'edit', key: 'edit',  className:styles.editColumn,
        render: (text, record) => {
          return (
            <div>
              <Button type="danger" className={styles.rejectHomeworkButton} onClick={()=>this.rejectHomework(record.homework_id)}>打回</Button>
              <Button type="primary"className={styles.acceptHomeworkButton} onClick={()=>this.acceptHomework(record.homework_id)}>同意</Button>
            </div>
          )
        }
      }
    ]);
    return tableHeader.toJS();
  },
  getSearchUrl(type) {
    let url = config.api.homework.homeworkUncheckedUrl;
    return url;
  },
  /* 打回 */
  rejectHomework(homeworkId) {
    let formData = new FormData()
    formData.append('homeworkId',homeworkId)
	formData.append('result', 'NG')
    fetch(config.api.homework.checkHomeworkUrl,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
    //   if(res.title == 'Success'){
          this.refs.uncheckedTable.refreshTableData();
    //   }
    })
  },
  /* 同意 */
  acceptHomework(homeworkId) {
    let formData = new FormData()
    formData.append('homeworkId',homeworkId)
	formData.append('result','OK')
    fetch(config.api.homework.checkHomeworkUrl,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
          this.refs.uncheckedTable.refreshTableData();
      }
    })
  }
});

function mapStateToProps(state) {
  return {
    menu: state.get('menu'),
    userInfo: state.get('user').get('userInfo'),
    homeworkCenter: state.get('courseCenter'),
    //workspace:state.get('workspace'),
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getGradeOptions:bindActionCreators(getGradeOptions,dispatch),
    getSubjectOptions:bindActionCreators(getSubjectOptions,dispatch),
    getVersionOptions:bindActionCreators(getVersionOptions,dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeworkUnchecked)