import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { CalendarPlus } from "lucide-react"

export const CreateEventButton: React.FC = () => {
    const navigate = useNavigate()
    const handleCreate = () => {
        navigate('/CreateEvent')
    }
    
    return (
        <Button onClick={handleCreate} className="w-full mt-4" size="lg">
            <CalendarPlus className="mr-2 h-5 w-5" />
            Create your event!
        </Button>
    )
}