import {Account, Avatars, Client, Databases, ID, Query, Storage} from "react-native-appwrite";
import {CreateUserParams, GetMenuParams, SignInParams} from "@/type";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    database: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
    categoryCollectionID: process.env.EXPO_PUBLIC_APPWRITE_CATEGORY_COLLECTION_ID!,
    menuCollectionID: process.env.EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID!,
    customizationCollectionID: process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATION_COLLECTION_ID!,
    menuCustomizationCollectionID: process.env.EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATION_COLLECTION_ID!,

    assetsBucketID: process.env.EXPO_PUBLIC_APPWRITE_ASETS_BUCKET_ID!
}

export const client = new Client();
client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

export async function createUserAccount({email, password, name}: CreateUserParams) {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name);
        if (!newAccount) throw Error("Account already exists!");
        await signIn({email, password});
        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.database,
            appwriteConfig.userCollectionId,
            ID.unique(),
            { email, name, accountId: newAccount.$id, avatar:avatarUrl },
        )

    } catch (error) {
        throw new Error(error as string);
    }
}

export async function signIn({email, password}: SignInParams) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.database,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}

export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        const queries: string[] = [];

        if(category) queries.push(Query.equal('categories', category));
        if(query) queries.push(Query.search('name', query));

        const menus = await databases.listDocuments(
            appwriteConfig.database,
            appwriteConfig.menuCollectionID,
            queries,
        )

        return menus.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.database,
            appwriteConfig.categoryCollectionID,
        )

        return categories.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}