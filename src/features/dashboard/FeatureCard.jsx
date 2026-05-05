import React from 'react';

export const FeatureCard = ({ title, desc, icon, tag, tagColor }) => {
  const tagStyles = {
    jasmine: "bg-jasmine/10 text-jasmine",
    sage: "bg-sage/10 text-sage",
    coral: "bg-coral/10 text-coral"
  };

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-all">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-egg font-display font-bold text-lg mb-2">{title}</h3>
      <p className="text-sage text-sm leading-relaxed mb-4">{desc}</p>
      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${tagStyles[tagColor]}`}>
        {tag}
      </span>
    </div>
  );
};