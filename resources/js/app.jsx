import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'EduCore LMS';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob([
            './Admin/Pages/**/*.jsx',
            './Instructor/Pages/**/*.jsx',
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
        if (parts.length >= 2 && ['Admin', 'Instructor', 'User'].includes(parts[0])) {
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
    },
    progress: {
        color: '#ff497c',
        showSpinner: true,
    },
});
