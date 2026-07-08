<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\BlogPostController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\SocialLinkController;
use Illuminate\Support\Facades\Route;

// Test route (keep this for verification)
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!'
    ]);
});

// Auth (session-based via Sanctum SPA auth)
// Frontend calls: POST /api/login, POST /api/logout, GET /api/user
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});

Route::prefix('v1')->group(function () {

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);

    // Skills
    Route::get('/skills', [SkillController::class, 'index']);

    // Social Links
    Route::get('/social-links', [SocialLinkController::class, 'index']);

    // Projects
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/featured', [ProjectController::class, 'featured']);
    Route::get('/projects/{slug}', [ProjectController::class, 'show']);

    // Blog Posts
    Route::get('/blog-posts', [BlogPostController::class, 'index']);
    Route::get('/blog-posts/{slug}', [BlogPostController::class, 'show']);

    // Comments
    Route::post('/comments', [CommentController::class, 'store']);

    // Contact
    Route::post('/contact', [ContactController::class, 'store']);
});
