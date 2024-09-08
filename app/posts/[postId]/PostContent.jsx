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
import { ThumbsUp, Send, Trash2, MessageCircle,MessageSquare, ChevronDown, ChevronUp, } from "lucide-react";

export default function PostContent({ post }) {
  const { user, handleSignInWithGoogle, isLoading } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likeUsers, setLikeUsers] = useState([]);
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [replyCounts, setReplyCounts] = useState({});

  const [repliesVisible, setRepliesVisible] = useState({});
  const [replies, setReplies] = useState({});
  const [newReply, setNewReply] = useState({});

  useEffect(() => {
    const fetchInitialReplyCounts = async () => {
      const counts = {};
      for (const comment of comments) {
        const replyCount = await getReplyCount(post.id, comment.id);
        counts[comment.id] = replyCount;
      }
      setReplyCounts(counts);
    };
    fetchInitialReplyCounts();
  }, [comments, post.id]);

  const getReplyCount = async (postId, commentId) => {
    const replies = await getReplies(postId, commentId);
    return replies.length;
  };
  const handleAddReplyWithCount = async (commentId) => {
    await handleAddReply(commentId);
    setReplyCounts((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || 0) + 1,
    }));
  };

  const handleDeleteReplyWithCount = async (commentId, replyId) => {
    await handleDeleteReply(commentId, replyId);
    setReplyCounts((prev) => ({
      ...prev,
      [commentId]: Math.max((prev[commentId] || 0) - 1, 0),
    }));
  };
  const handleToggleReplies = async (commentId) => {
    const newVisibility = !repliesVisible[commentId];
    setRepliesVisible((prev) => ({ ...prev, [commentId]: newVisibility }));

    if (newVisibility && !replies[commentId]) {
      const fetchedReplies = await getReplies(post.id, commentId);
      const repliesWithUserInfo = await Promise.all(
        fetchedReplies.map(async (reply) => {
          const userInfo = await getUserInfo(reply.userId);
          return { ...reply, user: userInfo };
        })
      );
      setReplies((prev) => ({ ...prev, [commentId]: repliesWithUserInfo }));

      // Update reply count to ensure it's accurate
      setReplyCounts((prev) => ({
        ...prev,
        [commentId]: repliesWithUserInfo.length,
      }));
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

    // Update reply count immediately
    setReplyCounts((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || 0) + 1,
    }));

    // Fetch updated replies if they're visible
    if (repliesVisible[commentId]) {
      const updatedReplies = await getReplies(post.id, commentId);
      const repliesWithUserInfo = await Promise.all(
        updatedReplies.map(async (reply) => {
          const userInfo = await getUserInfo(reply.userId);
          return { ...reply, user: userInfo };
        })
      );
      setReplies((prev) => ({ ...prev, [commentId]: repliesWithUserInfo }));
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    await deleteReply(post.id, commentId, replyId);

    // Update reply count immediately
    setReplyCounts((prev) => ({
      ...prev,
      [commentId]: Math.max((prev[commentId] || 0) - 1, 0),
    }));

    // Update replies list if visible
    if (repliesVisible[commentId]) {
      setReplies((prev) => ({
        ...prev,
        [commentId]: prev[commentId].filter((reply) => reply.id !== replyId),
      }));
    }
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
      <div className="p-8 space-y-8">
        {/* Post Content */}
        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Like Section */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLike}
            className={`group flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
              user && likes.includes(user.uid)
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50"
            }`}
          >
            <ThumbsUp
              size={20}
              className="transition-transform group-hover:scale-125"
            />
            <span className="font-semibold">{likes.length}</span>
          </button>
          <div className="text-sm italic text-gray-500 dark:text-gray-400">
            Appreciated by: {likes.map((user) => user.name).join(", ")}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="p-8 space-y-6 bg-gray-50 dark:bg-black dark:text-white">
        <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
          Comments
        </h3>

        {/* New Comment Input */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-grow p-4 transition-all duration-300 rounded-lg shadow-inner dark:bg-black focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddComment}
            className="p-4 text-white transition-all duration-300 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Send size={24} />
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-6 space-y-4 shadow-md dark:bg-black dark:text-white rounded-xl"
              >
                <div className="flex items-start justify-between">
                  <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {comment.user.name}
                  </span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleCommentLike(comment.id)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-300 ${
                        user && comment.likes.includes(user.uid)
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                      }`}
                    >
                      <ThumbsUp size={16} />
                      <span>{comment.likes.length}</span>
                    </button>
                    {user?.uid === comment.userId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 transition-colors duration-300 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {comment.content}
                </p>

                {/* Replies Section */}
                <div>
                  <button
                    onClick={() => handleToggleReplies(comment.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all duration-300 bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400"
                  >
                    <MessageSquare
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <span>
                      {repliesVisible[comment.id] ? "Hide" : "View"} Replies
                    </span>
                    <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                      {replyCounts[comment.id] || 0}
                    </span>
                    {repliesVisible[comment.id] ? (
                      <ChevronUp size={18} className="ml-1" />
                    ) : (
                      <ChevronDown size={18} className="ml-1" />
                    )}
                  </button>

                  {repliesVisible[comment.id] && (
                    <div className="pl-6 mt-4 space-y-4 border-l-2 border-gray-200 dark:border-gray-600">
                      {replies[comment.id]?.map((reply) => (
                        <div
                          key={reply.id}
                          className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              {reply.user.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleReplyLike(comment.id, reply.id)
                                }
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-300 ${
                                  user && reply.likes.includes(user.uid)
                                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                                }`}
                              >
                                <ThumbsUp size={12} />
                                <span>{reply.likes.length}</span>
                              </button>
                              {user?.uid === reply.userId && (
                                <button
                                  onClick={() =>
                                    handleDeleteReply(comment.id, reply.id)
                                  }
                                  className="text-red-500 transition-colors duration-300 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            {reply.content}
                          </p>
                        </div>
                      ))}

                      {/* New Reply Input */}
                      <div className="flex gap-2 mt-4">
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
                          className="flex-grow p-2 transition-all duration-300 bg-white rounded-lg shadow-inner dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          className="p-2 text-white transition-all duration-300 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="italic text-center text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
