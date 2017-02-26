import React from 'react';
import {Tag,Table} from 'antd';

import styles from './StudentModeContentComponent.scss';
import {isChoiceQuestion,addHttpPrefix,addHttpPrefixToImageUrl,optionIndexName,QUESTION_TYPE_NAME,getReviseResult,getReviseTagColor} from '../answer_homework/util';
import {Picturewall} from '../answer_homework/Picturewall';
import {CommentQuestionComponent} from './CommentQuestionComponent';

export const StudentModeContentComponent = React.createClass({
    propTypes:{
        questionList:React.PropTypes.array.isRequired,
    },
    render() {
        const { questionList } = this.props;
        return (
            <div>
                {questionList.map(
                    (question,index) => {
                        const {right} = question;
                        return (
                            <div key={index} className={styles.questionContainer}>
                                {right == 0 || right == 1?this.renderQuestinAnswerResultView(question,false):
                                    this.renderQuestinAnswerResultView(question,true)}
                            </div>
                        )
                    }
                )}
            </div>
        );
    },
    renderQuestinAnswerResultView(question, editable) {
        const { index,type,content,options,drawZone,answer,right } = question;
        const columns = [
            {
                title: (index) + ".",
                className: styles.indexTd,
                render: (t, r) => {
                    if (r.option) {
                        //选项
                        if( (parseInt(answer) & Math.pow(2,r.optionIndex)) == Math.pow(2,r.optionIndex) ) {
                            return <Tag color="blue-inverse">{optionIndexName[r.optionIndex]}</Tag>;
                        }else {
                            return optionIndexName[r.optionIndex];
                        }

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
                        <div><Tag color={getReviseTagColor(right)}>{getReviseResult(right)}</Tag></div>
                    </div>
                ),
                render: (t, r) => {
                    if (r.option) {
                        //选项
                        return <span dangerouslySetInnerHTML={{__html: addHttpPrefix(r.content)}}></span>
                    } else if(r.drawZone) {
                        //作图区
                        return <span dangerouslySetInnerHTML={{__html: addHttpPrefix(r.content)}}></span>
                    } else {
                        //答题结果
                        if( editable ) {
                            return <CommentQuestionComponent totalScore={question.totalScore}
                                                             questionType={question.type}
                                                             answer={question.answer} />
                        } else {
                            const imageList = r.answer.split("|").map((image, i) => {
                                return {
                                    name: i + '.png',
                                    url: addHttpPrefixToImageUrl(image)
                                };
                            });
                            return (
                                <div>
                                    <Picturewall imageList={imageList}/>
                                </div>
                            );
                        }
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
        if( !isChoiceQuestion(type) ) {
            dataSource.push({"answer":answer,"tagName":"答题结果"}); //在线答题
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
    // renderCommentQuestionView(question) {
    //     const { index,type,content,drawZone,answer,totalScore } = question;
    //     return <CommentQuestionComponent answer={answer}
    //                                      questionType={type} totalScore={totalScore}/>;
    // },
});