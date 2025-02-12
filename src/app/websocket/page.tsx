"use client";

import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client"; // Import SockJS
import UserCard from "../../components/ui/userCards"; // Import UserCard component

import { Client } from "@stomp/stompjs";

const CandidateSelection = () => {
    const [notifications, setNotifications] = useState<React.ReactNode[]>([]); // State for notifications

    useEffect(() => {
        // Create a SockJS connection
        const socket = new SockJS('http://localhost:8085/notifications'); // Update to correct URL

        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                login: 'validLogin',
                passcode: 'validPasscode'
            },
            debug: (str) => {
                console.log(str);
            },
            onConnect: (frame) => {
                console.log('Connected: ' + (frame ? frame : 'No frame received'));

                // Subscribe to the /topic/candidateResults topic
                stompClient.subscribe('/topic/candidateResults', (message) => {
                    // Handle the received message
                    showNotification(message.body);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            }
        });

        // Connect to the WebSocket
        stompClient.activate();

        // Function to display notifications
        function showNotification(message: string) {
            const userData = JSON.parse(message); // Parse the incoming message
            const userCard = (
                <UserCard
                    username={userData.email}
                    posts={0} // Default value
                    views={0} // Default value
                    avatarUrl="" // Default value
                />
            );
            // Manage state for rendering
            setNotifications((prev) => [...prev, userCard]);
        }

        // Cleanup on component unmount
        return () => {
            stompClient.deactivate();
        };
    }, []);

    return (
        <div>
            <h1>Candidate Selection</h1>
            <div id="notifications">
                {notifications}
            </div>
        </div>
    );
};

export default CandidateSelection;
