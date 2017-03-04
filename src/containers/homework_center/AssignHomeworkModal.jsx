/**
 * Created by wuyq on 2017/2/7.
 */
import React from 'react';
import {Button, Modal, Form, DatePicker, Select, notification} from 'antd';

import config from '../../config';
import {httpFetchPost, httpFetchGet} from '../../utils/http-utils';

const FormItem = Form.Item;
const Option = Select.Option;

export const AssignHomeworkModal = React.createClass({

    getInitialState() {
        return {
            visible: false,
            groups: [],

            homeworkId: "",
            finishTimeDF: null,
            finishTime: {
                value: "",
            },
            targetIds: {
                value: []
            },
            targetNames: [],

            loading:false,
        };
    },
    getDefaultProps() {
        return {};
    },
    componentWillMount(){
        this.getAssignGroup();
    },
    render() {
        //const { getFieldDecorator } = this.props.form;
        return (
            <Modal title="布置作业" visible={this.state.visible}
                   onOk={this.handleAssignHomework} onCancel={this.handleCancel}
                   footer={[
                       <Button key="cancel" onClick={this.handleCancel}>取消</Button>,
                       <Button key="assign" type="primary"
                               onClick={this.handleAssignHomework}
                               loading={this.state.loading}
                       >布置作业</Button>
                   ]}>
                <Form vertical>
                    <FormItem
                        label={<label className="ant-form-item-required">完成期限</label>}
                        validateStatus={this.state.finishTime.statue}
                        help={this.state.finishTime.errMsg}
                    >
                        <DatePicker showTime={{format: "HH:mm"}}
                                    format="YYYY/MM/DD HH:mm"
                                    placeholder="完成期限"
                                    style={{width: '35%'}}
                                    value={this.state.finishTimeDF}
                                    onChange={this.setFinishTime}

                        />
                    </FormItem>
                    <FormItem
                        label={<label className="ant-form-item-required">选择对象</label>}
                        validateStatus={this.state.targetIds.statue}
                        help={this.state.targetIds.errMsg}
                    >
                        <Select multiple key="group" style={{width: '35%'}}
                                value={this.state.targetIds.value}
                                onChange={(groupIds) => {
                                    this.setAssignGroups(groupIds)
                                }}>
                            {this.state.groups.map((group) => {
                                return <Option key={group.groupId} value={group.groupId}>{group.groupName}</Option>;
                            })}
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
        );
    },
    handleCancel() {
        this.setState({
            visible: false
        })
    },
    handleAssignHomework() {
        //布置作业
        if (this.formCheck() == false) {
            return;
        }
        let formData = new FormData();
        formData.append('homeworkId', this.state.homeworkId);
        formData.append('finishTime', this.state.finishTime.value);
        formData.append('targetIds[]', this.state.targetIds.value);
        formData.append('targetNames[]', this.state.targetNames);

        this.setState({
            loading:true,
        });
        httpFetchPost(config.api.homework.assignHomeworkUrl, formData)
            .then(
                result => {
                    this.setState({
                        loading:false,
                    });
                    if (result.title == "Success") {
                        notification.success({message: "布置作业成功!"});
                        this.setState({
                            visible: false
                        });
                    } else {
                        notification.error({message: result.result});
                    }
                }
            ).catch(
            () => {
                this.setState({
                    loading:false,
                });
            }
        )
    },
    showModal(homeworkId) {
        this.setState({
            visible: true,
            homeworkId: homeworkId,
            finishTimeDF: null,
            finishTime: {
                value: ""
            },
            targetIds: {
                value: []
            },
            targetNames: []
        });
    },
    getAssignGroup() {
        httpFetchGet(config.api.group.getByTeacherForHomework, {})
            .then(groups => {
                this.setState({
                    groups: groups,
                });
            }).catch(
            () => {
            }
        )
    },
    setFinishTime(time, timeString) {
        this.setState({
            finishTimeDF: time,
            finishTime: {
                value: timeString
            }
        });
    },
    setAssignGroups(groupIds) {
        let targetNames = this.state.groups.filter((group) => {
            for (let i in groupIds) {
                if (group.groupId == groupIds[i]) return true;
            }
            return false;
        }).map((group) => {
            return group.groupName;
        });
        this.setState({
            targetIds: {
                value: groupIds
            },
            targetNames: targetNames
        });
    },
    formCheck() {
        let checkResult = true;
        const finishTime = this.state.finishTime.value;
        const targetIds = this.state.targetIds.value;
        if (finishTime == "") {
            this.setState({
                finishTime: {
                    value: finishTime,
                    statue: "error",
                    errMsg: "请输入布置日期",
                }
            });
            checkResult = false;
        } else if ( this.state.finishTimeDF.diff(new Date()) <= 0 ) {
            this.setState({
                finishTime: {
                    value: finishTime,
                    statue: "error",
                    errMsg: "请选择当前时间以后的时间",
                }
            });
            checkResult = false;
        }
        if (targetIds == [] || targetIds.length == 0) {
            this.setState({
                targetIds: {
                    value: targetIds,
                    statue: "error",
                    errMsg: "请输入布置对象",
                }
            });
            checkResult = false;
        }
        return checkResult;
    },
})
