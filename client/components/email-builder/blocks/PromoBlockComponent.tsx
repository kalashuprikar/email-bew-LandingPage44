import React from "react";
import { PromoBlock } from "../types";

interface PromoBlockComponentProps {
  block: PromoBlock;
  isSelected: boolean;
}

export const PromoBlockComponent: React.FC<PromoBlockComponentProps> = ({
  block,
  isSelected,
}) => {
  const containerStyle = {
    backgroundColor: block.backgroundColor,
    padding: `${block.padding}px`,
    textAlign: block.alignment as any,
    borderRadius: `${block.borderRadius}px`,
    margin: `${block.margin}px auto`,
    width: `${block.width}${block.widthUnit}`,
    border:
      block.borderWidth > 0
        ? `${block.borderWidth}px solid ${block.borderColor}`
        : "none",
    boxSizing: "border-box" as const,
  };

  const textStyle = {
    margin: "0 0 12px 0",
    fontSize: `${block.fontSize}px`,
    color: block.fontColor,
  };

  const codeStyle = {
    margin: 0,
    fontSize: `${block.promoCodeFontSize}px`,
    fontWeight: block.fontWeight as any,
    color: block.promoCodeColor,
    letterSpacing: `${block.letterSpacing}px`,
  };

  return (
    <div
      style={containerStyle}
      className={`transition-all ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
    >
      <p style={textStyle}>{block.promoText}</p>
      <h2 style={codeStyle}>{block.promoCode}</h2>
    </div>
  );
};
