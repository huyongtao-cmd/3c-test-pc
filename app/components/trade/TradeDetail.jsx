import React from 'react';
import {Col, Divider, Modal, Row, Table} from 'antd';

import {App, U, Utils} from "../../common";

const id_div = 'div-dialog-trade-detail';


export default class TradeDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tradeId: this.props.tradeId,
            trade: {}
        };
    }

    componentDidMount() {
        this.loadData();
    }

    close = () => {
        Utils.common.closeModalContainer(id_div);
    };

    loadData = () => {
        let {tradeId} = this.state;
        App.api('/mch/trade/item', {id: tradeId}).then(result => {
            this.setState({
                trade: result
            });
        });
    };

    render() {
        let {trade = {}} = this.state;
        let {user = {}, address = {}, createdAt, id, orderNumber, totalAmount, totalPrice, tradeItems = [], type, mark} = trade;
        let {code, detail, name, mobile} = address;
        let codes = Utils.addr.getPCD(code);

        return <Modal title={'订单详情'}
                      className='trade-detail'
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'1200px'}
                      footer={null}
                      onCancel={this.close}
        >
            <div className='pay-detail'>
                <span className='part-title'>账单信息</span>
                <Row className='class-line'>
                    <Col span={8}>订单号：{orderNumber}</Col><Col
                    span={8}>下单时间：{U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm:ss')}</Col><Col
                    span={8}>付款时间：{U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm:ss')}</Col>
                </Row>
                <Row className='class-line'>
                    <Col span={8}>应付金额：￥{U.price.cent2yuan(totalPrice, false)}</Col>
                    <Col span={8}>实付金额：{(totalAmount !== 0) ?
                        <span>￥{U.price.cent2yuan(totalAmount, false)}</span> : '未付款'}</Col>
                    <Col span={8}>订单状态：{type ? <React.Fragment>
                        <a style={{color: '#FF3333'}}>{type === 1 && "待付款"}
                            {type === 2 && "待发货"}{type === 4 && "待评论"}
                        </a>
                        <a style={{color: "#D4B765"}}>{type === 3 && "已发货"}
                            {type === 6 && "已完成"}</a>
                        <a style={{color: '#C7C7C7'}}>{type === 5 && "已取消"}</a>
                    </React.Fragment> : <div/>}

                    </Col>
                </Row>
            </div>

            <Divider/>

            <div className='user-info'>
                <span className='part-title'>买家信息</span>
                <Row className='class-line'>
                    <Col span={8}>姓名：{name}</Col><Col span={8}>联系方式：{mobile}</Col>
                </Row>
                <Row className='class-line'>
                    <Col span={8}>收货地址：{codes}&nbsp;{detail}</Col><Col
                    span={8}>备注：{mark ? mark : '无'}</Col>
                </Row>
            </div>

            <Divider/>
            <div className='products'>
                <span className='part-title'>商品列表</span>
                <Table
                    pagination={false}
                    size={"small"}
                    columns={[{
                        title: '序号',
                        dataIndex: 'index',
                        align: 'center',
                        width: 50,
                        render: (str, item, index) => index + 1
                    }, {
                        title: '图片',
                        dataIndex: 'img',
                        align: 'center',
                        render: (index, item) => {
                            let {product = {}, productSno} = item;
                            let {specs = []} = product;
                            let _specs = specs.find(it => it.sno === productSno) || {};
                            let {imgs = []} = _specs;
                            return <img src={imgs[0]} style={{width: '40px', height: '40px'}}/>;
                        }
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        align: 'center',
                        width: '500px',
                        render: (name, item) => {
                            let {product = {}} = item;
                            let {title} = product;
                            return <span style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>{title}</span>;
                        }
                    }, {
                        title: '规格',
                        dataIndex: 'params',
                        align: 'center',
                        render: (name, item) => {
                            let {product = {}, productSno} = item;
                            let {specs = []} = product;
                            let _specs = specs.find(it => it.sno === productSno) || {};
                            let {params = []} = _specs;
                            return <div className='params'>
                                {params.map((item, index) => {
                                    let {label, value} = item;
                                    return <span className='param' key={index}>
                                                    <span className='label'>{label}：</span>
                                                    <span className='value'>{value}</span>
                                                </span>;
                                })}
                            </div>;
                        }
                    }, {
                        title: '单价',
                        dataIndex: 'price',
                        align: 'center',
                        render: (index, item) => {
                            let {product = {}, productSno} = item;
                            let {specs = []} = product;
                            let _specs = specs.find(it => it.sno === productSno) || {};
                            let {price} = _specs;
                            return <div>￥{U.price.cent2yuan(price, false)}</div>;
                        }
                    }, {
                        title: '数量',
                        dataIndex: 'num',
                        align: 'center',
                        render: (num) => {
                            return <div>{num}</div>;
                        }
                    }]}
                    rowKey={(item) => item.id}
                    dataSource={tradeItems}
                />
            </div>


        </Modal>

    }
}
