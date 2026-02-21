import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const UserDropDown: React.FC = () => {
    
    const { username,logout } = useAuth();
    const navigate = useNavigate();
    const onLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();

    };
    const onProfileClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/profile');
    };
  return(
     <div className="dropdown d-inline-block">
            <button className="btn btn-secondary dropdown-toggle w-100 d-flex justify-content-between align-items-center" type="button" id="userMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {username}
            </button>
            <ul className="dropdown-menu dropdown-menu-end w-100 shadow-sm" aria-labelledby="userMenuButton" >
                <li>
                    <button className="dropdown-item text-danger fw-semibold" onClick={onLogoutClick} >
                        <i className="bi bi-box-arrow-right"></i>
                        Logout
                    </button>
                    <button className="dropdown-item text-primary fw-semibold" onClick={onProfileClick}>
                        <i className="bi bi-person-circle"></i>
                        Profile
                    </button>
                </li>
            </ul>

        </div>
     );
    };

export default UserDropDown;