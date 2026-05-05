import React from 'react';

export const MemberRow = ({ initial, name, status, type, warning, highlight, active }) => {
  const styles = {
    olive: "bg-olive-light text-olive",
    coral: "bg-coral-light text-coral",
    jasmine: "bg-jasmine-light text-jasmine-dark",
    mauve: "bg-mauve text-jasmine"
  };

  return (
    <div className="flex items-center gap-4 py-1">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${styles[type]}`}>
        {initial}
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm text-midnight">{name}</p>
        <p className={`text-[10px] ${highlight ? 'text-olive font-bold' : 'text-gray-400'}`}>{status}</p>
      </div>
      <div className={`w-2 h-2 rounded-full ${warning ? 'bg-coral' : active ? 'bg-olive' : 'bg-jasmine'}`}></div>
    </div>
  );
};