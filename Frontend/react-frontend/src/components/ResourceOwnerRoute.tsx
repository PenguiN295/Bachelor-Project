import React from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { useEvent } from '../hooks/useEvent';
import LoadingState from './LoadingState';

const ResourceOwnerRoute: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { isOwner, loading } = useEvent(id!);
    const location = useLocation();
    console.log(isOwner)
    if (loading) {
        return <div><LoadingState /></div>;
    }
    if (!isOwner) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return <><Outlet /></>;
};

export default ResourceOwnerRoute;