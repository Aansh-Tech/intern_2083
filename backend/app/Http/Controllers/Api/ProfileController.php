<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show()
    {
        // Get the first profile (there's only one - yours)
        $profile = Profile::with(['skills', 'socialLinks', 'images'])->first();

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $profile->id,
                'bio' => $profile->bio,
                'title' => $profile->title,
                'phone' => $profile->phone,
                'address' => $profile->address,
                'profile_photo' => $profile->profile_photo,
                'resume_path' => $profile->resume_path,
                'resume_url' => $profile->resume_path
                    ? Storage::disk('public')->url($profile->resume_path)
                    : null,
                'skills' => $profile->skills,
                'social_links' => $profile->socialLinks,
                'images' => $this->transformImages($profile->images),
            ]
        ]);
    }

    /**
     * PUT /v1/profile (protected)
     * Updates the profile's core fields. All fields optional - send only what changes.
     */
    public function update(Request $request)
    {
        $profile = Profile::first();

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found'
            ], 404);
        }

        $validated = $request->validate([
            'bio' => ['sometimes', 'nullable', 'string'],
            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $profile->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'data' => $profile,
        ]);
    }

    /**
     * Adds a ready-to-use 'url' field onto each attached image
     * so the frontend doesn't have to build it manually.
     */
    private function transformImages($imageables)
    {
        return $imageables->map(function ($attachment) {
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
    }

    /**
     * POST /v1/profile/resume (protected)
     * Uploads/replaces the admin's CV. Deletes the old file if one exists.
     */
    public function uploadResume(Request $request)
    {
        $request->validate([
            'resume' => ['required', 'file', 'mimes:pdf', 'max:10240'], // max 10MB
        ]);

        $profile = Profile::first();

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'No profile exists yet.',
            ], 404);
        }

        // Delete old resume file if one exists
        if ($profile->resume_path) {
            Storage::disk('public')->delete($profile->resume_path);
        }

        $path = $request->file('resume')->store('resumes', 'public');

        $profile->update(['resume_path' => $path]);

        return response()->json([
            'success' => true,
            'message' => 'Resume uploaded successfully.',
            'data' => [
                'resume_path' => $path,
                'resume_url' => Storage::disk('public')->url($path),
            ],
        ]);
    }
}
