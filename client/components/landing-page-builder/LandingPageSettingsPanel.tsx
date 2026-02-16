import React, { useState, useEffect } from "react";
import { LandingPageBlock } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";
import { EditableLink } from "./EditableLink";

interface LandingPageSettingsPanelProps {
  block: LandingPageBlock | null;
  onBlockUpdate: (blockId: string, properties: Record<string, any>) => void;
  onBlockDelete?: () => void;
  blockId?: string;
  selectedLinkIndex?: number | null;
  selectedLinkType?: "navigation" | "quick" | null;
  onLinkSelect?: (index: number | null, type: "navigation" | "quick" | null) => void;
}

export const LandingPageSettingsPanel: React.FC<
  LandingPageSettingsPanelProps
> = ({
  block,
  onBlockUpdate,
  onBlockDelete,
  blockId,
  selectedLinkIndex,
  selectedLinkType,
  onLinkSelect
}) => {
  const [localProps, setLocalProps] = useState(block?.properties || {});

  useEffect(() => {
    if (block) {
      setLocalProps(block.properties);
    }
  }, [block?.id]);

  const updateProperty = (key: string, value: any) => {
    const updated = { ...localProps, [key]: value };
    setLocalProps(updated);
    if (blockId) {
      onBlockUpdate(blockId, updated);
    }
  };

  // Show link editing UI if a link is selected
  if (selectedLinkIndex !== null && selectedLinkType && block) {
    const links = selectedLinkType === "navigation"
      ? (localProps.navigationLinks || [])
      : (localProps.quickLinks || []);

    const link = links[selectedLinkIndex];

    if (link) {
      return (
        <div className="bg-white border-l border-gray-200 h-full overflow-y-auto flex flex-col">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
            <button
              onClick={() => onLinkSelect?.(null, null)}
              className="text-sm text-gray-600 hover:text-gray-900 mb-2"
            >
              ← Back to block
            </button>
            <h3 className="font-semibold text-gray-900">Edit Link</h3>
          </div>

          <div className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Link Text</Label>
                <Input
                  value={link.label}
                  onChange={(e) => {
                    const updated = [...links];
                    updated[selectedLinkIndex] = { ...link, label: e.target.value };
                    const key = selectedLinkType === "navigation" ? "navigationLinks" : "quickLinks";
                    updateProperty(key, updated);
                  }}
                  placeholder="Link text"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">URL</Label>
                <Input
                  value={link.href}
                  onChange={(e) => {
                    const updated = [...links];
                    updated[selectedLinkIndex] = { ...link, href: e.target.value };
                    const key = selectedLinkType === "navigation" ? "navigationLinks" : "quickLinks";
                    updateProperty(key, updated);
                  }}
                  placeholder="URL"
                />
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => {
                const updated = links.filter((_: any, i: number) => i !== selectedLinkIndex);
                const key = selectedLinkType === "navigation" ? "navigationLinks" : "quickLinks";
                updateProperty(key, updated);
                onLinkSelect?.(null, null);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Link
            </Button>
          </div>
        </div>
      );
    }
  }

  if (!block) {
    return (
      <div className="bg-white border-l border-gray-200 p-6 h-full flex flex-col items-center justify-center">
        <p className="text-gray-500 text-sm text-center">
          Select a block to edit its properties
        </p>
      </div>
    );
  }

  const updateNestedProperty = (
    parentKey: string,
    childKey: string,
    value: any,
  ) => {
    const updated = {
      ...localProps,
      [parentKey]: {
        ...(localProps[parentKey] || {}),
        [childKey]: value,
      },
    };
    setLocalProps(updated);
    if (blockId) {
      onBlockUpdate(blockId, updated);
    }
  };

  const renderHeaderBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Logo Text</Label>
        <Input
          value={localProps.logoText || ""}
          onChange={(e) => updateProperty("logoText", e.target.value)}
          placeholder="Logo text"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Logo Image URL</Label>
        <Input
          value={localProps.logoUrl || ""}
          onChange={(e) => updateProperty("logoUrl", e.target.value)}
          placeholder="Image URL"
        />
        {localProps.logoUrl && (
          <div className="mt-2 rounded border border-gray-200 p-2">
            <img
              src={localProps.logoUrl}
              alt="Logo preview"
              className="max-h-12 object-contain"
            />
          </div>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">
          Navigation Links
        </Label>
        <div className="space-y-2">
          {localProps.navigationLinks?.map(
            (link: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <EditableLink
                    label={link.label}
                    href={link.href}
                    onUpdate={(label, href) => {
                      const updated = [...(localProps.navigationLinks || [])];
                      updated[index] = { label, href };
                      updateProperty("navigationLinks", updated);
                    }}
                    onDelete={() => {
                      const updated = (localProps.navigationLinks || []).filter(
                        (_: any, i: number) => i !== index,
                      );
                      updateProperty("navigationLinks", updated);
                    }}
                  />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  title="Copy link"
                  onClick={() => {
                    const updated = [...(localProps.navigationLinks || [])];
                    updated.splice(index + 1, 0, { ...link });
                    updateProperty("navigationLinks", updated);
                  }}
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  title="Delete link"
                  onClick={() => {
                    const updated = (localProps.navigationLinks || []).filter(
                      (_: any, i: number) => i !== index,
                    );
                    updateProperty("navigationLinks", updated);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ),
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="mt-2 w-full"
          onClick={() => {
            const updated = [...(localProps.navigationLinks || [])];
            updated.push({ label: "New Link", href: "#" });
            updateProperty("navigationLinks", updated);
          }}
        >
          + Add Link
        </Button>
      </div>

      <div>
        <Label className="text-sm font-medium">CTA Button Text</Label>
        <Input
          value={localProps.ctaButtonText || ""}
          onChange={(e) => updateProperty("ctaButtonText", e.target.value)}
          placeholder="Button text"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">CTA Button Link</Label>
        <Input
          value={localProps.ctaButtonLink || ""}
          onChange={(e) => updateProperty("ctaButtonLink", e.target.value)}
          placeholder="Button URL"
        />
      </div>
    </div>
  );

  const renderHeroBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Headline</Label>
        <Input
          value={localProps.headline || ""}
          onChange={(e) => updateProperty("headline", e.target.value)}
          placeholder="Headline text"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Subheading</Label>
        <Input
          value={localProps.subheading || ""}
          onChange={(e) => updateProperty("subheading", e.target.value)}
          placeholder="Subheading text"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.backgroundColor || "#f3f4f6"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.backgroundColor || "#f3f4f6"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            placeholder="#f3f4f6"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Min Height</Label>
        <Input
          value={localProps.minHeight || "500px"}
          onChange={(e) => updateProperty("minHeight", e.target.value)}
          placeholder="500px"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">CTA Button Text</Label>
        <Input
          value={localProps.ctaButtonText || ""}
          onChange={(e) => updateProperty("ctaButtonText", e.target.value)}
          placeholder="Button text"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">CTA Button Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.ctaButtonColor || "#FF6A00"}
            onChange={(e) => updateProperty("ctaButtonColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.ctaButtonColor || "#FF6A00"}
            onChange={(e) => updateProperty("ctaButtonColor", e.target.value)}
            placeholder="#FF6A00"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );

  const renderFeaturesBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Heading</Label>
        <Input
          value={localProps.heading || ""}
          onChange={(e) => updateProperty("heading", e.target.value)}
          placeholder="Section heading"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Description</Label>
        <Input
          value={localProps.description || ""}
          onChange={(e) => updateProperty("description", e.target.value)}
          placeholder="Section description"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Columns</Label>
        <Input
          type="number"
          value={localProps.columns || 4}
          onChange={(e) =>
            updateProperty("columns", parseInt(e.target.value))
          }
          min="1"
          max="6"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );

  const renderFooterBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Company Name</Label>
        <Input
          value={localProps.companyName || ""}
          onChange={(e) => updateProperty("companyName", e.target.value)}
          placeholder="Company name"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Description</Label>
        <Input
          value={localProps.companyDescription || ""}
          onChange={(e) =>
            updateProperty("companyDescription", e.target.value)
          }
          placeholder="Company description"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Email</Label>
        <Input
          value={localProps.contactInfo?.email || ""}
          onChange={(e) =>
            updateNestedProperty("contactInfo", "email", e.target.value)
          }
          placeholder="Email address"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Phone</Label>
        <Input
          value={localProps.contactInfo?.phone || ""}
          onChange={(e) =>
            updateNestedProperty("contactInfo", "phone", e.target.value)
          }
          placeholder="Phone number"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.backgroundColor || "#1f2937"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.backgroundColor || "#1f2937"}
            onChange={(e) => updateProperty("backgroundColor", e.target.value)}
            placeholder="#1f2937"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.textColor || "#ffffff"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.textColor || "#ffffff"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Quick Links</Label>
        <div className="space-y-2">
          {localProps.quickLinks?.map((link: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <EditableLink
                  label={link.label}
                  href={link.href}
                  onUpdate={(label, href) => {
                    const updated = [...(localProps.quickLinks || [])];
                    updated[index] = { label, href };
                    updateProperty("quickLinks", updated);
                  }}
                  onDelete={() => {
                    const updated = (localProps.quickLinks || []).filter(
                      (_: any, i: number) => i !== index,
                    );
                    updateProperty("quickLinks", updated);
                  }}
                />
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                title="Copy link"
                onClick={() => {
                  const updated = [...(localProps.quickLinks || [])];
                  updated.splice(index + 1, 0, { ...link });
                  updateProperty("quickLinks", updated);
                }}
              >
                <Copy className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                title="Delete link"
                onClick={() => {
                  const updated = (localProps.quickLinks || []).filter(
                    (_: any, i: number) => i !== index,
                  );
                  updateProperty("quickLinks", updated);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="mt-2 w-full"
          onClick={() => {
            const updated = [...(localProps.quickLinks || [])];
            updated.push({ label: "New Link", href: "#" });
            updateProperty("quickLinks", updated);
          }}
        >
          + Add Link
        </Button>
      </div>
    </div>
  );

  const renderDefaultSettings = () => (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">
          Editing is not yet available for this block type. Select a different
          block to continue.
        </p>
      </div>
    </div>
  );

  const renderBlockSettings = () => {
    switch (block.type) {
      case "header":
        return renderHeaderBlockSettings();
      case "hero":
        return renderHeroBlockSettings();
      case "features":
        return renderFeaturesBlockSettings();
      case "footer":
        return renderFooterBlockSettings();
      default:
        return renderDefaultSettings();
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 h-full overflow-y-auto flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900">
          {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Settings
        </h3>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-6">{renderBlockSettings()}</div>
      </div>

      {onBlockDelete && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={onBlockDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Block
          </Button>
        </div>
      )}
    </div>
  );
};
