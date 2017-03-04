/**
 * created by cq on 2017/2/16.
 */

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {Row,Col,Input,Button,Modal,Tree} from 'antd';

import config from '../../config';
import {ROLE_STUDENT} from '../../constant';
import {baseURL} from '../../config';
import styles from './TaskDetail.scss';
import {convertDateToString} from '../../utils/date-utils';

const TreeNode = Tree.TreeNode;

const TreeString = React.createClass({
    getInitialState() {
        const keys = this.props.keys;
        return{
            defaultSelectedKeys:keys,
            defaultCheckedKeys:keys,
        };
    },
    getDefaultProps:function(){
    return{
        keys:['0-0','0-1'],
        treenodes: []
        }
    },
    render() {
        var treestr = [];
        var treenodesstr = [];
        var commongroup = [];
        var customgroup = [];
        var len = this.props.treenodes.length;
        var commonlen = 0;
        var customlen = 0;

        for(var i=0; i < len; i++)
        {
            if(this.props.treenodes[i].groupType == "01")
            {
                commonlen++;
                commongroup.push(<TreeNode title={this.props.treenodes[i].groupName} key={"0-0-" + i} disableCheckbox />);
            }
        }

        for(var i=0; i < len; i++)
        {
            if(this.props.treenodes[i].groupType == "02")
            {
                customlen++;
                customgroup.push(<TreeNode title={this.props.treenodes[i].groupName} key={"0-1-" + i} disableCheckbox />);
            }
        }

        if(commonlen > 0) {treenodesstr.push(<TreeNode title="普通群组" key="0-0" disableCheckbox>{commongroup}</TreeNode>)}
        if(customlen > 0) {treenodesstr.push(<TreeNode title="定制群组" key="0-1" disableCheckbox>{customgroup}</TreeNode>)}

        treestr.push(<Tree showLine checkable defaultSelectedKeys={this.state.defaultSelectedKeys} defaultCheckedKeys={this.state.defaultCheckedKeys}>{treenodesstr}</Tree>);

        return (<div>{treestr}</div>);
    }
    })

const TaskDetail = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        const keys = this.props.keys;
        return{
            title: "",
            createTime :"",
            longdt:"",
            creatorusername:"",
            content:"",
            userId:"",
            selectedgrouparray:[],
        }
    },

    getDefaultProps() {
        return {
        };
    },
    componentWillMount() {
        //获取通知详情
        this.getTaskDetail(this.props.params.taskId , this.props.userInfo.userId);
    },

    groupTree(){
        return(
            <div><TreeString treenodes={this.state.selectedgrouparray} /></div>
        )
    },
    render(){
        return(
            <div>
                <div className={styles.mainHeader}>
                    <h2>{this.state.title}</h2>
                </div>

                <div className={styles.subHeader}>
                    <span className={styles.dateSpan}>创建时间： {this.state.createTime}</span>
                    <span className={styles.creatorSpan}>作者：{this.state.creatorusername}</span>
                </div>

                <div className={styles.rightActionItems}>
                    <Button className={styles.rightActionItem+" "+styles.commitButton} onClick={()=>{this.context.router.goBack()}}>返回</Button>
                </div>

                <div className={styles.viewContent}>
                    <div dangerouslySetInnerHTML={{__html:this.state.content}} ></div>
                    {this.groupTree()}
                </div>
            </div>
        );

    },

    getTaskDetail(taskId, userId){
        fetch(config.api.notify.showTaskUrl(taskId, userId), {
            method:'get',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken')
            }
        }).then(res => res.json()).then(task => {
            this.setState({
                title: task.title ,
                createTime:convertDateToString(task.createDt, "yyyy-MM-dd hh:mm") ,
                creatorusername:task.creatorUserName ,
                content: task.content ,
                selectedgrouparray:task.listGroup,
            })
        })

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

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail)