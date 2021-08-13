import React, { Component } from 'react';
import { Icon, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { Utils, CTYPE } from "./index";

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

const panes = [{ title: '规格1', key: '', }]

class SiderCustom extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: false
    };

    componentDidMount() {
        this.setMenuOpen();
    }

    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
    }

    getPostion = (str, cha, num) => {
        let x = str.indexOf(cha);
        for (let i = 0; i < num; i++) {
            x = str.indexOf(cha, x + 1);
        }
        return x;
    };

    setMenuOpen = () => {

        let path = window.location.hash.split('#')[1];

        //兼容三层目录,三级页不修改，刷新时定位到一级
        let key = path.substr(0, path.lastIndexOf('/'));
        if (key.split('/').length > 3) {
            if (this.state.openKey)
                return;
            key = key.substring(0, this.getPostion(key, '/', 2));
        }

        this.setState({
            openKey: key,
            selectedKey: path
        });
    };

    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline'
        });
    };

    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });

    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false
        });
    };

    render() {

        let {
            ROLE_LIST,
            ROLE_EDIT,

            ADMIN_LIST,

            ARTICLE_ALL,
            ARTICLE_LIST,
            ARTICLE_EDIT,

            BANNER_EDIT

        } = Utils.adminPermissions;

        let withAdmin = ADMIN_LIST || ROLE_LIST || ROLE_EDIT;

        let withContent = ARTICLE_ALL || ARTICLE_EDIT || ARTICLE_LIST || BANNER_EDIT;

        let { firstHide, selectedKey, openKey } = this.state;

        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{ overflowY: 'auto' }}>
                <div className={this.props.collapsed ? 'logo logo-s' : 'logo'} />
                <Menu
                    onClick={this.menuClick}
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    openKeys={firstHide ? null : [openKey]}
                    onOpenChange={this.openMenu}>
                    <Menu.Item key="/app/dashboard/index">
                        <Link to={'/app/dashboard/index'}><Icon type="home" /><span
                            className="nav-text">首页</span></Link>
                    </Menu.Item>

                    <SubMenu key='/app/product'
                        title={<span><Icon type="appstore" /><span
                            className="nav-text">产品管理</span></span>}>
                        <Menu.Item key={CTYPE.link.product_templates.key}><Link
                            to={CTYPE.link.product_templates.path} />{CTYPE.link.product_templates.txt}</Menu.Item>
                        <Menu.Item key={CTYPE.link.product_products.key}><Link
                            to={CTYPE.link.product_products.path} />{CTYPE.link.product_products.txt}</Menu.Item>
                    </SubMenu>

                    <SubMenu key='/app/trade'
                        title={<span><Icon type="appstore" /><span
                            className="nav-text">订单管理</span></span>}>
                        <Menu.Item key={CTYPE.link.trade_trades.key}><Link
                            to={CTYPE.link.trade_trades.path} />{CTYPE.link.trade_trades.txt}</Menu.Item>
                    </SubMenu>

                    <SubMenu key='/app/shop'
                        title={<span><Icon type="shop" /><span
                            className="nav-text">店铺管理</span></span>}>
                        <Menu.Item key={CTYPE.link.shop_service.key}><Link
                            to={CTYPE.link.shop_service.path} />{CTYPE.link.shop_service.txt}</Menu.Item>
                    </SubMenu>

                    <SubMenu key='/app/finance'
                        title={<span><Icon type="transaction" /><span
                            className="nav-text">账单管理</span></span>}>
                        <Menu.Item key={CTYPE.link.finance_bills.key}><Link
                            to={CTYPE.link.finance_bills.path} />{CTYPE.link.finance_bills.txt}</Menu.Item>
                        <Menu.Item key={CTYPE.link.payment_term.key}><Link
                            to={CTYPE.link.payment_term.path} />{CTYPE.link.payment_term.txt}</Menu.Item>
                    </SubMenu>

                    <SubMenu key='/app/admin'
                        title={<span><Icon type="usergroup-add" /><span
                            className="nav-text">管理&权限</span></span>}>
                        <Menu.Item key={'/app/admin/admins'}><Link
                            to={'/app/admin/admins'} />管理员</Menu.Item>

                        <Menu.Item key={'/app/admin/roles'}><Link
                            to={'/app/admin/roles'} />权限组</Menu.Item>
                    </SubMenu>


                </Menu>
            </Sider>
        );
    }
}

export default SiderCustom;
