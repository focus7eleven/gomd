import React from 'react'
import styles from './LoginContainer.scss'
import {Form, Icon, Input, Button, Checkbox} from 'antd'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import logo from 'images/logo.png'
import {login} from '../actions/user'
const FormItem = Form.Item;

const LoginContainer = React.createClass({
  contextTypes:{
    router: React.PropTypes.object,
  },

  getInitialState(){
    return {}
  },

  componentWillReceiveProps(nextProps) {
    // 登录成功后的页面跳转
		if (nextProps.isAuth && !this.props.isAuth) {
			this.context.router.push(`/index`);
		}
	},

  handleSubmit(e) {
    // 登录表单验证
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values.username,values.password);
      }
    });
  },

  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.container}>
        <div className={styles.loginBody}>
          <div className={styles.panel}>
            <div className={styles.logoArea}>
              <img src={logo}/>
              {logo?<span>用户登录</span>:null}
            </div>
            <div className={styles.formArea}>
              <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
                <FormItem className={styles.formInput}>
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入用户名！' }],
                  })(
                    <Input addonBefore={<Icon type="user" />} placeholder="工号" />
                  )}
                </FormItem>
                <FormItem className={styles.formInput}>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码！' }],
                  })(
                    <Input addonBefore={<Icon type="lock" />} type="password" placeholder="密码" />
                  )}
                </FormItem>
                <FormItem>
                  <Button type="primary" htmlType="submit" className={styles.loginFormButton}>登录</Button>
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: false,
                  })(
                    <Checkbox>记住密码</Checkbox>
                  )}
                  <a className={styles.loginFormForgot}>忘记密码？</a>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <p>Copyright ©️2017 Nanjing Looedu Information Technology Co.,LTD. All rights reserved. 备案号：宁ICP备13003602号-2 服务热线：025-8681 4885</p>
        </div>
      </div>
    )

  }
})

function mapStateToProps(state) {
  return {
    isAuth: state.get('user').get('isAuth'),
  }
}

function mapDispatchToProps(dispatch){
  return {
    login:bindActionCreators(login,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(LoginContainer))
