import React, { createContext, FC, useContext } from 'react';
import { IpcRendererService } from '../shared/ipc/IpcRendererService';

const defaultValue = new IpcRendererService(window.ipcRenderer);

const IpcRendererContext = createContext<IpcRendererService>(defaultValue);

export const useIpcRenderer = () => useContext(IpcRendererContext);

export const IpcRendererProvider: FC = ({ children }) => {
  return (
    <IpcRendererContext.Provider value={defaultValue}>
      {children}
    </IpcRendererContext.Provider>
  );
};
