import { Outlet } from "react-router-dom"

import Mainbar from "./Mainbar"


const Layout = () =>
{   
    return   <>
        <Mainbar/>
        <Outlet/>
    </>
  
}
export default Layout