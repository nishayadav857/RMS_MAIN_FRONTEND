"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

interface UserCardProps {
  username: string;
  posts: number;
  views: number;
  avatarUrl: string;
  testStatus?: string;
  currentStatus?: string;
  onSelect: () => void;
  isSelected: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ 
  username, 
  posts, 
  views, 
  avatarUrl,
  testStatus,
  currentStatus,
  onSelect,
  isSelected
}) => {
  return (
    <div
      className={`flex items-start gap-3 p-3 border rounded-lg shadow-md cursor-pointer transition-colors relative ${
        isSelected
          ? 'border-l-4 border-l-blue-500 bg-blue-50 border-gray-200'
          : 'border-gray-200 hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback className="text-sm">
          {username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
     
      <div className="flex flex-grow justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold">{username}</h2>
          <div className="text-xs text-gray-600">
            <p>Score: {posts}</p>
            {testStatus && <p>Test: {testStatus}</p>}
            {currentStatus && <p>Status: {currentStatus}</p>}
          </div>
        </div>
        <input
          type="checkbox"
          checked={isSelected}
          readOnly
          className="ml-2 cursor-pointer accent-blue-500 w-4 h-4"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        />
      </div>
    </div>
  );
};

export default UserCard;