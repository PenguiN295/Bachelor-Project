import React from 'react';

import UserDropDown from './UserDropDown';
import Greeting from './Greeting';
const UserMenu: React.FC = () => {


    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Greeting />
                <UserDropDown />
            </div>
        </>
    )
};

export default UserMenu;