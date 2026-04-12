import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from 'react-native';
import getPosthog from '../../src/utils/getPosthog';

const SubscriptionDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    useEffect(() => {
        const subscriptionId = Array.isArray(id) ? id[0] : id;
        if (!subscriptionId) return;
        let mounted = true;
        (async () => {
            const ph = await getPosthog();
            if (!mounted || !ph) return;
            ph.capture('subscription_detail_viewed', { subscription_id: subscriptionId });
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