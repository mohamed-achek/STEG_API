import React, { lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

// project imports
import MainLayout from './../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
import AuthGuard from './../utils/route-guard/AuthGuard';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/Default')));

// pages routing
const SamplePage = Loadable(lazy(() => import('../views/outage-page')));
const ConsumptionPage = Loadable(lazy(() => import('../views/consumption-page'))); // Add consumption page routing
const BillingPage = Loadable(lazy(() => import('../views/billing-page'))); // Add billing page routing
const PaymentPage = Loadable(lazy(() => import('../views/payment-page'))); // Add payment page routing
const CheckoutPage = Loadable(lazy(() => import('../views/billing-page/Checkoutpage'))); // Add checkout page routing

//-----------------------|| MAIN ROUTING ||-----------------------//

const MainRoutes = () => {
    const location = useLocation();

    return (
        <Route
            path={[
                '/dashboard/default',
                '/sample-page',
                '/consumption-page',
                '/billing-page',
                '/payment-page',
                '/checkout/:id',  // Add checkout page path
                '/login'  // Add login page path
            ]}
        >
            <MainLayout>
                <Switch location={location} key={location.pathname}>
                    <AuthGuard>
                        <Route path="/dashboard/default" component={DashboardDefault} />
                        <Route path="/sample-page" component={SamplePage} />
                        <Route path="/consumption-page" component={ConsumptionPage} /> {}
                        <Route path="/billing-page" component={BillingPage} /> {}
                        <Route path="/payment-page" component={PaymentPage} /> {}
                        <Route path="/checkout/:id" component={CheckoutPage} /> 
                    </AuthGuard>
                </Switch>
            </MainLayout>
        </Route>
    );
};

export default MainRoutes;
