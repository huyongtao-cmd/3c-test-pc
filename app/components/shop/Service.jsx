import React from 'react';
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {Link} from "react-router-dom";
import {CTYPE} from "../../common";
import {Button, Card, Form, Input} from "antd";
import {PosterEdit} from "../../common/CommonEdit";


const FormItem = Form.Item;

class Service extends React.Component {


    render() {
        return (
            <div>
                <BreadcrumbCustom first={<Link to={CTYPE.link.shop_service.path}>{CTYPE.link.shop_service.txt}</Link>}/>

                <Card title={'客服设置'}
                      extra={<Button type={"primary"} style={{background: '#1890ff', color: '#fff'}}>保存</Button>}>

                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout} label='手机号码'>
                        <Input.TextArea rows={1} placeholder="输入品牌名称" maxLength={140}
                        />
                    </FormItem>

                    <PosterEdit title='客服二维码' type='l'   syncPoster={(url) => {

                    }}/>

                    <FormItem
                        {...CTYPE.formItemLayout} label='详细介绍'>
                        <Input.TextArea rows={2} placeholder="" maxLength={140}
                        />
                    </FormItem>


                </Card>

            </div>
        );
    }
}

export default Service;