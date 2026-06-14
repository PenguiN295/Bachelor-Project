import React, { createContext, useContext, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import url from '../../config';
import { useAuth } from './AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SignalRContextType {
    connection: signalR.HubConnection | null;
}

const SignalRContext = createContext<SignalRContextType>({ connection: null });

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token } = useAuth();
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!token) {
            if (connection) {
                connection.stop();
                setConnection(null);
            }
            return;
        }

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${url}/api/hubs/app`, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, [token]);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected to SignalR Hub');

                    connection.on('ReceiveNotification', (notification: any) => {
                        queryClient.invalidateQueries({ queryKey: ["notifications"] });
                        toast.info(notification.message);
                    });

                    connection.on('FriendRequestAccepted', () => {
                        queryClient.invalidateQueries({ queryKey: ["friends"] });
                    });

                    connection.on('ReceiveMessage', (message: any) => {
                        queryClient.setQueryData(['conversation', message.senderId], (oldData: any) => {
                            if (!oldData) return [message];
                            return [...oldData, message];
                        });
                        queryClient.invalidateQueries({ queryKey: ["chat-partners"] });
                    });
                })
                .catch(err => console.error('SignalR Connection Error: ', err));

            return () => {
                connection.off('ReceiveNotification');
                connection.off('FriendRequestAccepted');
                connection.off('ReceiveMessage');
                connection.stop();
            };
        }
    }, [connection, queryClient]);

    return (
        <SignalRContext.Provider value={{ connection }}>
            {children}
        </SignalRContext.Provider>
    );
};

export const useSignalR = () => useContext(SignalRContext);
