import { SideBarContext } from '@/app/contexts/SideBarContextContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContext } from 'react';
import { FaUserGroup } from "react-icons/fa6";
import { MdWork } from 'react-icons/md';
import { MdOutlineArticle } from 'react-icons/md';
import {
  Menu,
  MenuItem,
  MenuItemStyles,
  Sidebar,
  menuClasses
} from 'react-pro-sidebar';
import { BsFilePost } from 'react-icons/bs';
import { Button } from '@nextui-org/react';
import { Tooltip } from '@nextui-org/react';
import { FiLogOut } from 'react-icons/fi';

const primaryColor = `#0A0A70`

function SideBar() {
  const { isSideBarOpen, toggled, setToggled, setBroken, SetSideBar, broken } =
    useContext(SideBarContext);

  const pathname = usePathname();
  const router = useRouter();
  const themeColors = {
    sidebar: {
      backgroundColor: '#ffffff',
      color: '#807373'
    },
    menu: {
      menuContent: '#fbfcfd',
      icon: '#807373',
      hover: {
        backgroundColor: primaryColor,
        color: '#fff'
      },
      disabled: {
        color: '#807373aa'
      }
    }
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: '16px',
      fontWeight: 500,
      margin: '8px 0'
    },
    icon: ({ active }) => ({
      color: active ? '#fff' : themeColors.menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themeColors.menu.disabled.color
      },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      backgroundColor: active
        ? primaryColor
        : 'rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease-in-out'
    }),
    SubMenuExpandIcon: {
      color: '#000'
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(themeColors.menu.menuContent, !isSideBarOpen ? 1 : 1)
          : 'transparent'
    }),
    button: ({ active }) => ({
      [`&.${menuClasses.disabled}`]: {
        color: themeColors.menu.disabled.color
      },
      backgroundColor: active
        ? hexToRgba(primaryColor, 0.1)
        : 'transparent',
      color: active 
        ? primaryColor
        : themeColors.menu.icon,
      borderRadius: '8px',
      margin: '0 8px',
      padding: '12px',
      transition: 'all 0.2s ease-in-out',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      justifyContent: 'flex-start',
      height: 'auto',

      '&:hover': {
        backgroundColor: active
          ? hexToRgba(primaryColor, 0.1)
          : 'rgba(0, 0, 0, 0.05)',
        transform: 'translateX(4px)'
      },

      '&:active': {
        backgroundColor: active
          ? hexToRgba(primaryColor, 0.15)
          : 'rgba(0, 0, 0, 0.1)',
        transform: 'scale(0.98)'
      }
    }),
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '4px',
      flex: 1,

      '& .menu-title': {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '1.2'
      },

      '& .menu-description': {
        fontSize: '12px',
        color: 'rgba(0, 0, 0, 0.5)',
        lineHeight: '1.2'
      }
    })
  };

  function closeSidebar() {
    if (toggled && broken) {
      setToggled(false);
    }
  }

  return (
    <Sidebar
      collapsed={isSideBarOpen}
      toggled={toggled}
      onBackdropClick={() => {
        SetSideBar(false);
        setToggled(false);
      }}
      onBreakPoint={setBroken}
      breakPoint="md"
      rootStyles={{
        color: themeColors.sidebar.color
      }}
      backgroundColor={themeColors.sidebar.backgroundColor}
    >
      <Image
        src="/logo.png"
        width={200}
        priority
        className="mb-8 p-6 mx-auto"
        height={200}
        alt="logo"
      />

      <Menu menuItemStyles={menuItemStyles}>
        {/* <MenuItem
          icon={<LuHome size={24} />}
          onClick={closeSidebar}
          active={pathname === `/dashboard`}
          component={<Link href={`/dashboard`} />}
        >
          <div className="menu-title">Home</div>
          <div className="menu-description">Dashboard overview</div>
        </MenuItem> */}
        <MenuItem
          icon={<MdOutlineArticle size={24} />}
          onClick={closeSidebar}
          active={pathname === `/dashboard/blogs` || pathname === `/dashboard`}
          component={<Link href={`/dashboard/blogs`} />}
        >
          <div className="menu-title">Blogs</div>
          <div className="menu-description">Manage your blog posts</div>
        </MenuItem>
        <div className=" py-5 absolute bottom-0 left-0 right-0">
          <MenuItem
            icon={<FiLogOut size={24} />}
            onClick={() => {
              closeSidebar();
              router.push('/login');
            }}
          >
            <div className="menu-title">Logout</div>
            <div className="menu-description">Sign out of your account</div>
          </MenuItem>
        </div>
      </Menu>
    </Sidebar>
  );
}

export default SideBar;
