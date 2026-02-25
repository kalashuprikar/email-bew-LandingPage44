import React from "react";
import { TitleBlock } from "../types";
import { Edit2 } from "lucide-react";
import { getPaddingString, getMarginString } from "../utils";

interface TitleBlockComponentProps {
  block: TitleBlock;
  isSelected: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onEditingChange?: (id: string | null) => void;
  onContentChange: (content: string) => void;
  isTextElementSelected?: boolean;
  onTextElementSelect?: (selected: boolean) => void;
}

export const TitleBlockComponent: React.FC<TitleBlockComponentProps> = ({
  block,
  isSelected,
  isEditing,
  onEdit,
  onEditingChange,
  onContentChange,
  isTextElementSelected = false,
  onTextElementSelect,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected && onEditingChange) {
      onEditingChange(block.id);
    }
  };

  const handleEditIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditingChange) {
      onEditingChange(block.id);
    }
  };

  const handleTextElementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTextElementSelect?.(!isTextElementSelected);
  };

  const getTextElementStyles = () => {
    const elementStyles = block.textElementStyles;
    return {
      fontSize: elementStyles?.fontSize !== undefined ? `${elementStyles.fontSize}px` : `${block.fontSize}px`,
      color: elementStyles?.fontColor || block.fontColor,
      backgroundColor: elementStyles?.backgroundColor !== undefined ? elementStyles.backgroundColor : block.backgroundColor,
      textAlign: (elementStyles?.textAlignment || block.textAlignment || block.alignment) as any,
      lineHeight: elementStyles?.lineHeight || block.lineHeight || 1.2,
      fontWeight: elementStyles?.fontWeight || block.fontWeight,
      padding: elementStyles?.padding !== undefined
        ? `${elementStyles.padding}px`
        : elementStyles?.paddingTop !== undefined || elementStyles?.paddingRight !== undefined || elementStyles?.paddingBottom !== undefined || elementStyles?.paddingLeft !== undefined
        ? `${elementStyles.paddingTop ?? (block.padding || 0)}px ${elementStyles.paddingRight ?? (block.padding || 0)}px ${elementStyles.paddingBottom ?? (block.padding || 0)}px ${elementStyles.paddingLeft ?? (block.padding || 0)}px`
        : getPaddingString(block),
      borderRadius: elementStyles?.borderRadius !== undefined ? `${elementStyles.borderRadius}px` : (block.borderRadius ? `${block.borderRadius}px` : undefined),
      border: elementStyles?.borderWidth !== undefined
        ? (elementStyles.borderWidth > 0 ? `${elementStyles.borderWidth}px solid ${elementStyles.borderColor || block.borderColor}` : undefined)
        : (block.borderWidth ? `${block.borderWidth}px solid ${block.borderColor}` : undefined),
      margin: 0,
      userSelect: "none" as const,
      boxSizing: "border-box" as const,
      overflow: "hidden" as const,
      wordWrap: "break-word" as const,
      overflowWrap: "break-word" as const,
      whiteSpace: "normal" as const,
    };
  };

  const containerStyle = {
    userSelect: "none" as const,
    width: block.width ? `${block.width}${block.widthUnit || "%"}` : "100%",
    margin: getMarginString(block),
    boxSizing: "border-box" as const,
    overflow: "hidden" as const,
  };

  const textStyle = {
    fontSize: `${block.fontSize}px`,
    color: block.fontColor,
    backgroundColor: block.backgroundColor,
    textAlign: (block.textAlignment || block.alignment) as any,
    lineHeight: block.lineHeight || 1.2,
    fontWeight: block.fontWeight as any,
    margin: 0,
    padding: getPaddingString(block),
    userSelect: "none" as const,
    borderRadius: block.borderRadius ? `${block.borderRadius}px` : undefined,
    border: block.borderWidth
      ? `${block.borderWidth}px solid ${block.borderColor}`
      : undefined,
    boxSizing: "border-box" as const,
    overflow: "hidden" as const,
    wordWrap: "break-word" as const,
    overflowWrap: "break-word" as const,
    whiteSpace: "normal" as const,
  };

  return (
    <div
      className={`relative transition-all cursor-pointer ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={containerStyle}
    >
      {isTextElementSelected && (
        <div className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded mb-2">
          Title Element Selected
        </div>
      )}
      {isEditing ? (
        <textarea
          value={block.content}
          onChange={(e) => onContentChange(e.target.value)}
          onBlur={() => onEditingChange?.(null)}
          onClick={(e) => {
            e.stopPropagation();
            handleTextElementClick(e);
          }}
          autoFocus
          className={`w-full rounded px-2 py-1 font-serif outline-none ${isTextElementSelected ? "ring-2 ring-blue-400" : ""}`}
          style={getTextElementStyles()}
        />
      ) : (
        <h1
          onClick={handleTextElementClick}
          className={`transition-all ${isTextElementSelected ? "ring-2 ring-blue-400 rounded" : ""}`}
          style={getTextElementStyles()}
        >
          {block.content}
        </h1>
      )}
      {isSelected && !isEditing && (
        <div
          onClick={handleEditIconClick}
          className="absolute top-1 right-1 bg-valasys-orange text-white p-1 rounded cursor-pointer hover:bg-valasys-orange/90 transition-colors"
        >
          <Edit2 className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};
