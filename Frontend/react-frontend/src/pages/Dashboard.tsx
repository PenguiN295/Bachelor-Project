import React, { useEffect, useState } from 'react';
import url from '../../config';
const Dashboard: React.FC = () => {
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [loading, setLoading] = useState<boolean>(!username); 


  useEffect(() => {
    if (username && username !== 'undefined') 
    {console.log('Username already in localStorage:', username);
      setLoading(false);
      return ;
    }

    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${url}/user-info`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        console.log('User info fetched:', data);
        localStorage.setItem('username', data.username);
        setUsername(data.Username); 
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [username]);

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="container mt-5 text-left">
      <h1>Welcome {username}!</h1>
    </div>
  );
};

export default Dashboard;