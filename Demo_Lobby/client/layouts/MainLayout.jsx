import React from 'react';

export const MainLayout = ({content}) => {
    return (
        <div>
            <nav>
                <div className="nav-wrapper">
                    <a href="#" className="brand-logo">Logo</a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li>
                            <a href="/Login">Login</a>
                        </li>
                        <li>
                            <a href="/Registro">Registrate</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div>
              {content}
            </div>
        </div>

    );
}
