import Link from 'next/link';
// import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import Image from 'next/image';
import { useContext } from 'react';
import { SideBarContext } from '@/app/contexts/SideBarContextContext';

const Header = () => {
  const { isSideBarOpen, toggled, setToggled, SetSideBar, broken } =
    useContext(SideBarContext);


  return (
    <header className="sticky top-0 flex w-full bg-white drop-shadow-1 border-b z-[50]">
      <div className="flex flex-grow items-center justify-between px-4 py-8 shadow-2 md:px-6 2xl:px-11 ">
        {broken && (
          <div className="flex items-center gap-2 sm:gap-4 ">
            <button
              aria-controls="sidebar"
              onClick={(e) => {
                e.stopPropagation();
                setToggled(!toggled);
              }}
              className=" block  bg-white  lg:hidden"
            >
              <Image
                src="/menu.svg"
                alt="menu icon"
                sizes='(min-width: 640px) 640px, 100vw'
                width={20}
                height={20}
                style={{ minWidth: 20, minHeight: 20 }}
              />
            </button>
            <Link className="block flex-shrink-0 lg:hidden" href="/">
              <Image width={175} height={175} src="/logo.png" alt="Logo"  />
            </Link>
          </div>
        )}
        <div className="flex flex-row gap-x-1 items-center">
          <div className="flex flex-row gap-x-4 items-center">
            {!broken && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  SetSideBar(!isSideBarOpen);
                }}
              >
                <Image
                  src="/menu.svg"
                  alt="menu icon"
                  width={25}
                  height={25}
                  style={{ minWidth: 25, minHeight: 25 }}
                />
              </button>
            )}

            {/* <p className="font-semibold text-xl" >{activeTabName}</p> */}
          </div>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          {/* <ul className="md:flex hidden items-center gap-2 2xsm:gap-4">
            <DropdownNotification />
          </ul> */}

          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
