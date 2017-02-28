import React from 'react';
import { Col, Row, Card, Button, Table,Tag, Collapse} from 'antd';
import styles from './StudentModelLayout.scss';
import studentImg from 'images/homework/student.png';
import correctRadio from 'images/homework/correctRadio.png';
import unCorrectRadio from 'images/homework/unCorrectRadio.png';
import correct from 'images/homework/correct.png';
import wrongAnswer from 'images/homework/wrongAnswer.png';
import correctAnswerButton from 'images/homework/correctAnswerButton.png';
import answerResultButton from 'images/homework/answerResultButton.png';
import half from 'images/homework/half.png';
import vritualLine from 'images/homework/vritalLine.png';

import {QUESTION_TYPE_NAME, addHttpPrefix} from './util';
import {optionIndexName, getChoiceAnswerString} from './util';

import {baseURL} from '../../config'
import {Result} from './Result'

const Panel = Collapse.Panel;
export const StudentModelLayout = React.createClass({
 getInitialState: function() {
    return {
		content: "<p></p>",
		initialIndex: 0,
		questionNum: 0,
		clickTableIndex:0,
		anwsers:[],
		optionName:['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
	};
 },
 getDefaultProps : function () {
    return {
      questions : []
    };
  },
	handleLastButtonClick() {
		if (this.state.initialIndex <= 0) {
			this.setState({initialIndex:0,
				anwsers:this.props.questions[0].questionsWithKey,
				clickTableIndex:0
			});
		} else {
			this.setState({initialIndex:this.state.initialIndex - 1,
				clickTableIndex:this.state.initialIndex - 1,
				anwsers:this.props.questions[this.state.initialIndex - 1].questionsWithKey,
			});
		}

	},
  handleNextButtonClick() {
	console.log(this.props.questions.length);
	if (this.state.initialIndex + 1 >= this.props.questions.length) {
		this.setState({initialIndex:0,
		               anwsers:this.props.questions[0].questionsWithKey,
					   clickTableIndex:0
		});
	} else {
		this.setState({initialIndex:this.state.initialIndex + 1,
					   clickTableIndex:this.state.initialIndex + 1,
					   anwsers:this.props.questions[this.state.initialIndex + 1].questionsWithKey,					   
		});
	} 

  },
  handleTableClick(record, key) {
	  this.setState({clickTableIndex: record.key,
					 anwsers:this.props.questions[record.key].questionsWithKey});
  },
  updateRowStyle(record) {
	if ((record.key == this.state.clickTableIndex) || ((record.key == "1") && (record.key == this.state.clickTableIndex))) {
		return styles.tableClicked;
	  } else {
		return styles.tableUnClicked;
	  }
  },

  render() {
	  
	 var colCount = 24 / 4 ;
	  const optionState = ['A','B','C','D','E','F','G',
	  						'H','I','G','K','L','M','N',
	  						'O','P','Q','R','S','T',
	  						'U','V','W','X','Y','Z'];
	 const columns = [
            {
            title: (
				<div style={{textAlign:'center'}}>
					<img src={studentImg}/>
				</div>
			),
            dataIndex: 'name',
            key: 'name',
            },
            {
            title: (<font color="#2EB880">状态</font>),
            dataIndex: 'submitStatus',
            key: 'submitStatus',
			className:styles.threadCenter,
            },
            {
            title: (<font color="#2EB880">正确率</font>),
            dataIndex:'correctRate',
            key: 'correctRate',
			className:styles.threadRight,
            }
        ];
	var data = [];
	var questions = this.props.questions;
   // console.log(questions);
	var cols = [];
	var rows = [];
	 // var content =  questions[0].examination;
	  //questions.forEach(function(question){
	for (let i = 0; i < questions.length; i++) {
		 var status = (questions[i].submitStatus == null)? "未提交": "已提交";
		 console.log(status);
		 var result = {
            name: questions[i].stuName + (questions[i].stuNum !=null ? '('+questions[i].stuNum+')':'') ,
            submitStatus: status,
            correctRate: questions[i].correctRate,
			key: i
        }
		data.push(result);	
	}
	var finalResult = [];
	var anwsers = this.state.anwsers;
    let collapseBack = '#ffeae9';

	for (let i = 0; i < anwsers.length; i++) {
		let questionType = anwsers[i].type;
		var correctAnswer = '';
		var optionContent = [];
		var question = anwsers[i].questionContent;
		var questionTypeName ='';
		var answer = anwsers[i].answer;
		var score = anwsers[i].right;
		var correctRate = '99.98%';
		var panelText = '';
		var collapseImg = correct;

		var totalScore = 2;
		var getScore = 2;
		if (questionType == '01') {
			questionTypeName = '单选题';
		} else if (questionType == '02') {
			questionTypeName = '判断题';
		} else if (questionType == '03') {
			questionTypeName = '多选题';
		} else if (questionType == '04') {
			questionTypeName = '填空题';
		} else if (questionType == '05') {
			questionTypeName = '简答题';
		} else if (questionType == '06') {
			questionTypeName = '作文题';
		} else if (questionType == '07') {
			questionTypeName = '英语作文题';
		} else {
			questionTypeName = '';
		}
		
		var answerCompent = [];
		
		var imageSrcs = [];

		if (score == 0) {
			collapseImg = wrongAnswer;
			collapseBack = '#ffeae9';
		} else if (score == 1) {
			collapseImg = correct;
			collapseBack = "#e7f9f2"
		} else if (score == -1) {
			collapseImg = half;
			collapseBack = '#fdf7e0';
		}
		if (questionType == '01' || questionType == '02' || questionType == '03') {
			answer = getChoiceAnswerString(answer);
			var options = anwsers[i].optionsWithKey;
			for (let i = 0; i < options.length; i++) {
				if (options[i].isAnswer == 1)
					correctAnswer += optionState[i] + ',';
				var result= {
					questiontype:(<div key={i}>
						<img src={unCorrectRadio}/>&nbsp;{optionState[i]  +  '.'}
					</div>),
					option:(<span dangerouslySetInnerHTML={{__html: addHttpPrefix(options[i].optionContent)}}></span>),
				}
				if ( options[i].isAnswer == 1) {
					result= {
						questiontype:(<div>
							<img src={correctRadio}/>&nbsp;{optionState[i] +  '.'}
						</div>),
						option:(<span dangerouslySetInnerHTML={{__html: addHttpPrefix(options[i].optionContent)}}></span>),
					}
				}
					optionContent.push(result);
				//optionContent.push(<div style={{ display:'flex'}}>
				//<span>{this.state.optionName[i] + ". "}</span><span dangerouslySetInnerHTML={{__html: addHttpPrefix(options[i].optionContent)}}></span></div>);
			}
			if (correctAnswer == '')
				correctAnswer = '略';
			else {
				correctAnswer = correctAnswer.substr(0, correctAnswer.length - 1);
			}
		} else {
			imageSrcs = answer.split("|");
			for (let i = 0; i < imageSrcs.length; i++) {
				let url = baseURL+'/'+imageSrcs[i];
				answerCompent.push(<img src={url} className={styles.answerImage} />);
			}
			var options = anwsers[i].optionsWithKey;
			if (options != null && options != undefined && options.length > 0) {
				for (let i = 0; i < options.length; i++) {
					correctAnswer += options[i].optionContent + ",";
					//optionContent.push(<div style={{ display:'flex'}}>
					//<span>{this.state.optionName[i] + ". "}</span><span dangerouslySetInnerHTML={{__html: addHttpPrefix(options[i].optionContent)}}></span></div>);
				}
			}

			if (correctAnswer == '')
				correctAnswer = '略';
			else {
				correctAnswer = correctAnswer.substr(0, correctAnswer.length - 1);
			}
		}
		let columns=[
		{
			title:i + 1 + '.',
			dataIndex: 'questiontype',
			key: 'questiontype',
			width:'10%',

		},
		{
			title: (<span dangerouslySetInnerHTML={{__html: addHttpPrefix(question)}}></span>),
			dataIndex: 'option',
			key: 'option',
			width:'90%',
		}
		];

		if (questionType == '01' || questionType == '02' || questionType == '03') {
			finalResult.push(<div style={{marginTop:10}}>
				<Tag className={styles.tagFont}><span >{questionTypeName}</span></Tag>

				<Table
					pagination={false}
					columns={columns}
					dataSource={optionContent}
					bordered
				/>
				<Collapse accordion>
					<Panel
						header={<div style={{background:collapseBack}}><img src={collapseImg} style={{verticalAlign:'middle'}}/>&nbsp;&nbsp;&nbsp;<span style={{fontSize:15,verticalAlign:'middle'}}>本题班级正确率为<font color="red">{correctRate}</font>；得分:<font color="red">{getScore}</font>分(满分<font color="red">{totalScore}</font>分)</span></div>}>
						<img src={answerResultButton} style={{verticalAlign:'middle'}}/> &nbsp;&nbsp;<font style={{fontSize:15,verticalAlign:'middle'}}><span dangerouslySetInnerHTML={{__html: addHttpPrefix(answer)}}></span></font>
						<br/>
						<img src={vritualLine}/>
						<br/>
						<br/>
						<img src={correctAnswerButton} style={{verticalAlign:'middle'}}/> &nbsp;&nbsp;<font style={{fontSize:15,verticalAlign:'middle'}}><span dangerouslySetInnerHTML={{__html: addHttpPrefix(correctAnswer)}}></span></font>
					</Panel >
				</Collapse>
			</div>);
		} else {
			let optionContent= [{
				questiontype:'',
				option:'',
			}]
			let emptyText = {emptyText:''};
			finalResult.push(<div style={{marginTop:10}}>
				<Tag className={styles.tagFont}><span >{questionTypeName}</span></Tag>
				<Table
					pagination={false}
					columns={columns}
					dataSource={optionContent}
					locale={emptyText}
					rowClassName={(record,key)=>{return styles.hiddenTableRow}}
					bordered
				/>
				<Collapse accordion>
					<Panel
						header={<div style={{background:{collapseBack}}}><img src={collapseImg}/>&nbsp;&nbsp;&nbsp;<span style={{fontSize:15}}>本题班级正确率为<font color="red">{correctRate}</font>；得分:<font color="red">{getScore}</font>分(满分<font color="red">{totalScore}</font>分)</span></div>}>
						<img src={answerResultButton}/> &nbsp;&nbsp;{answerCompent}
						<br/>
						<img src={vritualLine}/>
						<br/>
						<br/>
						<img src={correctAnswerButton}/> &nbsp;&nbsp;<font style={{fontSize:15}}><span dangerouslySetInnerHTML={{__html: addHttpPrefix(correctAnswer)}}></span></font>
					</Panel >
				</Collapse>
			</div>);
		}
	}

	if (finalResult.length == 0)  {
		finalResult.push(<div>
			<span style={{fontSize:15,color:'#FF0000'}}>学生未提交作业，没有数据！</span>
		</div>);
	}
	console.log(finalResult);
	
	
   return (  
   
	<div style={{ padding: '0px' }}>
		<Row>
			<Col span={8}>
				<div>
					 <Table
						pagination={false}
						columns={columns}
						dataSource={data}
						size="middle"
						onRowClick={this.handleTableClick}
						rowClassName={(record, index) =>this.updateRowStyle(record)}
						bordered
					/>
				</div>
				
            </Col>
			<Col span={16} style={{ left: '8px' }}>
				{finalResult}
			</Col>
        </Row>
		<div className={styles.nextActionButtons}>
			<Button type='primary' style={this.state.initialIndex <= 0 ?{display:'none'}:{marginLeft:'20px'}} onClick={this.handleLastButtonClick}>上一个学生</Button>
			<Button type='primary' style={this.state.initialIndex + 1 >= this.props.questions.length ?{display:'none'}:{marginLeft:'20px'}} onClick={this.handleNextButtonClick}>下一个学生</Button>
		</div>
    </div>
	
   )
  },
});

