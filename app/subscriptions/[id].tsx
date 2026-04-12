import { View, Text } from 'react-native';
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import getPosthog from '../../src/utils/getPosthog';

const SubscriptionDetails = () => {
    const { id } = useLocalSearchParams<{id: string}>();
    useEffect(() => {
        let mounted = true;
        (async () => {
            const ph = await getPosthog();
            if (!mounted || !ph) return;
            ph.capture('subscription_detail_viewed', { subscription_id: id });
        })();
        return () => {
            mounted = false;
        };
    }, [id]);

    return (
        <View>
            <Text>SubscriptionDetails: {id}</Text>
        </View>
    )
}

export default SubscriptionDetails;