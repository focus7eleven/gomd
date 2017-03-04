import React from 'react'
import {Select} from 'antd'
import styles from './CreateExampaperFilter.scss'
import config from '../../config'
import {getSubject, getGrade, setExamInfo, getVersion} from './utils'
import {fromJS} from 'immutable'

const Option = Select.Option;

const CreateExampaperFilter = React.createClass({
    getDefaultProps(){
        return {
            examId: '',
            name: '',
        }
    },
    componentWillMount(){
        getSubject().then(res => {
            this.setState({
                subjects: fromJS(res)
            })
        })
        getGrade({
            subjectId: this.props.subjectOption
        }).then(res => {
            this.setState({
                grade: fromJS(res)
            })
        })
        getVersion().then(res => {
            this.setState({
                version: fromJS(res)
            })
        })
    },

    componentWillReceiveProps(nextProps){
        if( this.props.subjectOption != nextProps.subjectOption ) {
            getGrade({
                subjectId: nextProps.subjectOption
            }).then(res => {
                this.setState({
                    grade: fromJS(res)
                })
            })
        }
    },

    getInitialState(){
        return {
            subjects: [],
            grade: [],
            version: [],
        }
    },
    getData(){
        return {
            subjectId: this.props.subjectOption,
            gradeId: this.props.gradeOption,
            termId: this.props.termOption,
            versionId: this.props.versionOption,
        }
    },
    handleUpdateSelect(obj) {
        const {subjectOption,gradeOption,termOption,versionOption} = this.props;
        const selectData = {
            subjectId:subjectOption,
            gradeId:gradeOption,
            term:termOption,
            version:versionOption,
            ...obj
        };
        this.props.updateSelect(selectData);
    },
//改变年级
    handleGradeChange(value){
        this.handleUpdateSelect({gradeId:value});
    },
    //改变版本
    handleVersionChange(value){
        this.handleUpdateSelect({version:value});
    },
//改变学期
    handleTermChange(value){
        this.handleUpdateSelect({term:value});
    },
//改变学科
    handleSubjectChange(value){
        this.handleUpdateSelect({subjectId:value});
    },

    render(){
        const {subjects, grade, version} = this.state;
        const {subjectOption,gradeOption,termOption,versionOption} = this.props;
        return (
            <div className={styles.container}>
                <Select value={subjectOption} style={{marginLeft: 20, width: 150}} onChange={this.handleSubjectChange}>
                    <Option value="">选择学科</Option>
                    {
                        subjects.map((item, index) => {
                            return <Option value={item.get('subject_id')}
                                           key={index}>{item.get('subject_name')}</Option>
                        })
                    }
                </Select>
                <Select value={versionOption} style={{marginLeft: 20, width: 150}} onChange={this.handleVersionChange}>
                    <Option value="">选择版本</Option>
                    {
                        version.map((item, index) => {
                            return <Option value={item.get('id')} key={index}>{item.get('text')}</Option>
                        })
                    }
                </Select>
                <Select value={gradeOption} style={{marginLeft: 20, width: 150}} onChange={this.handleGradeChange}>
                    <Option value="">选择年级</Option>
                    {
                        grade.map((item, index) => {
                            return <Option value={item.get('gradeId')} key={index}>{item.get('gradeName')}</Option>
                        })
                    }
                </Select>
                <Select value={termOption} style={{marginLeft: 20, width: 150}} onChange={this.handleTermChange}>
                    <Option value="">选择学期</Option>
                    <Option value="上学期">上学期</Option>
                    <Option value="下学期">下学期</Option>
                </Select>

            </div>
        )
    }
})

export default CreateExampaperFilter
