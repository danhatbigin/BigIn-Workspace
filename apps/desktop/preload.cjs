const { contextBridge, ipcRenderer } = require('electron');
// No generic IPC, HTTP, filesystem or credential read interface is exposed.
contextBridge.exposeInMainWorld('biginDesktop', Object.freeze({
  status: () => ipcRenderer.invoke('op:status'),
  connect: token => ipcRenderer.invoke('op:connect', token),
  disconnect: () => ipcRenderer.invoke('op:disconnect'),
  load: (from,to) => ipcRenderer.invoke('op:load', from,to),
  search: (query,projectId) => ipcRenderer.invoke('op:search', query,projectId),
  write: entries => ipcRenderer.invoke('op:write', entries),
  resolve: clientIds => ipcRenderer.invoke('op:resolve', clientIds),
}));
