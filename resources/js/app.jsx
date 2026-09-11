import './bootstrap';
import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'EduCore LMS';

let preloaderHideTimeout = null;

const showPreloader = () => {
    const el = document.getElementById('preloader');
    if (!el) return;
    if (preloaderHideTimeout) {
        clearTimeout(preloaderHideTimeout);
        preloaderHideTimeout = null;
    }
    el.classList.remove('preloader-hidden');
    el.style.display = 'flex';
};

const hidePreloader = () => {
    const el = document.getElementById('preloader');
    if (!el) return;
    el.classList.add('preloader-hidden');
    preloaderHideTimeout = setTimeout(() => {
        el.style.display = 'none';
    }, 350);
};

// Global helper access
if (typeof window !== 'undefined') {
    window.showPreloader = showPreloader;
    window.hidePreloader = hidePreloader;

    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 350);
    });
}



createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob([
            './Admin/Pages/**/*.jsx',
            './Instructor/Pages/**/*.jsx',
            './Student/Pages/**/*.jsx',
            './User/Pages/**/*.jsx',
            './Pages/**/*.jsx',
            './**/*.jsx'
        ], { eager: true });

        // Direct path check (e.g. 'Admin/Pages/Dashboard/Index')
        if (pages[`./${name}.jsx`]) {
            return pages[`./${name}.jsx`];
        }

        // Shorthand check (e.g. 'Admin/Dashboard/Index' -> './Admin/Pages/Dashboard/Index.jsx')
        const parts = name.split('/');
        if (parts.length >= 2 && ['Admin', 'Instructor', 'Student', 'User'].includes(parts[0])) {
            const domain = parts[0];
            const rest = parts.slice(1).join('/');
            const withPagesPath = `./${domain}/Pages/${rest}.jsx`;
            if (pages[withPagesPath]) {
                return pages[withPagesPath];
            }
        }

        throw new Error(`Inertia page not found: ${name}`);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);

        // Hide preloader shortly after initial app render
        setTimeout(() => {
            hidePreloader();
        }, 300);
    },
    progress: {
        color: '#ff497c',
        showSpinner: true,
    },
});
