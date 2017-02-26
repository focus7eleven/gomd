import React from 'react';
import {Card} from 'antd';
import {baseURL} from '../../config'
import styles from './Result.scss';

export const Result = React.createClass({
	
  getInitialState() {
    return {
      result:{},
	  questionType:"01",
    };
  },
  getDefaultProps() {
    return {
    };
  },
  render() {
	var studentInfo = this.props.result.stuName + " " + this.props.result.stuNum;
	var ResultInfo = this.props.result.right;
	var questionType = this.props.questionType;
	
	var answer = this.props.result.answer;
	if (answer == null) {
		answer = " ";
	}
	var score = '3';
	
	var style;
	var headerStyle;
	if (ResultInfo == null) {
		score = "未提交";
		style = styles.unSubmit;
		headerStyle = styles.headerUnSumit;
	} else if (ResultInfo == -1) {
		style = styles.unRevise;	
		headerStyle = styles.headerUnRevise;
	} else if (ResultInfo == 0) {
		style = styles.wrong;
		
		headerStyle = styles.headerWrong;
	} else if (ResultInfo == 1) {
		style = styles.right;	
		headerStyle = styles.headerRight;
	} else {
		style = styles.right;
		headerStyle = styles.headerRight;
	}
	var imageSrcs = [];
	var answerCompent = [];
	
	if (ResultInfo != null) {
		if ((questionType != '01') && (questionType != '02') && (questionType != '03')) {
			imageSrcs = answer.split("|");
			for (let i = 0; i < imageSrcs.length; i++) {
				let url = baseURL+'/'+imageSrcs[i];
				answerCompent.push(<img src={url} className={styles.img}/>);
			}
		}	
		else {
			answerCompent.push(<p style={{textAlign:'center'}}>{answer}</p>);
		}
	}
	
	
	return (  
		<div className={style}>
			<div className={headerStyle}><p style={{textAlign:'center'}}>{studentInfo}</p></div>
			<div className={styles.body}>
				<div className={styles.anwser}>{answerCompent}</div>
				<div className={styles.score}><p>得分</p><p style={{textAlign:'right'}}>{score}</p></div>
			</div>		
		</div>
   )
  },
});

