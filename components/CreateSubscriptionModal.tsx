import useSubscriptionsStore from "@/app/stores/useSubscriptionsStore";
import { icons } from "@/constants/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";

const CATEGORY_OPTIONS = [
    "Entertainment",
    "AI Tools",
    "Developer Tools",
    "Design",
    "Productivity",
    "Cloud",
    "Music",
    "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
    "Entertainment": "#ffd3a2",
    "AI Tools": "#b8d4e3",
    "Developer Tools": "#e8def8",
    "Design": "#f5c542",
    "Productivity": "#b8e8d0",
    "Cloud": "#d1e8f2",
    "Music": "#f7c6d3",
    "Other": "#e2e8f0",
};

type Props = {
    visible: boolean;
    onClose: () => void;
    onCreate?: (sub: Subscription) => void;
}

export default function CreateSubscriptionModal({ visible, onClose, onCreate }: Props) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
    const [category, setCategory] = useState<string>(CATEGORY_OPTIONS[0]);
    const addSubscription = useSubscriptionsStore((s) => s.addSubscription);

    const valid = name.trim().length > 0 && !Number.isNaN(parseFloat(price)) && parseFloat(price) > 0;

    function handleSubmit() {
        if (!valid) return;
        const numericPrice = parseFloat(price);
        const id = `sub-${Date.now()}`;
        const startDate = dayjs().toISOString();
        const renewalDate = frequency === "Monthly" ? dayjs().add(1, "month").toISOString() : dayjs().add(1, "year").toISOString();
        const newSub: Subscription = {
            id,
            icon: icons.plus,
            name: name.trim(),
            price: numericPrice,
            billing: frequency,
            status: "active",
            startDate,
            renewalDate,
            category,
            currency: "USD",
            color: CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Other,
        };

        addSubscription(newSub);
        if (onCreate) onCreate(newSub);

        // reset
        setName("");
        setPrice("");
        setFrequency("Monthly");
        setCategory(CATEGORY_OPTIONS[0]);
        onClose();
    }

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Pressable style={{ flex: 1 }} onPress={onClose}>
                    <View className="modal-overlay" />
                </Pressable>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                    <View className="modal-container">
                        <View className="modal-header">
                            <Text className="modal-title">New Subscription</Text>
                            <Pressable onPress={onClose} className="modal-close">
                                <Text className="modal-close-text">×</Text>
                            </Pressable>
                        </View>
                        <ScrollView
                            contentContainerStyle={{ paddingBottom: 28, paddingHorizontal: 0, flexGrow: 1 }}
                            nestedScrollEnabled
                            showsVerticalScrollIndicator={false}
                        >
                            <View className="modal-body">
                                <View>
                                    <Text className="auth-label mb-2">Name</Text>
                                    <TextInput
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="Netflix, Notion, etc."
                                        className={"auth-input"}
                                        placeholderTextColor="#999"
                                    />
                                </View>
                                <View>
                                    <Text className="auth-label mb-2">Price</Text>
                                    <TextInput
                                        value={price}
                                        onChangeText={setPrice}
                                        placeholder="0.00"
                                        keyboardType="decimal-pad"
                                        className={"auth-input"}
                                        placeholderTextColor="#999"
                                    />
                                </View>
                                <View>
                                    <Text className="auth-label mb-2">Frequency</Text>
                                    <View className="picker-row">
                                        {(["Monthly", "Yearly"] as const).map((opt) => (
                                            <Pressable
                                                key={opt}
                                                onPress={() => setFrequency(opt)}
                                                className={clsx("picker-option", frequency === opt && "picker-option-active")}
                                            >
                                                <Text className={clsx("picker-option-text", frequency === opt && "picker-option-text-active")}>{opt}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </View>
                                <View>
                                    <Text className="auth-label mb-2">Category</Text>
                                    <View className="category-scroll">
                                        {CATEGORY_OPTIONS.map((opt) => (
                                            <Pressable
                                                key={opt}
                                                onPress={() => setCategory(opt)}
                                                className={clsx("category-chip", opt === category && "category-chip-active")}
                                            >
                                                <Text className={clsx("category-chip-text", opt === category && "category-chip-text-active")}>{opt}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </View>
                                <View className="mb-20">
                                    <Pressable onPress={handleSubmit} className={clsx("auth-button", !valid && "auth-button-disabled")}>
                                        <Text className="auth-button-text">Create Subscription</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}


