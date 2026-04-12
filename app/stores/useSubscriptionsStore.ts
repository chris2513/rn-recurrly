import { HOME_SUBSCRIPTIONS } from '@/constants/data';
import { create } from 'zustand';

type SubscriptionsState = {
    subscriptions: Subscription[];
    addSubscription: (s: Subscription) => void;
    setSubscriptions: (s: Subscription[]) => void;
};

export const useSubscriptionsStore = create<SubscriptionsState>((set) => ({
    subscriptions: HOME_SUBSCRIPTIONS,
    addSubscription: (s: Subscription) => set((state) => ({ subscriptions: [s, ...state.subscriptions] })),
    setSubscriptions: (s: Subscription[]) => set({ subscriptions: s }),
}));

export default useSubscriptionsStore;
