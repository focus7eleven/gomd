/**
 * created by cq on 2017/2/21.
 */

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {Row,Col,Input,Button,Modal,Tree} from 'antd';

import config from '../../config';
import {ROLE_STUDENT} from '../../constant';
import {baseURL} from '../../config';
import styles from './EduInfoDetail.scss';
import {convertDateToString} from '../../utils/date-utils';

const EduInfoDetail = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return{
            title: "",
            createTime :"",
            creatorusername:"",
            content:"",

        }
    },

    getDefaultProps() {
        return {
        };
    },
    componentWillMount() {
        //获取资讯详情
        this.getEduInfoDetail(this.props.params.eduinfoId , this.props.userInfo.userId);
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
                    <Button className={styles.rightActionItem+" "+styles.backButton} onClick={()=>{this.context.router.goBack()}} icon="rollback">返回</Button>
                </div>

                <div className={styles.viewContent}>
                    <div dangerouslySetInnerHTML={{__html:this.state.content}} ></div>
                </div>
            </div>
        );

    },

    getEduInfoDetail(eduinfoId, userId){
        fetch(config.api.notify.showEduInfoUrl(eduinfoId, userId), {
            method:'get',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken')
            }
        }).then(res => res.json()).then(eduinfo => {
            this.setState({
                title: eduinfo.content.title ,
                createTime:eduinfo.content.createDate.substring(0,16) ,
                creatorusername:eduinfo.content.createUserName ,
                content: eduinfo.content.content ,
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

export default connect(mapStateToProps, mapDispatchToProps)(EduInfoDetail)