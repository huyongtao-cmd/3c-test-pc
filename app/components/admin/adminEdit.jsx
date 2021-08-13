import React from 'react';
import { App, CTYPE, U } from "../../common";
import { Card, Input, Form, message, Button, Select } from "antd";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";


const FormItem = Form.Item;
const { Option } = Select;

class AdminEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            admin: {},
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let { id } = this.state;
        App.api(`mch/merchantAdmin/role_list`).then((roleList) => {
            this.setState({ roleList })
        })
        {
            id !== 0 && App.api(`/adm/merchantAdmin/item`, { id: id }).then((res) => {
                this.setState({
                    admin: res,
                })
            })
        }

    }

    save = () => {
        let { admin = {} } = this.state;
        let { mobile, name, password, id } = admin;

        if (U.str.isEmpty(mobile)) {
            message.warning("请输入管理员手机号")
            return;
        }
        if (mobile.length < 11) {
            message.warning("管理员手机号不能少于十一位")
            return;
        }
        if (U.str.isEmpty(name)) {
            message.warning("请输入管理员昵称")
            return;
        }
        if (U.str.isEmpty(password)) {
            message.warning("请输入管理员密码")
            return;
        }
        if (password.length < 6 || password.length > 17) {
            message.warning("管理员密码长度请控制在6-17位")
            return;
        }
        App.api(`mch/merchantAdmin/save`, {
            merchantAdmin: JSON.stringify({
                ...admin
            })
        }).then(() => {
            message.success(id ? "修改管理员信息成功" : "新建管理员成功")
            window.history.back();
        })
    }
    changeValue = (value) => {
        let { admin = {} } = this.state;
        this.setState({
            admin: {
                ...admin,
                roleId: value
            }
        })
    }

    render() {
        let { id, admin = {}, roleList = [] } = this.state;
        let { roleId } = admin;
        return (
            <div>
                <BreadcrumbCustom first={'管理员'} second={id === 0 ? '新建管理员' : '编辑管理员'}
                />
                <Card extra={<Button type={"primary"} icon={'save'} onClick={() => {
                    this.save()
                }}>保存</Button>}>
                    <FormItem
                        {...CTYPE.formItemLayout} label='手机号码' required={true}>
                        <Input rows={1} value={admin.mobile} placeholder="输入手机号码" maxLength={15}
                            onChange={(e) => {
                                admin.mobile = e.target.value
                                this.setState({ admin })

                            }} />
                    </FormItem>
                    <FormItem
                        {...CTYPE.formItemLayout} label='名称' required={true}>
                        <Input rows={1} value={admin.name} placeholder="输入管理员名称" maxLength={16}
                            onChange={(e) => {
                                admin.name = e.target.value
                                this.setState({ admin })

                            }} />
                    </FormItem>
                    <FormItem
                        {...CTYPE.formItemLayout} label='密码' required={true}>
                        <Input type="password" value={admin.password} rows={1} placeholder="请设置密码" maxLength={20}
                            onChange={(e) => {
                                admin.password = e.target.value
                                this.setState({ admin })

                            }} />
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout} label='选择权限组' required={true}>

                        <Select defaultValue="lucy" style={{ width: 120 }} value={roleId} onChange={(value) => this.changeValue(value)}>

                            {roleList.map((role, index) => {
                                let { name, id } = role;
                                return <Option key={index} value={id}>{name}</Option>
                            })}
                        </Select>
                    </FormItem>




                </Card>
            </div>
        );
    }
}

export default AdminEdit;