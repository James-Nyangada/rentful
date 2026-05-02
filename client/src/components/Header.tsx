import React from "react";

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-black text-primary tracking-tighter uppercase">{title}</h1>
      <p className="text-sm text-foreground/60 font-medium mt-2">{subtitle}</p>
    </div>
  );
};

export default Header;
