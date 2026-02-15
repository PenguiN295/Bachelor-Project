import React from 'react';
import { useAuth } from '../context/AuthContext';
const UserDropDown: React.FC = () => {
    const { username,logout } = useAuth();
    const onLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();

    };
  return(
     <div className="dropdown d-inline-block">
            <button className="btn btn-secondary dropdown-toggle w-100 d-flex justify-content-between align-items-center" type="button" id="userMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {username}
            </button>
            <ul className="dropdown-menu dropdown-menu-end w-100 shadow-sm" aria-labelledby="userMenuButton" style={{ minWidth: '100%' }}>
                <li>
                    <button className="dropdown-item text-danger fw-semibold" onClick={onLogoutClick}>
                        <i className="bi bi-box-arrow-right"></i>
                         Logout
                    </button>
                </li>
            </ul>

        </div>
     );
    };

export default UserDropDown;