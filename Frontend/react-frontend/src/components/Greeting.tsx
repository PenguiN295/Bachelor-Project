import React from 'react';
import { useAuth } from '../context/AuthContext';

const Greeting:React.FC = () =>{
    const { username } = useAuth();
    return(
        <div>
            <h1>Welcome {username}!</h1>
        </div>
    );
}
export default Greeting;