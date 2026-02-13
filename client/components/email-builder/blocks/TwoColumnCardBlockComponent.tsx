import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDrop } from "react-dnd";
import { TwoColumnCardBlock, ContentBlock } from "../types";
import { BlockRenderer } from "../BlockRenderer";
import { Upload, Trash2, Plus, Copy, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const generateId = () =>
  `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface CardDropZoneProps {
  cardId: string;
  blocks: ContentBlock[];
  onAddBlock: (block: ContentBlock) => void;
  onDeleteBlock: (blockId: string) => void;
  onUpdateBlock?: (block: ContentBlock) => void;
  selectedBlockId?: string | null;
  onSelectBlock?: (blockId: string) => void;
}

interface CardDropZoneProps {
  cardId: string;
  blocks: ContentBlock[];
  onAddBlock: (block: ContentBlock) => void;
  onDeleteBlock: (blockId: string) => void;
  onUpdateBlock?: (block: ContentBlock) => void;
}

const CardDropZone: React.FC<CardDropZoneProps> = ({
  cardId,
  blocks,
  onAddBlock,
  onDeleteBlock,
  onUpdateBlock,
}) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ["block", "template"],
      drop: (item: any) => {
        if (item.blocks) {
          item.blocks.forEach((block: ContentBlock) => {
            onAddBlock(block);
          });
        } else if (item.block) {
          onAddBlock({
            ...item.block,
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          });
        }
        return { handled: true };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  const ref = useRef<HTMLDivElement>(null);
  drop(ref);

  return (
    <div
      ref={ref}
      className="mt-3 pt-2 border-t border-gray-200 relative z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {blocks && blocks.length > 0 ? (
        <div className="space-y-3 mt-2">
          {blocks.map((block) => (
            <div key={block.id} className="relative group">
              <BlockRenderer
                block={block}
                isSelected={false}
                onBlockUpdate={(updatedBlock) => {
                  onUpdateBlock?.(updatedBlock);
                }}
                onDelete={(blockId) => onDeleteBlock(blockId)}
                blockIndex={0}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`text-center py-6 border-2 border-dashed rounded transition-colors ${
            isOver
              ? "border-valasys-orange bg-orange-50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <p className="text-xs text-gray-500">
            {isOver ? "Drop block here" : "Drag blocks here to add to card"}
          </p>
        </div>
      )}
    </div>
  );
};

// Wrapper component that makes the entire card content droppable
const DroppableCardContent: React.FC<any> = (props) => {
  const {
    card,
    cardPadding,
    textColor,
    titles,
    descriptions,
    children,
    onAddBlock,
    onDeleteBlock,
    onUpdateBlock,
  } = props;

  const contentRef = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ["block", "template"],
      drop: (item: any, monitor) => {
        if (item.blocks) {
          item.blocks.forEach((block: ContentBlock) => {
            onAddBlock(block);
          });
        } else if (item.block) {
          onAddBlock({
            ...item.block,
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          });
        }
        return { handled: true };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  drop(contentRef);

  return (
    <div
      ref={contentRef}
      className={`flex-1 overflow-visible flex flex-col relative z-20 transition-colors ${
        isOver ? "bg-orange-50 border-2 border-dashed border-valasys-orange" : "bg-white"
      }`}
      style={{
        padding: `${cardPadding}px`,
        color: textColor,
        margin: 0,
        border: isOver ? undefined : "none",
        minHeight: "150px",
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {isOver && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40">
          <p className="text-sm text-valasys-orange font-bold bg-white px-3 py-1 rounded">
            Drop block here
          </p>
        </div>
      )}
      {children}
    </div>
  );
};

interface TwoColumnCardBlockComponentProps {
  block: TwoColumnCardBlock;
  isSelected: boolean;
  onUpdate: (block: TwoColumnCardBlock) => void;
  onDuplicate?: (block: TwoColumnCardBlock, position: number) => void;
  onDelete?: (blockId: string) => void;
  blockIndex?: number;
}

export const TwoColumnCardBlockComponent: React.FC<
  TwoColumnCardBlockComponentProps
> = ({ block, isSelected, onUpdate, onDuplicate, onDelete, blockIndex = 0 }) => {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);
  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [resizingCardId, setResizingCardId] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [editingButtonCardId, setEditingButtonCardId] = useState<string | null>(
    null,
  );
  const [buttonEditForm, setButtonEditForm] = useState({
    text: "",
    link: "",
    backgroundColor: "#FF6A00",
    textColor: "#ffffff",
  });

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    cardId: string,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const updatedCards = block.cards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                image: event.target?.result as string,
                imageAlt: file.name,
              }
            : card,
        );
        onUpdate({ ...block, cards: updatedCards });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (cardId: string) => {
    const updatedCards = block.cards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            image: "",
            imageAlt: "",
            imageWidth: undefined,
            imageHeight: undefined,
          }
        : card,
    );
    onUpdate({ ...block, cards: updatedCards });
  };

  const handleDuplicateTitle = (cardId: string, titleId: string) => {
    const updatedCards = block.cards.map((card) => {
      if (card.id === cardId && card.titles) {
        const titleIndex = card.titles.findIndex((t) => t.id === titleId);
        const titleToDuplicate = card.titles[titleIndex];
        if (titleToDuplicate) {
          const newTitles = [...card.titles];
          newTitles.splice(titleIndex + 1, 0, {
            ...titleToDuplicate,
            id: generateId(),
          });
          return { ...card, titles: newTitles };
        }
      }
      return card;
    });
    onUpdate({ ...block, cards: updatedCards });
  };

  const handleDuplicateDescription = (cardId: string, descId: string) => {
    const updatedCards = block.cards.map((card) => {
      if (card.id === cardId && card.descriptions) {
        const descIndex = card.descriptions.findIndex((d) => d.id === descId);
        const descToDuplicate = card.descriptions[descIndex];
        if (descToDuplicate) {
          const newDescriptions = [...card.descriptions];
          newDescriptions.splice(descIndex + 1, 0, {
            ...descToDuplicate,
            id: generateId(),
          });
          return { ...card, descriptions: newDescriptions };
        }
      }
      return card;
    });
    onUpdate({ ...block, cards: updatedCards });
  };

  const handleDeleteTitle = (cardId: string, titleId: string) => {
    const updatedCards = block.cards.map((card) => {
      if (card.id === cardId && card.titles) {
        const newTitles = card.titles.filter((t) => t.id !== titleId);
        return { ...card, titles: newTitles };
      }
      return card;
    });
    onUpdate({ ...block, cards: updatedCards });
  };

  const handleDeleteDescription = (cardId: string, descId: string) => {
    const updatedCards = block.cards.map((card) => {
      if (card.id === cardId && card.descriptions) {
        const newDescriptions = card.descriptions.filter(
          (d) => d.id !== descId,
        );
        return { ...card, descriptions: newDescriptions };
      }
      return card;
    });
    onUpdate({ ...block, cards: updatedCards });
  };

  const handleAddButton = (cardId: string) => {
    const updatedCards = block.cards.map((card) => {
      if (card.id === cardId) {
        return {
          ...card,
          button: {
            text: "Click me",
            link: "#",
            backgroundColor: "#FF6A00",
            textColor: "#ffffff",
            borderRadius: 4,
            padding: 12,
          },
        };
      }
      return card;
    });
    onUpdate({ ...block, cards: updatedCards });
  };

  const handleOpenButtonEditor = (cardId: string) => {
    const card = block.cards.find((c) => c.id === cardId);
    if (card?.button) {
      setButtonEditForm({
        text: card.button.text,
        link: card.button.link || "#",
        backgroundColor: card.button.backgroundColor,
        textColor: card.button.textColor,
      });
      setEditingButtonCardId(cardId);
    }
  };

  const handleAddBlockToCard = (cardId: string, newBlock: ContentBlock) => {
    const updatedCards = block.cards.map((card) => {
      if (card.id === cardId) {
        return {
          ...card,
          blocks: [...(card.blocks || []), newBlock],
        };
      }
      return card;
    });
    onUpdate({ ...block, cards: updatedCards });
  };

  const handleDeleteBlockFromCard = (cardId: string, blockId: string) => {
    const updatedCards = block.cards.map((card) => {
      if (card.id === cardId) {
        return {
          ...card,
          blocks: (card.blocks || []).filter((b) => b.id !== blockId),
        };
      }
      return card;
    });
    onUpdate({ ...block, cards: updatedCards });
  };

  const handleUpdateBlockInCard = (cardId: string, updatedBlock: ContentBlock) => {
    const updatedCards = block.cards.map((card) => {
      if (card.id === cardId) {
        return {
          ...card,
          blocks: (card.blocks || []).map((b) =>
            b.id === updatedBlock.id ? updatedBlock : b
          ),
        };
      }
      return card;
    });
    onUpdate({ ...block, cards: updatedCards });
  };

  const handleUpdateButton = (
    cardId: string,
    updates: Partial<{
      text: string;
      link: string;
      backgroundColor: string;
      textColor: string;
      borderRadius: number;
      padding: number;
    }>,
  ) => {
    const updatedCards = block.cards.map((card) => {
      if (card.id === cardId && card.button) {
        return {
          ...card,
          button: { ...card.button, ...updates },
        };
      }
      return card;
    });
    onUpdate({ ...block, cards: updatedCards });
  };

  const handleDeleteButton = (cardId: string) => {
    const updatedCards = block.cards.map((card) => {
      if (card.id === cardId) {
        return {
          ...card,
          button: null,
        } as any;
      }
      return card;
    });
    onUpdate({ ...block, cards: updatedCards });
  };

  const handleStartEditingTitle = (cardId: string, titleId: string) => {
    const card = block.cards.find((c) => c.id === cardId);
    if (card?.titles) {
      const title = card.titles.find((t) => t.id === titleId);
      if (title) {
        setEditingFieldId(titleId);
        setEditingValue(title.content);
      }
    }
  };

  const handleStartEditingDescription = (cardId: string, descId: string) => {
    const card = block.cards.find((c) => c.id === cardId);
    if (card?.descriptions) {
      const desc = card.descriptions.find((d) => d.id === descId);
      if (desc) {
        setEditingFieldId(descId);
        setEditingValue(desc.content);
      }
    }
  };

  const handleSaveEditTitle = (cardId: string, titleId: string) => {
    const updatedCards = block.cards.map((card) => {
      if (card.id === cardId && card.titles) {
        return {
          ...card,
          titles: card.titles.map((t) =>
            t.id === titleId ? { ...t, content: editingValue } : t,
          ),
        };
      }
      return card;
    });
    onUpdate({ ...block, cards: updatedCards });
    setEditingFieldId(null);
    setEditingValue("");
  };

  const handleSaveEditDescription = (cardId: string, descId: string) => {
    const updatedCards = block.cards.map((card) => {
      if (card.id === cardId && card.descriptions) {
        return {
          ...card,
          descriptions: card.descriptions.map((d) =>
            d.id === descId ? { ...d, content: editingValue } : d,
          ),
        };
      }
      return card;
    });
    onUpdate({ ...block, cards: updatedCards });
    setEditingFieldId(null);
    setEditingValue("");
  };

  const FieldToolbar = ({
    fieldId,
    cardId,
    fieldType,
    onDuplicate,
    onDelete,
  }: {
    fieldId: string;
    cardId: string;
    fieldType: "title" | "description";
    onDuplicate: (cardId: string, fieldId: string) => void;
    onDelete: (cardId: string, fieldId: string) => void;
  }) => {
    return (
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-2 shadow-sm mt-2 w-fit">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-gray-100"
          title={`Duplicate this ${fieldType}`}
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(cardId, fieldId);
          }}
        >
          <Copy className="w-3 h-3 text-gray-700" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-red-100"
          title={`Delete this ${fieldType}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(cardId, fieldId);
          }}
        >
          <Trash2 className="w-3 h-3 text-red-600" />
        </Button>
      </div>
    );
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    cardId: string,
    handle: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizingCardId(cardId);
    setResizeHandle(handle);
    setStartX(e.clientX);
    setStartY(e.clientY);

    const card = block.cards.find((c) => c.id === cardId);
    setStartWidth(card?.imageWidth || 300);
    setStartHeight(card?.imageHeight || 200);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeHandle || !resizingCardId) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      switch (resizeHandle) {
        case "se":
          newWidth = Math.max(100, startWidth + deltaX);
          newHeight = Math.max(100, startHeight + deltaY);
          break;
        case "sw":
          newWidth = Math.max(100, startWidth - deltaX);
          newHeight = Math.max(100, startHeight + deltaY);
          break;
        case "ne":
          newWidth = Math.max(100, startWidth + deltaX);
          newHeight = Math.max(100, startHeight - deltaY);
          break;
        case "nw":
          newWidth = Math.max(100, startWidth - deltaX);
          newHeight = Math.max(100, startHeight - deltaY);
          break;
        case "e":
          newWidth = Math.max(100, startWidth + deltaX);
          break;
        case "w":
          newWidth = Math.max(100, startWidth - deltaX);
          break;
        case "n":
          newHeight = Math.max(100, startHeight - deltaY);
          break;
        case "s":
          newHeight = Math.max(100, startHeight + deltaY);
          break;
      }

      const updatedCards = block.cards.map((card) =>
        card.id === resizingCardId
          ? { ...card, imageWidth: newWidth, imageHeight: newHeight }
          : card,
      );
      onUpdate({ ...block, cards: updatedCards });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
      setResizingCardId(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isResizing,
    resizeHandle,
    startX,
    startY,
    startWidth,
    startHeight,
    block,
    onUpdate,
    resizingCardId,
  ]);

  return (
    <div
      className={`w-full rounded-lg overflow-hidden ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      style={{
        width: `${block.width}${block.widthUnit}`,
      }}
    >
      <div className="flex gap-5">
        {block.cards.map((card, index) => {
          const contentRef = useRef<HTMLDivElement>(null);
          const [{ isOverContent }, dropContent] = useDrop(
            () => ({
              accept: ["block", "template"],
              drop: (item: any) => {
                if (item.blocks) {
                  item.blocks.forEach((b: ContentBlock) => {
                    handleAddBlockToCard(card.id, b);
                  });
                } else if (item.block) {
                  handleAddBlockToCard(card.id, {
                    ...item.block,
                    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  });
                }
                return { handled: true };
              },
              collect: (monitor) => ({
                isOverContent: !!monitor.isOver(),
              }),
            }),
            [card.id]
          );

          dropContent(contentRef);

          const titles = useMemo(
            () =>
              card.titles ||
              (card.title
                ? [{ id: `title-${card.id}`, content: card.title }]
                : []),
            [card.titles, card.title],
          );

          const descriptions = useMemo(
            () =>
              card.descriptions ||
              (card.description
                ? [{ id: `description-${card.id}`, content: card.description }]
                : []),
            [card.descriptions, card.description],
          );

          return (
            <div
              key={card.id}
              className="flex-1 rounded-lg overflow-visible flex flex-col"
              style={{
                backgroundColor: card.backgroundColor,
                margin: `${card.margin}px`,
                borderRadius: `${card.borderRadius}px`,
                minHeight: "400px",
              }}
              onMouseEnter={() => setHoveredCardId(card.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              {/* Image Section */}
              <div
                className="relative h-40 flex-shrink-0"
                style={{
                  borderRadius: `${card.borderRadius}px ${card.borderRadius}px 0 0`,
                }}
              >
                {card.image ? (
                  <>
                    <div
                      style={{
                        padding: "12px",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={card.image}
                        alt={card.imageAlt || "Card image"}
                        onError={(e) => {
                          const imgElement = e.target as HTMLImageElement;
                          imgElement.style.display = "none";
                          const parent = imgElement.parentElement;
                          if (parent) {
                            const errorDiv = document.createElement("div");
                            errorDiv.className =
                              "w-full h-40 bg-gray-200 flex items-center justify-center text-center p-4";
                            errorDiv.innerHTML =
                              '<p style="font-size: 12px; color: #666;">Image failed to load. Check the URL or upload the image directly.</p>';
                            parent.appendChild(errorDiv);
                          }
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          maxWidth: "100%",
                          display: "block",
                          objectFit: "cover",
                          borderRadius: `${card.borderRadius}px`,
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <label className="flex items-center justify-center w-full h-full bg-gray-800 cursor-pointer hover:bg-gray-700 transition-colors rounded">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-400">Click to upload</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, card.id)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Content Section - Droppable */}
              <div
                ref={contentRef}
                className={`flex-1 overflow-auto flex flex-col transition-colors ${
                  isOverContent ? "bg-orange-50" : "bg-white"
                }`}
                style={{
                  padding: `${Math.max(12, card.padding)}px`,
                  color: card.textColor,
                  margin: 0,
                  border: isOverContent ? "2px dashed rgb(255, 106, 0)" : "none",
                  minHeight: "150px",
                }}
              >

                {/* Titles */}
                <div className="space-y-2 mb-2">
                  {titles.map((title) => (
                    <div
                      key={title.id}
                      onMouseEnter={() => setHoveredFieldId(title.id)}
                      onMouseLeave={() => setHoveredFieldId(null)}
                    >
                      {editingFieldId === title.id ? (
                        <>
                          <input
                            type="text"
                            autoFocus
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={() =>
                              handleSaveEditTitle(card.id, title.id)
                            }
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleSaveEditTitle(card.id, title.id);
                              } else if (e.key === "Escape") {
                                setEditingFieldId(null);
                                setEditingValue("");
                              }
                            }}
                            className="w-full font-bold text-base mb-2 m-0 p-1 border-2 border-valasys-orange rounded"
                            style={{
                              color: card.textColor,
                              backgroundColor: "transparent",
                            }}
                          />
                          <FieldToolbar
                            fieldId={title.id}
                            cardId={card.id}
                            fieldType="title"
                            onDuplicate={handleDuplicateTitle}
                            onDelete={handleDeleteTitle}
                          />
                        </>
                      ) : (
                        <>
                          <h3
                            className="font-bold text-base mb-2 m-0 cursor-pointer px-2 py-1 rounded transition-all"
                            style={{
                              color: card.textColor,
                              border:
                                focusedFieldId === title.id
                                  ? "2px solid rgb(255, 106, 0)"
                                  : hoveredFieldId === title.id
                                    ? "2px dotted rgb(255, 106, 0)"
                                    : "none",
                            }}
                            onClick={() => setFocusedFieldId(title.id)}
                            onDoubleClick={() =>
                              handleStartEditingTitle(card.id, title.id)
                            }
                            title="Double-click to edit"
                          >
                            {title.content || "Add title"}
                          </h3>
                          {focusedFieldId === title.id && (
                            <FieldToolbar
                              fieldId={title.id}
                              cardId={card.id}
                              fieldType="title"
                              onDuplicate={handleDuplicateTitle}
                              onDelete={handleDeleteTitle}
                            />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Descriptions */}
                <div className="space-y-2 mb-3">
                  {descriptions.map((desc) => (
                    <div
                      key={desc.id}
                      onMouseEnter={() => setHoveredFieldId(desc.id)}
                      onMouseLeave={() => setHoveredFieldId(null)}
                    >
                      {editingFieldId === desc.id ? (
                        <>
                          <textarea
                            autoFocus
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={() =>
                              handleSaveEditDescription(card.id, desc.id)
                            }
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onKeyPress={(e) => {
                              if (e.key === "Escape") {
                                setEditingFieldId(null);
                                setEditingValue("");
                              }
                            }}
                            className="w-full text-xs leading-snug m-0 p-1 border-2 border-valasys-orange rounded"
                            style={{
                              color: card.textColor,
                              backgroundColor: "transparent",
                            }}
                            rows={3}
                          />
                          <FieldToolbar
                            fieldId={desc.id}
                            cardId={card.id}
                            fieldType="description"
                            onDuplicate={handleDuplicateDescription}
                            onDelete={handleDeleteDescription}
                          />
                        </>
                      ) : (
                        <>
                          <p
                            className="text-xs leading-snug m-0 cursor-pointer px-2 py-1 rounded transition-all"
                            style={{
                              color: card.textColor,
                              border:
                                focusedFieldId === desc.id
                                  ? "2px solid rgb(255, 106, 0)"
                                  : hoveredFieldId === desc.id
                                    ? "2px dotted rgb(255, 106, 0)"
                                    : "none",
                            }}
                            onClick={() => setFocusedFieldId(desc.id)}
                            onDoubleClick={() =>
                              handleStartEditingDescription(card.id, desc.id)
                            }
                            title="Double-click to edit"
                          >
                            {desc.content || "Add description"}
                          </p>
                          {focusedFieldId === desc.id && (
                            <FieldToolbar
                              fieldId={desc.id}
                              cardId={card.id}
                              fieldType="description"
                              onDuplicate={handleDuplicateDescription}
                              onDelete={handleDeleteDescription}
                            />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Button */}
                {card.button && card.button.text && (
                  <div className="flex flex-col gap-2 mt-3 pt-2 border-t border-gray-200">
                    <button
                      style={{
                        backgroundColor: card.button.backgroundColor,
                        color: card.button.textColor,
                        borderRadius: `${card.button.borderRadius}px`,
                        padding: `${card.button.padding}px ${card.button.padding * 2}px`,
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                      onMouseEnter={() =>
                        setHoveredFieldId(`button-${card.id}`)
                      }
                      onMouseLeave={() => setHoveredFieldId(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFocusedFieldId(`button-${card.id}`);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleOpenButtonEditor(card.id);
                      }}
                      title="Double-click to edit button"
                    >
                      {card.button.text}
                    </button>
                    {focusedFieldId === `button-${card.id}` && (
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-2 shadow-sm w-fit">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs hover:bg-gray-100"
                          title="Edit button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenButtonEditor(card.id);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-red-100"
                          title="Delete button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteButton(card.id);
                            setFocusedFieldId(null);
                            setEditingButtonCardId(null);
                          }}
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Nested Blocks - Rendered inside card */}
                {card.blocks && card.blocks.length > 0 && (
                  <div className="space-y-3 mt-3 pt-2 border-t border-gray-200 w-full">
                    {card.blocks.map((nestedBlock) => (
                      <div key={nestedBlock.id} className="relative group w-full max-w-full overflow-hidden">
                        <BlockRenderer
                          block={nestedBlock}
                          isSelected={false}
                          onBlockUpdate={(updatedBlock) => {
                            handleUpdateBlockInCard(card.id, updatedBlock);
                          }}
                          onDelete={(blockId) => {
                            handleDeleteBlockFromCard(card.id, blockId);
                          }}
                          blockIndex={0}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Button Editor Dialog */}
      <Dialog
        open={!!editingButtonCardId}
        onOpenChange={(open) => {
          if (!open) setEditingButtonCardId(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Button</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Button Text
              </label>
              <Input
                value={buttonEditForm.text}
                onChange={(e) =>
                  setButtonEditForm({
                    ...buttonEditForm,
                    text: e.target.value,
                  })
                }
                placeholder="Click me"
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Button Link
              </label>
              <Input
                value={buttonEditForm.link}
                onChange={(e) =>
                  setButtonEditForm({
                    ...buttonEditForm,
                    link: e.target.value,
                  })
                }
                placeholder="https://example.com"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={buttonEditForm.backgroundColor}
                    onChange={(e) =>
                      setButtonEditForm({
                        ...buttonEditForm,
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    value={buttonEditForm.backgroundColor}
                    onChange={(e) =>
                      setButtonEditForm({
                        ...buttonEditForm,
                        backgroundColor: e.target.value,
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={buttonEditForm.textColor}
                    onChange={(e) =>
                      setButtonEditForm({
                        ...buttonEditForm,
                        textColor: e.target.value,
                      })
                    }
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    value={buttonEditForm.textColor}
                    onChange={(e) =>
                      setButtonEditForm({
                        ...buttonEditForm,
                        textColor: e.target.value,
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingButtonCardId(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingButtonCardId) {
                  handleUpdateButton(editingButtonCardId, {
                    text: buttonEditForm.text,
                    link: buttonEditForm.link,
                    backgroundColor: buttonEditForm.backgroundColor,
                    textColor: buttonEditForm.textColor,
                  });
                  setEditingButtonCardId(null);
                }
              }}
              className="bg-valasys-orange hover:bg-orange-600"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
