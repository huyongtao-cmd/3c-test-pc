import React from 'react';
import {Button, Card, Pagination, Table, TreeSelect} from 'antd';
import Link from "react-router-dom/Link";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {App, CTYPE, U, Utils} from "../../common";
import {Menu, Input, Dropdown, Icon, Divider, Modal, message} from "antd";
import ProductUtils from "./ProductUtils";
import TemplateUtils from "./TemplateUtils";


const Search = Input.Search;

class Products extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            products: [],
            merchantCategories: [],
            qo: {},
            pagination: {
                pageSize: 10,
                current: 1,
                total: 0,
            },
            selectIds: [],
            selectedRows: []
        }

    }

    componentDidMount() {
        this.loadData()
        ProductUtils.loadMerchantCategories(this, true)
    }

    loadData = () => {
        let {qo} = this.state;
        console.log(qo)
        App.api(`mch/product/products`, {qo: JSON.stringify(qo)}).then((res) => {
            let pagination = Utils.pager.convert2Pagination(res);
            this.setState({

                products: res.content,
                pagination: pagination,
            })
        })

    }

    reload = (key, value) => {
        let {qo} = this.state;
        qo[key] = value;
        this.setState({
            qo: qo
        })
        this.loadData();
    }

    edit = (product) => {
        App.go(`/app/product/product-edit/${product.id}/${0}`)
    }

    changeStatus = (id) => {
        Modal.confirm({
            title: '确认修改状态', onOk: () => {
                App.api('mch/product/changeStatus', {id: id}).then(() => {
                    this.loadData();
                    message.success('修改状态成功')
                })
            },
            onCancel: () => {

            }
        })
    }


    render() {

        let {products = [], merchantCategories = [], pagination = {}, selectedRows = []} = this.state;
        let {current, total} = pagination;
        return (
            <div>
                <BreadcrumbCustom
                    first={<Link to={CTYPE.link.product_products.path}>{CTYPE.link.product_products.txt}</Link>}/>
                <Card>
                    <div style={{display: 'flex'}}>
                        <div style={{flex: '0 0 auto'}}>
                            <Button onClick={() => {this.edit({id: 0})}} icon={'file-add'} type={"primary"}>
                                添加
                            </Button>
                            <Button disabled={selectedRows.length <= 0}>{selectedRows.length <= 0 ? '批量删除' : `删除${selectedRows.length}条`}
                            </Button>
                        </div>
                        <div style={{flex: '1', textAlign: 'right'}}><TreeSelect style={{float: 'right'}}
                                                                                 allowClear={true}
                                                                                 treeCheckable={true}
                                                                                 treeData={merchantCategories}
                                                                                 placeholder={'请选择分类'}
                                                                                 onChange={(value) => {
                                                                                     this.reload('sequence', value)
                                                                                 }}
                                                                                 style={{width: "300px"}}/>


                            <Search onSearch={(value) => this.reload('name', value)} style={{width: '200px'}}
                                    placeholder={'请输入名称查询'} onChange={(e) => {

                            }}/></div>
                    </div>

                    <div className={'clearfix-h20'}/>
                    <Table rowSelection={{
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setState({
                                selectedRows: selectedRows
                            })

                        }
                    }}
                           columns={[{
                               title: '序号',
                               dataIndex: 'id',
                               className: 'txt-center',
                               render: (col, row, i) => i + 1
                           }, {
                               title: '类别',
                               dataIndex: 'sequence',
                               className: 'txt-center',
                               render: ((categoryId, product, index) => {
                                   return <span>{ProductUtils.getCategoryName(merchantCategories, product.sequence)}</span>
                               })

                           }, {
                               title: '产品名称',
                               dataIndex: 'name',
                               className: 'txt-center',
                           }, {
                               title: '图片',
                               dataIndex: 'img',
                               className: 'txt-center',
                               render: (obj, template, index) => {
                                   let {specs = []} = template;
                                   let images = [];
                                   specs.map((spec, index) => {
                                       let {imgs = []} = spec;
                                       imgs.map((img, index) => {
                                           images.push(img)
                                       })
                                   })
                                   return <img style={{width: '60px', height: '60px'}} src={images[0]}
                                               onClick={() => Utils.common.showImgLightbox(images)}/>

                               }
                           },
                               {
                                   title: '规格',
                                   dataIndex: 'specs_count',
                                   className: 'txt-center',
                                   width: '80px',
                                   render: (c, item, index) => {
                                       let {specs = []} = item;
                                       return <a
                                           onClick={() => TemplateUtils.templateDrawer(products, index)}>【{specs.length}】</a>
                                   }
                               }, {
                                   title: '参数',
                                   dataIndex: 'params_count',
                                   className: 'txt-center',
                                   width: '80px',
                                   render: (c, item, index) => {
                                       let {params = []} = item;
                                       return <a
                                           onClick={() => TemplateUtils.templateDrawer(products, index)}>【{params.length}】</a>
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
                                       let {status} = template;
                                       return <span>{Utils.common.byte2status(template.status)}</span>
                                   }
                               }, {
                                   title: '操作',
                                   dataIndex: 'option',
                                   className: 'txt-center',
                                   render: (obj, product, index) => {
                                       let {status} = product;
                                       return <Dropdown overlay={<Menu>
                                           <Menu.Item key="1">
                                               <a onClick={() => this.edit(product)}>编辑</a>
                                           </Menu.Item>
                                           <Divider/>
                                           <Menu.Item key="2">
                                               <a onClick={() => this.changeStatus(product.id)}>{status === 1 && '下架'}{status === 2 && '上架'}</a>
                                           </Menu.Item>

                                       </Menu>} trigger={['click']}>
                                           <a className="ant-dropdown-link">
                                               操作 <Icon type="down"/>
                                           </a>

                                       </Dropdown>
                                   }

                               }]}
                           pagination={false}
                           dataSource={products}
                           rowKey={(item) => item.id}
                    />
                    <Pagination style={{float: 'right'}} total={total} showSizeChanger
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
                                }}/>

                </Card>
            </div>
        );
    }
}

export default Products;