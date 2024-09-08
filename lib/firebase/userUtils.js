import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const getUserInfo = async (userId) => {
  console.log(`Fetching user info for userId: ${userId}`);
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log(`User data found for ${userId}:`, userData);
      return {
        id: userId,
        name: userData.name || "Unnamed User",
        email: userData.email || null,
        photoURL: userData.photoURL || null,
        // Add other fields you want to return
      };
    } else {
      console.warn(`No user document found for userId: ${userId}`);
      // Create a placeholder user document
      await createPlaceholderUser(userId);
      return { id: userId, name: "Unnamed User" };
    }
  } catch (error) {
    console.error(`Error fetching user info for ${userId}:`, error);
    return { id: userId, name: "Error Fetching User" };
  }
};

const createPlaceholderUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      name: "Unnamed User",
      createdAt: new Date(),
    });
    console.log(`Created placeholder user document for userId: ${userId}`);
  } catch (error) {
    console.error(`Error creating placeholder user document for ${userId}:`, error);
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, updates);
    console.log(`Updated user profile for userId: ${userId}`, updates);
  } catch (error) {
    console.error(`Error updating user profile for ${userId}:`, error);
  }
};
