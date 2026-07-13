<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogPostController extends Controller
{
    public function index()
    {
        $posts = BlogPost::where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    public function show($slug)
    {
        $post = BlogPost::where('slug', $slug)
            ->where('status', 'published')
            ->with(['comments' => function ($query) {
                $query->where('status', 'approved');
            }])
            ->first();

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Blog post not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $post
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePost($request);

        $profile = Profile::first();
        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'No profile exists yet. Create a profile before adding blog posts.'
            ], 422);
        }

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $post = BlogPost::create([...$validated, 'profile_id' => $profile->id]);

        return response()->json([
            'success' => true,
            'message' => 'Blog post created successfully.',
            'data' => $post
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $post = BlogPost::find($id);

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Blog post not found'
            ], 404);
        }

        $validated = $this->validatePost($request, true, $post->id);
        $post->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Blog post updated successfully.',
            'data' => $post
        ]);
    }

    public function destroy($id)
    {
        $post = BlogPost::find($id);

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Blog post not found'
            ], 404);
        }

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Blog post deleted successfully.'
        ]);
    }

    private function validatePost(Request $request, bool $isUpdate = false, ?int $ignoreId = null): array
    {
        $rule = $isUpdate ? 'sometimes|required' : 'required';
        $slugUnique = 'unique:blog_posts,slug' . ($ignoreId ? ",{$ignoreId}" : '');

        return $request->validate([
            'title' => "$rule|string|max:255",
            'slug' => "nullable|string|max:191|$slugUnique",
            'excerpt' => 'nullable|string|max:300',
            'content' => "$rule|string",
            'featured_image' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'status' => 'in:draft,published,archived',
            'published_at' => 'nullable|date',
            'allow_comments' => 'boolean',
        ]);
    }
}
