<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->get();

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
        $query = Project::orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $projects = $query->get();

        return response()->json([
            'success' => true,
            'data' => $projects
        ]);
    }

    public function show($slug)
    {
        $project = Project::where('slug', $slug)
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
            'data' => $project
        ]);
    }

    public function featured()
    {
        $projects = Project::where('status', 'published')
            ->where('is_featured', true)
            ->limit(3)
            ->get();

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
            'title' => 'sometimes|required|string|max:255',
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
}
