<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;

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
                'skills' => $profile->skills,
                'social_links' => $profile->socialLinks,
                'images' => $profile->images,
            ]
        ]);
    }
}
