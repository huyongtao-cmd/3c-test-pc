import React from 'react';
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {Card, Col, DatePicker, Dropdown, Empty, Icon, Input, Menu, message, Pagination, Row, Tabs} from 'antd';
import Search from "antd/es/input/Search";
import {U, App, CTYPE, Utils} from "../../common";
import '../../assets/css/trades.scss';
import TradeUtils from "./TradeUtils";

const InputSearch = Input.Search;
const {TabPane} = Tabs;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY/MM/DD';


const tabList = [
    {
        key: '0',
        tab: '全部有效订单',
    },
    {
        key: '1',
        tab: '待支付',
    }, {
        key: '2',
        tab: '待发货',
    }, {
        key: '3',
        tab: '待收货',
    }, {
        key: '6',
        tab: '确认完成'
    }
];

class Trades extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: 0,
            pagination: {
                current: 1,
                pageSize: CTYPE.pagination.pageSize,
                total: 0
            },
        }

    }

    componentDidMount() {
        this.loadData();

    }

    loadData = () => {
        let {pagination = {}, type, orderNumber, userId, lastModified} = this.state;
        console.log(pagination)
        App.api('/mch/trade/items', {
            tradeQo: JSON.stringify({
                pageSize: pagination.pageSize,
                pageNumber: pagination.current,
                type,
                orderNumber: orderNumber ? orderNumber : null,
                userId,
                lastModified
            })
        }).then((result) => {
            let {content = [], totalElements} = result;
            this.setState({
                trades: content,
                totalElements,
                loading: false
            });
        });
    };

    send = (id, type) => {
        App.api('/mch/trade/send', {id: id, type: type}).then(() => {
            if (type === 3) {
                message.success("发货成功");
            }
            this.loadData();
        });
    };

    onTabChange = (key) => {
        this.setState({type: parseInt(key)}, () => this.loadData())
    }

    handleTableChange = (current,pageSize) => {
        this.setState({
            pagination: {
                current,
                pageSize,
            }
        }, () => this.loadData());
    };



    render() {
        let {trades = [], pagination = {}, orderNumber, tabType = 0, totalElements, show_modal} = this.state;

        return <div className="trade-list">

            <BreadcrumbCustom first={'订单'}/>

            <Card tabList={tabList} onTabChange={(key) => {
                this.onTabChange(key)
            }}>


                {trades.length <= 0 &&
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                }

                {trades.length > 0 && <React.Fragment>
                    <table>
                        <thead>
                        <tr>
                            <th>商品详情</th>
                            <th>买家信息</th>
                            <th>付款信息</th>
                            <th>订单状态</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        {trades.map((trade, index) => {
                            let {
                                id,
                                totalAmount,
                                totalPrice,
                                tradeItems = [],
                                user = {},
                                type,
                                orderNumber,
                                createdAt
                            } = trade;
                            let {name, mobile} = user;
                            return <tbody key={index}>
                            <tr className='tsplit'/>
                            <tr className='header'>
                                <td className='time' colSpan={6}>
                                    <span>订单编号：{orderNumber}</span>
                                    <span>下单时间：{U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm:ss')}</span>
                                </td>
                            </tr>
                            <tr className='item'>
                                {tradeItems.map((item, index) => {
                                    let {product = {}, num, productSno} = item;
                                    let {specs = [], name} = product;
                                    let _specs = specs.find(it => it.sno === productSno) || {};
                                    let {imgs = [], params = [], price} = _specs;
                                    return <td className='product' key={index}>
                                        <img src={imgs[0]}/>
                                        <div className='product-detail'>
                                            <div className='title'>{name}</div>
                                            <div className='params'>
                                                {params.map((item, index) => {
                                                    let {label, value} = item;
                                                    return <span className='param' key={index}>
                                                            <span className='label'>{label}：</span>
                                                            <span className='value'>{value}</span>
                                                        </span>;
                                                })}
                                            </div>
                                        </div>
                                        <div className='num-price'>
                                            <div>￥{U.price.cent2yuan(price, false)}</div>
                                            <div>{num}件</div>
                                        </div>
                                    </td>;
                                })}


                                <td className='user'>
                                    <div className='name'>
                                        <i/>
                                        {name}
                                    </div>
                                    <div className='mobile'>
                                        <i/>
                                        {mobile}
                                    </div>
                                </td>
                                <td className='price user'>
                                    <div className='txt'>
                                        需付款：￥{U.price.cent2yuan(totalPrice, false)}
                                    </div>
                                    <div className='txt'>
                                        实付款：￥{U.price.cent2yuan(type === 1 ? 0 : totalAmount, false)}
                                    </div>
                                </td>
                                <td className='status user'>
                                    <div className='txt'>
                                        <div>
                                            <a style={{color: '#FF3333'}}>{type === 1 && "待付款"}
                                                {type === 2 && "待发货"}{type === 4 && "待评论"}
                                            </a>
                                            <a style={{color: "#D4B765"}}>{type === 3 && "已发货"}
                                                {type === 6 && "已完成"}</a>
                                            <a style={{color: '#C7C7C7'}}>{type === 5 && "已取消"}</a>
                                        </div>
                                    </div>
                                </td>
                                <td className='operating user'>
                                    <Dropdown overlay={<Menu>
                                        <Menu.Item key="1">
                                            <a onClick={() => {
                                                TradeUtils.tradeDetail(id);
                                            }}>查看详情</a>
                                        </Menu.Item>
                                        {type === 2 && < Menu.Item key="2">
                                            <a onClick={() => {
                                                this.send(trade.id, 3);
                                            }}>发货</a>
                                        </Menu.Item>}
                                    </Menu>} trigger={['click']}>
                                        <a className="ant-dropdown-link">操作 <Icon type="down"/>
                                        </a>
                                    </Dropdown>
                                </td>
                            </tr>
                            </tbody>;
                        })}
                    </table>
                    <Pagination
                        showSizeChanger
                        onChange={(page, pageSize) => {
                            this.handleTableChange(page, pageSize);
                        }}
                        onShowSizeChange={(current, size) => {
                            this.handleTableChange(current, size);
                        }}
                        style={{float: 'right'}}
                        total={totalElements}
                        showTotal={total => `总共 ${total} 条`}
                    />
                </React.Fragment>}


            </Card>

        </div>
    }

}

export default Trades;