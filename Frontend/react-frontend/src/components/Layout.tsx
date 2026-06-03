import { Outlet } from "react-router-dom"
import Mainbar from "./Mainbar"

const Layout = () => {   
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Mainbar />
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout