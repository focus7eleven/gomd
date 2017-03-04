/**
 * created by cq on 2017/2/21.
 */

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Row,Col,Input,Button,Modal,Table,Tabs} from 'antd';

import config from '../../config';
import {ROLE_STUDENT} from '../../constant';
import {baseURL} from '../../config';
import styles from './TaskSubmitModal.scss';
import {convertDateToString} from '../../utils/date-utils';

const TabPane = Tabs.TabPane;

function callback(key) {
    console.log(key);
}

export const TaskSubmitModal = React.createClass({
    getInitialState() {
        return{
            visible:false,
            taskId:"",
            title:"",
            submitlist:[], //已提交人员列表
            notsubmitlist:[],//未提交人员列表

            returnDate:"",
            content:"",
            attachmentUrls:"",

        }
    },
    getDefaultProps() {
        return {
        };
    },
    componentWillMount() {

    },
    render(){
        let submitcolumns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                className: styles.tableColumn ,
            },
            {
            title: '员工号',
            dataIndex: 'worknum',
            key: 'worknum',
                className: styles.tableColumn,
        }, {
            title: '姓名',
            dataIndex: 'username',
            key: 'username',
                className: styles.tableColumn,
        }, {
            title: '提交时间',
            dataIndex: 'submittime',
            key: 'submittime',
                className: styles.tableColumn,
        }, {
            title: '回复内容',
            dataIndex: 'content',
            key: 'content',
                className: styles.tableColumn,
        },
            {
                title: '任务结果附件',
                dataIndex: 'attachment',
                key: 'attachment',
                className: styles.tableColumn,
            }, ];

        let notsubmitcolumns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                className: styles.tableColumn,
            },
            {
            title: '员工号',
            dataIndex: 'worknum',
            key: 'worknum',
                className: styles.tableColumn,
        }, {
            title: '姓名',
            dataIndex: 'username',
            key: 'username',
                className: styles.tableColumn,
        },  ];

        var submitdata = [];
        var submitlen = this.state.submitlist.length;
        for(var i=0; i<submitlen; i++){
            //this.getReturnDetail(this.state.submitlist[i].taskId,this.state.submitlist[i].userId);
            submitdata.push(
                {
                    index:(i + 1),
                    key:(i + 1),
                    worknum: this.state.submitlist[i].workNum,
                    username:this.state.submitlist[i].userName,
                    submittime:this.state.returnDate,
                    content:this.state.content,
                    attachment:this.state.attachementUrls,

                }
            )

        }



        var notsubmitdata = [];
        var notsubmitlen = this.state.notsubmitlist.length;
        for(var i=0; i<notsubmitlen; i++)
        {
             notsubmitdata.push(
                {
                    index:(i + 1),
                    key: (i + 1),
                    worknum: this.state.notsubmitlist[i].workNum,
                    username: this.state.notsubmitlist[i].userName,

                }
            );
        }

        return(
            <Modal
            visible={this.state.visible}
            title="提交详情"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
                <Button key="download1" type="primary" size="large" onClick={()=>this.handleDownloadResponse(this.state.taskId)}>
                    下载回复
                </Button>,
                <Button key="download2" type="primary" size="large" onClick={()=>this.handleDownloadAttachment(this.state.taskId)}>
                    下载附件
                </Button>,
                <Button key="back" size="large" onClick={this.handleCancel}>关闭</Button>,
            ]}
        >
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="已回复" key="1">
                        <Table bordered columns={submitcolumns} dataSource={submitdata} />
                    </TabPane>
                    <TabPane tab="未回复" key="2">
                        <Table bordered columns={notsubmitcolumns} dataSource={notsubmitdata} />
                    </TabPane>

                </Tabs>


        </Modal>
        );


    },
    handleDownloadResponse(taskId){
        if(taskId != "") {
            fetch(config.api.notify.downloadResponse(taskId), {
                method: 'post',
                headers: {
                    'from': 'nodejs',
                    'token': sessionStorage.getItem('accessToken'),
                },
            }).then(res => res.blob()).then(res => {
                let linkId = 'downloadResponse_' + taskId;

                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(res);
                link.download = "任务回复_" + taskId + ".xlsx";
                link.id = linkId;
                link.click();
            })
        }
    },
    handleDownloadAttachment(taskId){
        if(taskId != "") {
            fetch(config.api.notify.downloadAttachment(taskId), {
                method: 'post',
                headers: {
                    'from': 'nodejs',
                    'token': sessionStorage.getItem('accessToken'),
                },
            }).then(res => res.blob()).then(res => {
                let linkId = 'downloadAttachment_' + taskId;

                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(res);
                link.download = "任务附件_" + taskId + ".zip";
                link.id = linkId;
                link.click();
            })
        }

    },
    handleOk(){
        this.setState({
            visible: false,
        });

    },
    handleCancel(){
        this.setState({
            visible: false,
        });

    },
    showModal(taskId) {
        this.setState({
            visible:true,
            taskId:taskId,
        });
        this.getSubmitList(taskId);
        this.getNotSubmitList(taskId);
    },

    getSubmitList(taskId){
        fetch(config.api.notify.getSubmitListUrl(taskId), {
            method:'get',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken')
            }
        }).then(res => res.json()).then(submitlist => {
            this.setState({
                submitlist: submitlist ,

            })
        })
    },

    getReturnDetail(taskId, userId){
        fetch(config.api.notify.showReturnDetailUrl(taskId, userId), {
            method:'get',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken')
            }
        }).then(res => res.json()).then(returninfo => {
            this.setState({
                returnDate:returninfo.returnDateStr ,
                content:returninfo.content ,
                attachmentUrls:returninfo.attachmentUrls ,

            })
        })
    },

    getNotSubmitList(taskId){
        fetch(config.api.notify.getNotSubmitListUrl(taskId), {
            method:'get',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken')
            }
        }).then(res => res.json()).then(notsubmitlist => {
            this.setState({
                notsubmitlist: notsubmitlist ,

            })
        })
    },

});






