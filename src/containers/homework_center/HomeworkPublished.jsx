/**
 * created by cq on 2017/2/8.
 */

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {Modal, Button} from 'antd';
import {fromJS} from 'immutable';

import {CustomTable} from '../../components/table/CustomTable';
import config from '../../config';
import permissionDic from '../../utils/permissionDic';
import {ROLE_TEACHER} from '../../constant';
import {getGradeOptions,getSubjectOptions,getVersionOptions} from '../../actions/homework_action/main'
//import {findMenuInTree} from '../../reducer/menu';
import styles from './HomeworkPublished.scss';
import {XhlDownloadButton} from '../../components/button/XhlDownloadButton';

const HomeworkPublished = React.createClass({
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

            visible: false
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
    showModal(homework_class_id, homework_name) {
        this.setState({
            visible: true,
            homework_class_id:homework_class_id,
            homework_name:homework_name
        });
    },
    //删除作业
    handleOk(homeworkClassId) {
        this.handleDeleteHomework(homeworkClassId);
        this.setState({
            visible: false,
        });
    },
    handleCancel(e) {
        this.setState({
            visible: false,
        });
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
                <Modal title="确定删除该作业吗？" visible={this.state.visible} onOk={() => this.handleOk(this.state.homework_class_id)} onCancel={this.handleCancel}>
                    <p>作业名称： {this.state.homework_name}</p>
                </Modal>
            </div>

        );
    },

    getTableHeader() {
        let tableHeader = fromJS([
            {title: '日期', dataIndex: 'create_dt', key: 'create_dt'},
            {
                title: '作业名称', dataIndex: 'homework_name', key: 'homework_name',
                render: (text, record) => {
                    return <a onClick={() => {this.context.router.push(`/index/homework/homework_detail/`+record.homework_id)}}>{text}</a>
                }
            },
            {title: '班级/群组', dataIndex: 'target_name', key: 'target_name'},
            {title: '创建人', dataIndex: 'create_user_name', key: 'create_user_name'},
            {title: '完成期限', dataIndex: 'finish_time', key: 'finish_time'},
            {title: '学科', dataIndex: 'subject', key: 'subject'},
            {title: '批改状态', dataIndex: 'status', key: 'status'},

            {   //“操作”
                title: permissionDic['edit'], dataIndex: 'edit', key: 'edit',
                render: (text, record) => {
                    return (
                        <span className={styles.ButtonGroup}>
                            {record.homeworkKind == 2?
                                <XhlDownloadButton type="primary" className={styles.editHomeworkButton}
                                                   url={config.api.homework.downloadAnswersheet(record.homework_id)}
                                                   filename={"答题卡_"+record.homework_id+".pdf"}>答题卡</XhlDownloadButton>
                                 : null}
                            {record.homeworkKind == 2 && record.enCompositionNum > 0?
                                <Button type="primary" className={styles.editHomeworkButton} onClick={()=>this.gotoPigaiPage(record)}>英语作文</Button> : null}
                            {record.submitNum > 0 && record.homeworkKind == 1 ?
                                <Button type="primary" className={styles.editHomeworkButton} onClick={()=>this.gotoCommentPage(record,0)}>批改作业</Button> : null }
                            {record.submitNum > 0 && record.homeworkKind == 1 ?
                                <Button type="primary" className={styles.editHomeworkButton}
                                        onClick={() => {this.context.router.push(`/index/homework/check_results/`+record.homework_class_id)}}>查看批改</Button> : null }
                            {record.submitNum > 0 && record.homeworkKind == 1 && record.needCorrectStuNum > 0 ?
                                <Button type="primary" className={styles.editHomeworkButton}
                                        onClick={()=>this.gotoCommentPage(record,1)}>批改订正</Button> : null }
                            {record.submitNum > 0 && record.homeworkKind == 1 && record.needCorrectStuNum > 0 && record.reviseCorrectStuNum > 0 ?
                                <Button type="primary" className={styles.editHomeworkButton}>查看订正</Button> : null }
                            {record.submitNum == 0 ?
                                <Button className={styles.deleteHomeworkButton} onClick={()=>this.showModal(record.homework_class_id,record.homework_name)}>删除</Button>: null}
                        </span>
                    );
                }
            }
        ]);


        return tableHeader.toJS();
    },
    getSearchUrl(type) {
        let url = "";
        url = config.api.homework.publishedHomeworkPageUrl;
        return url;
    },

    handleDeleteHomework(value){
        let formData = new FormData();
        formData.append('homeworkClassId',value);

        fetch(config.api.homework.pubDeleteHomeworkUrl,{
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
    gotoCommentPage(homework, answerType) {
        const {homework_id, homework_class_id,homework_name} = homework;

        this.context.router.push({
            pathname: `/index/homework/comment_homework`,
            state: {
                homeworkClassId: homework_class_id,
                homeworkId:homework_id,
                homeworkName:homework_name,
                answerType: answerType
            }
        })
    },
    gotoPigaiPage(homework) {
        const answersheet_id = homework.answersheet_id;
        const homework_class_id = homework.homework_class_id;
        const homework_id = homework.homework_id;
        const homework_name = homework.homework_name;
        const create_dt = homework.create_dt;
        const finish_time = homework.finish_time;
        const target_name = homework.target_name;

        this.context.router.push({
            pathname: `/index/homework/pigai_enarticle_results`,
            state: {
                homeworkClassId: homework_class_id,
                homeworkId:homework_id,
                answersheetId:answersheet_id,
                homework_name:homework_name,
                create_dt:create_dt,
                finish_time:finish_time,
                target_name:target_name,
                // answerType: answerType
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeworkPublished)