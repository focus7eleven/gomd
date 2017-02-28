/**
 * Created by cq on 2017/2/13.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Row,Col,Input,Button, Icon, Card, Table, Affix} from 'antd';


import config from '../../config';
import {ROLE_STUDENT} from '../../constant';
import styles from './ExamPaperReviseResult.scss';
import {QuestionModelLayout} from '../../components/answer_homework/QuestionModelLayout'
import {StudentModelLayout} from '../../components/answer_homework/StudentModelLayout'
import srcImg from 'images/homework/search.png';
const ExamPaperReviseResult = React.createClass({
	contextTypes: {
		router: React.PropTypes.object
    },
    getInitialState() {
        return {
            homeworkName:"",
            gradeName:"",
            subjectName:"",
            publishTime:"",
            questionList:[
                {type:"",content:"",options:[""]}
            ],
            buttonText: "学生模式",
        }
    },
	componentWillMount() {
		//获取批改详情
		this.checkResultByStu(this.props.params.homeworkClassId);
	},
    changeText(){
        if(this.state.buttonText == "题目模式") {
            this.checkResultByStu(this.props.params.homeworkClassId);
            this.setState({buttonText: "学生模式"});
        }
        else
        {
            this.checkResultByQuestion(this.props.params.homeworkClassId);
            this.setState({buttonText: "题目模式"});
        }
    },
    handleRowClicked: function(event) {
		console.log(event.target);
	},
	checkResultByQuestion(homeworkClassId) {
		fetch(config.api.homework.checkResultByQuestion(homeworkClassId),{
			method:'get',
			headers:{
				'from':'nodejs',
				'token':sessionStorage.getItem('accessToken')
			}
		}).then(res => res.json()).then(homework => {
          this.setState({
            homeworkId:homework.id,
            homeworkName: homework.name,
            gradeName:homework.gradeName,
            subjectName:homework.subjectName,
            createTime:homework.createTime,
            submitTime:homework.submitTime,
            publishTime:homework.submitTime,
            questionList:homework.questionExamPaperAndAnswerBaseList,
          });
		})
	},
    checkResultByStu(homeworkClassId) {
        fetch(config.api.homework.checkResultByStudents(homeworkClassId),{
            method:'get',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken')
            }
        }).then(res => res.json()).then(homework => {
            this.setState({
                homeworkId:homework.id,
                homeworkName: homework.name,
                stuExamPaperAndAnswerList:homework.stuExamPaperAndAnswerList,
                gradeName:homework.gradeName,
                subjectName:homework.subjectName,
                createTime:homework.createTime,
                submitTime:homework.submitTime,
                publishTime:homework.submitTime,
            });
        })
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
    render() {
        const { homeworkId,homeworkName, gradeName, subjectName, publishTime,createTime,submitTime, questionList, buttonText ,stuExamPaperAndAnswerList} = this.state;
        const columns = [
            {
            title: <Icon type="file-text" />,
                className: 'text-align:center',
            dataIndex: 'questiontype',
            key: 'questiontype',
            },
            {
            title: '答对',
            dataIndex: 'right',
            key: 'right',
            },
            {
            title: '答错',
            dataIndex: 'wrong',
            key: 'wrong',
            },
            {
            title: '未提交',
            dataIndex:'unsubmit',
            key: 'unsubmit',
            },
            {
                title: '未批改',
                dataIndex:'unrevise',
                key: 'unrevise',
            },
            {
                title: '正确率',
                dataIndex:'rightratio',
                key: 'rightratio',
            },
        ];
        const data = [];
	var studentJson = {
      "id":homeworkId,
      "name": homeworkName,
      "stuExamPaperAndAnswerList":stuExamPaperAndAnswerList,
        "createTime": createTime,
        "submitTime": publishTime,
        "subjectName": subjectName,
        "gradeName": gradeName,
    };
	var jasonData = {
        "id": homeworkId,
        "name": homeworkName,
        "questionExamPaperAndAnswerBaseList":questionList,
        "createTime": createTime,
        "submitTime": publishTime,
        "subjectName": subjectName,
        "gradeName": gradeName,
};
            var modelLayout = [];
			var rows = [];
			if (this.state.buttonText == "题目模式") {
				modelLayout.push(<QuestionModelLayout questions={jasonData.questionExamPaperAndAnswerBaseList} />);
			} else {
				modelLayout.push(<StudentModelLayout questions={studentJson.stuExamPaperAndAnswerList}/>);
			}
			for (let i = 0; i < data.length; i++) {
				rows.push(<tr onClick={this.handleRowClicked}>
							<td className={styles.numberTd}>{data[i].key}</td>
							<td className={styles.numberTd}>{data[i].right}</td>
							<td className={styles.numberTd}>{data[i].wrong}</td>
							<td className={styles.numberTd}>{data[i].unsubmit}</td>
							<td className={styles.numberTd}>{data[i].unrevise}</td>
							<td className={styles.numberTd}>{data[i].rightratio}</td>
						</tr>
				);
			}
        return (
            <div>
                <div className={styles.mainHeader}>
					<div style={{textAlign:'center'}}>
                        <img style={{ verticalAlign:'middle'}} src={srcImg}/>
						&nbsp;&nbsp;
                        <span className={styles.fontStyle}>查看批改结果</span>
					</div>
					<div className={styles.info} >
						<Button size="small" shape="circle" className={styles.infoRight}></Button>&nbsp;<span style={{verticalAlign:'middle'}}>正确</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button size="small" shape="circle" className={styles.infoWrong}></Button>&nbsp;<span style={{verticalAlign:'middle'}}>错误</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button size="small" shape="circle" className={styles.infoHalf}></Button>&nbsp;<span style={{verticalAlign:'middle'}}>半对</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button size="small" shape="circle" className={styles.infoUnsubmit}></Button>&nbsp;<span style={{verticalAlign:'middle'}}>未提交</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button size="small" shape="circle" className={styles.infoUnrevise}></Button>&nbsp;<span style={{verticalAlign:'middle'}}>未批改</span>
					</div>
                </div>

                <div className={styles.rightActionButtons}>
					<div><span style={{  fontWeight:'bold'}}><Icon type='appstore'/>作业名称:</span><span>{homeworkName}</span> <span style={{  fontWeight:'bold'}}><Icon type='appstore'/>学科:</span><span>{subjectName} </span>  <span style={{  fontWeight:'bold'}}><Icon type='appstore'/> 布置时间:</span><span>{publishTime}</span></div>
					<div>
						<Button className={styles.backButton} icon="swap" onClick={this.changeText}>{buttonText}</Button>
						<Button className={styles.backButton} icon="rollback" onClick={()=>{this.context.router.goBack()}}>返回</Button>
					</div>
                </div>
				{modelLayout}
            </div>
        );
    },

});

function mapStateToProps(state) {
    return {
    }
}
function mapDispatchToProps(dispatch) {
    return {
      // downloadAnswersheet:bindActionCreators(downloadAnswersheet,dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExamPaperReviseResult)



