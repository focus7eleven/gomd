import React from 'react';
import {Button, Icon, Modal, Row, Col, Card} from 'antd';

import styles from './Picturewall.scss';

const CustomCard = React.createClass({
    propTypes: {
        url: React.PropTypes.string.isRequired,
        handleRemove: React.PropTypes.func,
    },
    getInitialState() {
        return {
            actionVisible: false,
            timeId: "",

            previewVisible: false,
            modalWidth: 520,
            modalHeight: 300,
        }
    },
    componentDidMount() {
        this.setState({
            modalWidth: document.body.clientWidth * 0.5,
            modalHeight: document.body.clientHeight * 0.5,
        });
    },
    render() {
        const {actionVisible, previewVisible, modalWidth, modalHeight} = this.state;
        return (
            <div>
                <Card bordered={true} className={styles.customCard} bodyStyle={{padding: 0}}
                      onMouseOver={this.handleMouseOver}
                      onMouseOut={this.handleMouseOut}>
                    <div className={styles.cardBody}>
                        <img className={styles.cardImage} src={this.props.url}/>
                        {actionVisible ? (
                                <div className={styles.cardAction}>
                                    <Button className={styles.cardActionButton} value="small" type="primary"
                                            onClick={this.handlePreview}>查看</Button>
                                    {this.props.handleRemove ?
                                        <Button className={styles.cardActionButton} value="small" type="primary"
                                                onClick={this.props.handleRemove}>删除</Button> : null}
                                </div>
                            ) : null}
                    </div>
                </Card>
                <Modal visible={previewVisible} onCancel={this.handlePreviewCancel} footer={null} width={modalWidth}
                       style={{height: modalHeight}}>
                    <img src={this.props.url}/>
                </Modal>
            </div>
        )
    },
    handleMouseOver() {
        if (this.state.timeId != "") {
            clearTimeout(this.state.timeId);
            this.state.timeId = "";
        }
        this.setState({
            actionVisible: true
        });
    },
    handleMouseOut() {
        this.setState({
            timeId: setTimeout(() => {
                this.setState({
                    actionVisible: false
                });
            }, 200)
        });
    },
    handlePreview() {
        this.setState({previewVisible: true})
    },
    handlePreviewCancel() {
        this.setState({previewVisible: false})
    }
});
export const Picturewall = React.createClass({
    propTypes: {
        imageList: React.PropTypes.array.isRequired,
        onUpload: React.PropTypes.func,
        onRemove: React.PropTypes.func,
        message: React.PropTypes.string
    },
    getInitialState() {
        return {
            previewVisible: false,
            previewImage: '',
        }
    },
    render() {
        const {previewVisible, previewImage} = this.state;
        const {imageList, message} = this.props;
        return (
            <div>
                <Row gutter={8}>
                    {imageList.map(
                        (image, i) => {
                            return (
                                <Col span="4" key={i}>
                                    <CustomCard url={image.url}
                                                handleRemove={this.props.onRemove ? () => {
                                                        this.props.onRemove(i)
                                                    } : null}></CustomCard>
                                </Col>
                            )
                        }
                    )}
                    { this.props.onUpload? (
                        <Col span="4" key="upload">
                            <Card bordered={true} onClick={this.handleClick} className={styles.cardUpload}
                                  bodyStyle={{padding: 0}}>
                                <input type="file" style={{display: 'none'}} accept="image/*"
                                       onChange={(e) => {
                                           this.handleUploadFile(e)
                                       }}
                                       ref="uploadInput" multiple="multiple"/>
                                <div className={styles.cardUploadBody}>
                                    <Icon type="plus"/>
                                    <div>上传答案</div>
                                    {message ? <div>{message}</div> : null}
                                </div>
                            </Card>
                        </Col>
                        ): null }

                </Row>
            </div>
        );
    },
    handleClick() {
        this.refs.uploadInput.click();
    },
    handleUploadFile(e) {
        this.props.onUpload(e.target.files);
    },
})

