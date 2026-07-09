<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\SocialLink;
use Illuminate\Http\Request;

class SocialLinkController extends Controller
{
    public function index()
    {
        $links = SocialLink::orderBy('display_order')->get();

        return response()->json([
            'success' => true,
            'data' => $links
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer',
        ]);

        $profile = Profile::first();
        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'No profile exists yet. Create a profile before adding social links.'
            ], 422);
        }

        $link = SocialLink::create([...$validated, 'profile_id' => $profile->id]);

        return response()->json([
            'success' => true,
            'message' => 'Social link created successfully.',
            'data' => $link
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $link = SocialLink::find($id);

        if (!$link) {
            return response()->json([
                'success' => false,
                'message' => 'Social link not found'
            ], 404);
        }

        $validated = $request->validate([
            'platform' => 'sometimes|required|string|max:255',
            'url' => 'sometimes|required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer',
        ]);

        $link->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Social link updated successfully.',
            'data' => $link
        ]);
    }

    public function destroy($id)
    {
        $link = SocialLink::find($id);

        if (!$link) {
            return response()->json([
                'success' => false,
                'message' => 'Social link not found'
            ], 404);
        }

        $link->delete();

        return response()->json([
            'success' => true,
            'message' => 'Social link deleted successfully.'
        ]);
    }
}
