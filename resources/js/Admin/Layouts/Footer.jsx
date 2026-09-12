import React from 'react';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer footer-transparent d-print-none">
            <div className="container-fluid px-4">
                <div className="row text-center align-items-center flex-row-reverse">
                    <div className="col-12 col-lg-auto mt-3 mt-lg-0">
                        <ul className="list-inline list-inline-dots mb-0">
                            <li className="list-inline-item">
                                Copyright &copy; {year}{' '}
                                <span className="link-secondary">EduCore LMS</span>. All rights reserved.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
