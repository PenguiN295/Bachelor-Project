import ProfileActions from "../components/ProfileActions";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ChangePage: React.FC = () => {
const { modifyUser } = useParams<{ modifyUser: string }>();
const navigate = useNavigate();
    if(!modifyUser || (modifyUser !== 'username' && modifyUser !== 'password'))
    {
        navigate('/dashboard');
    }
    return (
        <div className="container mt-5">
            
            <ProfileActions modifyUser={modifyUser as 'username' | 'password'} />
        </div>
    );
}
export default ChangePage;