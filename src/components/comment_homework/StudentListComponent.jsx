import React from 'react';
import {Icon} from 'antd';

import styles from './ListComponent.scss'

export const StudentListComponent = React.createClass({
    propTypes: {
        studentList:React.PropTypes.array.isRequired, // [{name:张三},...]
        selectedStudentIndex:React.PropTypes.number.isRequired,
        onClick:React.PropTypes.func.isRequired,
    },
    render() {
        const {studentList, selectedStudentIndex} = this.props;
        return (
            <div>
                <div className={styles.header}>
                    <Icon type="solution" />
                </div>
                <div className={styles.listItems}>
                    {studentList.map(
                        (student, index) => {
                            return (
                                <div key={index}
                                     className={selectedStudentIndex == index ? styles.listItem2 : styles.listItem}
                                     onClick={() => {
                                         this.props.onClick(index)
                                     }}>
                                    {student.studentName}
                                </div>
                            )
                        }
                    )}
                </div>
            </div>
        )
    }
});