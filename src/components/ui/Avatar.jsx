export const Avatar = ({ initial, type, size = "size-11" }) => {
  const variants = {
    olive: "bg-olive-light text-olive-dark",
    jasmine: "bg-jasmine-light text-jasmine-dark",
    coral: "bg-coral-light text-coral-dark",
    mauve: "bg-mauve text-jasmine",
  };

  return (
    <div className={`${size} rounded-full flex items-center justify-center font-display font-black text-sm shrink-0 ${variants[type] || variants.olive}`}>
      {initial}
    </div>
  );
};