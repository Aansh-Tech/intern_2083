<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index($slug)
    {
        $post = BlogPost::where('slug', $slug)->first();

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Blog post not found'
            ], 404);
        }

        $comments = $post->comments()->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $comments
        ]);
    }

    /**
     * GET /v1/comments (protected)
     * Lists comments across every blog post, newest first.
     * Optional ?status=pending|approved|rejected to filter.
     */
    public function indexAll(Request $request)
    {
        $query = Comment::with('blogPost:id,title,slug')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $comments = $query->get();

        return response()->json([
            'success' => true,
            'data' => $comments
        ]);
    }

    /**
     * PATCH /v1/comments/{id} (protected)
     * Updates a comment's moderation status, e.g. { "status": "approved" }.
     */
    public function updateStatus(Request $request, $id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Comment not found'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $comment->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Comment status updated successfully.',
            'data' => $comment
        ]);
    }

    public function destroy($id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Comment not found'
            ], 404);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully.'
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'blog_post_id' => 'required|exists:blog_posts,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'content' => 'required|string|min:3',
        ]);

        $comment = Comment::create([
            'blog_post_id' => $validated['blog_post_id'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'content' => $validated['content'],
            'status' => 'pending',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Comment submitted successfully. Awaiting approval.',
            'data' => $comment
        ], 201);
    }
}
