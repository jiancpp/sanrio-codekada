import React from 'react';

export const WhoBox = ({ icon, title, color, accent, sub }) => (
  <div className={`${color} p-8 rounded-[2.5rem] shadow-xl`}>
    <div className="text-4xl mb-6">{icon}</div>
    <h3 className={`font-display font-black text-2xl ${accent} mb-4`}>{title}</h3>
    <p className={`${sub} text-sm leading-relaxed`}>
      Keep everyone connected across distance or busy schedules with real-time health sync.
    </p>
  </div>
);