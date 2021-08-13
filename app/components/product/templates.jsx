import React from 'react';
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import { App, CTYPE, U, Utils } from "../../common";
import { Link } from 'react-router-dom';
import { Button, Card, Table, Input, Select, TreeSelect, Dropdown, Menu, Icon, Pagination } from "antd";
import ProductUtils from "./ProductUtils";
import TemplateUtils from "./TemplateUtils";

const { SHOW_PARENT } = TreeSelect;
const Search = Input.Search;


class Templates extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            merchantCategories: [],
            productCategories: [],
            templates: [],
            qo: {},
            pagination: {
                pageSize: 10,
                current: 1,
                total: 0,
            },
        }
    }

    componentDidMount() {
        this.loadData();
        ProductUtils.loadMerchantCategories(this, false);
    }

    loadData = () => {
        let { qo } = this.state;
        App.api(`mch/product/merchantTemplate`, { qo: JSON.stringify(qo) }).then((res) => {
            let pagination = Utils.pager.convert2Pagination(res);
            this.setState({
                templates: res.content,
                pagination: pagination,
            })
        })
    }


    createProduct = (template) => {
        App.go(`/app/product/product-edit/${0}/${template.id}`)
    }

    reload = (key, value) => {
        let { qo } = this.state;
        qo[key] = value;
        this.setState({
            qo: qo
        })
        this.loadData();
    }

    render() {

        let { merchantCategories = [], templates = [], pagination } = this.state;
        let { current, total } = pagination;
        return (
            <div>
                <BreadcrumbCustom
                    first={<Link to={CTYPE.link.product_templates.path}>{CTYPE.link.product_templates.txt}</Link>} />
                <Card>
                    <div>
                        <TreeSelect style={{ float: 'right' }} allowClear={true} treeCheckable={true}
                            treeData={merchantCategories}
                            placeholder={'请选择分类'}
                            showCheckedStrategy={SHOW_PARENT}
                            style={{ width: "300px" }}
                            onChange={(value) => {
                                console.log(value)
                                this.reload('sequence', value)
                            }}
                        />
                        <Search style={{ width: '200px', float: 'right' }} placeholder={"输入名称查询"} onSearch={(value) => {
                            this.reload('title', value)
                        }} />
                    </div>
                    <div className={'clearfix-h20'} />
                    <Table
                        columns={[{
                            title: '序号',
                            dataIndex: 'id',
                            className: 'txt-center',
                            render: (col, row, i) => i + 1
                        }, {
                            title: '类别',
                            dataIndex: 'sequence',
                            className: 'txt-center',
                            render: ((categoryId, template, index) => {
                                return <span>{ProductUtils.getCategoryName(merchantCategories, template.sequence)}</span>
                            })

                        }, {
                            title: '产品名称',
                            dataIndex: 'title',
                            className: 'txt-center',
                        }, {
                            title: '图片',
                            dataIndex: 'img',
                            className: 'txt-center',
                            render: (obj, template, index) => {
                                let { specs = [] } = template;
                                let images = [];
                                specs.map((spec, index) => {
                                    let { imgs = [] } = spec;
                                    imgs.map((img, index) => {
                                        images.push(img)
                                    })
                                })
                                return <img style={{ width: '60px', height: '60px' }} src={images[0]}
                                    onClick={() => Utils.common.showImgLightbox(images)} />

                            }
                        },
                        {
                            title: '规格',
                            dataIndex: 'specs_count',
                            className: 'txt-center',
                            width: '80px',
                            render: (c, item, index) => {
                                let { specs = [] } = item;
                                return <a onClick={() => TemplateUtils.templateDrawer(item)}>【{specs.length}】</a>
                            }
                        }, {
                            title: '参数',
                            dataIndex: 'params_count',
                            className: 'txt-center',
                            width: '80px',
                            render: (c, item, index) => {
                                let { params = [] } = item;
                                return <a onClick={() => TemplateUtils.templateDrawer(item)}>【{params.length}】</a>
                            }
                        },
                        {
                            title: '创建时间',
                            dataIndex: 'createdAt',
                            className: 'txt-center',
                            render: (obj, merchant, index) => {
                                return <span>{U.date.format(new Date(merchant['createdAt'] || 0), 'yyyy-MM-dd HH:mm:ss')}</span>
                            }
                        }, {
                            title: '状态',
                            dataIndex: 'status',
                            className: 'txt-center',
                            render: (obj, template, index) => {
                                let { status } = template;
                                return <span>{Utils.common.byte2status(template.status)}</span>
                            }
                        }, {
                            title: '操作',
                            dataIndex: 'option',
                            className: 'txt-center',
                            render: (obj, template, index) => {
                                return <Dropdown overlay={<Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.createProduct(template)}>复制</a>
                                    </Menu.Item>
                                </Menu>} trigger={['click']}>
                                    <a className="ant-dropdown-link">
                                        操作 <Icon type="down" />
                                    </a>
                                </Dropdown>
                            }

                        }]}
                        dataSource={templates}
                        pagination={false}
                        rowKey={(item) => item.id}
                    />
                    <Pagination style={{ float: 'right' }} total={total} showSizeChanger
                        onShowSizeChange={(current, size) => {
                            this.setState({
                                pagination: {
                                    ...pagination,
                                    current: current,
                                    pageSize: size
                                }
                            })
                        }} current={current}
                        onChange={(current) => {
                            this.setState({
                                pagination: {
                                    ...pagination,
                                    current: current
                                }
                            })
                        }} />

                </Card>
            </div>
        );
    }
}

export default Templates;