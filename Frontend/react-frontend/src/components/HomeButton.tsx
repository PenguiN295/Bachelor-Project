import { useNavigate } from "react-router-dom";




const HomeButton : React.FC = () =>
{
    const navigate = useNavigate();
    const onHomeClick = () =>
    {
        navigate("/dashboard")
    }
    return <button className="btn btn-outline-primary mb-3" onClick={onHomeClick}>
                    <i className="bi bi-arrow-left"></i>
                    Home
                </button>
}
export default HomeButton;