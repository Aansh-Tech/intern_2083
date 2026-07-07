<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'blog_post_id' => 'required|exists:blog_posts,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'content' => 'required|string|min:3',
        ]);

        // Create the comment
        $comment = Comment::create([
            'blog_post_id' => $validated['blog_post_id'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'content' => $validated['content'],
            'status' => 'pending', // Comments need admin approval
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Comment submitted successfully. Awaiting approval.',
            'data' => $comment
        ], 201);
    }
}