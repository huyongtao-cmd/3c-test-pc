import React from 'react';
import Link from "react-router-dom/Link";
import {CTYPE, U, Utils} from "../../common";
import '../../assets/css/common/common-edit.less';
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {Button, Card, Form, Input, Tabs, InputNumber, Icon, message, TreeSelect, Switch, Select} from "antd";
import ProductUtils from "./ProductUtils";
import HtmlEditor from "../../common/HtmlEditor";
import App from "../../common/App";

const {Meta} = Card;
const {TabPane} = Tabs
const FormItem = Form.Item
const InputGroup = Input.Group;
const {Option} = Select;

class ProductEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            templateId: parseInt(this.props.match.params.templateId),
            activeKey: 0,
            product: {},
            qo: {},
            pagination: {
                pageSize: 10,
                current: 1,
                total: 0,
            },
            merchantCategories: [],
            merchantBrands: [],


        }
    }

    componentDidMount() {
        ProductUtils.loadMerchantCategories(this, true);
        this.loadData();

    }

    loadData = () => {
        let {templateId, id} = this.state;
        App.api(`mch/product/merchantBrands`).then((merchantBrands) => {
            this.setState({merchantBrands})
        })

        if (templateId) {
            App.api(`mch/product/template`, {id: templateId}).then((template) => {
                this.setState({
                    product: template
                })
            })
        } else {
            if (id) {
                App.api(`mch/product/product`, {id}).then((product) => {
                    this.setState({
                        product
                    })
                })
            } else {
                this.setState({
                    product: {
                        params: [{label: '', value: ''}],
                        specs: [{
                            imgs: [],
                            params: [{label: '', value: ''}],
                            price: 0,
                            sno: ''
                        }],
                    },
                });
            }
        }

    }


    doImgOpt = (index, opt, img) => {
        console.log(img)
        let {product = {}, activeKey} = this.state;
        let {specs = []} = product;
        let {imgs = []} = specs[parseInt(activeKey)];

        if (opt === 'left') {
            if (index === 0) {
                message.warn('??????????????????');
                return;
            }
            imgs = U.array.swap(imgs, index, index - 1);
        } else if (opt === 'right') {
            if (index === imgs.length - 1) {
                message.warn('?????????????????????');
                return;
            }
            imgs = U.array.swap(imgs, index, index + 1);
        } else if (opt === 'remove') {
            imgs = U.array.remove(imgs, index);
        } else if (opt === 'add') {
            imgs.push(img);
        }

        specs[parseInt(activeKey)].imgs = imgs;

        this.setState({
            product: {
                ...product,
                specs
            }
        });
    };

    paneContent = () => {

        let {
            activeKey, product = {
                params: [{label: '', value: ''}],
                specs: [{
                    imgs: [],
                    params: [{label: '', value: ''}],
                    price: 0,
                    sno: '',
                    stock: 0,
                }],
            }
        } = this.state;

        console.log(product)

        let {specs = []} = product;
        let spec = specs.length > 0 ? specs[parseInt(activeKey)] : {};
        let {imgs = [], params = [], price, sno, stock} = spec;

        return <div className={'common-edit-page'}>
            <Card>
                <div className='imgs-opt-block'>
                    {imgs.map((img, index) => {
                        return <Card key={index} className='img-card-edit'
                                     cover={<img src={img}/>}
                                     actions={[
                                         <Icon type="left" key="left"
                                               onClick={() => this.doImgOpt(index, 'left', img)}/>,
                                         <Icon type="delete" key="delete"
                                               onClick={() => this.doImgOpt(index, 'remove', img)}/>,
                                         <Icon type="right" key="right"
                                               onClick={() => this.doImgOpt(index, 'right', img)}/>
                                     ]}
                        />
                    })}

                    {imgs.length < 6 &&
                    <Card cover={<div className='up-icon'/>}
                          className={'img-card-add'} onClick={() => {
                        Utils.common.showImgEditor(CTYPE.imgeditorscale.square, null, (img) => this.doImgOpt(0, 'add', img));
                    }}>
                        <Meta description='??????750*422,??????1M .jpg???.png??????'/>
                    </Card>}

                </div>
            </Card>
            <Card title={'*??????'} size={"small"} style={{margin: '10px 0', width: '100%'}}>
                {params.map((param, index) => {
                    let {label, value} = param;
                    return <div key={index}>
                        <InputGroup>
                            <Input onChange={(e) => {
                                specs[parseInt(activeKey)].params[index].label = e.target.value;
                                this.setState({
                                    product: {
                                        ...product,
                                        specs
                                    }
                                })
                            }
                            } placeholder={'?????????'} value={label} style={{width: '150px'}}/>
                            <Input onChange={(e) => {
                                specs[parseInt(activeKey)].params[index].value = e.target.value;
                                this.setState({
                                    product: {
                                        ...product,
                                        specs
                                    }
                                })
                            }}
                                   placeholder={'????????????'} value={value} style={{width: '500px'}}/>
                            {params.length === 2 ?
                                <Button
                                    onClick={() => {
                                        params = U.array.remove(params, index)
                                        spec.params = params;
                                        specs[parseInt(activeKey)] = spec;
                                        this.setState({
                                            product: {
                                                ...product,
                                                specs: specs
                                            }
                                        })
                                    }}
                                    icon={'minus'} style={{color: '#fff', background: '#ff4d4f'}}/> : <Button
                                    onClick={() => {
                                        params.push({label: '', value: ''});
                                        spec.params = params;
                                        specs[parseInt(activeKey)] = spec;
                                        this.setState({
                                            product: {
                                                ...product,
                                                specs: specs || []
                                            }
                                        })
                                    }}
                                    icon={'plus'} type={"primary"}/>}
                        </InputGroup>
                    </div>
                })
                }
            </Card>

            <Card title={'*??????'} size={"small"} style={{margin: '10px 0', width: '100%'}}>
                <FormItem required={true} {...CTYPE.formItemLayout} label='????????????'>
                    <InputNumber value={U.price.cent2yuan(price)} onChange={(e) => {
                        specs[parseInt(activeKey)].price = U.price.yuan2cent(e);
                        this.setState({
                            product: {
                                ...product,
                                specs
                            }
                        })
                    }} style={{width: '100px'}}/>
                </FormItem>

                <FormItem required={true} {...CTYPE.formItemLayout} label='??????'>
                    <Input value={stock} onChange={(e) => {
                        specs[parseInt(activeKey)].stock = e.target.value;
                        this.setState({
                            product: {
                                ...product,
                                specs
                            }
                        })

                    }}
                           style={{width: '100px'}}/>
                </FormItem>
                <FormItem required={true} {...CTYPE.formItemLayout} label='??????'>
                    <Input value={sno} onChange={(e) => {
                        specs[parseInt(activeKey)].sno = e.target.value;
                        this.setState({
                            product: {
                                ...product,
                                specs
                            }
                        })

                    }}
                           style={{width: '100px'}}/>
                </FormItem>

            </Card>
        </div>
    }

    onEdit = (targetKey, action) => {
        let {product = {}, activeKey} = this.state;
        let {specs = []} = product;
        if (action === 'add') {
            specs.push({
                imgs: [],
                params: [{label: '', val: ''}]
            });
        } else if (action === 'remove') {
            specs = U.array.remove(specs, parseInt(activeKey));
            activeKey = 0;
        }
        this.setState({
            product: {
                ...product,
                specs
            }, activeKey
        });
    };

    save = () => {
        let {product = {}, templateId, id} = this.state;
        let {name, params = [], specs = [], sequence, content, brandId, priority} = product;
        console.log(product);
        if (U.str.isEmpty(name) || name.size > 40) {
            message.warn("?????????????????????????????????????????????40??????")
            return;
        }
        let pLength = params.length
        if (!sequence) {
            message.warn("???????????????")
            return;
        }
        if (!brandId) {
            message.warn("???????????????")
            return;
        }
        if (U.str.isEmpty(content)) {
            message.warn("????????????????????????")
            return;
        }
        if (!pLength) {
            message.warn("??????????????????????????????")
            return;
        }
        if (!priority) {
            message.warn("???????????????")
            return;
        }

        let index = 0;
        let errMsg = ''
        for (let i = 0; i < pLength; i++) {
            let {label, value} = params[i]
            if (U.str.isEmpty(label) || label.size > 15) {
                errMsg = '?????????????????????????????????????????????????????????15??????'
                index = i + 1;
                break;
            }
            if (U.str.isEmpty(value)) {
                errMsg = '??????????????????????????????'
                index = i + 1;
                break;
            }
        }
        console.log('error' + index)
        if (index) {
            message.warn(`?????????${index}????????????${errMsg}`)
            return;
        }

        let sLength = specs.length;
        let index2 = 0;
        let errMsg2 = ''
        if (!sLength) {
            message.warn("?????????????????????????????????")
            return;
        }
        for (let k = 0; k < sLength; k++) {
            let {price, sno, imgs = []} = specs[k];
            if (!price || price <= 0) {
                errMsg = '???????????????0'
                index = k + 1;
                break;
            }
            if (U.str.isEmpty(sno)) {
                errMsg = '??????????????????'
                index = k + 1;
                break;
            }
            if (imgs.length === 0) {
                errMsg = "????????????????????????"
                index = k + 1;
                break;
            }
            if (!specs[k].params.length) {
                errMsg = '??????????????????????????????'
                index = k + 1;
                break;
            }
            if (!specs[k].stock && specs[k].stock !== 0) {
                errMsg = "??????"
                index = k + 1;
            }
            for (let j = 0; j < specs[k].params.length; j++) {

                if (U.str.isEmpty(specs[k].params[j].label) || specs[k].params[j].label.size > 15) {
                    errMsg2 = '???????????????????????????????????????????????????15??????'
                    index2 = j + 1;
                    index = k + 1
                    break;
                }
                if (U.str.isEmpty(specs[k].params[j].value)) {
                    errMsg2 = '????????????????????????'
                    index2 = j + 1;
                    index = k + 1
                    break;
                }
            }
        }
        if (index) {
            message.warn(`???${index}??????${errMsg}`.concat(index2 ? `???${index2}??????${errMsg2}` : ''))
            return;
        }

        App.api(`mch/product/saveProduct`, {
            product: JSON.stringify({
                ...product,
                id: templateId ? 0 : id,
            })
        }).then(() => {
            message.success(`${templateId ? "??????" : "??????"}??????`)
            window.history.back()
        })

    }


    render() {
        let {id, activeKey, product = {}, merchantCategories = [], merchantBrands = [], pagination = {}} = this.state;
        let {specs = [], params = [], content, sequence, brandId, name, status, priority} = product;

        let {current, total} = pagination;
        return (
            <div>
                <BreadcrumbCustom
                    first={<Link to={CTYPE.link.product_products.path}>{CTYPE.link.product_products.txt}</Link>}
                    second={id === 0 ? '????????????' : '????????????'}
                />
                <Card extra={<Button type={"primary"} icon={'save'} onClick={() => {
                    this.save()
                }}>??????</Button>}>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout}
                        label={'??????'}
                    >
                        <TreeSelect style={{width: '500px'}} value={sequence}
                                    treeData={merchantCategories} onChange={(value) => {
                            this.setState({
                                product: {
                                    ...product,
                                    sequence: value,
                                }
                            })
                            console.log(value);
                        }}/>
                    </FormItem>
                    <FormItem
                        {...CTYPE.formItemLayout}
                        label={'??????'}
                    >
                        <Select value={String(brandId)} onChange={(value) => {
                            this.setState({
                                product: {
                                    ...product,
                                    brandId: parseInt(value),
                                }
                            })
                            console.log(value);
                        }}
                                style={{width: '500px'}}>
                            {
                                merchantBrands.map((brand, index) => {
                                    return <Option key={index} value={String(brand.id)}>{brand.name}</Option>
                                })

                            }

                        </Select>
                    </FormItem>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout}
                        label={'??????'}
                    >
                        <Input value={name} placeholder={'????????????'} onChange={(e) => {
                            this.setState({
                                product: {
                                    ...product,
                                    name: e.target.value,
                                }
                            })
                        }}/>
                    </FormItem>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout}
                        label={'????????????'}
                    >
                        <Tabs
                            onChange={(activeKey) => {
                                this.setState({activeKey})
                            }}
                            activeKey={activeKey.toString()}
                            type="editable-card"
                            onEdit={this.onEdit}
                        >{specs.map((spec, index) => {
                            return <TabPane tab={`??????${index + 1}`} key={index} closable={specs.length > 1}>
                                {this.paneContent()}
                            </TabPane>
                        })
                        }</Tabs>


                    </FormItem>
                    <FormItem required={true} {...CTYPE.formItemLayout} label='????????????'>
                        <Card style={{width: '800px'}}> {params.map((param, index) => {
                            return <div className={'param'} key={index}>
                                <InputGroup>
                                    <Input onChange={(e) => {
                                        params[index].label = e.target.value;
                                        this.setState({
                                            product: {
                                                ...product,
                                                params
                                            }
                                        })
                                    }}
                                           placeholder={'?????????'} value={param.label} style={{width: '150px'}}/>
                                    <Input onChange={(e) => {
                                        params[index].value = e.target.value;
                                        this.setState({
                                            product: {
                                                ...product,
                                                params
                                            }
                                        })
                                    }} placeholder={'????????????'} value={param.value} style={{width: '500px'}}/>
                                    {params.length > 1 &&
                                    <Button onClick={() => {
                                        console.log("-----")
                                        params = U.array.remove(params, index)
                                        this.setState({
                                            product: {
                                                ...product,
                                                params: params
                                            }
                                        })
                                    }}
                                            icon="minus" type={'button'}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                color: '#fff',
                                                background: '#ff4d4f'
                                            }}/>}
                                    {params.length === (index + 1) &&
                                    <Button onClick={() => {
                                        console.log('+++++')
                                        params.push({label: '', value: ''})
                                        this.setState({
                                            product: {
                                                ...product,
                                                params: params
                                            }
                                        })
                                    }}
                                            icon="plus" type="primary" style={{width: '32px', height: '32px'}}/>}
                                </InputGroup>
                            </div>
                        })}
                        </Card>
                    </FormItem>
                    <FormItem required={true} {...CTYPE.formItemLayout} label='??????'>
                        <Switch defaultChecked={false} onChange={(checked, event) => {
                            {
                                checked ? (status = 1) : (status = 2)
                            }
                            this.setState({
                                product: {
                                    ...product,
                                    status: status
                                }
                            })
                        }}/>
                    </FormItem>
                    <FormItem required={true} {...CTYPE.formItemLayout} label='??????'>
                        <InputNumber value={priority} min={1} onChange={(value) => {
                            this.setState({
                                product: {
                                    ...product,
                                    priority: value,
                                }
                            })
                        }}/>
                    </FormItem>
                    <FormItem required={false} {...CTYPE.formItemLayout} label='????????????'>
                        <HtmlEditor content={content} syncContent={(content) => {
                            this.setState({
                                product: {
                                    ...product,
                                    content: content
                                }
                            })

                        }}/>
                    </FormItem>

                </Card>
            </div>
        );
    }
}

export default ProductEdit;