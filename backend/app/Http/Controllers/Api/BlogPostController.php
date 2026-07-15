<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogPostController extends Controller
{
    public function index()
    {
        $posts = BlogPost::with('images.image')
            ->where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->paginate(10)
            ->through(fn ($post) => $this->withImages($post));

        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    /**
     * GET /v1/admin/blog-posts (protected)
     * Same as index(), but returns posts of every status (draft/published/archived)
     * for the admin panel. Optional ?status=draft|published|archived to filter.
     */
    public function adminIndex(Request $request)
    {
        $query = BlogPost::with('images.image')->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $posts = $query->paginate(10)->through(fn ($post) => $this->withImages($post));

        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    public function show($slug)
    {
        $post = BlogPost::where('slug', $slug)
            ->where('status', 'published')
            ->with([
                'images.image',
                'comments' => function ($query) {
                    $query->where('status', 'approved');
                },
            ])
            ->first();

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Blog post not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->withImages($post)
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

    /**
     * Adds a ready-to-use 'images' array (with 'url' per image) onto the
     * blog post, same shape/pattern as CertificateController::withImages.
     */
    private function withImages(BlogPost $post)
    {
        $data = $post->toArray();

        $data['images'] = $post->images->map(function ($attachment) {
            return [
                'id' => $attachment->id,
                'type' => $attachment->type,
                'display_order' => $attachment->display_order,
                'is_primary' => $attachment->is_primary,
                'image' => $attachment->image ? [
                    'id' => $attachment->image->id,
                    'filename' => $attachment->image->filename,
                    'alt_text' => $attachment->image->alt_text,
                    'caption' => $attachment->image->caption,
                    'url' => Storage::disk('public')->url($attachment->image->image_path),
                ] : null,
            ];
        });

        return $data;
    }
}
