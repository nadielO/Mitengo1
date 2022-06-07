// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  menuItem: getIcon('ic_menu_item'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      
      { title: 'dashboard', path: PATH_DASHBOARD.general.app, icon: ICONS.analytics },
      
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // USER
      {
        title: 'Growers',
        path: PATH_DASHBOARD.growers.root,
        icon: ICONS.user,
        children: [
          
          { title: 'list', path: PATH_DASHBOARD.growers.list },
          
        ],
      },
      

      
      {
        title: 'Trees',
        path: PATH_DASHBOARD.trees.root,
        icon: ICONS.cart,
        children: [
         
          { title: 'list', path: PATH_DASHBOARD.trees.list },
          
        ],
      },
      

      // INVOICE
      {
        title: 'Locations',
        path: PATH_DASHBOARD.locations.root,
        icon: ICONS.invoice,
        children: [
          { title: 'list', path: PATH_DASHBOARD.locations.list },
        ],
      },

      // BLOG
      {
        title: 'Gallery',
        path: PATH_DASHBOARD.gallery.root,
        icon: ICONS.blog,
        children: [
          { title: 'posts', path: PATH_DASHBOARD.gallery.posts },
          
        ],
      },
      {
        title: 'Sales',
        path: PATH_DASHBOARD.sales.root,
        icon: ICONS.kanban,
        children: [
         
          { title: 'list', path: PATH_DASHBOARD.sales.list },
          
        ],
      },
    ],
  },

  // APP
  // ----------------------------------------------------------------------
  
];

export default navConfig;
