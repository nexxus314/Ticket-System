import { useState, useEffect } from "react";

export default function Comments({ ticketId, token, userEmail }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  async function fetchComments() {
    try {
      const res = await fetch(`http://localhost:5000/comments/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  }

  async function addComment(e) {
    e.preventDefault();

    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/comments/${ticketId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      const data = await res.json();

      if (res.ok) {
        setNewComment("");
        await fetchComments();
      } else {
        console.error("Backend error:", data);
        alert("Error adding comment: " + (data.message || JSON.stringify(data)));
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteComment(commentId) {
    try {
      const res = await fetch(`http://localhost:5000/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchComments();
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  }

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="font-semibold mb-3">Comments ({comments.length})</h3>

      {/* Add Comment Form */}
      <form onSubmit={addComment} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full border border-slate-200 rounded px-3 py-2 text-sm mb-2 resize-none"
          rows="3"
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Comment"}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="p-2 bg-slate-50 rounded text-sm border border-slate-100"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-slate-700">
                  {comment.userEmail}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-700 mb-2">{comment.text}</p>
              {userEmail === comment.userEmail && (
                <button
                  onClick={() => deleteComment(comment._id)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
