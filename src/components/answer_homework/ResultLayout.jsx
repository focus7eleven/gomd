import React from 'react';
import { Col, Row } from 'antd';
import styles from './Result.scss';

import {Result} from './Result'

export const ResultLayout = React.createClass({
	
  getInitialState() {
    return {
    };
  },
  getDefaultProps() {
    return {
    };
  },
  render() {
	  var testData = [{"id":"223210684245217280","name":"王胜","oneAnswer":"A","oneAnswerImgs":null,"oneAnswerImgs2":null,"examPaperStatus":0,"questionAnswers":[]},
					  {"id":"223210749848326144","name":"张华","oneAnswer":"B","oneAnswerImgs":null,"oneAnswerImgs2":null,"examPaperStatus":0,"questionAnswers":[]},
				      {"id":"223210832228651008","name":"孙立","oneAnswer":"C","oneAnswerImgs":null,"oneAnswerImgs2":null,"examPaperStatus":0,"questionAnswers":[]},
				      {"id":"223210915196178432","name":"李慧","oneAnswer":"D","oneAnswerImgs":null,"oneAnswerImgs2":null,"examPaperStatus":0,"questionAnswers":[]},
				      {"id":"228679245633818624","name":"张新","oneAnswer":"A","oneAnswerImgs":null,"oneAnswerImgs2":null,"examPaperStatus":0,"questionAnswers":[]},
				      {"id":"239532847868809216","name":"学生5","oneAnswer":"A","oneAnswerImgs":null,"oneAnswerImgs2":null,"examPaperStatus":0,"questionAnswers":[]},
				      {"id":"240674912598102016","name":"学生6","oneAnswer":"A","oneAnswerImgs":null,"oneAnswerImgs2":null,"examPaperStatus":0,"questionAnswers":[]}];
	  var cols = [];
	  testData.forEach(function(data){
					cols.push(
						<Col span="8">
							<Result title={data.name}  anwser={data.oneAnswer} score={data.examPaperStatus}></Result>
						</Col>
					);
	  });
	  
   return (  
	<div style={{ background: '#ECECEC', padding: '30px' }}>
		<Row type="flex" justify="space-between">{cols}</Row>
    </div>
   )
  },
});

