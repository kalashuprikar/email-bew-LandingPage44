import React from "react";
import { TextBlock } from "../types";
import { Edit2, Copy, Trash2 } from "lucide-react";

interface TextBlockComponentProps {
  block: TextBlock;
  isSelected: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onEditingChange?: (id: string | null) => void;
  onContentChange: (content: string) => void;
  onDuplicate?: (block: TextBlock, position: number) => void;
  onDelete?: (blockId: string) => void;
  blockIndex?: number;
  isTextElementSelected?: boolean;
  onTextElementSelect?: (selected: boolean) => void;
}

export const TextBlockComponent: React.FC<TextBlockComponentProps> = ({
  block,
  isSelected,
  isEditing,
  onEdit,
  onEditingChange,
  onContentChange,
  onDuplicate,
  onDelete,
  blockIndex = 0,
  isTextElementSelected = false,
  onTextElementSelect,
}) => {
  const [isHovering, setIsHovering] = React.useState(false);

  const getWidthStyle = () => {
    if (block.widthUnit === "%") {
      return `${block.width}%`;
    }
    return `${block.width}px`;
  };

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
      fontStyle: elementStyles?.fontStyle || block.fontStyle,
      padding: elementStyles?.padding !== undefined
        ? `${elementStyles.padding}px`
        : elementStyles?.paddingTop !== undefined || elementStyles?.paddingRight !== undefined || elementStyles?.paddingBottom !== undefined || elementStyles?.paddingLeft !== undefined
        ? `${elementStyles.paddingTop ?? block.padding}px ${elementStyles.paddingRight ?? block.padding}px ${elementStyles.paddingBottom ?? block.padding}px ${elementStyles.paddingLeft ?? block.padding}px`
        : `${block.padding}px`,
      borderWidth: `${elementStyles?.borderWidth !== undefined ? elementStyles.borderWidth : block.borderWidth}px`,
      borderColor: elementStyles?.borderColor || block.borderColor,
      borderStyle: (elementStyles?.borderWidth !== undefined ? elementStyles.borderWidth : block.borderWidth) > 0 ? "solid" : "none",
      borderRadius: `${elementStyles?.borderRadius !== undefined ? elementStyles.borderRadius : block.borderRadius}px`,
    };
  };

  return (
    <div
      className={`relative transition-all cursor-pointer user-select-none ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        margin: `${block.margin}px`,
        display: "block",
        userSelect: "none",
      }}
    >
      {isTextElementSelected && (
        <div className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded mb-2">
          Text Element Selected
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
          style={{
            ...getTextElementStyles(),
            width: getWidthStyle(),
            userSelect: "text",
            boxSizing: "border-box",
            overflow: "auto",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "normal",
          }}
        />
      ) : (
        <p
          onClick={handleTextElementClick}
          className={`transition-all ${isTextElementSelected ? "ring-2 ring-blue-400 rounded" : ""}`}
          style={{
            ...getTextElementStyles(),
            width: getWidthStyle(),
            margin: 0,
            userSelect: "none",
            boxSizing: "border-box",
            overflow: "hidden",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          {block.content}
        </p>
      )}
    </div>
  );
};
