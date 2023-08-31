// constant
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Button from "@mui/material/Button";
import HomeIcon from '@mui/icons-material/Home';
import WalletIcon from '@mui/icons-material/Wallet';
import ListAltIcon from '@mui/icons-material/ListAlt';
import BugReportIcon from '@mui/icons-material/BugReport';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import RouterIcon from '@mui/icons-material/Router';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

// ==============================|| MENU ITEMS ||============================== //
const MenuOptions = [
    {
        id: 'create-strategy',
        type: 'group',
        children: [
            {
                id: 'create-strategy',
                title: '创建策略',
                type: 'item',
                url: '/sample-page',
                icon: AddBoxIcon,
                breadcrumbs: false
            }

        ]
    },
    {
        id: 'detail',
        type: 'group',
        children: [
            {
                id: 'home',
                title: '总览',
                type: 'item',
                url: '/home',
                icon: HomeIcon,
                breadcrumbs: false
            },
            {
                id: 'wallet-manage',
                title: '钱包管理',
                type: 'item',
                url: '/wallet-manage',
                icon: WalletIcon,
                breadcrumbs: false
            },
            {
                id: 'strategy-list',
                title: '策略列表',
                type: 'item',
                url: '/sample-page',
                icon: ListAltIcon,
                breadcrumbs: false
            },
            {
                id: 'strategy-check',
                title: '策略验证',
                type: 'item',
                url: '/sample-page',
                icon: BugReportIcon,
                breadcrumbs: false
            },
            {
                id: 'trade-online',
                title: '在线交易',
                type: 'item',
                url: '/sample-page',
                icon: ShoppingBagIcon,
                breadcrumbs: false
            },
            {
                id: 'vpn-setting',
                title: '代理设置',
                type: 'item',
                url: '/sample-page',
                icon: RouterIcon,
                breadcrumbs: false
            },
            {
                id: 'ai-conversion',
                title: '智能问答',
                type: 'item',
                url: 'https://codedthemes.gitbook.io/berry/',
                icon: HeadsetMicIcon,
                external: true,
                target: true
            }
        ]
    }
];

const menuItems = {
    items: MenuOptions
};

export default menuItems;
