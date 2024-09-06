"use client";

import { useState, useEffect } from 'react';
import hljs from "highlight.js";
import { useAuth } from '@/lib/contexts/AuthContext' // Adjust this import pat
import { toggleLike, addComment, getComments, deleteComment, toggleCommentLike } from '@/lib/firebase/post/interactions';

export default function PostContent({ post }) {
  const { user, handleSignInWithGoogle, isLoading } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

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
    setLikes(prevLikes => 
      prevLikes.includes(user.uid)
        ? prevLikes.filter(id => id !== user.uid)
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
    setNewComment('');
    const updatedComments = await getComments(post.id);
    setComments(updatedComments);
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(post.id, commentId);
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handleCommentLike = async (commentId) => {
    if (!user) {
      await handleSignInWithGoogle();
      return;
    }
    await toggleCommentLike(post.id, commentId, user.uid);
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.likes.includes(user.uid)
                ? comment.likes.filter(id => id !== user.uid)
                : [...comment.likes, user.uid]
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
      <div 
        className="prose post-content dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
      
      <div className="flex items-center gap-2 mt-4">
        <button 
          onClick={handleLike} 
          className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md"
        >
          {user && likes.includes(user.uid) ? 'Unlike' : 'Like'} ({likes.length})
        </button>
      </div>

      <div className="mt-4">
        <h3 className="mb-2 text-lg font-semibold">Comments</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <button 
            onClick={handleAddComment} 
            className="px-4 py-2 text-white bg-green-500 rounded-md"
          >
            {user ? 'Post' : 'Sign In to Post'}
          </button>
        </div>

        {comments.map((comment) => (
          <div key={comment.id} className="py-2 border-b dark:border-gray-700">
            <p>{comment.content}</p>
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={() => handleCommentLike(comment.id)} 
                className="text-sm text-blue-500"
              >
                {user && comment.likes.includes(user.uid) ? 'Unlike' : 'Like'} ({comment.likes.length})
              </button>
              {user && user.uid === comment.userId && (
                <button 
                  onClick={() => handleDeleteComment(comment.id)} 
                  className="text-sm text-red-500"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
