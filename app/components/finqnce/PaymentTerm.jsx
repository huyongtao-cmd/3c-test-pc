import React from 'react';
import { App, CTYPE, Utils } from "../../common";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import { Link } from "react-router-dom";
import { Button, Card, Tooltip, Input, message, Modal, Radio, Icon, InputNumber } from "antd";
import ImgEditor from "../../common/ImgEditor";
import { PosterEdit } from "../../common/CommonEdit";
import "../../assets/css/common/common-edit.less";
import "../../assets/css/account.scss"
import classNames from "classnames";

const RadioGroup = Radio.Group;

class PaymentTerm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            visible: false,
            type: 1,
            account: {},
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        App.api(`/mch/account/items`,).then((result) => {
            this.setState({
                accounts: result,
                loading: false
            });
        });
    }

    submit = () => {
        let { account = {}, type } = this.state;
        App.api(`/mch/account/save`, {
            account: JSON.stringify({
                ...account,
                type: type,
            })
        }).then(() => {
            message.success('创建成功');
            this.setState({ visible: false });
            this.loadData();
        })
    }

    remove = (id) => {
        Modal.confirm({
            title: '确认删除', onOk: () => {
                App.api(`/mch/account/remove`, { id: id }).then(() => {
                    message.success('删除成功');
                    this.loadData();
                })
            },
            onCancel: () => {
            }
        })
    }

    onChange = (e) => {
        let { account = {} } = this.state;
        account["img"] = undefined;
        this.setState({ type: e.target.value, account })
    }

    changeValue = (name, e) => {
        console.log(e.target.value);
        let { account = {} } = this.state;
        account[name] = e.target.value;
        this.setState({ account })
    }

    syncImg = (img) => {
        let { account = {} } = this.state;
        account["img"] = img;
        this.setState({ account });
        message.success('上传成功');
    };

    render() {
        let { accounts = [], visible = false, type = 1, account = {} } = this.state;
        console.log(accounts);
        let bankCard = accounts.find(a => a.type === 1) || {};
        let wechat = accounts.find(a => a.type === 2) || {};
        let alipay = accounts.find(a => a.type === 3) || {};
        console.log(wechat);
        let { accountName, accountNo, bankName } = bankCard;

        let { img } = account;
        const limitDecimals = value => {
            return value.replace(/^(0+)|[^\d]+/g, '');
        }


        return (
            <div className="account-page">
                <BreadcrumbCustom first={CTYPE.link.payment_term.txt} />
                <Card>
                    <Button type="primary" icon={"file-add"} onClick={() => {
                        this.setState({ visible: true, type: 1 })
                    }}>新建收款账户</Button>

                    <div className="sub-title">银行卡</div>
                    <div className="bank">
                        {Object.keys(bankCard).length > 0 && <div className="bank-detail">
                            <p className="p-bank">{bankName}</p>
                            <p className="p-no">{accountNo}</p>
                            <p className="p-name">{accountName}</p>
                            <span onClick={() => {
                                this.remove(bankCard.id)
                            }}>删除</span>
                        </div>}
                    </div>

                    <div className="sub-title">微信</div>
                    <div className="alipay">
                        {Object.keys(wechat).length > 0 && <div className="alipay-detail">
                            <img src={wechat.img || ""} />
                            <span onClick={() => {
                                this.remove(wechat.id)
                            }}>删除</span>
                        </div>}
                    </div>
                    <div className="sub-title">支付宝</div>
                    <div className="alipay">
                        {Object.keys(alipay).length > 0 && < div className="alipay-detail">
                            <img src={alipay.img || ""} />
                            <span onClick={() => {
                                this.remove(alipay.id)
                            }}>删除</span>
                        </div>}
                    </div>
                </Card>

                <Modal title='新建收款账户' visible={visible} onOk={() => {
                    this.submit()
                }} onCancel={() => {
                    this.setState({ visible: false, type: 1, account: {} })
                }}>
                    <RadioGroup onChange={this.onChange} value={type}>
                        <Radio value={1}>银行卡</Radio>
                        <Radio value={2}>微信</Radio>
                        <Radio value={3}>支付宝</Radio>
                    </RadioGroup>
                    <Tooltip title={"一次仅可上传一类账户"}>
                        <Icon type="question-circle" />
                    </Tooltip>

                    {type === 1 && <React.Fragment>
                        <div className="line">
                            <p className="account-p">银行名称：</p>
                            <Input value={account.bankName} maxLength={20} onChange={(e) => {
                                this.changeValue("bankName", e)
                            }} />
                        </div>

                        <div className="line">
                            <p className="account-p">账户名：</p>
                            <Input value={account.accountName} maxLength={20} onChange={(e) => {
                                this.changeValue("accountName", e)
                            }} />
                        </div>
                        <div className="line">
                            <p className="account-p">卡号：</p>
                            <InputNumber value={account.accountNo} formatter={limitDecimals} parser={limitDecimals} maxLength={20} onChange={(value) => {
                                account["accountNo"] = value;
                                this.setState({ account })
                            }} />
                        </div>
                    </React.Fragment>}

                    {type === 3 && <div className="alipay-img">
                        <p className="p-required">收款码：</p>
                        <img src={img} className={classNames("default-img", { "ali-img": img })} />
                        <div className="upload-tip">
                            <Button type='primary' onClick={() => {
                                Utils.common.showImgEditor(1, img, this.syncImg);
                            }}><Icon type="diff" />选择图片</Button>
                        </div>
                    </div>}
                    {type === 2 && <div className="alipay-img">
                        <p className="p-required">收款码：</p>
                        <img src={img} className={classNames("default-img", { "ali-img": img })} />
                        <div className="upload-tip">
                            <Button type='primary' onClick={() => {
                                Utils.common.showImgEditor(1, img, this.syncImg);
                            }}><Icon type="diff" />选择图片</Button>
                        </div>
                    </div>}

                </Modal>
            </div>
        );
    }
}

export default PaymentTerm;
