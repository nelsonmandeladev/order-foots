import {View, Text, Button} from 'react-native'
import {useRouter} from "expo-router";

export default function SignIn() {
    const router = useRouter();
    return (
        <View className="text-center w-full">
            <Text>Sign In</Text>
            <Button title={"Sign up"} onPress={() => router.push("/sign-up")} />
        </View>
    )
}