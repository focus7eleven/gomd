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
import {getSubjectOptions} from '../../actions/homework_action/main'
import {AssignHomeworkModal} from './AssignHomeworkModal';
import styles from './StudentHomeworkPage.scss';
import {XhlDownloadButton} from '../../components/button/XhlDownloadButton';

const StudentHomeworkPage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        return {
            subjectOptionList: [],
        }
    },
    getDefaultProps() {
        return {};
    },
    componentWillMount(){
        this.props.getSubjectOptions();
    },

    componentWillReceiveProps(nextProps){
        this.setState({
            subjectOptionList: nextProps.homeworkCenter.get('subjectOptions').map((subject) => {
                return {key: subject.subject_id, value: subject.subject_name};
            })
        })
    },
    render() {
        const columns = this.getTableHeader();
        const filters = [
            {key: "subjectId", type: "select", placeholder: "所有学科", options: this.state.subjectOptionList},
            {key: "search", type: "input", placeholder: "请输入作业名称"}
        ];

        return (
            <div> {/* 过滤+表格+分页 */}
                <CustomTable columns={columns} showIndex={true} pageUrl={config.api.homework.studentHomeworkPageUrl}
                             filters={filters}></CustomTable>
                <AssignHomeworkModal ref="assignHomeworkModal"></AssignHomeworkModal>
            </div>
        );
    },
    getTableHeader() {
        let tableHeader = fromJS([
            {
                title: '布置日期', key: 'create_dt',
                render: (text, record) => {
                    return <div>{record.create_dt}<br/>{record.create_week}</div>
                }
            },
            {
                title: '作业名称', dataIndex: 'homework_name', key: 'homework_name',
                render: (text, record) => {
                    return <a onClick={() => {
                        this.context.router.push(`/index/homework/homework_detail/` + record.homework_id)
                    }}>{text}</a>
                }
            },
            {title: '班级/群组', dataIndex: 'target_name', key: 'target_name'},
            {title: '创建人', dataIndex: 'create_user_name', key: 'create_user_name'},
            {title: '完成期限', dataIndex: 'finish_time', key: 'finish_time'},
            {title: '交卷时间', dataIndex: 'submitTime', key: 'submitTime'},
            {title: '学科', dataIndex: 'subject', key: 'subject'},
            {title: '批改状态', dataIndex: 'status', key: 'status'},
            {
                title: '操作', key: 'operation',
                render: (text, record) => {
                    if (record.homeworkKind == 1) {
                        return (
                            <span className={styles.ButtonGroup}>
                                {record.submitTime == null ?
                                    <Button type="primary" onClick={() => this.gotoAnswerPage(record, 0)}>在线作答</Button> :
                                    <Button type="primary" onClick={() => this.gotoAnswerResult(record)}>查看结果</Button>
                                }
                                {record.needCorrectNumber > 0 ? <Button type="primary" onClick={() => this.gotoAnswerPage(record, 1)}>在线订正</Button> : null}
                            </span>
                        )
                    } else {
                        return (
                            <span className={styles.ButtonGroup}>
                                <XhlDownloadButton type="primary" url={config.api.homework.downloadAnswersheet(record.homework_id)}
                                                   filename={"答题卡_"+record.homework_id+".pdf"}>下载答题卡</XhlDownloadButton>
                                {record.enCompositionNum > 0 ? <Button type="primary">英语作文作答</Button> : null}
                            </span>
                        )
                    }
                }
            }
        ]);
        return tableHeader.toJS();
    },
    gotoAnswerPage(homework, answerType) {
        const {homework_class_id} = homework;

        this.context.router.push({
            pathname: `/index/homework/answer_homework`,
            state: {
                homeworkClassId: homework_class_id,
                answerType: answerType
            }
        })
    },
    gotoAnswerResult(homework) {
        const {homework_class_id} = homework;

        this.context.router.push({
            pathname: `/index/homework/homework_answer_result`,
            state: {
                homeworkClassId: homework_class_id,
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
        getSubjectOptions: bindActionCreators(getSubjectOptions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentHomeworkPage)