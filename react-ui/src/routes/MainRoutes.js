import React, { lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

// project imports
import MainLayout from './../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
import AuthGuard from './../utils/route-guard/AuthGuard';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/Default')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('../views/outage-page')));
const ConsumptionPage = Loadable(lazy(() => import('../views/consumption-page'))); // Add consumption page routing

//-----------------------|| MAIN ROUTING ||-----------------------//

const MainRoutes = () => {
    const location = useLocation();

    return (
        <Route
            path={[
                '/dashboard/default',
                '/sample-page',
                '/consumption-page' // Add consumption page path
            ]}
        >
            <MainLayout>
                <Switch location={location} key={location.pathname}>
                    <AuthGuard>
                        <Route path="/dashboard/default" component={DashboardDefault} />
                        <Route path="/sample-page" component={SamplePage} />
                        <Route path="/consumption-page" component={ConsumptionPage} /> {/* Add consumption page route */}
                    </AuthGuard>
                </Switch>
            </MainLayout>
        </Route>
    );
};

export default MainRoutes;
