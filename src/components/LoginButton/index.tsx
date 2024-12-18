"use client";

import React from "react";

type LoginButtonProps = {
  text?: string;
  href?: string;
  className?: string;
};

export const LoginButton = (props?: LoginButtonProps) => {
  const {
    text = "Log In with SSO",
    href = "/auth/login",
    className = "btn btn--style-secondary btn--icon-style-without-border btn--size-medium"
  } = props || {};
  return (
    <a
      className={className}
      style={{
        width: "100%",
        display: "block",
      }}
      href={href}
    >
      {text}
    </a>
  );
};
export default LoginButton;
