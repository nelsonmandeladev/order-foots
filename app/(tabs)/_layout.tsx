import {Redirect, Slot} from "expo-router";

export default function Layout() {
    const isAuthenticated = false;

    if (!isAuthenticated) return <Redirect href="/sign-in" />;
    return <Slot />
}