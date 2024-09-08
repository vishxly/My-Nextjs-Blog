"use client";

import { useState, useEffect } from "react";
import hljs from "highlight.js";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  toggleLike,
  addComment,
  getComments,
  deleteComment,
  toggleCommentLike,
} from "@/lib/firebase/post/interactions";
import { getUserInfo } from "@/lib/firebase/userUtils";
import { ThumbsUp, Send, Trash2 } from "lucide-react";

export default function PostContent({ post }) {
  const { user, handleSignInWithGoogle, isLoading } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likeUsers, setLikeUsers] = useState([]);
  const [userInfoLoading, setUserInfoLoading] = useState(true);

  useEffect(() => {
    hljs.highlightAll();
  }, [post.content]);

  const formatUserName = (user) => {
    if (user.name && user.name !== "Unnamed User") {
      return user.name;
    }
    return `Unnamed User (ID: ${user.id})`;
  };

  useEffect(() => {
    const fetchComments = async () => {
      console.log("Fetching comments for post:", post.id);
      const fetchedComments = await getComments(post.id);
      const commentsWithUserInfo = await Promise.all(
        fetchedComments.map(async (comment) => {
          console.log(
            `Fetching user info for comment ${comment.id}, userId: ${comment.userId}`
          );
          const userInfo = await getUserInfo(comment.userId);
          console.log(`User info fetched for comment ${comment.id}:`, userInfo);
          return { ...comment, user: userInfo };
        })
      );
      console.log("Comments with user info:", commentsWithUserInfo);
      setComments(commentsWithUserInfo);
    };
    fetchComments();
  }, [post.id]);

  useEffect(() => {
    const fetchLikeUsers = async () => {
      console.log("Fetching like users for post:", post.id);
      setUserInfoLoading(true);
      try {
        const likeUserInfo = await Promise.all(
          likes.map(async (userId) => {
            console.log(`Fetching user info for like, userId: ${userId}`);
            const userInfo = await getUserInfo(userId);
            console.log(
              `User info fetched for like, userId: ${userId}:`,
              userInfo
            );
            return userInfo;
          })
        );
        console.log("Like users info:", likeUserInfo);
        setLikeUsers(likeUserInfo);
      } catch (error) {
        console.error("Error fetching like users:", error);
      } finally {
        setUserInfoLoading(false);
      }
    };
    fetchLikeUsers();
  }, [likes]);

  const handleLike = async () => {
    if (!user) {
      await handleSignInWithGoogle();
      return;
    }
    setUserInfoLoading(true);
    try {
      await toggleLike(post.id, user.uid);
      const updatedLikes = likes.includes(user.uid)
        ? likes.filter((id) => id !== user.uid)
        : [...likes, user.uid];
      setLikes(updatedLikes);

      // Fetch user info for all likes, including the new one
      const allLikeUserInfo = await Promise.all(
        updatedLikes.map(async (userId) => await getUserInfo(userId))
      );
      setLikeUsers(allLikeUserInfo);
    } catch (error) {
      console.error("Error handling like:", error);
    } finally {
      setUserInfoLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      await handleSignInWithGoogle();
      return;
    }
    if (!newComment.trim()) return;
    await addComment(post.id, user.uid, newComment);
    setNewComment("");
    const updatedComments = await getComments(post.id);
    const commentsWithUserInfo = await Promise.all(
      updatedComments.map(async (comment) => {
        const userInfo = await getUserInfo(comment.userId);
        return { ...comment, user: userInfo }; // Fixed: use userInfo instead of user
      })
    );
    setComments(commentsWithUserInfo);
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(post.id, commentId);
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  const handleCommentLike = async (commentId) => {
    if (!user) {
      await handleSignInWithGoogle();
      return;
    }
    await toggleCommentLike(post.id, commentId, user.uid);
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.likes.includes(user.uid)
                ? comment.likes.filter((id) => id !== user.uid)
                : [...comment.likes, user.uid],
            }
          : comment
      )
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="p-6">
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              user && likes.includes(user.uid)
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                : "bg-gray-100 text-gray-600 dark:bg-black dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900"
            }`}
          >
            <ThumbsUp size={18} />
            <span>{likes.length}</span>
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Liked by:{" "}
            {likeUsers.map((user, index) => (
              <span key={user.id}>
                {formatUserName(user)}
                {index < likeUsers.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold">Comments</h3>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow px-4 py-2 border rounded-full dark:bg-black dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <button
              onClick={handleAddComment}
              className={`px-6 py-2 rounded-full transition-colors ${
                user
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
              disabled={!user}
            >
              <Send size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-lg bg-gray-50 dark:bg-black"
              >
                <div className="mb-2 font-semibold">
                  {formatUserName(comment.user)}
                </div>
                <p className="text-gray-800 dark:text-gray-200">
                  {comment.content}
                </p>

                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleCommentLike(comment.id)}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      user && comment.likes.includes(user.uid)
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    <ThumbsUp size={14} />
                    <span>{comment.likes ? comment.likes.length : 0}</span>
                  </button>
                  {user && user.uid === comment.userId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="flex items-center gap-1 text-sm text-red-500 transition-colors hover:text-red-600"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
