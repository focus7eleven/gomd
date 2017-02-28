/**
 * created by cq on 2017/2/16.
 */

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {Modal, Button, Table, Icon} from 'antd';
import {fromJS} from 'immutable';

import {CustomTable} from '../../components/table/CustomTable';
import config from '../../config';
import permissionDic from '../../utils/permissionDic';
import {ROLE_TEACHER} from '../../constant';
import styles from './NotificationLibPage.scss';
import {TaskSubmitModal} from './TaskSubmitModal';
//import {new} from 'images/new.gif';
import imgSrc from 'images/new.gif';

const NotificationLibPage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        return {
            type: "",
            pageUrl: "",
            visible: false,
            columns:"",
            visible: false,
        }
    },
    getDefaultProps() {
        return {};
    },
    componentWillMount(){
        this.setState({
            type: this.props.params.type,
            pageUrl: this.getSearchUrl(this.props.params.type),
            columns: this.getTableHeader(this.props.params.type)
        });
    },

    componentWillReceiveProps(nextProps){
        if (this.props.params.type != nextProps.params.type) {
            this.setState({
                type:nextProps.params.type,
                pageUrl:this.getSearchUrl(nextProps.params.type),
                columns:this.getTableHeader(nextProps.params.type)
            });
        }
    },

    showTaskSubmitModal(taskid){
        this.refs.taskSubmitModal.showModal(taskid);
    },

    render() {
        //const columns = this.getTableHeader(this.state.type);
        const filters = [
            {key:"search", type:"input",placeholder:"请输入标题"}
        ];
        return (
            <div> {/* 过滤+表格+分页 */}
                <CustomTable columns={this.state.columns} showIndex={true} pageUrl={this.state.pageUrl}
                             filters={filters} ref="uncheckedTable"></CustomTable>
                <TaskSubmitModal ref="taskSubmitModal"></TaskSubmitModal>
            </div>

        );
    },

    getTableHeader(type) {
        let tableHeader;
        if(type == "notification" || type == "mynotification" || type == "undonotification") {
             tableHeader = fromJS([
                {
                    title: '标题', dataIndex: 'title', key: 'title',
                    render: (text, record) => {
                        if(record.readCount == 0){
                            return (
                                <div>
                                    <img src={imgSrc} />
                                    <a onClick={() => {this.context.router.push(`/index/notification/showNotificationDetail/`+record.notificationId )}}>{text}</a>

                                </div>)
                        }
                        else{
                            return <a onClick={() => {this.context.router.push(`/index/notification/showNotificationDetail/` + record.notificationId)}}>{text}</a>
                        }

                    }
                },
                {
                    title: '内容概要', width: '400px', dataIndex: 'summary', key: 'summary',
                    render: (text, record) => {
                        if (record.summary.length > 100) {
                            var summary = record.summary;
                            summary = summary.substring(0, 99);
                            return (
                                <div>{summary}</div>
                            )
                        }
                        else {
                            return (
                                <div>{text}</div>
                            )
                        }
                    }
                },
                {title: '创建者', dataIndex: 'creatorUserName', key: 'creatorUserName'},
                {title: '创建时间', width: '200px', dataIndex: 'createDtString', key: 'createDtString',
                    render: (text, record) => {
                        var dateshow = record.createDtString;
                        dateshow = dateshow.substring(0,16);
                        return(<div>{dateshow}</div>)
                    }
                },
                {title: '状态', dataIndex: 'availability', key: 'availability'},

            ]);
        }
        else if(type == "task" || type == "mytask" || type == "undotask"){
             tableHeader = fromJS([
                {
                    title: '标题', dataIndex: 'title', key: 'title',
                    render: (text, record) => {
                       return <a onClick={() => {this.context.router.push(`/index/task/showTaskDetail/`+record.taskId)}}>{text}</a>
                    }
                },
                {title: '内容概要', width: '400px',dataIndex: 'summary', key: 'summary',
                    render: (text, record) => {
                        if(record.summary.length > 100){
                            var summary = record.summary;
                            summary = summary.substring(0 , 99);
                            return(
                                <div>{summary}</div>
                            )
                        }
                        else
                        {
                            return(
                                <div>{text}</div>
                            )
                        }
                    }
                },
                {title: '创建者', dataIndex: 'creatorUserName', key: 'creatorUserName'},
                {title: '创建时间', width:'200px',dataIndex: 'createDtStr', key: 'createDtStr',
                    render: (text, record) => {
                        var dateshow = record.createDtStr;
                        dateshow = dateshow.substring(0,16);
                        return(<div>{dateshow}</div>)
                    }},
                {title: '提交任务人数', dataIndex: 'taskSubmitCount', key: 'taskSubmitCount',
                    render: (text, record) => {
                        return (
                            <div>
                                <a onClick={() => this.showTaskSubmitModal(record.taskId)}>提交人数：{record.taskSubmitCount}</a>
                            </div>
                        )
                    }

                },

            ]);
        }
        else if(type == "cityeduinfo" || type == "schooleduinfo" || type == "classeduinfo"){
             tableHeader = fromJS([
                {
                    title: '标题', dataIndex: 'title', key: 'title',
                    render: (text, record) => {
                       return <a onClick={() => {this.context.router.push(`/index/eduinfo/showEduInfoDetail/`+record.eduInfoId)}}>{text}</a>
                    }
                },
                {title: '内容概要', width: '400px',dataIndex: 'summary', key: 'summary',
                    render: (text, record) => {
                        if(record.summary.length > 100){
                            var summary = record.summary;
                            summary = summary.substring(0 , 99);
                            return(
                                <div>{summary}</div>
                            )
                        }
                        else
                        {
                            return(
                                <div>{text}</div>
                            )
                        }
                    }
                },
                {title: '创建者', dataIndex: 'createUserName', key: 'createUserName'},
                {title: '创建时间', width:'200px',dataIndex: 'createDtString', key: 'createDtString',
                    render: (text, record) => {
                        var dateshow = record.createDtString;
                        dateshow = dateshow.substring(0,16);
                        return(<div>{dateshow}</div>)
                    }
                },

            ]);
        }

        return tableHeader.toJS();
    },
    getSearchUrl(type) {
        let url = "";
        switch (type) {
            case 'notification':
                url = config.api.notify.receiveNotifyUrl;
                break;
            case 'mynotification':
                url = config.api.notify.myNotifyUrl;
                break;
            case 'undonotification':
                url = config.api.notify.undoNotifyUrl;
                break;
            case 'task':
                url = config.api.notify.receiveTaskUrl;
                break;
            case 'mytask':
                url = config.api.notify.myTaskUrl;
                break;
            case 'undotask':
                url = config.api.notify.undoTaskUrl;
                break;
            case 'cityeduinfo':
                url = config.api.notify.cityEduInfoUrl;
                break;
            case 'schooleduinfo':
                url = config.api.notify.schoolEduInfoUrl;
                break;
            case 'classeduinfo':
                url = config.api.notify.classEduInfoUrl;
                break;
            default:
                url = config.api.notify.classEduInfoUrl;
                break;
        }
        return url;
    },

});

function mapStateToProps(state) {
    return {
        menu: state.get('menu'),
        userInfo: state.get('user').get('userInfo'),

    }
}
function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationLibPage)