import '@/global.css';
import { styled } from 'nativewind';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

import useSubscriptionsStore from '@/app/stores/useSubscriptionsStore';
import SubscriptionCard from '@/components/SubscriptionCard';

const SafeArea = styled(RNSafeAreaView);

export default function Subscriptions() {
    const [query, setQuery] = useState('');
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const subscriptions = useSubscriptionsStore((s) => s.subscriptions);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return subscriptions;

        return subscriptions.filter((s) => {
            return [s.name, s.category, s.plan]
                .filter(Boolean)
                .some((field) => field!.toLowerCase().includes(q));
        });
    }, [query, subscriptions]);

    return (
        <SafeArea className="flex-1 bg-background p-5">
            <Text className="text-2xl font-sans-bold text-primary mb-4">Subscriptions</Text>

            <View>
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search subscriptions"
                    placeholderTextColor="#8a8a8a"
                    className="rounded-2xl border border-black/10 bg-card px-4 py-3 text-base text-primary mb-4"
                />
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <SubscriptionCard
                        {...item}
                        onPress={() =>
                            setExpandedSubscriptionId((current) => (current === item.id ? null : item.id))
                        }
                        expanded={expandedSubscriptionId === item.id}
                    />
                )}
                ItemSeparatorComponent={() => <View className="h-4" />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
                ListEmptyComponent={() => (
                    <Text className="mt-6 text-center text-primary/70">No subscriptions found</Text>
                )}
            />
        </SafeArea>
    );
}