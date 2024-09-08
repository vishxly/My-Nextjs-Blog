"use client"

import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createOrUpdateUserDocument = async (user) => {
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        try {
            if (!userSnap.exists()) {
                const userData = {
                    name: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: serverTimestamp(),
                };
                await setDoc(userRef, userData);
                console.log("User document created for:", user.uid, userData);
            } else {
                const existingData = userSnap.data();
                const updatedData = {
                    name: user.displayName || existingData.name || user.email.split('@')[0],
                    email: user.email,
                    photoURL: user.photoURL,
                    lastLogin: serverTimestamp(),
                };
                await updateDoc(userRef, updatedData);
                console.log("User document updated for:", user.uid, updatedData);
            }
        } catch (error) {
            console.error("Error creating/updating user document:", error);
            setError("Failed to save user data. Please try again.");
        }
    };

    useEffect(() => {
        setIsLoading(true);
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("Auth state changed, user:", user);
                setUser(user);
                await createOrUpdateUserDocument(user);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });
        return () => unsub();
    }, []);

    const handleSignInWithGoogle = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, new GoogleAuthProvider());
            console.log("Google sign-in result:", result.user);
            await createOrUpdateUserDocument(result.user);
        } catch (error) {
            console.error("Error during sign-in:", error);
            setError(error?.message || "Failed to sign in. Please try again.");
        }
        setIsLoading(false);
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error during logout:", error);
            setError(error?.message || "Failed to log out. Please try again.");
        }
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                handleSignInWithGoogle,
                handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
