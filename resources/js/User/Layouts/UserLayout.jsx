import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import CustomPointer from '../Components/CustomPointer';
import { useFlashNotification } from '../../Hooks/useFlashNotification';

export default function UserLayout({ children }) {
    useFlashNotification();

    return (
        <>
            <CustomPointer />
            <Header />
            {children}
            <Footer />
        </>
    );
}
