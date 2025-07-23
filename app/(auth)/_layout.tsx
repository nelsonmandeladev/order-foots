import {Slot} from "expo-router";
import {Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, View} from "react-native";
import {images} from "@/constants";

export default function _AuthLayout() {
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView className={"bg-white h-full"} keyboardShouldPersistTaps={"handled"}>
                <View className={"w-full relative"} style={{height: Dimensions.get('screen').height / 2.25}}>
                    <ImageBackground source={images.loginGraphic} className={"size-full rounded-b-lg"} resizeMode={"stretch"} />
                    <Image source={images.logo} className={"self-center size-48 absolute -bottom-16"} resizeMode={"stretch"} />
                </View>
               <View className={"p-5 mt-5"}>
                   <Slot />
               </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}