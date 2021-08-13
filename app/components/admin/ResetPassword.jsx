import React from 'react'
import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import { Form, Icon, Input, message, Modal, notification } from 'antd';

import CTYPE from "../../common/CTYPE";
import '../../assets/css/common/common-list.less'
import U from '../../common/U.jsx';

const FormItem = Form.Item;
const id_div = 'reset_password';

class ResetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loding: false,
            mobile: this.props.mobile
        };
    }

    updatePassword = () => {
        let { newPassword, verifyPassword, mobile } = this.state;
        if (U.str.isEmpty(newPassword) || newPassword.length < 6 || newPassword.length > 17) {
            message.warning("请输入6-17位的新密码")
            return;
        }
        if (U.str.isEmpty(verifyPassword)) {
            message.warning("请确认新密码")
            return;
        }
        if (newPassword !== verifyPassword) {
            message.warning("两次输入密码不一致,请重新输入密码")
            return;
        }
        App.api(`mch/merchantAdmin/reset_password`, { mobile, newPassword }).then(() => {
            if (App.getAdmProfile.mobile === mobile) {
                message.success("密码重置成功，请尝试重新登录")
                this.close()
                App.logout()
                App.go(`/login`)
            }
            message.success("密码重置成功")
            this.close()
        })
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        let { newPassword, verifyPassword, loading } = this.state;


        return <Modal title={'修改密码'}
            getContainer={() => Utils.common.createModalContainer(id_div)}
            visible={true}
            width={'600px'}
            confirmLoading={loading}
            onOk={this.updatePassword}
            onCancel={this.close}>
            <Form>


                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>新密码</span>
                    )}
                    hasFeedback>
                    <Input type="password" placeholder="请输入新密码" value={newPassword} onChange={(e) => {
                        this.setState({ newPassword: e.target.value })
                    }} />
                </FormItem>

                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>确认新密码</span>
                    )}
                    hasFeedback>
                    <Input type="password" placeholder="请确认新密码" value={verifyPassword} onChange={(e) => {
                        this.setState({ verifyPassword: e.target.value })
                    }} />
                </FormItem>

            </Form>
        </Modal>
    }
}

export default Form.create()(ResetPassword);
