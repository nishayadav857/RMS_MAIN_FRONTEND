'use client';

import React, { useState, useEffect } from "react";
import { BsBell, BsClock, BsCheckCircle } from "react-icons/bs";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CandidateMessage {
    email: string;
    currentStatus: "SCREEN_SELECTED" | "MCQ_SCHEDULED";
    jdfilename: string;
}

interface NotificationData {
    id: string;
    email: string;
    currentStatus: "MCQ_SCHEDULED" | "SCREEN_SELECTED";
    jdfilename: string;
    timestamp: number;
}

interface NotificationPanelProps {
    collapsed: boolean;
}

export default function NotificationPanel({ collapsed }: NotificationPanelProps) {
    const [hasNewNotifications, setHasNewNotifications] = useState(false);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8085/notifications');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                login: 'validLogin',
                passcode: 'validPasscode'
            },
            debug: (str) => {
                if (!str.includes('PING') && !str.includes('PONG')) {
                    console.debug('[STOMP]', str);
                }
            },
            onConnect: () => {
                stompClient.subscribe('/topic/candidateResults', (message) => {
                    if (!message.body) return;

                    try {
                        const candidateData = JSON.parse(message.body) as CandidateMessage;
                        
                        setNotifications(prev => [
                            {
                                id: `${Date.now()}-${candidateData.email}`,
                                ...candidateData,
                                timestamp: Date.now()
                            },
                            ...prev
                        ]);
                        
                        if (!isOpen) {
                            setHasNewNotifications(true);
                        }
                    } catch (error) {
                        console.error('Message parsing error:', error);
                    }
                });
            }
        });

        stompClient.activate();
        return () => stompClient.deactivate();
    }, []);

    const mcqScheduled = notifications.filter(n => n.currentStatus === "MCQ_SCHEDULED");
    const testMCQ_SCHEDULED = notifications.filter(n => n.currentStatus === "SCREEN_SELECTED");

    const togglePanel = () => {
        if (!isOpen) {
            setHasNewNotifications(false);
        }
        setIsOpen(!isOpen);
    };

    const renderNotificationItem = (notification: NotificationData) => (
        <div key={notification.id} className="p-3 mb-2 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{notification.email}</h3>
                <span className="text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
                <p className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        notification.currentStatus === 'SCREEN_SELECTED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {notification.currentStatus.replace('_', ' ')}
                    </span>
                </p>
                <p className="mt-1">
                    <span className="font-medium">Stage:</span> {notification.currentStatus}
                </p>
            </div>
        </div>
    );

    return (
        <li>
            <a
                href="#"
                onClick={togglePanel}
                className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-300 relative"
            >
                <div className="relative">
                    <BsBell className="w-5 h-5" />
                    {hasNewNotifications && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full
                            transform translate-x-1 -translate-y-1 animate-pulse" />
                    )}
                </div>
                {!collapsed && <span>Notifications</span>}
            </a>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">Candidate Test Tracker</h2>
                            <div className="flex gap-3">
                                <Button
                                    variant="destructive"
                                    className="flex items-center gap-2"
                                    onClick={() => setNotifications([])}
                                >
                                    Clear All
                                    <X className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={togglePanel}
                                    className="h-10 w-10 p-2 rounded-lg"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col h-[calc(90vh-4rem)]">
                            {/* Status Overview at Top */}
                            <div className="p-6 bg-gray-50 border-b">
                                <h3 className="text-xl font-semibold mb-4 text-gray-700">Test Status Overview</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-yellow-50 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">MCQ Scheduled</span>
                                            <span className="text-2xl font-bold">{mcqScheduled.length}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">SCREEN SELECTED</span>
                                            <span className="text-2xl font-bold">{testMCQ_SCHEDULED.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section with Side-by-Side Lists */}
                            <div className="flex-1 flex divide-x">
                                <div className="w-1/2 p-6 overflow-y-auto">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BsCheckCircle className="text-green-600" />
                                        <h3 className="text-xl font-semibold text-gray-700">
                                            SCREEN SELECTED ({testMCQ_SCHEDULED.length})
                                        </h3>
                                    </div>
                                    <div className="space-y-4 h-[calc(100%-3rem)] overflow-y-auto">
                                        {testMCQ_SCHEDULED.length > 0 
                                            ? testMCQ_SCHEDULED.map(renderNotificationItem)
                                            : (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500 text-lg">No MCQ_SCHEDULED tests</p>
                                                </div>
                                            )}
                                    </div>
                                </div>

                                <div className="w-1/2 p-6 overflow-y-auto">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BsClock className="text-yellow-600" />
                                        <h3 className="text-xl font-semibold text-gray-700">
                                            MCQ Scheduled ({mcqScheduled.length})
                                        </h3>
                                    </div>
                                    <div className="space-y-4 h-[calc(100%-3rem)] overflow-y-auto">
                                        {mcqScheduled.length > 0 
                                            ? mcqScheduled.map(renderNotificationItem)
                                            : (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500 text-lg">No candidates scheduled</p>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
}