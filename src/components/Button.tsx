"use client";

import styled, { css } from "styled-components";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

const sizes = {
  sm: css`
    padding: 0.35rem 0.6rem;
    font-size: 0.9rem;
    border-radius: 7px;
  `,
  md: css`
    padding: 0.6rem 1rem;
    font-size: 1rem;
    border-radius: 8px;
  `,
  lg: css`
    padding: 0.85rem 1.2rem;
    font-size: 1.05rem;
    border-radius: 10px;
  `,
};

const StyledButton = styled.button<Required<Pick<ButtonProps, "variant" | "size">> & { fullWidth?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border: 1px solid transparent;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
  ${(p) => sizes[p.size]};
  width: ${(p) => (p.fullWidth ? "100%" : "auto")};

  ${(p) =>
    p.variant === "primary" &&
    css`
      background: var(--primary, #cf3201);
      color: #fff;
      border-color: rgba(0, 0, 0, 0.1);
      &:hover {
        background: var(--secondary, #ff7642);
      }
    `}

  ${(p) =>
    p.variant === "secondary" &&
    css`
      background: var(--secondary, #ff7642);
      color: #fff;
      border-color: rgba(0, 0, 0, 0.1);
      &:hover {
        opacity: 0.9;
      }
    `}

  ${(p) =>
    p.variant === "outline" &&
    css`
      background: transparent;
      color: var(--primary, #cf3201);
      border-color: currentColor;
      &:hover {
        color: var(--secondary, #ff7642);
        border-color: var(--secondary, #ff7642);
      }
    `}
`;

export default function Button({ variant = "primary", size = "md", fullWidth, ...rest }: ButtonProps) {
  return <StyledButton variant={variant} size={size} fullWidth={fullWidth} {...rest} />;
}
