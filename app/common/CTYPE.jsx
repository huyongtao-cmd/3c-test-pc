let CTYPE = (() => {

    let maxlength = {title: 40, intro: 500, descr: 140};
    let minlength = {title: 1, intro: 1};
    let eidtMaxWidth = 1800;
    let eidtMinWidth = 900;
    let formStyle = {minWidth: eidtMinWidth, maxWidth: eidtMaxWidth, marginTop: '20px'};

    return {

        minprice: 0,
        maxprice: 1000000,

        eidtMaxWidth: 1800,

        eidtMinWidth: 900,

        maxVisitNum: 9999999,

        maxlength: maxlength,

        minlength: minlength,
        pagination: {pageSize: 20},

        formStyle,

        commonPagination: {showQuickJumper: true, showSizeChanger: true, showTotal: total => `总共 ${total} 条`},

        fieldDecorator_rule_title: {
            type: 'string',
            required: true,
            message: `标题长度为${minlength.title}~${maxlength.title}个字`,
            whitespace: true,
            min: minlength.title,
            max: maxlength.title
        },

        expirePeriods: [{key: '1D', label: '一天'},
            {key: '3D', label: '三天'},
            {key: '1W', label: '一周'},
            {key: '1M', label: '一个月'},
            {key: '3M', label: '三个月'},
            {key: '6M', label: '六个月'},
            {key: '1Y', label: '一年'},
            {key: '2Y', label: '两年'},
            {key: '3Y', label: '三年'},
            {key: '5Y', label: '五年'},
            {key: '10Y', label: '十年'}],

        link: {
            admin_admins: {key: '/app/admin/admins', path: '/app/admin/admins', txt: '管理员'},
            admin_roles: {key: '/app/admin/roles', path: '/app/admin/roles', txt: '权限组'},

            articles: {key: '/app/content/articles', path: '/app/content/articles', txt: '文章管理'},
            tags: {key: '/app/content/tags', path: '/app/content/tags', txt: '新闻标签管理'},



            finance_bills: {key: '/app/finance/bills', path: '/app/finance/bills', txt: '账单'},
            payment_term:{key:'/app/finance/payment_term',path:'/app/finance/payment_term',txt:'收款方式'},
            shop_service:{key:'/app/shop/service',path:'/app/shop/service',txt:'客服设置'},
            trade_trades:{key:'/app/trade/trades',path:'/app/trade/trades',txt:'订单列表'},
            product_products:{key:'/app/product/products',path:'/app/product/products',txt:'我的产品'},
            product_templates:{key:'/app/product/templates',path:'/app/product/templates',txt:'我的模板'},


        },

        //图片裁切工具比例
        imgeditorscale: {
            square: 1,
            rectangle_v: 1.7778,
            rectangle_h: 0.5625,
            rectangle_ad: 0.29
        },

        imgeditorscaleCourse: {
            square: 0.57,
            rectangle_v: 1,
            rectangle_h: 1,
            rectangle_ad: 0.29
        },

        formItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        dialogItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        shortFormItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 4},
                sm: {span: 3},
            },
        },
        longFormItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        tailFormItemLayout: {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 3,
                },
            },
        },
        file: {
            posters: {
                maxSize: 1024 * 1024,
            }
        },
        REGION_PATH: window.location.protocol + '//c1.wakkaa.com/assets/pca-code.json',

        redirectTypes: [{value: 'NONE', label: '不跳转'}, {
            value: 'LINK',
            label: 'url跳转'
        }, {
            value: 'ARTICLES', label: '新闻模块'
        }, {
            value: 'ARTICLE', label: '文章单页', withPayload: true
        }],

        colors: ['#f50', '#2db7f5', '#87d068', '#108ee9'],
        qqMapKey:'7GKBZ-O5IWS-QKPOR-66QSX-7XUUK-O7BF5'

    };

})();

export default CTYPE;
