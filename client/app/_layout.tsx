// app/_layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {Stack} from 'expo-router';
import {theme} from '@/app/theme';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '@/constants';
import type {List} from '@/types';
import AppTitle from "@/components/AppTitle";
import { ApiError } from '@/types/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      cacheTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      useErrorBoundary: (error) => {
        const apiError = error as ApiError;
        return apiError.status >= 500;
      },
    },
  },
});
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

    queryClient.setDefaultOptions({
      mutations: {
        onError: (error: ApiError) => {
          // Global error handling for mutations
          console.error(`Mutation error: ${error.message}`);
        },
      },
    });

  }, []);

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
