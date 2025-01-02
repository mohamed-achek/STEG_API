// assets
import { IconBrandChrome, IconHelp, IconSitemap } from '@tabler/icons';
import OutageIcon from './../assets/images/icons/outage.png';
import ConsumptionIcon from './../assets/images/icons/consumption.png'; // Add an icon for consumption

// constant
const icons = {
    IconBrandChrome: IconBrandChrome,
    IconHelp: IconHelp,
    IconSitemap: IconSitemap,
    OutageIcon: () => <img src={OutageIcon} alt="Outage Icon" style={{ width: '24px', height: '24px' }} />,
    ConsumptionIcon: () => <img src={ConsumptionIcon} alt="Consumption Icon" style={{ width: '24px', height: '24px' }} /> // Add consumption icon
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
        }
    ]
};
