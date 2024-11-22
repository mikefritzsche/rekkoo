import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants';

export default function AppTitle() {
  const pathname = usePathname();

  useEffect(() => {
    const updateTitle = async () => {
      if (pathname === '/') {
        document.title = 'My Lists - Themed Lists';
        return;
      }

      if (pathname.startsWith('/list/')) {
        const storedLists = await AsyncStorage.getItem(STORAGE_KEYS.LISTS);
        if (storedLists) {
          const lists = JSON.parse(storedLists);
          const listId = pathname.split('/')[2];
          const list = lists.find((l: any) => l.id === listId);
          if (list) {
            document.title = `${list.title} - Themed Lists`;
            return;
          }
        }
      }

      document.title = 'Themed Lists';
    };

    updateTitle();
  }, [pathname]);

  return null;
}
