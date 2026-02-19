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
  selectedElement?: "heading" | "subheading" | "button" | null;
  onElementSelect?: (element: "heading" | "subheading" | "button" | null) => void;
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
  selectedElement,
  onElementSelect,
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

  // Show element-specific styling UI if an element is selected
  if (selectedElement && block && block.type === "hero") {
    const elementLabels = {
      heading: "Headline",
      subheading: "Subheading",
      button: "CTA Button",
    };

    return (
      <div className="bg-white border-l border-gray-200 h-full overflow-y-auto flex flex-col">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
          <button
            onClick={() => onElementSelect?.(null)}
            className="text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            ← Back to block
          </button>
          <h3 className="font-semibold text-gray-900">Edit {elementLabels[selectedElement]}</h3>
        </div>

        <div className="flex-1 p-4">
          <div className="space-y-4">
            {selectedElement === "heading" && (
              <>
                <div>
                  <Label className="text-sm font-medium">Headline Text</Label>
                  <textarea
                    value={localProps.headline || ""}
                    onChange={(e) => updateProperty("headline", e.target.value)}
                    placeholder="Enter headline text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Headline Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={localProps.headlineColor || "#1f2937"}
                      onChange={(e) => updateProperty("headlineColor", e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={localProps.headlineColor || "#1f2937"}
                      onChange={(e) => updateProperty("headlineColor", e.target.value)}
                      placeholder="#1f2937"
                      className="flex-1"
                    />
                  </div>
                </div>
              </>
            )}
            {selectedElement === "subheading" && (
              <>
                <div>
                  <Label className="text-sm font-medium">Subheading Text</Label>
                  <textarea
                    value={localProps.subheading || ""}
                    onChange={(e) => updateProperty("subheading", e.target.value)}
                    placeholder="Enter subheading text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Subheading Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={localProps.subheadingColor || "#4b5563"}
                      onChange={(e) => updateProperty("subheadingColor", e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={localProps.subheadingColor || "#4b5563"}
                      onChange={(e) => updateProperty("subheadingColor", e.target.value)}
                      placeholder="#4b5563"
                      className="flex-1"
                    />
                  </div>
                </div>
              </>
            )}
            {selectedElement === "button" && (
              <>
                <div>
                  <Label className="text-sm font-medium">Button Text</Label>
                  <Input
                    value={localProps.ctaButtonText || ""}
                    onChange={(e) => updateProperty("ctaButtonText", e.target.value)}
                    placeholder="Enter button text"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Button Color</Label>
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
                <div>
                  <Label className="text-sm font-medium">Button Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={localProps.ctaButtonTextColor || "#ffffff"}
                      onChange={(e) => updateProperty("ctaButtonTextColor", e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={localProps.ctaButtonTextColor || "#ffffff"}
                      onChange={(e) => updateProperty("ctaButtonTextColor", e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

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

      <div>
        <Label className="text-sm font-medium">Width</Label>
        <Input
          value={localProps.width || "100%"}
          onChange={(e) => updateProperty("width", e.target.value)}
          placeholder="100% or 1200px"
        />
      </div>

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
        <Label className="text-sm font-medium">Width</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={String(localProps.width || "100%").replace(/[^0-9]/g, "")}
            onChange={(e) => {
              const unit = String(localProps.width || "100%").includes("%") ? "%" : "px";
              const inputValue = e.target.value;

              // Only accept numeric input
              const numericOnly = inputValue.replace(/[^0-9]/g, "");

              if (numericOnly === "") {
                return; // Don't save empty values
              }

              const num = parseInt(numericOnly, 10);

              // For percentage: only allow up to 100
              if (unit === "%") {
                if (num > 100) {
                  return;
                }
              }

              updateProperty("width", `${num}${unit}`);
            }}
            placeholder="100"
            className="flex-1"
          />
          <select
            value={String(localProps.width || "100%").includes("%") ? "%" : "px"}
            onChange={(e) => {
              const currentNum = parseInt(String(localProps.width || "100").replace(/[^0-9]/g, ""), 10) || 100;
              const unit = e.target.value;

              // When switching TO percentage, cap at 100
              if (unit === "%") {
                const cappedNum = Math.min(currentNum, 100);
                updateProperty("width", `${cappedNum}${unit}`);
              } else {
                updateProperty("width", `${currentNum}${unit}`);
              }
            }}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="%">%</option>
            <option value="px">px</option>
          </select>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Min Height</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={String(localProps.minHeight || "500px").replace(/[^0-9]/g, "")}
            onChange={(e) => {
              const inputValue = e.target.value;

              // Only accept numeric input
              const numericOnly = inputValue.replace(/[^0-9]/g, "");

              if (numericOnly === "") {
                return; // Don't save empty values
              }

              updateProperty("minHeight", `${numericOnly}px`);
            }}
            placeholder="500"
            className="flex-1"
          />
          <div className="px-3 py-2 border border-input rounded-md bg-background text-sm flex items-center text-gray-500">
            px
          </div>
        </div>
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

      <div>
        <Label className="text-sm font-medium">Headline Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.headlineColor || "#1f2937"}
            onChange={(e) => updateProperty("headlineColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.headlineColor || "#1f2937"}
            onChange={(e) => updateProperty("headlineColor", e.target.value)}
            placeholder="#1f2937"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Subheading Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.subheadingColor || "#4b5563"}
            onChange={(e) => updateProperty("subheadingColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.subheadingColor || "#4b5563"}
            onChange={(e) => updateProperty("subheadingColor", e.target.value)}
            placeholder="#4b5563"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Button Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.ctaButtonTextColor || "#ffffff"}
            onChange={(e) => updateProperty("ctaButtonTextColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.ctaButtonTextColor || "#ffffff"}
            onChange={(e) => updateProperty("ctaButtonTextColor", e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Background Image URL</Label>
        <Input
          value={localProps.backgroundImage || ""}
          onChange={(e) => updateProperty("backgroundImage", e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        {localProps.backgroundImage && (
          <div className="mt-2 text-xs text-gray-600">
            <div
              className="w-full h-20 rounded border border-gray-300 bg-cover bg-center mt-1"
              style={{ backgroundImage: `url(${localProps.backgroundImage})` }}
            />
          </div>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium">Overlay Opacity (0-100)</Label>
        <Input
          type="number"
          min="0"
          max="100"
          value={localProps.overlayOpacity || 0}
          onChange={(e) => updateProperty("overlayOpacity", parseInt(e.target.value))}
          placeholder="0"
        />
        <p className="text-xs text-gray-500 mt-1">
          Use overlay to make text more readable over the background image
        </p>
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

      <div>
        <Label className="text-sm font-medium">Width</Label>
        <Input
          value={localProps.width || "100%"}
          onChange={(e) => updateProperty("width", e.target.value)}
          placeholder="100% or 1200px"
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
        <Label className="text-sm font-medium">Width</Label>
        <Input
          value={localProps.width || "100%"}
          onChange={(e) => updateProperty("width", e.target.value)}
          placeholder="100% or 1200px"
        />
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

  const renderTestimonialsBlockSettings = () => (
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

      <div>
        <Label className="text-sm font-medium">Width</Label>
        <Input
          value={localProps.width || "100%"}
          onChange={(e) => updateProperty("width", e.target.value)}
          placeholder="100% or 1200px"
        />
      </div>
    </div>
  );

  const renderAboutBlockSettings = () => (
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

      <div>
        <Label className="text-sm font-medium">Width</Label>
        <Input
          value={localProps.width || "100%"}
          onChange={(e) => updateProperty("width", e.target.value)}
          placeholder="100% or 1200px"
        />
      </div>
    </div>
  );

  const renderHeadingBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Text</Label>
        <textarea
          value={localProps.text || ""}
          onChange={(e) => updateProperty("text", e.target.value)}
          placeholder="Heading text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          rows={3}
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Heading Level</Label>
        <select
          value={localProps.level || "h2"}
          onChange={(e) => updateProperty("level", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
        >
          <option value="h1">Heading 1 (H1)</option>
          <option value="h2">Heading 2 (H2)</option>
          <option value="h3">Heading 3 (H3)</option>
        </select>
      </div>

      <div>
        <Label className="text-sm font-medium">Font Family</Label>
        <select
          value={localProps.fontFamily || "Arial, sans-serif"}
          onChange={(e) => updateProperty("fontFamily", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
        >
          <option value="Arial, sans-serif">Arial</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Times New Roman, serif">Times New Roman</option>
          <option value="Courier New, monospace">Courier New</option>
          <option value="Verdana, sans-serif">Verdana</option>
          <option value="Inter, sans-serif">Inter</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Font Size</Label>
          <Input
            value={localProps.fontSize || "2rem"}
            onChange={(e) => updateProperty("fontSize", e.target.value)}
            placeholder="2rem or 32px"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Font Weight</Label>
          <select
            value={localProps.fontWeight || "bold"}
            onChange={(e) => updateProperty("fontWeight", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
          >
            <option value="normal">Normal</option>
            <option value="medium">Medium</option>
            <option value="semibold">Semibold</option>
            <option value="bold">Bold</option>
          </select>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.textColor || "#1f2937"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.textColor || "#1f2937"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            placeholder="#1f2937"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Text Alignment</Label>
        <div className="flex gap-2">
          {["left", "center", "right"].map((align) => (
            <button
              key={align}
              onClick={() => updateProperty("textAlign", align)}
              className={`flex-1 py-2 px-3 rounded border text-xs font-medium transition-colors ${
                (localProps.textAlign || "left") === align
                  ? "bg-valasys-orange text-white border-valasys-orange"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Padding</Label>
          <Input
            value={localProps.padding || "20px"}
            onChange={(e) => updateProperty("padding", e.target.value)}
            placeholder="20px"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Margin</Label>
          <Input
            value={localProps.margin || "0px"}
            onChange={(e) => updateProperty("margin", e.target.value)}
            placeholder="0px"
          />
        </div>
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

      <div>
        <Label className="text-sm font-medium">Custom CSS Classes</Label>
        <Input
          value={localProps.customClasses || ""}
          onChange={(e) => updateProperty("customClasses", e.target.value)}
          placeholder="mt-4 shadow-sm"
        />
      </div>
    </div>
  );

  const renderParagraphBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Text</Label>
        <textarea
          value={localProps.text || ""}
          onChange={(e) => updateProperty("text", e.target.value)}
          placeholder="Paragraph text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          rows={5}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Font Size</Label>
          <Input
            value={localProps.fontSize || "1rem"}
            onChange={(e) => updateProperty("fontSize", e.target.value)}
            placeholder="1rem or 16px"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Line Height</Label>
          <Input
            value={localProps.lineHeight || "1.6"}
            onChange={(e) => updateProperty("lineHeight", e.target.value)}
            placeholder="1.6"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.textColor || "#4b5563"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.textColor || "#4b5563"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            placeholder="#4b5563"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Text Alignment</Label>
        <div className="flex gap-2">
          {["left", "center", "right"].map((align) => (
            <button
              key={align}
              onClick={() => updateProperty("textAlign", align)}
              className={`flex-1 py-2 px-3 rounded border text-xs font-medium transition-colors ${
                (localProps.textAlign || "left") === align
                  ? "bg-valasys-orange text-white border-valasys-orange"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Padding</Label>
          <Input
            value={localProps.padding || "20px"}
            onChange={(e) => updateProperty("padding", e.target.value)}
            placeholder="20px"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Margin</Label>
          <Input
            value={localProps.margin || "0px"}
            onChange={(e) => updateProperty("margin", e.target.value)}
            placeholder="0px"
          />
        </div>
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

  const renderRichTextBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">HTML Content</Label>
        <p className="text-xs text-gray-500 mb-2">Supports basic HTML: strong, em, u, a, ul, li</p>
        <textarea
          value={localProps.text || ""}
          onChange={(e) => updateProperty("text", e.target.value)}
          placeholder="Rich text content (HTML)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-xs"
          rows={8}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Font Size</Label>
          <Input
            value={localProps.fontSize || "1rem"}
            onChange={(e) => updateProperty("fontSize", e.target.value)}
            placeholder="1rem or 16px"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Line Height</Label>
          <Input
            value={localProps.lineHeight || "1.6"}
            onChange={(e) => updateProperty("lineHeight", e.target.value)}
            placeholder="1.6"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.textColor || "#4b5563"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.textColor || "#4b5563"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            placeholder="#4b5563"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );

  const renderQuoteBlockSettings = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Quote Text</Label>
        <textarea
          value={localProps.quoteText || ""}
          onChange={(e) => updateProperty("quoteText", e.target.value)}
          placeholder="Quote text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          rows={3}
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Author Name</Label>
        <Input
          value={localProps.authorName || ""}
          onChange={(e) => updateProperty("authorName", e.target.value)}
          placeholder="Author name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Quote Size</Label>
          <Input
            value={localProps.quoteSize || "1.5rem"}
            onChange={(e) => updateProperty("quoteSize", e.target.value)}
            placeholder="1.5rem"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Author Size</Label>
          <Input
            value={localProps.authorSize || "0.875rem"}
            onChange={(e) => updateProperty("authorSize", e.target.value)}
            placeholder="0.875rem"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={localProps.textColor || "#1f2937"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={localProps.textColor || "#1f2937"}
            onChange={(e) => updateProperty("textColor", e.target.value)}
            placeholder="#1f2937"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Border Position</Label>
        <select
          value={localProps.borderPosition || "left"}
          onChange={(e) => updateProperty("borderPosition", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
        >
          <option value="left">Left</option>
          <option value="top">Top</option>
          <option value="right">Right</option>
          <option value="bottom">Bottom</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Border Width</Label>
          <Input
            value={localProps.borderWidth || "4px"}
            onChange={(e) => updateProperty("borderWidth", e.target.value)}
            placeholder="4px"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Border Color</Label>
          <Input
            type="color"
            value={localProps.borderColor || "#FF6A00"}
            onChange={(e) => updateProperty("borderColor", e.target.value)}
            className="w-full h-10 p-1 cursor-pointer"
          />
        </div>
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
    </div>
  );

  const renderDefaultSettings = () => (
    <div className="space-y-4">
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

      <div>
        <Label className="text-sm font-medium">Width</Label>
        <Input
          value={localProps.width || "100%"}
          onChange={(e) => updateProperty("width", e.target.value)}
          placeholder="100% or 1200px"
        />
      </div>
    </div>
  );

  const renderTextHeadingsBlockSettings = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h4 className="font-semibold text-gray-900 mb-4">Component Styling</h4>

        <div className="space-y-4">
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

          <div>
            <Label className="text-sm font-medium">Background Image URL</Label>
            <Input
              value={localProps.backgroundImage || ""}
              onChange={(e) => updateProperty("backgroundImage", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Padding</Label>
              <Input
                value={localProps.padding || "40px"}
                onChange={(e) => updateProperty("padding", e.target.value)}
                placeholder="40px"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Margin</Label>
              <Input
                value={localProps.margin || "0px"}
                onChange={(e) => updateProperty("margin", e.target.value)}
                placeholder="0px"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Border Radius</Label>
              <Input
                value={localProps.borderRadius || "0px"}
                onChange={(e) => updateProperty("borderRadius", e.target.value)}
                placeholder="0px"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Box Shadow</Label>
              <Input
                value={localProps.boxShadow || "none"}
                onChange={(e) => updateProperty("boxShadow", e.target.value)}
                placeholder="none"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Custom CSS Classes</Label>
            <Input
              value={localProps.customClasses || ""}
              onChange={(e) => updateProperty("customClasses", e.target.value)}
              placeholder="my-custom-class"
            />
          </div>
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded-md border border-orange-200">
        <p className="text-xs text-orange-800">
          <strong>Tip:</strong> Click on the individual text blocks inside the "Text & Headings" component to edit their specific styles like font family, size, and weight.
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
      case "testimonials":
        return renderTestimonialsBlockSettings();
      case "about":
        return renderAboutBlockSettings();
      case "footer":
        return renderFooterBlockSettings();
      case "heading":
        return renderHeadingBlockSettings();
      case "paragraph":
        return renderParagraphBlockSettings();
      case "rich-text":
        return renderRichTextBlockSettings();
      case "quote":
        return renderQuoteBlockSettings();
      case "text-headings":
        return renderTextHeadingsBlockSettings();
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
