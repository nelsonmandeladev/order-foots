import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import {dummyData} from "@/libs/data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
    const list = await databases.listDocuments(
        appwriteConfig.database,
        collectionId
    );

    await Promise.all(
        list.documents.map((doc) =>
            databases.deleteDocument(appwriteConfig.database, collectionId, doc.$id)
        )
    );
}

async function clearStorage(): Promise<void> {
    const list = await storage.listFiles(appwriteConfig.assetsBucketID);

    await Promise.all(
        list.files.map((file) =>
            storage.deleteFile(appwriteConfig.assetsBucketID, file.$id)
        )
    );
}

async function uploadImageToStorage(imageUrl: string) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileObj = {
        name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
        type: blob.type,
        size: blob.size,
        uri: imageUrl,
    };

    const file = await storage.createFile(
        appwriteConfig.assetsBucketID,
        ID.unique(),
        fileObj
    );

    return storage.getFileViewURL(appwriteConfig.assetsBucketID, file.$id);
}

export async function seed(): Promise<void> {
    // 1. Clear all
    console.log("Clearing database and storage before seeding");
    await clearAll(appwriteConfig.categoryCollectionID);
    await clearAll(appwriteConfig.customizationCollectionID);
    await clearAll(appwriteConfig.menuCollectionID);
    await clearAll(appwriteConfig.menuCustomizationCollectionID);
    await clearStorage();
    console.log("Database and storage cleared!");

    console.log("Starting Database and storage seeding...")
    // 2. Create Categories
    console.log("Seeding categories...");
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        const doc = await databases.createDocument(
            appwriteConfig.database,
            appwriteConfig.categoryCollectionID,
            ID.unique(),
            cat
        );
        categoryMap[cat.name] = doc.$id;
    }
    console.log("Categories seeded!")

    // 3. Create Customizations
    console.log("Seeding Customizations...");
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
        const doc = await databases.createDocument(
            appwriteConfig.database,
            appwriteConfig.customizationCollectionID,
            ID.unique(),
            {
                name: cus.name,
                price: cus.price,
                type: cus.type,
            }
        );
        customizationMap[cus.name] = doc.$id;
    }
    console.log("Customizations seeded!...");

    // 4. Create Menu Items
    console.log("Seeding  Menu Items...");
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
        const uploadedImage = await uploadImageToStorage(item.image_url);

        const doc = await databases.createDocument(
            appwriteConfig.database,
            appwriteConfig.menuCollectionID,
            ID.unique(),
            {
                name: item.name,
                description: item.description,
                image_url: uploadedImage,
                price: item.price,
                rating: item.rating,
                calories: item.calories,
                protein: item.protein,
                categories: categoryMap[item.category_name],
            }
        );

        menuMap[item.name] = doc.$id;
        console.log(`Created menu item for ${item.name}`);

        // 5. Create menu_customizations
        for (const cusName of item.customizations) {
            await databases.createDocument(
                appwriteConfig.database,
                appwriteConfig.menuCustomizationCollectionID,
                ID.unique(),
                {
                    menu: doc.$id,
                    customizations: customizationMap[cusName],
                }
            );
        }
    }
    console.log("Menu Items seeded!");

    console.log("✅ Seeding complete.");
}