import { View, Text } from 'react-native';
import react from 'react';
import {Link} from "expo-router";

const SignIn = () => {
    return (
        <View>
            <Text>Sign In</Text>
            <Link href="/(auth)/sign-up">Create an account</Link>
        </View>
    )
}

export default SignIn;