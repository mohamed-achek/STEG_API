// assets
import { IconBrandChrome, IconHelp, IconSitemap } from '@tabler/icons';
import OutageIcon from './../assets/images/icons/outage.png';

// constant
const icons = {
    IconBrandChrome: IconBrandChrome,
    IconHelp: IconHelp,
    IconSitemap: IconSitemap,
    OutageIcon: () => <img src={OutageIcon} alt="Outage Icon" style={{ width: '24px', height: '24px' }} />
};

//-----------------------|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||-----------------------//

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
    ]
};
