// assets
import { IconBrandChrome, IconHelp, IconSitemap } from '@tabler/icons';
import OutageIcon from './../assets/images/icons/outage.png';
import ConsumptionIcon from './../assets/images/icons/consumption.png'; // Add an icon for consumption
import BillingIcon from './../assets/images/icons/billing.png'; // Add an icon for billing
import PaymentIcon from './../assets/images/icons/payment.png'; // Add an icon for payment

// constant
const icons = {
    IconBrandChrome: IconBrandChrome,
    IconHelp: IconHelp,
    IconSitemap: IconSitemap,
    OutageIcon: () => <img src={OutageIcon} alt="Outage Icon" style={{ width: '24px', height: '24px' }} />,
    ConsumptionIcon: () => <img src={ConsumptionIcon} alt="Consumption Icon" style={{ width: '24px', height: '24px' }} />, // Add consumption icon
    BillingIcon: () => <img src={BillingIcon} alt="Billing Icon" style={{ width: '24px', height: '24px' }} />, // Add billing icon
    PaymentIcon: () => <img src={PaymentIcon} alt="Payment Icon" style={{ width: '24px', height: '24px' }} /> // Add payment icon
};

export const other = {
    id: 'sample-docs-roadmap',
    type: 'group',
    children: [
        {
            id: 'sample-page',
            title: 'Outages',
            type: 'item',
            url: '/sample-page',
            icon: icons.OutageIcon,
            breadcrumbs: false
        },
        {
            id: 'consumption-page',
            title: 'Consumption',
            type: 'item',
            url: '/consumption-page',
            icon: icons.ConsumptionIcon,
            breadcrumbs: false
        },
        {
            id: 'billing-page',
            title: 'Billing',
            type: 'item',
            url: '/billing-page',
            icon: icons.BillingIcon,
            breadcrumbs: false
        },
        {
            id: 'payment-page',
            title: 'Payments',
            type: 'item',
            url: '/payment-page',
            icon: icons.PaymentIcon,
            breadcrumbs: false
        }
    ]
};
