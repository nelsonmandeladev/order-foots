import {Button, Text, View} from "react-native";
import {useRouter} from "expo-router";

export default function SignUp() {
    const router = useRouter();
    return (
        <View>
            <Text>SignUp</Text>
            <Button title={"Sign In"} onPress={() => router.push("/sign-in")} />
        </View>
    )
}