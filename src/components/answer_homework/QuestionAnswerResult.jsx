import React from 'react';
import {Tag,Table} from 'antd';

import styles from './AnswerHomeworkComponent.scss';
import {Picturewall} from './Picturewall';
import {QUESTION_TYPE_NAME,optionIndexName,addHttpPrefix,addHttpPrefixToImageUrl,getReviseResult,getReviseTagColor,getChoiceAnswerString,isChoiceQuestion} from './util';
import {baseURL} from '../../config';

export const QuestionAnswerResult = React.createClass({
    propTypes: {
        index: React.PropTypes.number.isRequired,
        type: React.PropTypes.string.isRequired,
        drawZone:React.PropTypes.string,
        content:React.PropTypes.string.isRequired,
        options:React.PropTypes.arrayOf(React.PropTypes.string),
        correctAnswer:React.PropTypes.string,
        answer:React.PropTypes.arrayOf(React.PropTypes.object), //答题结果 [{answer:"",right:0},{answer:"",right:0}]
    },
    render() {
        const { index,type,content,options,drawZone,correctAnswer,answer } = this.props;
        const columns = [
            {
                title: (index + 1) + ".",
                className: styles.indexTd,
                render: (t, r) => {
                    if (r.option) {
                        //选项
                        return optionIndexName[r.optionIndex];
                    } else {
                        //其他，作图区，答案==
                        return null;
                    }
                }
            },
            {
                title: (
                    <div className={styles.questionContent}>
                        <div dangerouslySetInnerHTML={{__html: addHttpPrefix(content)}}></div>
                        {this.renderResultTag(answer)}
                    </div>
                ),
                render: (t, r) => {
                    if (r.option) {
                        //选项
                        return <span dangerouslySetInnerHTML={{__html: addHttpPrefix(r.content)}}></span>
                    } else if(r.drawZone) {
                        //作图区
                        return <span dangerouslySetInnerHTML={{__html: addHttpPrefix(r.content)}}></span>
                    } else if(r.correctAnswer) {
                        //标准答案
                        return (
                            <div>
                                <Tag color="yellow-inverse">{r.tagName}</Tag>
                                <span dangerouslySetInnerHTML={{__html: addHttpPrefix(r.content)}}></span>
                            </div>
                        );
                    } else {
                        //答题结果
                        return (
                            <div>
                                <Tag color="yellow-inverse">{r.tagName}</Tag>
                                {isChoiceQuestion(type)?this.renderChoiceAnswer(r.answer):this.renderSubjectAnswer(r.answer)}
                            </div>
                        );
                    }
                }
            }
        ];
        let dataSource = [];
        if( options && isChoiceQuestion(type) ) {
            for( let i = 0; i < options.length; i++ ) {
                dataSource.push({"option":true,"optionIndex":i,"content":options[i]});
            }
        }
        if( drawZone && drawZone.length > 0 ) {
            dataSource.push({"drawZone":true,"content":drawZone});
        }
        dataSource.push({"answer":answer[0].answer,"tagName":"答题结果"}); //在线答题
        if( answer.length > 1 ) {
            dataSource.push({"answer":answer[1].answer,"tagName":"订正结果"}); //在线订正
        }
        if( (answer.length > 1 || answer[0].right == 1) && correctAnswer ) {
            dataSource.push({"content":correctAnswer,"tagName":"标准答案","correctAnswer":true}); //标准答案
        }
        dataSource = dataSource.map(
            (v, i) =>{
                return {...v,index:i.toString()};
            }
        );
        return (
            <div>
                <Tag className={styles.tag}>{QUESTION_TYPE_NAME[type]}</Tag>
                <Table bordered={true} columns={columns} dataSource={dataSource} pagination={false}
                       rowKey={(record) => {return record.index}}></Table>
            </div>
        );
    },
    renderResultTag(results) {
        return (
          <div>
              <Tag color={getReviseTagColor(results[0].right)}>答题:{getReviseResult(results[0].right)}</Tag>
              {results.length>1?<Tag color={getReviseTagColor(results[1].right)}>订正:{getReviseResult(results[1].right)}</Tag>:
                  <Tag color={getReviseTagColor(-1)}>订正:未订正</Tag>}
          </div>
        );
    },
    renderChoiceAnswer(answer) {
      const value = getChoiceAnswerString(answer);
        return <span>{value}</span>;
    },
    renderSubjectAnswer(answer) {
        const imageList = answer.split("|").map((image, i) => {
            return {
                name: i + '.png',
                url: addHttpPrefixToImageUrl(image)
            };
        });
        return <Picturewall imageList={imageList}/>;
    }
});