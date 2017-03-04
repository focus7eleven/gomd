import React from 'react'
import {fromJS} from 'immutable'
import styles from './ChoiceQuestion.scss'
import {Table, Radio, Checkbox} from 'antd'
import {addHttpPrefix,isChoiceQuestion} from '../../../answer_homework/util';

const ChoiceQuestion = React.createClass({
    getDefaultProps(){
        return {
            questionInfo: fromJS({})
        }
    },
    getTableData(){
        const questionType = this.props.questionInfo.get('kind')
        let selectComponent = null
        switch (questionType) {
            case '01'://单选
                selectComponent = (record) => (<Radio checked={record.isAnswer}></Radio>)
                break;
            case '02'://判断
                selectComponent = (record) => (<Radio checked={record.isAnswer}></Radio>)
                break;
            case '03'://多选
                selectComponent = (record) => (<Checkbox checked={record.isAnswer}/>)
                break;
            default:
                selectComponent = () => null
        }
        const tableHeader = [{
            title: this.props.questionInfo.get('questionNo'),
            key: 'num',
            className: styles.columnsNo,
            width: 50,
            render: (text, record) => {
                if (record.isOption) { //选项
                    return selectComponent(record);
                } else {
                    //作图区
                }
            }
        }, {
            title: this.renderQuestion(),
            dataIndex: 'answer',
            key: 'answer',
            render: (text, record) => {
                return (
                    <div className={styles.question}>
                        <span dangerouslySetInnerHTML={{__html: addHttpPrefix(text) || '请输入选项内容'}}></span>
                    </div>
                )
            }
        }]
        let tableBody = [];
        if( isChoiceQuestion ) {
            tableBody = tableBody.concat(this.props.questionInfo.get('optionPojoList').map((v, k) => ({
                isOption:true,
                answer: v.get('content'),
                isAnswer: v.get('answer'),
                key: k,
            })).toJS());
        } else {

        }
        return {
            tableHeader,
            tableBody,
        }
    },
    renderQuestion(){
        return (
            <span dangerouslySetInnerHTML={{__html: addHttpPrefix(this.props.questionInfo.get('examination')) || '请输入题目内容'}}></span>
        )
    },
    render(){
        const tableData = this.getTableData()
        let questionTypeName = ''
        switch (this.props.questionInfo.get('kind')) {
            case '01':
                questionTypeName = '单选题'
                break;
            case '02':
                questionTypeName = '判断题'
                break;
            case '03':
                questionTypeName = '多选题'
                break;
            case '04':
                questionTypeName = '填空题'
                break;
            case '05':
                questionTypeName = '简答（计算题）'
                break;
            case '05':
                questionTypeName = '语文作文'
                break;
            case '07':
                questionTypeName = '英语作文'
                break;
            default:
                questionTypeName = ''
        }
        return (
            <div className={styles.container}>
                <div className={styles.tag}>
                    {questionTypeName}
                </div>
                <Table bordered dataSource={tableData.tableBody} columns={tableData.tableHeader} pagination={false}/>
            </div>
        )
    }
})

export default ChoiceQuestion
