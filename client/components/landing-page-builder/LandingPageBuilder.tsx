import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ChevronLeft, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LandingPage, LandingPageBlock } from "./types";
import {
  getLandingPagesFromLocalStorage,
  saveLandingPageToLocalStorage,
  createHeaderBlock,
  createHeroBlock,
  createFeaturesBlock,
  createTestimonialsBlock,
  createAboutBlock,
  createContactFormBlock,
  createFooterBlock,
} from "./utils";
import { DraggableLandingPagePreview } from "./DraggableLandingPagePreview";
import { BlocksPanel } from "./BlocksPanel";
import { SectionsPanel } from "./SectionsPanel";
import { LandingPageSettingsPanel } from "./LandingPageSettingsPanel";
import { LandingPagePreviewMode } from "./LandingPagePreviewMode";

interface LandingPageBuilderProps {
  pageId?: string;
  onBack: () => void;
}

export const LandingPageBuilder: React.FC<LandingPageBuilderProps> = ({
  pageId,
  onBack,
}) => {
  const [page, setPage] = useState<LandingPage | null>(null);
  const [pageName, setPageName] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<"heading" | "subheading" | "button" | null>(null);
  const [selectedLinkIndex, setSelectedLinkIndex] = useState<number | null>(null);
  const [selectedLinkType, setSelectedLinkType] = useState<"navigation" | "quick" | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSectionsPanelOpen, setIsSectionsPanelOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (pageId) {
      const pages = getLandingPagesFromLocalStorage();
      const foundPage = pages.find((p) => p.id === pageId);
      if (foundPage) {
        setPage(foundPage);
        setPageName(foundPage.name);
      }
    } else {
      // Create a new page with no default blocks
      const newPage: LandingPage = {
        id: `lp-${Date.now()}`,
        name: "Untitled Landing Page",
        description: "A new landing page",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        blocks: [],
      };
      setPage(newPage);
      setPageName(newPage.name);
    }
  }, [pageId]);

  const handleAddBlock = (block: LandingPageBlock) => {
    if (!page) return;

    setPage({
      ...page,
      blocks: [...page.blocks, block],
    });
  };

  const updateBlockInTree = (
    blocks: LandingPageBlock[],
    blockId: string,
    properties: Record<string, any>,
  ): LandingPageBlock[] => {
    return blocks.map((block) => {
      if (block.id === blockId) {
        return { ...block, properties };
      }
      if (block.children) {
        return {
          ...block,
          children: updateBlockInTree(block.children, blockId, properties),
        };
      }
      return block;
    });
  };

  const handleUpdateBlock = (
    blockId: string,
    properties: Record<string, any>,
  ) => {
    if (!page) return;

    const updatedBlocks = updateBlockInTree(page.blocks, blockId, properties);

    setPage({
      ...page,
      blocks: updatedBlocks,
    });
  };

  const deleteBlockFromTree = (
    blocks: LandingPageBlock[],
    blockId: string,
  ): LandingPageBlock[] => {
    return blocks
      .filter((block) => block.id !== blockId)
      .map((block) => {
        if (block.children) {
          return {
            ...block,
            children: deleteBlockFromTree(block.children, blockId),
          };
        }
        return block;
      });
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!page) return;

    const updatedBlocks = deleteBlockFromTree(page.blocks, blockId);

    setPage({
      ...page,
      blocks: updatedBlocks,
    });

    setSelectedBlockId(null);
    setSelectedElement(null);
  };

  const handleMoveBlock = (blockId: string, direction: "up" | "down") => {
    if (!page) return;

    const index = page.blocks.findIndex((b) => b.id === blockId);
    if (index === -1) return;

    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === page.blocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...page.blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[index],
    ];

    setPage({
      ...page,
      blocks: newBlocks,
    });
  };

  const duplicateBlockInTree = (
    blocks: LandingPageBlock[],
    blockId: string,
  ): LandingPageBlock[] => {
    const newBlocks: LandingPageBlock[] = [];
    for (const block of blocks) {
      newBlocks.push(block);
      if (block.id === blockId) {
        const duplicatedBlock: LandingPageBlock = JSON.parse(
          JSON.stringify(block),
        );
        duplicatedBlock.id = `${block.type}-${Date.now()}`;
        newBlocks.push(duplicatedBlock);
      } else if (block.children) {
        block.children = duplicateBlockInTree(block.children, blockId);
      }
    }
    return newBlocks;
  };

  const handleDuplicateBlock = (blockId: string) => {
    if (!page) return;

    const updatedBlocks = duplicateBlockInTree([...page.blocks], blockId);

    setPage({
      ...page,
      blocks: updatedBlocks,
    });
  };

  const handleReorderBlocks = (reorderedBlocks: LandingPageBlock[]) => {
    if (!page) return;

    setPage({
      ...page,
      blocks: reorderedBlocks,
    });
  };

  const handleAddBlockAtIndex = (
    blockIndex: number,
    block: LandingPageBlock,
    parentId?: string,
  ) => {
    if (!page) return;

    let newBlocks: LandingPageBlock[] = JSON.parse(JSON.stringify(page.blocks));

    if (parentId) {
      const parent = findBlockInTree(newBlocks, parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.splice(blockIndex, 0, block);
      }
    } else {
      newBlocks.splice(blockIndex, 0, block);
    }

    setPage({
      ...page,
      blocks: newBlocks,
    });
  };

  const handleSelectTemplate = (blocks: LandingPageBlock[]) => {
    if (!page) return;

    // Add all blocks from the template to the page at once
    setPage({
      ...page,
      blocks: [...page.blocks, ...blocks],
    });

    setIsSectionsPanelOpen(false);
  };

  const handleSave = async () => {
    if (!page) return;

    setIsSaving(true);
    try {
      const updatedPage = {
        ...page,
        name: pageName,
        updatedAt: new Date().toISOString(),
      };
      saveLandingPageToLocalStorage(updatedPage);
      setPage(updatedPage);
      // Show a success message (you can add toast notification here)
      setTimeout(() => {
        setIsSaving(false);
      }, 500);
    } catch (error) {
      console.error("Error saving landing page:", error);
      setIsSaving(false);
    }
  };

  if (!page) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const findBlockInTree = (
    blocks: LandingPageBlock[],
    blockId: string,
  ): LandingPageBlock | null => {
    for (const block of blocks) {
      if (block.id === blockId) return block;
      if (block.children) {
        const found = findBlockInTree(block.children, blockId);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedBlock = selectedBlockId ? findBlockInTree(page.blocks, selectedBlockId) : null;

  // If in preview mode, show the preview component
  if (previewMode) {
    return (
      <LandingPagePreviewMode
        page={page}
        onBack={() => setPreviewMode(false)}
      />
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Blocks Panel */}
      <div className="w-72 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
            onClick={() => {
              if (previewMode) {
                setPreviewMode(false);
              } else {
                onBack();
              }
            }}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <BlocksPanel
          onAddBlock={handleAddBlock}
          onOpenSectionsPanel={() => setIsSectionsPanelOpen(true)}
        />
      </div>

      {/* Middle - Sections Panel (conditional) */}
      {isSectionsPanelOpen && (
        <div className="w-80 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
          <SectionsPanel
            onSelectTemplate={handleSelectTemplate}
            onBack={() => setIsSectionsPanelOpen(false)}
          />
        </div>
      )}

      {/* Center - Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex-1">
            <Input
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              placeholder="Landing Page Title"
              className="text-lg font-semibold border-0 focus-visible:ring-0 px-0"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className={previewMode ? "bg-valasys-orange text-white" : ""}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-valasys-orange hover:bg-orange-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <DraggableLandingPagePreview
              page={page}
              selectedBlockId={selectedBlockId}
              selectedElement={selectedElement}
              onSelectBlock={setSelectedBlockId}
              onElementSelect={setSelectedElement}
              onUpdateBlock={handleUpdateBlock}
              onDeleteBlock={handleDeleteBlock}
              onMoveBlock={handleMoveBlock}
              onDuplicateBlock={handleDuplicateBlock}
              onReorderBlocks={handleReorderBlocks}
              onAddBlock={handleAddBlockAtIndex}
              onLinkSelect={(blockId, linkIndex, linkType) => {
                setSelectedBlockId(blockId);
                setSelectedLinkIndex(linkIndex);
                setSelectedLinkType(linkType);
                setSelectedElement(null);
              }}
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Settings Panel */}
      <div className="w-96 bg-white border-l border-gray-200 overflow-hidden flex flex-col">
        <LandingPageSettingsPanel
          block={selectedBlock}
          blockId={selectedBlockId || undefined}
          selectedElement={selectedElement}
          onElementSelect={setSelectedElement}
          onBlockUpdate={handleUpdateBlock}
          onBlockDelete={
            selectedBlockId ? () => handleDeleteBlock(selectedBlockId) : undefined
          }
          selectedLinkIndex={selectedLinkIndex}
          selectedLinkType={selectedLinkType}
          onLinkSelect={(index, type) => {
            setSelectedLinkIndex(index);
            setSelectedLinkType(type);
          }}
        />
      </div>
    </div>
    </DndProvider>
  );
};
