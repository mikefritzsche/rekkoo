import {LIST_PRIORITIES, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, MAX_TAGS, MAX_TAG_LENGTH} from '../constants';

type Priority = keyof typeof LIST_PRIORITIES;

export const formatDate = (date: string): string => {
  const now = new Date();
  const itemDate = new Date(date);
  const diff = now.getTime() - itemDate.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return itemDate.toLocaleDateString();
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateTitle = (title: string): string | null => {
  if (!title.trim()) return 'Title is required';
  if (title.length > MAX_TITLE_LENGTH) return `Title must be less than ${MAX_TITLE_LENGTH} characters`;
  return null;
};

export const validateDescription = (description?: string): string | null => {
  if (!description) return null;
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`;
  }
  return null;
};

export const validateTags = (tags?: string[]): string | null => {
  if (!tags?.length) return null;
  if (tags.length > MAX_TAGS) return `Maximum ${MAX_TAGS} tags allowed`;
  for (const tag of tags) {
    if (tag.length > MAX_TAG_LENGTH) {
      return `Tag '${tag}' is too long (max ${MAX_TAG_LENGTH} characters)`;
    }
  }
  return null;
};

export const getPriorityColor = (priority: Priority): string => {
  const theme = {
    low: '#10b981',    // success color
    medium: '#f59e0b', // warning color
    high: '#ef4444',   // error color
  };
  return theme[priority.toLowerCase() as keyof typeof theme];
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const groupItemsByDate = (items: any[]): Record<string, any[]> => {
  return items.reduce((groups, item) => {
    const date = new Date(item.createdAt).toLocaleDateString();
    return {
      ...groups,
      [date]: [...(groups[date] || []), item],
    };
  }, {});
};

export const sortItemsByPriority = (items: any[]): any[] => {
  const priorityOrder = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return [...items].sort((a, b) =>
    priorityOrder[a.priority as Priority] - priorityOrder[b.priority as Priority]
  );
};

export const filterItems = (
  items: any[],
  searchText: string,
  filters: { completed?: boolean; priority?: Priority }
): any[] => {
  return items.filter(item => {
    const matchesSearch = searchText
      ? item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchText.toLowerCase())
      : true;

    const matchesCompleted = filters.completed !== undefined
      ? item.completed === filters.completed
      : true;

    const matchesPriority = filters.priority
      ? item.priority === filters.priority
      : true;

    return matchesSearch && matchesCompleted && matchesPriority;
  });
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxAttempts) break;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};
