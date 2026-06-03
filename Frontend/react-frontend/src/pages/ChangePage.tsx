import ProfileActions from "../components/ProfileActions";
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect } from 'react';

const ChangePage: React.FC = () => {
    const { modifyUser } = useParams<{ modifyUser: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (!modifyUser || (modifyUser !== 'username' && modifyUser !== 'password')) {
            navigate('/dashboard');
        }
    }, [modifyUser, navigate]);

    if (!modifyUser || (modifyUser !== 'username' && modifyUser !== 'password')) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <ProfileActions modifyUser={modifyUser as 'username' | 'password'} />
        </div>
    );
}

export default ChangePage;