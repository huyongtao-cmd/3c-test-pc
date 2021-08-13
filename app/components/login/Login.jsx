import React from 'react';
import App from '../../common/App.jsx';
import {Button, Card, Form, Icon, Input, message, Modal} from 'antd';
import KvStorage from "../../common/KvStorage";
import {Utils} from "../../common";

const FormItem = Form.Item;

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            imgSrc: '',
            valCode: ''
        };
    }

    isIE = () => { //ie?
        if (!!window.ActiveXObject || "ActiveXObject" in window)
            return true;
        else
            return false;
    };

    componentDidMount() {

        // this.genValCode();

        //未授权从index被拦截回login时清除loading效果
        message.destroy();

        if (this.isIE()) {
            Modal.warning({
                title: '提示',
                content: (<div>
                    <p>你正在使用的浏览器内核版本过低，微软已经不再提供技术支持，为避免可能存在的安全隐患，请尽快升级你的浏览器或者安装更安全的浏览器（比如 <a
                        href='http://www.google.cn/chrome/browser/desktop/index.html' target='_blank'>Chrome</a>）访问管理平台。
                    </p>
                    <p>如果你正在使用的是双核浏览器，比如QQ浏览器、搜狗浏览器、猎豹浏览器、世界之窗浏览器、傲游浏览器、360浏览器等，可以使用浏览器的极速模式来继续访问管理平台。</p></div>),
            });
        }

        document.addEventListener('keydown', this.doSubmit);

    }

    // genValCode = () => {
    //     let key = new Date().getTime();
    //     this.setState({imgSrc: App.API_BASE + '/common/gen_valCode_signin?key=' + key, valCode: {key, code: ''}});
    // };

    doSubmit = (e) => {
        if (e.keyCode === 13) {
            this.onSubmit();
        }
    };

    componentWillUnmount() {
        document.removeEventListener('keydown', this.doSubmit);
    }

    onSubmit = () => {
        this.props.form.validateFields((err, merchantAdmin) => {
                if (err) {
                    Object.keys(err).forEach(key => {
                        message.warning(err[key].errors[0].message);
                    });
                } else {
                    App.api('mch/merchantAdmin/signin', {
                            mobile: merchantAdmin.username,
                            password: merchantAdmin.password
                        }
                    ).then(res => {
                        let {merchantAdmin = {},  merchantAdminRole = {}, merchantAdminSession = {}} = res;
                        Utils.adm.savePermissions(merchantAdminRole.permissions);
                        console.log(res)
                        KvStorage.set('admin-profile', JSON.stringify(merchantAdmin));
                        KvStorage.set('merchant-admin-token', merchantAdminSession.token);

                        App.go(`/app/dashboard/index`);

                    });
                }
            }
        );
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        let {imgSrc, valCode = {}} = this.state;
        // let {code = ''} = valCode;

        return (
            <Card className="login">

                <div className="login-form">
                    <div className="login-logo"/>
                    <Card style={{width: 300, height: 200}} bordered={false}>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{required: true, message: '请输入手机号!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 13}}/>}
                                       placeholder="账号"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: '请输入密码!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                                       placeholder="密码"/>
                            )}
                        </FormItem>
                        
                        {/* <FormItem>
                            <Button type="primary" htmlType="submit" onClick={this.onSubmit} style={{
                                display: 'block',
                                width: '100%'
                            }}>
                                登录
                            </Button>
                        </FormItem> */}
                        <FormItem>
                            <Button type="primary" htmlType="submit" onClick={() => App.go(`/tab`)} style={{
                                display: 'block',
                                width: '100%'
                            }}>
                                登录
                            </Button>
                        </FormItem>

                    </Card>
                </div>
            </Card>

        );
    }
}

const login = Form.create()(Login);
export default login;
