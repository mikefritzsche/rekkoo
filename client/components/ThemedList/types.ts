import {ListItem} from "@/types";

export interface ThemedListProps {
  listId: string; // Required prop
  items: ListItem[];
  onItemPress?: (item: ListItem) => void;
  onItemLongPress?: (item: ListItem) => void;
  onItemToggle?: (item: ListItem) => void;
  emptyStateMessage?: string;
  showDividers?: boolean;
  isLoading?: boolean;
  gradient?: string[];
}
