import '@/global.css';
import { useClerk } from '@clerk/expo';
import { styled } from 'nativewind';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { usePostHog } from 'posthog-react-native';

const SafeAreaView = styled(RNSafeAreaView);

export default function Settings() {
    const { signOut } = useClerk();
    const [signingOut, setSigningOut] = useState(false);
    const posthog = usePostHog();

    const handleSignOut = async () => {
        if (signingOut) return;
        setSigningOut(true);
        try {
            posthog.capture('user_signed_out');
            posthog.reset();
            await signOut();
        } catch (err) {
            // Log the error and re-enable the button so the user can retry
            // (Runtime will surface this in Metro/Console)
            // eslint-disable-next-line no-console
            console.error('Sign out failed', err);
            setSigningOut(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-2xl font-sans-bold text-primary mb-6">Settings</Text>

            <View className="rounded-[24px] bg-card px-6 py-6 shadow-sm border border-black/10">
                <Text className="text-sm font-sans-semibold text-primary/70 mb-4">Account</Text>

                <Pressable
                    onPress={handleSignOut}
                    disabled={signingOut}
                    accessibilityRole="button"
                    className={`auth-button ${signingOut ? 'auth-button-disabled' : 'bg-destructive'}`}
                    style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                >
                    {signingOut ? (
                        <Text className="auth-button-text text-white">Signing out...</Text>
                    ) : (
                        <Text className="auth-button-text text-white">Sign out</Text>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}