import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  deleteDoc,
  orderBy,
  getDoc,
} from "firebase/firestore";

export const toggleLike = async (postId, userId) => {
  const postRef = doc(db, `posts/${postId}`);
  const post = await getDoc(postRef);
  const likes = post.data().likes || [];

  if (likes.includes(userId)) {
    await updateDoc(postRef, {
      likes: arrayRemove(userId),
    });
  } else {
    await updateDoc(postRef, {
      likes: arrayUnion(userId),
    });
  }
};

export const addComment = async (postId, userId, content) => {
  const commentsRef = collection(db, `posts/${postId}/comments`);
  await addDoc(commentsRef, {
    userId,
    content,
    timestamp: Timestamp.now(),
    likes: [],
  });
};

export const getComments = async (postId) => {
  const commentsRef = collection(db, `posts/${postId}/comments`);
  const q = query(commentsRef, orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteComment = async (postId, commentId) => {
  await deleteDoc(doc(db, `posts/${postId}/comments/${commentId}`));
};

export const toggleCommentLike = async (postId, commentId, userId) => {
  const commentRef = doc(db, `posts/${postId}/comments/${commentId}`);
  const comment = await getDoc(commentRef);
  const likes = comment.data().likes || [];

  if (likes.includes(userId)) {
    await updateDoc(commentRef, {
      likes: arrayRemove(userId),
    });
  } else {
    await updateDoc(commentRef, {
      likes: arrayUnion(userId),
    });
  }
};
