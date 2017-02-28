import React from 'react';
import {Tag, Table} from 'antd';

import styles from './AnswerHomeworkComponent.scss';
import {Picturewall} from './Picturewall';
import {baseURL} from '../../config';
import {QUESTION_TYPE_NAME, addHttpPrefix, addHttpPrefixToImageUrl, QUESTION_TYPE_FILL_IN_BLANK} from './util';

export const SubjectiveQuestion = React.createClass({
    propTypes: {
        index: React.PropTypes.number.isRequired,
        type: React.PropTypes.string.isRequired,
        content: React.PropTypes.string.isRequired,
        drawZone: React.PropTypes.string,
        answer: React.PropTypes.string,
        handleUpload: React.PropTypes.func.isRequired,
        handleRemove: React.PropTypes.func,
    },

    getInitialState() {
        return {};
    },
    getDefaultProps() {
        return {};
    },
    render() {
        const {index, content, drawZone, answer, type} = this.props;

        const columns = [{
            title: (index + 1) + ".",
            dataIndex: 'index',
            className: styles.indexTd,
            render: () => {
                return ""
            }
        }, {
            title: <span dangerouslySetInnerHTML={{__html: addHttpPrefix(content)}}></span>,
            render: (t, r) => {
                if( r.index == 1 ) {
                    //答案区
                    let imageList = [];
                    if (answer && answer.length > 0) {
                        imageList = answer.split("|").map((image, i) => {
                            return {
                                name: i + '.png',
                                url: addHttpPrefixToImageUrl(image)
                            };
                        });
                    }
                    return (
                        <Picturewall
                            imageList={imageList}
                            onUpload={(files) => {
                                this.handleUpload(files)
                            }}
                            onRemove={this.props.handleRemove ? (i) => this.props.handleRemove(i) : null}
                            message={type == QUESTION_TYPE_FILL_IN_BLANK ? "所有的填空题共享同一份答案" : null}
                        />
                    )
                } else {
                    //作图区
                    return <span dangerouslySetInnerHTML={{__html: addHttpPrefix(drawZone)}}></span>
                }

            }
        }];
        let dataSource = [];
        if( drawZone ) {
            dataSource.push({"index": 0, "answer": drawZone});
        }
        dataSource.push({"index": 1, "answer": answer});


        return (
            <div>
                <Tag className={styles.tag}>{QUESTION_TYPE_NAME[type]}</Tag>
                <Table bordered={true} columns={columns} dataSource={dataSource} pagination={false}
                       rowKey={(record) => record.index}></Table>
            </div>
        );
    },
    handleUpload(files) {
        this.props.handleUpload(files);
    },
});