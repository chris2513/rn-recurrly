import { View, Text } from 'react-native';
import react from 'react';
import {Link} from "expo-router";

const SignUp = () => {
    return (
        <View>
            <Text>Sign Up</Text>
            <Link href="/(auth)/sign-in">Sign In</Link>
        </View>
    )
}

export default SignUp;