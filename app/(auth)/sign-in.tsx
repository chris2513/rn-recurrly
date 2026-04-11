import '@/global.css';
import { useAuth, useSignIn } from '@clerk/expo';
import { type Href, Link, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

export default function SignInScreen() {
    const { signIn, errors, fetchStatus } = useSignIn();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [flowError, setFlowError] = useState<string | null>(null);

    const isVerificationStep =
        signIn.status === 'needs_client_trust' ||
        signIn.status === 'needs_second_factor';

    const navigateHome = async ({ decorateUrl }: { decorateUrl: (path: string) => string }) => {
        const url = decorateUrl('/(tabs)');
        if (typeof window !== 'undefined' && url.startsWith('http')) {
            window.location.href = url;
        } else {
            router.push(url as Href);
        }
    };

    const finalizeSignIn = async () => {
        await signIn.finalize({
            navigate: ({
                session,
                decorateUrl,
            }: {
                session?: { currentTask?: unknown };
                decorateUrl: (path: string) => string;
            }) => {
                if (session?.currentTask) {
                    return;
                }

                void navigateHome({ decorateUrl });
            },
        });
    };

    const handleSubmit = async () => {
        setFlowError(null);

        if (!emailAddress || !password) {
            setFlowError('Enter your email and password to continue.');
            return;
        }

        const { error } = await signIn.password({
            emailAddress,
            password,
        });

        if (error) {
            setFlowError(error.longMessage ?? error.message ?? 'Unable to sign in.');
            return;
        }

        if (signIn.status === 'complete') {
            await finalizeSignIn();
            return;
        }

        if (isVerificationStep) {
            const emailCodeFactor = signIn.supportedSecondFactors?.find(
                (factor: { strategy?: string }) => factor.strategy === 'email_code'
            );

            if (emailCodeFactor) {
                await signIn.mfa.sendEmailCode();
                return;
            }
        }

        setFlowError('Continue with the verification code to finish signing in.');
    };

    const handleVerify = async () => {
        setFlowError(null);

        if (!code) {
            setFlowError('Enter the code from your email.');
            return;
        }

        const { error } = await signIn.mfa.verifyEmailCode({ code });

        if (error) {
            setFlowError(error.longMessage ?? error.message ?? 'Verification failed.');
            return;
        }

        if (signIn.status === 'complete') {
            await finalizeSignIn();
            return;
        }

        setFlowError('Verification did not complete. Please try again.');
    };

    if (isSignedIn) {
        return null;
    }

    return (
        <SafeAreaView className="flex-1 bg-background px-5 pt-12">
            <View className="rounded-[40px] bg-card px-6 py-8">
                <Text className="text-4xl font-sans-extrabold text-primary">Welcome back</Text>
                <Text className="mt-2 text-base font-sans-medium text-primary/70">
                    Sign in to manage your subscriptions and billing in one place.
                </Text>

                {isVerificationStep ? (
                    <View className="mt-8 space-y-4">
                        <Text className="text-sm font-sans-semibold text-primary/90">Verification code</Text>
                        <TextInput
                            className="rounded-3xl border border-black/10 bg-white px-4 py-4 text-base text-primary shadow-sm"
                            value={code}
                            onChangeText={setCode}
                            placeholder="Enter code"
                            placeholderTextColor="#8a8a8a"
                            keyboardType="numeric"
                        />
                        {errors.fields.code && (
                            <Text className="text-sm text-destructive">{errors.fields.code.message}</Text>
                        )}
                        {flowError && <Text className="text-sm text-destructive">{flowError}</Text>}
                        <Pressable
                            onPress={handleVerify}
                            disabled={fetchStatus === 'fetching'}
                            className="mt-4 rounded-3xl bg-accent px-4 py-4 items-center justify-center"
                            style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }, fetchStatus === 'fetching' && { opacity: 0.5 }]}
                        >
                            {fetchStatus === 'fetching' ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-base font-sans-semibold text-white">Verify code</Text>
                            )}
                        </Pressable>
                        <Pressable
                            onPress={() => signIn.mfa.sendEmailCode()}
                            className="mt-3 rounded-3xl border border-black/10 px-4 py-4 items-center justify-center"
                            style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
                        >
                            <Text className="text-base font-sans-semibold text-primary">Resend code</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => signIn.reset()}
                            className="mt-3 items-center"
                            style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
                        >
                            <Text className="text-sm font-sans-medium text-primary/70">Start over</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View className="mt-8 space-y-4">
                        <View>
                            <Text className="text-sm font-sans-semibold text-primary/90">Email</Text>
                            <TextInput
                                className="mt-3 rounded-3xl border border-black/10 bg-white px-4 py-4 text-base text-primary shadow-sm"
                                autoCapitalize="none"
                                value={emailAddress}
                                onChangeText={setEmailAddress}
                                placeholder="Enter your email"
                                placeholderTextColor="#8a8a8a"
                                keyboardType="email-address"
                                autoCorrect={false}
                            />
                            {errors.fields.identifier && (
                                <Text className="mt-2 text-sm text-destructive">{errors.fields.identifier.message}</Text>
                            )}
                        </View>
                        <View>
                            <Text className="text-sm font-sans-semibold text-primary/90">Password</Text>
                            <TextInput
                                className="mt-3 rounded-3xl border border-black/10 bg-white px-4 py-4 text-base text-primary shadow-sm"
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter your password"
                                placeholderTextColor="#8a8a8a"
                                secureTextEntry
                            />
                            {errors.fields.password && (
                                <Text className="mt-2 text-sm text-destructive">{errors.fields.password.message}</Text>
                            )}
                        </View>
                        {flowError && <Text className="text-sm text-destructive">{flowError}</Text>}
                        <Pressable
                            onPress={handleSubmit}
                            disabled={!emailAddress || !password || fetchStatus === 'fetching'}
                            className="mt-4 rounded-3xl bg-accent px-4 py-4 items-center justify-center"
                            style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }, (!emailAddress || !password || fetchStatus === 'fetching') && { opacity: 0.5 }]}
                        >
                            {fetchStatus === 'fetching' ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-base font-sans-semibold text-white">Continue</Text>
                            )}
                        </Pressable>
                    </View>
                )}

                <View className="mt-6 items-center">
                    <Text className="text-sm font-sans-medium text-primary/70">
                        New here?{' '}
                        <Link href="/sign-up" className="text-accent font-sans-semibold">
                            Create an account
                        </Link>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
