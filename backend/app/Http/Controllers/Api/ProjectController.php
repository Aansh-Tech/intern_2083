<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('images.image')
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($project) => $this->withImages($project));

        return response()->json([
            'success' => true,
            'data' => $projects
        ]);
    }

    /**
     * GET /v1/admin/projects (protected)
     * Same as index(), but returns projects of every status (draft/published/archived)
     * for the admin panel. Optional ?status=draft|published|archived to filter.
     */
    public function adminIndex(Request $request)
    {
        $query = Project::with('images.image')->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $projects = $query->get()->map(fn ($project) => $this->withImages($project));

        return response()->json([
            'success' => true,
            'data' => $projects
        ]);
    }

    public function show($slug)
    {
        $project = Project::with('images.image')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->first();

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->withImages($project)
        ]);
    }

    public function featured()
    {
        $projects = Project::with('images.image')
            ->where('status', 'published')
            ->where('is_featured', true)
            ->limit(3)
            ->get()
            ->map(fn ($project) => $this->withImages($project));

        return response()->json([
            'success' => true,
            'data' => $projects
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:191|unique:projects,slug',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'github_link' => 'nullable|string|max:255',
            'live_link' => 'nullable|string|max:255',
            'technologies' => 'nullable|string|max:255',
            'is_featured' => 'boolean',
            'status' => 'in:draft,published,archived',
            'completed_at' => 'nullable|date',
        ]);

        $profile = Profile::first();
        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'No profile exists yet. Create a profile before adding projects.'
            ], 422);
        }

        $project = Project::create([...$validated, 'profile_id' => $profile->id]);

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully.',
            'data' => $project
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }

      $validated = $request->validate([
    'title' => 'required|string|max:255',
    'slug' => 'sometimes|required|string|max:191|unique:projects,slug,' . $project->id,
    'subtitle' => 'nullable|string|max:255',
    'description' => 'nullable|string',
    'content' => 'nullable|string',
    'github_link' => 'nullable|string|max:255',
    'live_link' => 'nullable|string|max:255',
    'technologies' => 'nullable|string|max:255',
    'is_featured' => 'boolean',
    'status' => 'in:draft,published,archived',
    'completed_at' => 'nullable|date',
]);

        $project->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully.',
            'data' => $project
        ]);
    }

    public function destroy($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully.'
        ]);
    }

    /**
     * Adds a ready-to-use 'images' array (with 'url' per image) onto the
     * project, same shape/pattern as CertificateController::withImages.
     */
    private function withImages(Project $project)
    {
        $data = $project->toArray();

        $data['images'] = $project->images->map(function ($attachment) {
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
