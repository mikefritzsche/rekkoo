// app/_layout.tsx
import {Stack} from 'expo-router';
import {theme} from '@/app/theme';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '@/constants';
import type {List} from '@/types';
import AppTitle from "@/components/AppTitle";

export default function RootLayout() {
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    const loadLists = async () => {
      const storedLists = await AsyncStorage.getItem(STORAGE_KEYS.LISTS);
      if (storedLists) {
        setLists(JSON.parse(storedLists));
      }
    };
    loadLists();
  }, []);

  return (
    <>
      <AppTitle/>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: theme.colors.background
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="list/[id]"
          options={({route}) => {
            const listId = route.params?.id;
            const list = lists.find(l => l.id === listId);
            return {
              headerShown: false,
              title: list?.title || 'List',
              presentation: 'card',
            };
          }}
        />
      </Stack>
    </>
  );
}
