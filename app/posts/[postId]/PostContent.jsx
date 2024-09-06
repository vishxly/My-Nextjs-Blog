"use client";

import { useState, useEffect } from "react";
import hljs from "highlight.js";
import { useAuth } from "@/lib/contexts/AuthContext"; // Adjust this import pat
import {
  toggleLike,
  addComment,
  getComments,
  deleteComment,
  toggleCommentLike,
} from "@/lib/firebase/post/interactions";
import { ThumbsUp, Send, Trash2 } from "lucide-react";
export default function PostContent({ post }) {
  const { user, handleSignInWithGoogle, isLoading } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    hljs.highlightAll();
  }, [post.content]);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getComments(post.id);
      setComments(fetchedComments);
    };
    fetchComments();
  }, [post.id]);

  const handleLike = async () => {
    if (!user) {
      await handleSignInWithGoogle();
      return;
    }
    await toggleLike(post.id, user.uid);
    setLikes((prevLikes) =>
      prevLikes.includes(user.uid)
        ? prevLikes.filter((id) => id !== user.uid)
        : [...prevLikes, user.uid]
    );
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
    setComments(updatedComments);
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
    <div className="max-w-2xl mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-black">
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
                ? "bg-blue-100 text-blue-600 dark:bg-black dark:text-blue-300"
                : "bg-gray-100 text-gray-600 dark:bg-black dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900"
            }`}
          >
            <ThumbsUp size={18} />
            <span>{likes.length}</span>
          </button>
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
                    <span>{comment.likes.length}</span>
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
