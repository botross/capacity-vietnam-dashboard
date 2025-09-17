import { createContext, useState } from 'react';

export const SideBarContext = createContext<{
  isSideBarOpen: boolean;
  SetSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggleSideBar: () => void;
  toggled: boolean;
  broken: boolean;
  setToggled: React.Dispatch<React.SetStateAction<boolean>>;
  setBroken: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isSideBarOpen: false,
  toggled: false,
  broken: false,
  SetSideBar: () => null,
  handleToggleSideBar: () => null,
  setToggled: () => null,
  setBroken: () => null
});

type Props = {
  children: React.ReactNode;
};

function SideBarContextContext({ children }: Props) {
  const [isSideBarOpen, SetSideBar] = useState<boolean>(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);

  function handleToggleSideBar() {
    SetSideBar(!isSideBarOpen);
  }

  return (
    <SideBarContext.Provider
      value={{
        isSideBarOpen,
        SetSideBar,
        handleToggleSideBar,
        setToggled,
        toggled,
        setBroken,
        broken
      }}
    >
      {children}
    </SideBarContext.Provider>
  );
}

export default SideBarContextContext;
