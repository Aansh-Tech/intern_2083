<?php

use Illuminate\Support\Facades\Route;

// Test route (keep this for verification)
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!'
    ]);
});

// Your real API routes
Route::prefix('v1')->group(function () {

    // Profile - returns simple response for now
    Route::get('/profile', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'name' => 'Admin User',
                'bio' => 'This is a test profile response',
                'title' => 'Developer'
            ]
        ]);
    });

    // Skills
    Route::get('/skills', function () {
        return response()->json([
            'success' => true,
            'data' => []
        ]);
    });

    // Social Links
    Route::get('/social-links', function () {
        return response()->json([
            'success' => true,
            'data' => []
        ]);
    });

    // Projects
    Route::get('/projects', function () {
        return response()->json([
            'success' => true,
            'data' => []
        ]);
    });

    Route::get('/projects/featured', function () {
        return response()->json([
            'success' => true,
            'data' => []
        ]);
    });

    Route::get('/projects/{slug}', function ($slug) {
        return response()->json([
            'success' => true,
            'data' => [
                'title' => 'Project: ' . $slug,
                'slug' => $slug
            ]
        ]);
    });

    // Blog Posts
    Route::get('/blog-posts', function () {
        return response()->json([
            'success' => true,
            'data' => []
        ]);
    });

    Route::get('/blog-posts/{slug}', function ($slug) {
        return response()->json([
            'success' => true,
            'data' => [
                'title' => 'Blog Post: ' . $slug,
                'slug' => $slug
            ]
        ]);
    });

    // Comments
    Route::post('/comments', function () {
        return response()->json([
            'success' => true,
            'message' => 'Comment submitted successfully!'
        ], 201);
    });

    // Contact
    Route::post('/contact', function () {
        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully!'
        ], 201);
    });
});
