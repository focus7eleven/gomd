import React from 'react'
import {getExampaperInfo} from '../../components/table/exampaper/exampaper-utils'
import styles from './DisplayExampaper.scss'
import {fromJS} from 'immutable'
import ChoiceQuestion from '../../components/table/exampaper/display/ChoiceQuestion'
import {Button} from 'antd'
const DisplayExampaper = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        return {
            exampaperInfo: fromJS({}),
            exerciseList: fromJS([]),
            examPaperId: '',
        }
    },
    componentDidMount(){
        /*getExistExamInfo(this.context.router.params.examId).then(res => {
         this.setState({

         exerciseList:fromJS(res)
         })
         })*/
        getExampaperInfo(this.context.router.params.examId).then(res => {
            this.setState({
                examPaperId: this.context.router.params.examId,
                exerciseList: fromJS(res.wordQuestions),
                exampaperInfo: fromJS(res.examPaperInfo)
            })
        })
    },
    handleGoBack(){
        this.context.router.goBack();
    },
    render(){
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.wrapper}>
                        <div className={styles.exampaperName}>{this.state.exampaperInfo.get('name')}</div>
                        <div className={styles.exampaperInfo}>
                            <span>{`${this.state.exampaperInfo.get('subject_name') || ''}（${this.state.exampaperInfo.get('versionName') || '----'}）`}&nbsp;&nbsp;
                                |&nbsp;&nbsp;</span>
                            <span>{`${this.state.exampaperInfo.get('gradeName') || ''}（${this.state.exampaperInfo.get('term')}）`}&nbsp;&nbsp;
                                |&nbsp;&nbsp;</span>
                            <span>创建时间：{this.state.exampaperInfo.get('uploadTime') || '----'}</span>
                        </div>
                    </div>
                    <Button type='primary' onClick={this.handleGoBack}>返回</Button>
                </div>
                <div className={styles.body}>
                    {
                        this.state.exerciseList.map((v, k) => {
                            if (v.get('kind') == '01' || v.get('kind') == '02' || v.get('kind') == '03') {
                                //单选
                                return <ChoiceQuestion questionInfo={v} key={k}/>
                            } else if (v.get('kind') == '04') {
                                //填空
                                return <ChoiceQuestion questionInfo={v} key={k}/>;
                            } else if (v.get('kind') == '05' || v.get('kind') == '06' || v.get('kind') == '07') {
                                //简答题
                                return <ChoiceQuestion questionInfo={v} key={k}/>;
                            } else if (v.get('kind') == '08') {
                                //title
                                return null;
                            } else if (v.get('kind') == '09') {
                                //嵌套题
                                return null;
                            } else {
                                return null
                            }
                        })
                    }
                </div>
            </div>
        )
    }
})

export default DisplayExampaper
