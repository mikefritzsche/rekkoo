export const APP_NAME = 'Themed Lists';

export const STORAGE_KEYS = {
  LISTS: 'user_lists',
  LIST_ITEMS: (id: string | number) => `list_${id}`,
};

export const LIST_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_TAGS = 5;
export const MAX_TAG_LENGTH = 20;

export const ERROR_MESSAGES = {
  LOAD_FAILED: 'Failed to load items',
  SAVE_FAILED: 'Failed to save items',
  ADD_FAILED: 'Failed to add item',
  UPDATE_FAILED: 'Failed to update item',
  DELETE_FAILED: 'Failed to delete item',
  INVALID_TITLE: 'Title is required',
  TITLE_TOO_LONG: `Title must be less than ${MAX_TITLE_LENGTH} characters`,
  DESCRIPTION_TOO_LONG: `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`,
  TOO_MANY_TAGS: `Maximum ${MAX_TAGS} tags allowed`,
  TAG_TOO_LONG: `Tag must be less than ${MAX_TAG_LENGTH} characters`,
} as const;
