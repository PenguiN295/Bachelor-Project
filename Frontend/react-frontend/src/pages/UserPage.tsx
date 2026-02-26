
import { useNavigate } from 'react-router-dom';

const UserPage: React.FC = () => {
    const navigate = useNavigate();
    const onChanceClick = (where: string) =>
    {
        if(where === 'username')
            navigate('/ChangePage/username');
        else if(where === 'password')
            navigate('/ChangePage/password');
    }

    return (
        <>
            <div>
                <button className="btn btn-outline-secondary mb-3 ms-2" onClick={() => onChanceClick('username')}>
                    <i className="bi bi-pencil"></i>
                    Change Username
                </button>
                <button className="btn btn-outline-secondary mb-3 ms-2" onClick={() => onChanceClick('password')}>
                    <i className="bi bi-pencil"></i>
                    Change Password
                </button> 
            </div>
        </>

    );

}

export default UserPage;