import React, { createContext, useContext, useEffect, useState } from 'react';
import { useP2P } from '../hooks/useP2P';
import { useBluetooth } from '../hooks/useBluetooth';

const P2PContext = createContext<any>(null);

export const P2PProvider: React.FC = ({ children }) => {
  const p2p = useP2P();
  const bluetooth = useBluetooth();
  
  return (
    <P2PContext.Provider value={{ p2p, bluetooth }}>
      {children}
    </P2PContext.Provider>
  );
};

export const useP2PContext = () => useContext(P2PContext);