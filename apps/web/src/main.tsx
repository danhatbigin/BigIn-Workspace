import React from 'react';
import { createRoot } from 'react-dom/client';
import './system/system.css';
const isDesignPreview = location.pathname.replace(/\/$/, '').endsWith('/design-system') || location.hash === '#design-system';
const module = isDesignPreview ? await import('./preview/DesignPreview') : window.biginDesktop ? await import('./DesktopEntry') : await import('./WorkspaceEntry');
createRoot(document.getElementById('root')!).render(<React.StrictMode><module.default /></React.StrictMode>);
