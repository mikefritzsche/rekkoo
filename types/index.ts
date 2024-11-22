export type List = {
  id: string;
  title: string;
  createdAt: string;
  itemCount: number;
  completedCount: number;
  color: 'orange' | 'purple' | 'emerald' | 'blue';
};

export type ListItem = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  tags?: string[];
};

export type ThemedListProps = {
  items: ListItem[];
  onItemPress?: (item: ListItem) => void;
  onItemLongPress?: (item: ListItem) => void;
  onItemToggle?: (item: ListItem) => void;
  emptyStateMessage?: string;
  showDividers?: boolean;
  isLoading?: boolean;
  gradient?: string[];
};

export interface AppTheme {
  colors: {
    background: string;
    card: string;
    border: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    gradients: {
      orange: string[];
      purple: string[];
      emerald: string[];
      blue: string[];
    };
    accent: {
      primary: string;
      secondary: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
    };
    input: {
      background: string;
      placeholder: string;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
}

