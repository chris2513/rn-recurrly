import "@/global.css"
import { useState } from "react";
import { usePostHog } from "posthog-react-native";
import {View, Image, Text, FlatList} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import { styled } from "nativewind";
import images from "@/constants/images";
import {HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS} from "@/constants/data";
import {icons} from "@/constants/icons";
import {formatCurrency} from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeadings";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const posthog = usePostHog();
    return (
        <SafeAreaView className="flex-1 bg-background p-5">

            <View>

                <FlatList
                    ListHeaderComponent={() => (
                        <View>
                            <View className="home-header">
                                <View className="home-user">
                                    <Image source={images.avatar} className="home-avatar" />
                                    <Text className="home-user-name">{HOME_USER.name}</Text>
                                </View>
                                <Image source={icons.add} className="home-add-icon" />
                            </View>
                            <View className="home-balance-card">

                                <Text className="home-balance-label">Balance</Text>
                                <View className="home-balance-row">
                                    <Text className="home-balance-amount">
                                        {formatCurrency(HOME_BALANCE.amount)}
                                    </Text>
                                    <Text className="home-balance-date">
                                        {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                                    </Text>
                                </View>
                            </View>
                            <ListHeading title="Upcoming" />
                            <FlatList

                                data={UPCOMING_SUBSCRIPTIONS}
                                renderItem={({item}) => (
                                    <UpcomingSubscriptionCard {...item} />
                                )}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                ListEmptyComponent={<Text className="home-empty-state">No Upcoming Subscriptions</Text>}
                            />
                            <ListHeading title="All Subscriptions" />
                        </View>
                    )}
                    data={HOME_SUBSCRIPTIONS}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <SubscriptionCard {...item}
                            onPress={() => {
                                const isExpanding = expandedSubscriptionId !== item.id;
                                setExpandedSubscriptionId(
                                    (currentId) => (
                                        currentId === item.id ? null : item.id
                                    )
                                );
                                if (isExpanding) {
                                    posthog.capture('subscription_expanded', {
                                        subscription_id: item.id,
                                        subscription_name: item.name,
                                    });
                                }
                            }}
                            expanded={expandedSubscriptionId === item.id}
                        />
                    )}
                    extraData={expandedSubscriptionId}
                    ItemSeparatorComponent={() => <View className="h-4"></View>}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => <Text className="home-empty-state">
                        No Subscriptions Yet
                    </Text>}
                    contentContainerClassName="pb-20"
                    />

            </View>
        </SafeAreaView>
    );
}