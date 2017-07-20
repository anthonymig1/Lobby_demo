import React from 'react';

import ListOut from '../../imports/ui/ListOut.jsx';

export const layoutCuenta = ({content}) => {
    return (
        <div>
            <nav>
                <div className="nav-wrapper">
                    <a href="#" className="brand-logo">Logo</a>
                    <ListOut/>
                </div>
            </nav>
            <div>
              {content}
            </div>
        </div>

    );
}
