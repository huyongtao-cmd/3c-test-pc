import React from 'react';
import {Link} from "react-router-dom";
import {App, CTYPE, U, Utils} from "../../common";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {Card, Divider, Dropdown, message, Modal, Radio, Table} from "antd";

const radios = [{value: 1, txt: '通过'}, {value: 2, txt: '失败'}];

class Bills extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            onAuditBill: {},
            bills: [],
            pagination: {
                current: 1,
                pageSize: CTYPE.pagination.pageSize,
                total: 0,
            },
            billQo: {},
            visible: false,
        }

    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {billQo = {}, pagination = {}} = this.state;
        App.api(`/mch/bill/items`, {billQo: JSON.stringify(billQo)}).then((res) => {
            this.setState({bills: res.content, pagination: Utils.pager.convert2Pagination(res)})
        })
    }

    auditModal = (bill) => {
        this.setState({visible: true, onAuditBill: bill})
    }

    audit = () => {
        let {status, onAuditBill} = this.state;
        App.api(`/mch/bill/check`, {id: onAuditBill.id, status: status}).then(() => {
            this.setState({visible: false}, this.loadData);
            message.success('操作已完成');
        })

    }


    render() {
        let {bills = [], pagination = {}, visible = false, onAuditBill = {}} = this.state;
        let {current, pageSize, total} = pagination;
        return (
            <div>
                <BreadcrumbCustom
                    first={<Link to={CTYPE.link.finance_bills.path}>{CTYPE.link.finance_bills.txt}</Link>}/>

                <Card>
                    <Table columns={[
                        {
                            title: '序号',
                            dataIndex: 'id',
                            className: 'txt-center',
                            render: (col, row, i) => i + 1
                        }, {
                            title: '订单编号',
                            dataIndex: 'orderNumber',
                            className: 'txt-center',
                        }, {
                            title: '金额',
                            dataIndex: 'amount',
                            className: 'txt-center',
                            render: (amount) => {
                                return <div>
                                    {U.price.cent2yuan(amount)}
                                </div>
                            }
                        }, {
                            title: '时间',
                            dataIndex: 'createdAt',
                            className: 'txt-center',
                            render: (createdAt) => {
                                return <div>{U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')}</div>
                            }
                        }, {
                            title: '支付凭证',
                            dataIndex: 'imgs',
                            className: 'txt-center',
                            render: (imgs, item, index) => {
                                console.log(imgs)
                                return <img style={{width: '60px', height: '60px'}} src={imgs[0]} onClick={() => {
                                    Utils.common.showImgLightbox(imgs)
                                }}/>
                            }
                        }, {
                            title: '审核结果',
                            dataIndex: 'status',
                            className: 'txt-center',
                            render: (obj, item, index) => {
                                let {status} = item;
                                return <div>
                                    {status === 1 && '通过'}
                                    {status === 2 && '失败'}
                                    {status === 3 && '待审核'}
                                </div>
                            }
                        }, {
                            title: '账单审核',
                            dataIndex: 'option',
                            className: 'txt-center',
                            render: ((obj, item, index) => {
                                return <React.Fragment>
                                    <a onClick={() => this.auditModal(item)}>审核</a>
                                </React.Fragment>
                            })
                        }


                    ]} rowKey={(item) => item.id}
                           pagination={false}
                           dataSource={bills}
                    />
                </Card>

                <Modal title='账单审核' visible={visible} onOk={() => {
                    this.audit()
                }} onCancel={() => {
                    this.setState({visible: false})
                }}>
                    <Radio.Group onChange={(e) => {
                        this.setState({
                            status: e.target.value
                        })
                    }} defaultValue={onAuditBill.status}>
                        {radios.map((radio, index) => {
                            let {value, txt} = radio;
                            return <Radio value={value}>{txt}</Radio>
                        })}
                    </Radio.Group>
                </Modal>
            </div>
        );
    }

}

export default Bills;