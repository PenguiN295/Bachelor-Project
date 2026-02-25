import { useNavigate } from "react-router-dom"



export const CreateEventButton : React.FC = () =>
{
    const navigate = useNavigate()
     const handleCreate = () =>
  {
    navigate('/CreateEvent')
  }
    
return <button onClick={handleCreate}>
              Create your event!
          </button>
}