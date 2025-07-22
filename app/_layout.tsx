import {SplashScreen, Stack} from "expo-router";
import "./globals.css";
import {useFonts} from "expo-font";
import {useEffect} from "react";

export default function RootLayout() {

  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-SmiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "Quicksand-medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  return <Stack screenOptions={{ headerShown: false}} />;
}
