import { styled } from "nativewind";
import { Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView)

const Insights = () => {
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className='text-2xl font-sans-bold text-primary mb-4'>Insights</Text>
            <View className="flex rounded-3xl bg-card px-6 py-6 shadow-sm border border-black/10 items-center justify-center">
                <Text className="text-sm font-sans-semibold text-primary/70 mb-4">Coming Soon</Text>
            </View>
        </SafeAreaView>
    )
}

export default Insights;