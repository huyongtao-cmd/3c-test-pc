import React from 'react';
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import { Avatar, Button, Card, Dropdown, Icon, Menu, Table, Tag } from "antd";
import { App, KvStorage } from "../../common";
import AdminUtils from "./AdminUtils"

class Admins extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let { merchantAdmin } = this.state;
        this.setState({ loading: true })
        App.api(`/mch/merchantAdmin/findMerchantAdmins`).then((res) => {
            this.setState({
                list: res
            })
        })
    }

    edit = admin => {
        App.go(`/app/admin/admin-edit/${admin.id}`)
        this.setState({ loading: false })
    };


    render() {
        let { list = [] } = this.state;
        return (
            <div>
                <BreadcrumbCustom first={'管理员'} />

                <Card title={<Button type="primary" icon="user-add" onClick={() => this.edit({ id: 0 })}>管理员</Button>}>
                    <Table
                        columns={[{
                            title: '序号',
                            dataIndex: 'id',
                            className: 'txt-center',
                            render: (col, row, i) => i + 1
                        }, {
                            title: '手机号',
                            dataIndex: 'mobile',
                            className: 'txt-center'
                        }, {
                            title: '名称',
                            dataIndex: 'name',
                            className: 'txt-center'
                        }, {
                            title: '操作',
                            dataIndex: 'option',
                            className: 'txt-center',
                            render: (obj, admin, index) => {
                                return <Dropdown overlay={<Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.edit(admin)}>编辑</a>
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                        <a onClick={() => AdminUtils.resetPassword(admin.mobile)}>重置密码</a>
                                    </Menu.Item>
                                    {/*<Menu.Item key="2">*/}
                                    {/*    <a onClick={() => this.remove(admin.id, index)}>删除</a>*/}
                                    {/*</Menu.Item>*/}
                                    {/*<Menu.Divider/>*/}
                                    {/*<Menu.Item key="3">*/}
                                    {/*    <a onClick={() => AdminUtils.adminSessions(admin.id, admin.name)}>登录日志</a>*/}
                                    {/*</Menu.Item>*/}
                                </Menu>} trigger={['click']}>
                                    <a className="ant-dropdown-link">
                                        操作 <Icon type="down" />
                                    </a>
                                </Dropdown>
                            }

                        }]}
                        rowKey={(item) => item.id}
                        dataSource={list}
                        pagination={false}
                    />
                </Card>

            </div>
        );
    }
}

export default Admins;