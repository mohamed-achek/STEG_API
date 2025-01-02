// assets
import { IconDeviceAnalytics } from '@tabler/icons';
import DashboardIcon from './../assets/images/icons/dashboard.png'; // Import the new dashboard icon

// constant
const icons = {
    IconDeviceAnalytics,
    DashboardIcon: () => <img src={DashboardIcon} alt="Dashboard Icon" style={{ width: '24px', height: '24px' }} /> // Use the new dashboard icon
};

//-----------------------|| DASHBOARD MENU ITEMS ||-----------------------//

export const dashboard = {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.DashboardIcon,
            breadcrumbs: false
        }
    ]
};
