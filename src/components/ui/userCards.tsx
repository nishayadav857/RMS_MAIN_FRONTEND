"use client";
 
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
 
const UserCard: React.FC<{ username: string; posts: number; views: number; avatarUrl: string }> = ({ username, posts, views, avatarUrl }) => {
  const [isChecked, setIsChecked] = React.useState(false);
 
  return (
    <div
      className={`flex items-start gap-4 p-4 border rounded-lg shadow-md cursor-pointer transition-colors relative ${
        isChecked
          ? 'border-l-4 border-l-blue-500 bg-blue-50 border-gray-200'
          : 'border-gray-200 hover:bg-gray-50'
      }`}
      onClick={() => setIsChecked(!isChecked)}
    >
      <Avatar>
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback className="text-lg">{username.charAt(0)}</AvatarFallback>
      </Avatar>
     
      <div className="flex flex-grow justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{username}</h2>
          <p>{posts} posts</p>
          <p>{views} views</p>
        </div>
        <input
          type="checkbox"
          checked={isChecked}
          readOnly
          className="ml-4 cursor-pointer accent-blue-500"
          onClick={(e) => {
            e.stopPropagation();
            setIsChecked(!isChecked);
          }}
        />
      </div>
    </div>
  );
};
 
export default UserCard;
 