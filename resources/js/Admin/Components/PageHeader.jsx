import React from 'react';

export default function PageHeader({ title, pretitle, breadcrumbs = [], actions = null }) {
    return (
        <div className="page-header d-print-none">
            <div className="container-xl">
                <div className="row g-2 align-items-center">
                    <div className="col">
                        {pretitle && <div className="page-pretitle">{pretitle}</div>}
                        <h2 className="page-title">{title}</h2>
                    </div>
                    {actions && (
                        <div className="col-auto ms-auto d-print-none">
                            <div className="btn-list">{actions}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
