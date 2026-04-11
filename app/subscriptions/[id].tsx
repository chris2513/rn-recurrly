import { View, Text } from 'react-native';
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { usePostHog } from "posthog-react-native";

const SubscriptionDetails = () => {
    const { id } = useLocalSearchParams<{id: string}>();
    const posthog = usePostHog();

    useEffect(() => {
        posthog.capture('subscription_detail_viewed', { subscription_id: id });
    }, [id, posthog]);

    return (
        <View>
            <Text>SubscriptionDetails: {id}</Text>
        </View>
    )
}

export default SubscriptionDetails;