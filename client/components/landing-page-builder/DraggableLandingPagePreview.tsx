import React, { useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Trash2, Copy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LandingPage, LandingPageBlock } from "./types";
import {
  HeaderBlockPreview,
  HeroBlockPreview,
  FeaturesBlockPreview,
  TestimonialsBlockPreview,
  AboutBlockPreview,
  ContactFormBlockPreview,
  FooterBlockPreview,
  SpacerBlockPreview,
  PricingBlockPreview,
  FaqBlockPreview,
  SignupBlockPreview,
  PricingFooterBlockPreview,
} from "./BlockPreviews";
import {
  createHeaderBlock,
  createHeroBlock,
  createFeaturesBlock,
  createTestimonialsBlock,
  createAboutBlock,
  createContactFormBlock,
  createFooterBlock,
  createSectionSpacerBlock,
  createPricingBlock,
  createFaqBlock,
  createSignupBlock,
  createPricingFooterBlock,
} from "./utils";

interface DraggableLandingPagePreviewProps {
  page: LandingPage;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  onUpdateBlock: (blockId: string, properties: Record<string, any>) => void;
  onDeleteBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, direction: "up" | "down") => void;
  onDuplicateBlock?: (blockId: string) => void;
  onReorderBlocks: (blocks: LandingPageBlock[]) => void;
  onAddBlock?: (blockIndex: number, block: LandingPageBlock) => void;
  onLinkSelect?: (blockId: string, linkIndex: number, linkType: "navigation" | "quick") => void;
}

const BLOCK_CREATORS = {
  header: createHeaderBlock,
  hero: createHeroBlock,
  features: createFeaturesBlock,
  testimonials: createTestimonialsBlock,
  about: createAboutBlock,
  "contact-form": createContactFormBlock,
  footer: createFooterBlock,
  "section-spacer": createSectionSpacerBlock,
  pricing: createPricingBlock,
  faq: createFaqBlock,
  signup: createSignupBlock,
  "pricing-footer": createPricingFooterBlock,
};

const DragItem: React.FC<{
  block: LandingPageBlock;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (props: Record<string, any>) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onAddBlock?: (blockIndex: number, block: LandingPageBlock) => void;
  onLinkSelect?: (linkIndex: number, linkType: "navigation" | "quick") => void;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
}> = ({
  block,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddBlock,
  onLinkSelect,
  moveBlock,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: "block",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveBlock(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "block",
    item: () => ({
      index,
      id: block.id,
    }),
    collect(monitor) {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  drag(drop(ref));

  const blockProps = {
    block,
    isSelected,
    onSelect,
    onUpdate,
    onLinkSelect,
  };

  let blockContent;

  switch (block.type) {
    case "header":
      blockContent = <HeaderBlockPreview {...blockProps} />;
      break;
    case "hero":
      blockContent = <HeroBlockPreview {...blockProps} />;
      break;
    case "features":
      blockContent = <FeaturesBlockPreview {...blockProps} />;
      break;
    case "testimonials":
      blockContent = <TestimonialsBlockPreview {...blockProps} />;
      break;
    case "about":
      blockContent = <AboutBlockPreview {...blockProps} />;
      break;
    case "contact-form":
      blockContent = <ContactFormBlockPreview {...blockProps} />;
      break;
    case "footer":
      blockContent = <FooterBlockPreview {...blockProps} />;
      break;
    case "section-spacer":
      blockContent = <SpacerBlockPreview {...blockProps} />;
      break;
    case "pricing":
      blockContent = <PricingBlockPreview {...blockProps} />;
      break;
    case "faq":
      blockContent = <FaqBlockPreview {...blockProps} />;
      break;
    case "signup":
      blockContent = <SignupBlockPreview {...blockProps} />;
      break;
    case "pricing-footer":
      blockContent = <PricingFooterBlockPreview {...blockProps} />;
      break;
    default:
      blockContent = <div>Unknown block type</div>;
  }

  const handleAddBlock = (blockType: string) => {
    const creator =
      BLOCK_CREATORS[blockType as keyof typeof BLOCK_CREATORS];
    if (creator && onAddBlock) {
      const newBlock = creator();
      onAddBlock(index + 1, newBlock);
    }
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`relative transition-all rounded cursor-pointer group mb-6 ${
        isDragging ? "opacity-50" : ""
      } ${
        isSelected
          ? "border-[0.5px] border-solid border-orange-300"
          : isHovered
            ? "border border-dashed border-orange-300"
            : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div onClick={onSelect}>{blockContent}</div>

      {isSelected && (
        <>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white rounded-full shadow-lg border border-orange-300 p-2 z-50">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-gray-100"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            title="Duplicate block"
            onClick={(e) => {
              e.stopPropagation();
              if (onDuplicate) onDuplicate();
            }}
          >
            <Copy className="w-4 h-4 text-gray-600" />
          </Button>

          <div className="w-px bg-gray-300"></div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                title="Add block below"
              >
                <Plus className="w-4 h-4 text-valasys-orange" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem onClick={() => handleAddBlock("header")}>
                Header
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("hero")}>
                Hero
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("features")}>
                Features
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("testimonials")}>
                Testimonials
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("about")}>
                About
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAddBlock("contact-form")}
              >
                Contact Form
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("footer")}>
                Footer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAddBlock("section-spacer")}
              >
                Spacer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("pricing")}>
                Pricing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("faq")}>
                FAQ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock("signup")}>
                Signup
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAddBlock("pricing-footer")}
              >
                Pricing Footer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px bg-gray-300"></div>

          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            title="Delete block"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        </>
      )}
    </div>
  );
};

export const DraggableLandingPagePreview: React.FC<
  DraggableLandingPagePreviewProps
> = ({
  page,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  onDuplicateBlock,
  onReorderBlocks,
  onAddBlock,
  onLinkSelect,
}) => {
  const [blocks, setBlocks] = React.useState(page.blocks);

  React.useEffect(() => {
    setBlocks(page.blocks);
  }, [page.blocks]);

  const moveBlock = (dragIndex: number, hoverIndex: number) => {
    const dragBlock = blocks[dragIndex];
    const newBlocks = [...blocks];
    newBlocks.splice(dragIndex, 1);
    newBlocks.splice(hoverIndex, 0, dragBlock);
    setBlocks(newBlocks);
    onReorderBlocks(newBlocks);
  };

  const handleAddBlockAtIndex = (blockIndex: number, newBlock: LandingPageBlock) => {
    const newBlocks = [...blocks];
    newBlocks.splice(blockIndex, 0, newBlock);
    setBlocks(newBlocks);
    onReorderBlocks(newBlocks);
  };

  const renderBlock = (block: LandingPageBlock, index: number) => {
    const isSelected = selectedBlockId === block.id;

    return (
      <DragItem
        key={block.id}
        block={block}
        index={index}
        isSelected={isSelected}
        onSelect={() => onSelectBlock(block.id)}
        onUpdate={(props: Record<string, any>) =>
          onUpdateBlock(block.id, props)
        }
        onDelete={() => onDeleteBlock(block.id)}
        onDuplicate={() => onDuplicateBlock?.(block.id)}
        onAddBlock={onAddBlock ? handleAddBlockAtIndex : undefined}
        onLinkSelect={onLinkSelect ? (linkIndex, linkType) => onLinkSelect(block.id, linkIndex, linkType) : undefined}
        moveBlock={moveBlock}
      />
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col gap-4 p-4">
        {blocks.map((block, index) => renderBlock(block, index))}
      </div>
    </DndProvider>
  );
};
