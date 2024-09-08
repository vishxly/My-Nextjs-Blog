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
  addReply,
  getReplies,
  deleteReply,
  toggleReplyLike,
} from "@/lib/firebase/post/interactions";
import { getUserInfo } from "@/lib/firebase/userUtils";
import { ThumbsUp, Send, Trash2, MessageCircle } from "lucide-react";

export default function PostContent({ post }) {
  const { user, handleSignInWithGoogle, isLoading } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likeUsers, setLikeUsers] = useState([]);
  const [userInfoLoading, setUserInfoLoading] = useState(true);

  const [repliesVisible, setRepliesVisible] = useState({});
  const [replies, setReplies] = useState({});
  const [newReply, setNewReply] = useState({});

  const handleToggleReplies = async (commentId) => {
    setRepliesVisible((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    if (!replies[commentId]) {
      const fetchedReplies = await getReplies(post.id, commentId);
      const repliesWithUserInfo = await Promise.all(
        fetchedReplies.map(async (reply) => {
          const userInfo = await getUserInfo(reply.userId);
          return { ...reply, user: userInfo };
        })
      );
      setReplies((prev) => ({ ...prev, [commentId]: repliesWithUserInfo }));
    }
  };

  const handleAddReply = async (commentId) => {
    if (!user) {
      await handleSignInWithGoogle();
      return;
    }
    if (!newReply[commentId]?.trim()) return;
    await addReply(post.id, commentId, user.uid, newReply[commentId]);
    setNewReply((prev) => ({ ...prev, [commentId]: "" }));
    const updatedReplies = await getReplies(post.id, commentId);
    const repliesWithUserInfo = await Promise.all(
      updatedReplies.map(async (reply) => {
        const userInfo = await getUserInfo(reply.userId);
        return { ...reply, user: userInfo };
      })
    );
    setReplies((prev) => ({ ...prev, [commentId]: repliesWithUserInfo }));
  };

  const handleDeleteReply = async (commentId, replyId) => {
    await deleteReply(post.id, commentId, replyId);
    setReplies((prev) => ({
      ...prev,
      [commentId]: prev[commentId].filter((reply) => reply.id !== replyId),
    }));
  };

  const handleReplyLike = async (commentId, replyId) => {
    if (!user) {
      await handleSignInWithGoogle();
      return;
    }
    await toggleReplyLike(post.id, commentId, replyId, user.uid);
    setReplies((prev) => ({
      ...prev,
      [commentId]: prev[commentId].map((reply) =>
        reply.id === replyId
          ? {
              ...reply,
              likes: reply.likes.includes(user.uid)
                ? reply.likes.filter((id) => id !== user.uid)
                : [...reply.likes, user.uid],
            }
          : reply
      ),
    }));
  };

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
        return { ...comment, user: userInfo };
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
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow p-2 bg-gray-100 rounded-lg dark:bg-black"
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg"
            >
              <Send size={18} />
            </button>
          </div>
          <div>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 space-y-2 border rounded-lg dark:border-gray-800"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">
                      {formatUserName(comment.user)}
                    </span>
                    <p className="text-gray-800 dark:text-gray-200">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleCommentLike(comment.id)}
                        className={`flex items-center gap-2 px-2 py-1 rounded-full transition-colors ${
                          user && comment.likes.includes(user.uid)
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-gray-100 text-gray-600 dark:bg-black dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900"
                        }`}
                      >
                        <ThumbsUp size={14} />
                        <span>{comment.likes.length}</span>
                      </button>
                      {user?.uid === comment.userId && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600 dark:text-red-300 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300">
                    {comment.text}
                  </p>
                  <div>
                    <button
                      onClick={() => handleToggleReplies(comment.id)}
                      className="text-blue-600 dark:text-blue-300 hover:underline"
                    >
                      {repliesVisible[comment.id]
                        ? "Hide Replies"
                        : "Show Replies"}
                      {/* {repliesVisible[comment.id]
                        ? "Hide replies"
                        : `View replies (${comment.replyCount || 0})`} */}
                    </button>
                  </div>

                  {/* Reply Section */}
                  {repliesVisible[comment.id] && (
                    <div className="mt-2 ml-6">
                      {replies[comment.id]?.length > 0 ? (
                        replies[comment.id].map((reply) => (
                          <div
                            key={reply.id}
                            className="flex items-center justify-between p-2 space-y-2 border-b last:border-none dark:border-gray-800"
                          >
                            <div className="text-sm">
                              <span className="font-semibold">
                                {formatUserName(reply.user)}
                              </span>{" "}
                              <p className="text-gray-600 dark:text-gray-300">
                                {reply.content}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleReplyLike(comment.id, reply.id)
                                }
                                className={`flex items-center gap-2 px-2 py-1 rounded-full transition-colors ${
                                  user && reply.likes.includes(user.uid)
                                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                    : "bg-gray-100 text-gray-600 dark:bg-black dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900"
                                }`}
                              >
                                <ThumbsUp size={14} />
                                <span>{reply.likes.length}</span>
                              </button>
                              {user?.uid === reply.userId && (
                                <button
                                  onClick={() =>
                                    handleDeleteReply(comment.id, reply.id)
                                  }
                                  className="text-red-600 dark:text-red-300 hover:text-red-400"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                          No replies yet.
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={newReply[comment.id] || ""}
                          onChange={(e) =>
                            setNewReply((prev) => ({
                              ...prev,
                              [comment.id]: e.target.value,
                            }))
                          }
                          placeholder="Add a reply..."
                          className="flex-grow p-2 bg-gray-100 rounded-lg dark:bg-black"
                        />
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          className="px-4 py-2 text-white bg-blue-600 rounded-lg"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No comments yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
