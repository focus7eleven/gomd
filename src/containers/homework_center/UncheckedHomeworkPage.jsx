/**
 * created by wangc on 2017/2/8
 */

import React from 'react';
import {connect} from 'react-redux';
import {Select,Button} from 'antd';
import {fromJS, List} from 'immutable';
import {bindActionCreators} from 'redux'

import {CustomTable} from '../../components/table/CustomTable';
import config from '../../config';
import permissionDic from '../../utils/permissionDic';
import {getGradeOptions,getSubjectOptions,getVersionOptions} from '../../actions/homework_action/main'

const UncheckedHomeworkPage = React.createClass({


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
            pageUrl: config.api.homework.teaUnCheckHomeworkPageUrl,
        });
        this.props.getGradeOptions();
        this.props.getSubjectOptions();
        this.props.getVersionOptions();
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
                    return <a onClick={() => console.log(record.homework_name)}>{text}</a>
                }
            },
            {title: '创建时间', dataIndex: 'create_dt', key: 'create_dt'},
            {title: '发布人', dataIndex: 'create_user_name', key: 'create_user_name'},
            {title: '学科', dataIndex: 'subject', key: 'subject'},
            {title: '年级', dataIndex: 'gradeName', key: 'gradeName'},
            {title: '学期', dataIndex: 'term', key: 'term'},
            {title: '版本', dataIndex: 'textbook_version', key: 'textbook_version'}
        ]);
        if (this.props.userInfo){
            if (this.props.userInfo.schoolId){
                tableHeader = tableHeader.concat([{
                    title:'状态',
                    dataIndex:'school_check',
                    key:'school_check',
                    render: (text,record) =>{
                        if (record.school_check == 0){
                            return "审核中";
                        }else {
                            return "被打回";
                        }
                    }
                }])

            }else {
                tableHeader = tableHeader.concat([{
                    title:'状态',
                    dataIndex:'area_check',
                    key:'area_check',
                    render: (text,record) =>{
                        if (record.area_check == 0){
                            return "审核中";
                        }else {
                            return "被打回";
                        }
                    }

                }])
            }
        }
        if (this.props.userInfo) {
            //是老师时，显示布置作业按钮
            tableHeader = tableHeader.concat(
                [{
                    title: permissionDic['edit'],
                    dataIndex: 'edit',
                    key: 'edit',
                    render: (text, record) => {
                        if (this.props.userInfo.schoolId){
                            if (record.school_check != 0){
                                return (
                                    <div>
                                        <Button type="primary">修改</Button>
                                        <Button type="danger"  style={{marginLeft:'10px'}} onClick={this.handleDeleteHomework.bind(this,record.homework_id)}>删除</Button>
                                    </div>
                                )
                            }
                        }else {
                            if (record.area_check != 0){
                                return (
                                    <div>
                                        <Button type="primary" onClick={this.handleEditHomework.bind(this,record.homework_id)}>修改</Button>
                                        <Button type="danger"  style={{marginLeft:'10px'}} onClick={this.handleDeleteHomework.bind(this,record.homework_id)}>删除</Button>
                                    </div>
                                )
                            }
                        }

                    }
                }]
            )
        }
        return tableHeader.toJS();
    },

    handleEditHomework(value){


    },

    handleDeleteHomework:function(value){
        let userId = this.props.userInfo.userId;
        let formData = new FormData();
        formData.append('userId',userId);
        formData.append('homeworkId',value);

        console.log(userId);
        fetch(config.api.homework.teaDeleteHomeworkUrl,{
            method:'post',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken')
            },
            body:formData,
        }).then(res => res.json()).then(res =>{
            if(res.title == 'Success'){
                this.refs.uncheckedTable.refreshTableData();
            }
        });

    },


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

export default connect(mapStateToProps, mapDispatchToProps)(UncheckedHomeworkPage)