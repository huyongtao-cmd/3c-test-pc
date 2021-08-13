import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import Page from './common/Page';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Index from './Index';
import templates from "../app/components/product/templates";
import products from "./components/product/Products";
import service from "../app/components/shop/Service";
import bills from "../app/components/finqnce/bills";
import admins from "../app/components/admin/admins";
import adminEdit from "./components/admin/adminEdit";
import trades from "../app/components/trade/Trades";
import productEdit from "../app/components/product/ProductEdit";
import PaymentTerm from "./components/finqnce/PaymentTerm";
import roles from "./components/admin/Roles";
import roleEdit from "./components/admin/RoleEdit";
import TabDemo from './test/TabDemo';


const routes = (
    <HashRouter>
        <Switch>
            <Route path='/' children={() => (
                <Page>
                    <Switch>

                        {/* <Redirect exact from='/' to='/app/dashboard/index' /> */}

                        <Route path='/' exact component={Index} />

                        <Route path='/login' exact component={Login} />

                        <Route path='/tab' exact component={TabDemo} />
                        <Route path={'/app/trade/trades'} component={trades} />
                        <Route path='/app' children={() => (
                            <Index>

                                <Route path='/app/dashboard/index' component={Dashboard} />

                                <Route path={'/app/product/templates'} component={templates} />

                                <Route path={'/app/product/products'} component={products} />

                                <Route path={'/app/product/product-edit/:id/:templateId'} component={productEdit} />

                                <Route path={'/app/shop/service'} component={service} />

                                <Route path={'/app/finance/bills'} component={bills} />

                                <Route path={'/app/admin/admins'} component={admins} />

                                <Route path={'/app/admin/roles'} component={roles} />

                                <Route path={'/app/admin/role-edit/:id'} component={roleEdit} />

                                <Route path={'/app/admin/admin-edit/:id'} component={adminEdit} />

                                {/* <Route path={'/app/trade/trades'} component={trades} /> */}

                                <Route path={'/app/finance/payment_term'} component={PaymentTerm} />
                            </Index>
                        )} />
                    </Switch>
                </Page>
            )}>
            </Route>
        </Switch>
    </HashRouter>
);


export default routes;
