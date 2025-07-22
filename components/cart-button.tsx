import {Image, Text, TouchableOpacity, View} from "react-native";
import {images} from "@/constants";


export function CartButton() {
    const totalItems = 10;
    return (
        <TouchableOpacity className={"cart-btn"} onPress={() => {}}>
            <Image source={images.bag}  className={"size-5"} resizeMode={"cover"} />
            {totalItems > 0 && (
                <View className={"cart-badge"}>
                    <Text className={"small-bold text-white"}>{totalItems}</Text>
                </View>
            )}
        </TouchableOpacity>
    )
}