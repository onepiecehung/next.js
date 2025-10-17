"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/components/ui/layout/tags";
import { CheckIcon, PlusIcon } from "lucide-react";
import { KeyboardEvent, useState } from "react";

export interface TagData {
  id: string;
  label: string;
}

export interface TagsInputProps {
  tags: TagData[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onTagCreate?: (tag: TagData) => void;
  placeholder?: string;
  allowCreate?: boolean;
  allowRemove?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Tags Input Component
 * Interactive tag selection component with create and remove functionality
 * Based on shadcn.io Tags component implementation
 */
export function TagsInputComponent({
  tags,
  selectedTags,
  onTagsChange,
  onTagCreate,
  placeholder = "Search tag...",
  allowCreate = true,
  allowRemove = true,
  disabled = false,
  className,
}: TagsInputProps) {
  const { t } = useI18n();
  const [newTag, setNewTag] = useState<string>("");

  const handleRemove = (value: string) => {
    if (!selectedTags.includes(value)) {
      return;
    }
    console.log(`removed: ${value}`);
    onTagsChange(selectedTags.filter((v) => v !== value));
  };

  const handleSelect = (value: string) => {
    if (selectedTags.includes(value)) {
      handleRemove(value);
      return;
    }
    console.log(`selected: ${value}`);
    onTagsChange([...selectedTags, value]);
  };

  const handleCreateTag = () => {
    if (!newTag.trim() || !allowCreate) {
      return;
    }

    const newTagData: TagData = {
      id: newTag.toLowerCase().replace(/\s+/g, "-"),
      label: newTag.trim(),
    };

    console.log(`created: ${newTag}`);

    if (onTagCreate) {
      onTagCreate(newTagData);
    }

    onTagsChange([...selectedTags, newTagData.id]);
    setNewTag("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateTag();
    }
  };

  const availableTags = tags.filter((tag) => !selectedTags.includes(tag.id));

  return (
    <Tags className={className}>
      <TagsTrigger disabled={disabled}>
        {selectedTags.map((tagId) => (
          <TagsValue
            key={tagId}
            onRemove={allowRemove ? () => handleRemove(tagId) : undefined}
          >
            {tags.find((t) => t.id === tagId)?.label || tagId}
          </TagsValue>
        ))}
      </TagsTrigger>
      <TagsContent>
        <TagsInput
          value={newTag}
          onValueChange={setNewTag}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
        <TagsList>
          <TagsEmpty>
            {allowCreate && newTag.trim() && (
              <button
                className="mx-auto flex cursor-pointer items-center gap-2 px-2 py-1 text-sm hover:bg-accent rounded-sm"
                onClick={handleCreateTag}
                type="button"
                disabled={disabled}
              >
                <PlusIcon className="text-muted-foreground" size={14} />
                {t("createNewTag", "common")}: {newTag}
              </button>
            )}
          </TagsEmpty>
          <TagsGroup>
            {availableTags.map((tag) => (
              <TagsItem
                key={tag.id}
                onSelect={() => handleSelect(tag.id)}
                value={tag.id}
                disabled={disabled}
              >
                {tag.label}
                {selectedTags.includes(tag.id) && (
                  <CheckIcon className="text-muted-foreground" size={14} />
                )}
              </TagsItem>
            ))}
          </TagsGroup>
        </TagsList>
      </TagsContent>
    </Tags>
  );
}
