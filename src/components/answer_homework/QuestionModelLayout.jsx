import React from 'react';
import { Col, Row, Card, Button, Table } from 'antd';
import styles from './QuestionModelLayout.scss';
import homeworkImg from 'images/homework/homework.png';
import splitLine from 'images/homework/splitLine.png';
import {QUESTION_TYPE_NAME, addHttpPrefix} from './util';

import {Result} from './Result'

export const QuestionModelLayout = React.createClass({
  
 getInitialState: function() {
    return {
		content: "<p></p>",
		initialIndex: 0,
		questionNum: 0,
		clickTableIndex:"1",
		optionName:['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
	};
 },
 getDefaultProps : function () {
    return {
      questions : []
    };
  },
  handleNextButtonClick() {
		console.log("click start");
		console.log(this.state.initialIndex);
		if (this.state.initialIndex + 1 >= this.props.questions.length) {
			this.setState({initialIndex:0,
				content: this.props.questions[0].examination,
				clickTableIndex:this.props.questions[0].index});
		} else {
			this.setState({initialIndex:this.state.initialIndex + 1,
				content: this.props.questions[this.state.initialIndex + 1].examination,
				clickTableIndex:this.props.questions[this.state.initialIndex + 1].index
			});
		}
	},
	handleLastButtonClick() {
		console.log("click start");
		console.log(this.state.initialIndex);
		if (this.state.initialIndex - 1 <= -1) {
			this.setState({initialIndex:0,
				content: this.props.questions[0].examination,
				clickTableIndex:this.props.questions[0].index});
		} else {
			this.setState({initialIndex:this.state.initialIndex - 1,
				content: this.props.questions[this.state.initialIndex - 1].examination,
				clickTableIndex:this.props.questions[this.state.initialIndex - 1].index
			});
		}
	},
  handleTableClick(index, key) {
	  console.log(index);
	  this.setState({clickTableIndex: index.key});
	  this.setState({initialIndex: index.key - 1});
	  console.log(this.state.clickTableIndex);
  },
  updateRowStyle(record) {
	 // console.log("update");
	 // console.log(record.key);
	 // console.log(this.state.clickTableIndex);
	  if ((record.key == this.state.clickTableIndex) || ((record.key == "1") && (record.key == this.state.clickTableIndex))) {
		return styles.tableClicked;
	  } else {
		return styles.tableUnClicked;
	  }
  },
  render() {
	  
	
	 const columns = [
            {
            title: (<div style={{textAlign:'center'}}>
				<img src={homeworkImg}/>
			</div>),
            dataIndex: 'questiontype',
            key: 'questiontype',
			fixed:'center',
            },
            {
            title: (<font color="#2EB880">答对</font>),
            dataIndex: 'right',
            key: 'right',
			className:styles.threadRight,
            },
            {
            title: (<font color="#2EB880">答错</font>),
            dataIndex: 'wrong',
            key: 'wrong',
			className:styles.threadRight,
            },
            {
            title: (<font color="#2EB880">未提交</font>),
            dataIndex:'unsubmit',
            key: 'unsubmit',
			className:styles.threadRight,
            },
            {
                title: (<font color="#2EB880">未批改</font>),
                dataIndex:'unrevise',
                key: 'unrevise',
				className:styles.threadRight,
            },
            {
                title: (<font color="#2EB880">正确率</font>),
                dataIndex:'rightratio',
                key: 'rightratio',
				className:styles.threadRight,
            },
        ];
	var data = [];
	var questions = this.props.questions;
  
	var cols = [];
	var rows = [];
	 // var content =  questions[0].examination;
	  //questions.forEach(function(question){
	for (let i = 0; i < questions.length; i++) {
		var questionType = questions[i].type;
		var questionTypeName = "";
		let j = i + 1;
		if (questionType == '01') {
			questionTypeName = j + ' (单选题)';
		} else if (questionType == '02') {
			questionTypeName = j + ' (判断题)';
		} else if (questionType == '03') {
			questionTypeName = j + ' (多选题)';
		} else if (questionType == '04') {
			questionTypeName = j +' (填空题)';
		} else if (questionType == '05') {
			questionTypeName = j + ' (简答题)';
		} else if (questionType == '06') {
			questionTypeName = j + ' (作文题)';
		} else if (questionType == '07') {
			questionTypeName = j + ' (英语作文题)';
		} else {
			questionTypeName = i + '';
		}
		
		 var result = {
            key: questions[i].index,
            questiontype: questionTypeName,
            right: questions[i].correctCount,
            wrong: questions[i].answerCount - questions[i].correctCount,
            unsubmit: 0,
            unrevise: 0,
            rightratio: questions[i].correctRate

        }
		data.push(result);	
	}
	var colCount = 0;
	var questionContent =  questions[this.state.initialIndex].questionContent;
	if (questionContent == null) {
		questionContent = "<p> no question </p>";
	}
	var optionContent = [];
	var questionType = questions[this.state.initialIndex].type;
	if (questionType == '01' || questionType == '02' || questionType == '03') {
		colCount = 24 / 6;
		var options = questions[this.state.initialIndex].optionsWithKey;
		for (let i = 0; i < options.length; i++) {
			optionContent.push(<div style={{ display:'flex'}}>
			<span>{this.state.optionName[i] + ". "}</span><span dangerouslySetInnerHTML={{__html: addHttpPrefix(options[i].optionContent)}}></span></div>);
		}
		
	} else {
		colCount = 24;
	}
	var anwserList = questions[this.state.initialIndex].questionExamPaperStuAnswerList;
	  if (anwserList != null && anwserList != undefined) {
		  for (let i = 0; i < anwserList.length;i++) {
			  cols.push(
				  <Col span={colCount}>
					  <Result questionType={questionType} result={anwserList[i]}></Result>
				  </Col>
			  );
		  }
	  }

	
   return (  
   
	<div style={{ padding: '0px' }}>
		<Row>
			<Col span={8}>
				<div>
					 <Table
						pagination={false}
						columns={columns}
						dataSource={data}
						onRowClick={this.handleTableClick}
						rowClassName={(record, index) =>this.updateRowStyle(record)}
						bordered
					/>
				</div>
            </Col>
            <Col span={16} style={{ left:'8px'}}>
				<Card style={{width:'98%',left:'0px'}} title="题目" >
					<div dangerouslySetInnerHTML={{__html: addHttpPrefix(questionContent)}}>
					</div>
					{optionContent}
				</Card>
				<br/>
				<img src={splitLine}/>
				<Row gutter={16}>{cols}</Row>
				<div className={styles.nextActionButtons}>
					<Button type='primary' style={this.state.initialIndex <= 0 ?{display:'none'}:{marginLeft:'20px'}} onClick={this.handleLastButtonClick}>上一题</Button>
					<Button type='primary' style={this.state.initialIndex + 1 >= this.props.questions.length ?{display:'none'}:{marginLeft:'20px'}} onClick={this.handleNextButtonClick}>下一题</Button>
				</div>
			</Col>
        </Row>

    </div>
	
   )
  },
});

