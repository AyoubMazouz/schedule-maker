import React from "react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="px-3 text-xl uppercase">
      Schedual
      <span className="font-bold text-primary">Maker</span>
    </Link>
  );
};
