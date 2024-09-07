import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getUserInfo = async (userId) => {
  try {
    console.log(`Fetching user info for userId: ${userId}`);
    const userRef = doc(db, `users/${userId}`);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log(`User data for ${userId}:`, userData);
      return {
        id: userId,
        name: userData.name || "Unknown User",
      };
    } else {
      console.warn(`User document not found for userId: ${userId}`);
    }
  } catch (error) {
    console.error(`Error fetching user info for userId: ${userId}`, error);
  }

  return { id: userId, name: "Unknown User" };
};

