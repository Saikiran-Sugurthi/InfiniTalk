import React, { createContext, useContext, useState } from "react";

const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newState) => {
    setOpen(newState);
  };

  return (
    <DrawerContext.Provider value={{ open, toggleDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => useContext(DrawerContext);
