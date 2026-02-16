import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditableLinkProps {
  label: string;
  href: string;
  onUpdate: (label: string, href: string) => void;
  onDelete?: () => void;
  inline?: boolean;
}

export const EditableLink: React.FC<EditableLinkProps> = ({
  label,
  href,
  onUpdate,
  onDelete,
  inline = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(label);
  const [editHref, setEditHref] = useState(href);

  const handleBlur = () => {
    onUpdate(editLabel, editHref);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div
        className="cursor-pointer hover:opacity-70 transition-opacity"
        onDoubleClick={() => setIsEditing(true)}
        title="Double click to edit"
      >
        {inline ? <span>{label}</span> : <a href={href}>{label}</a>}
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="flex flex-col gap-1 w-full">
        <Input
          placeholder="Link text"
          value={editLabel}
          onChange={(e) => setEditLabel(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          size="sm"
          className="text-xs"
        />
        <Input
          placeholder="URL"
          value={editHref}
          onChange={(e) => setEditHref(e.target.value)}
          onBlur={handleBlur}
          size="sm"
          className="text-xs"
        />
      </div>
      {onDelete && (
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 flex-shrink-0"
          onClick={onDelete}
          title="Delete link"
        >
          <X className="w-3 h-3 text-red-500" />
        </Button>
      )}
    </div>
  );
};
