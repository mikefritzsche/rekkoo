// data/defaultData.ts
import { generateId } from '@/utils';
import type { List, ListItem } from '@/types';

export const createDefaultLists = (): List[] => [
  {
    id: generateId(),
    title: 'Shopping List',
    createdAt: new Date().toISOString(),
    itemCount: 5,
    completedCount: 2,
    color: 'blue'
  },
  {
    id: generateId(),
    title: 'Work Tasks',
    createdAt: new Date().toISOString(),
    itemCount: 8,
    completedCount: 3,
    color: 'purple'
  },
  {
    id: generateId(),
    title: 'Movies to Watch',
    createdAt: new Date().toISOString(),
    itemCount: 4,
    completedCount: 1,
    color: 'orange'
  },
  {
    id: generateId(),
    title: 'Groceries',
    createdAt: new Date().toISOString(),
    itemCount: 6,
    completedCount: 4,
    color: 'emerald'
  }
];

const shoppingItems = (listId: string): ListItem[] => [
  {
    id: generateId(listId),
    title: 'New Headphones',
    description: 'Look for noise-cancelling ones',
    completed: true,
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['electronics', 'music']
  },
  {
    id: generateId(listId),
    title: 'Running Shoes',
    description: 'Size 10, preferably Nike',
    completed: true,
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['sports', 'clothing']
  },
  {
    id: generateId(listId),
    title: 'Backpack',
    description: 'Waterproof laptop backpack',
    completed: false,
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['accessories']
  },
  {
    id: generateId(listId),
    title: 'Watch',
    description: 'Smart watch for fitness tracking',
    completed: false,
    priority: 'low',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['electronics', 'fitness']
  },
  {
    id: generateId(listId),
    title: 'Phone Case',
    description: 'Protective case for iPhone',
    completed: false,
    priority: 'low',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['accessories', 'electronics']
  }
];

const workItems = (listId: string): ListItem[] => [
  {
    id: generateId(listId),
    title: 'Project Proposal',
    description: 'Write Q4 project proposal',
    completed: true,
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['documentation', 'urgent']
  },
  // ... rest of work items
];

const movieItems = (listId: string): ListItem[] => [
  {
    id: generateId(listId),
    title: 'The Matrix',
    description: 'Sci-fi classic',
    completed: true,
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['sci-fi', 'action']
  },
  // ... rest of movie items
];

const groceryItems = (listId: string): ListItem[] => [
  {
    id: generateId(listId),
    title: 'Milk',
    description: '2 gallons',
    completed: true,
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['dairy', 'essential']
  },
  // ... rest of grocery items
];

export const createDefaultItems = (lists: List[]): Record<string, ListItem[]> => {
  const getListId = (title: string) => lists.find(l => l.title === title)?.id!;

  return {
    [getListId('Shopping List')]: shoppingItems(getListId('Shopping List')),
    [getListId('Work Tasks')]: workItems(getListId('Work Tasks')),
    [getListId('Movies to Watch')]: movieItems(getListId('Movies to Watch')),
    [getListId('Groceries')]: groceryItems(getListId('Groceries'))
  };
};

// data/index.ts
export * from './defaultData';
