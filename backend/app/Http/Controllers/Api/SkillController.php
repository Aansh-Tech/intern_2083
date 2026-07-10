<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::orderBy('display_order')->get();

        return response()->json([
            'success' => true,
            'data' => $skills
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateSkill($request);

        $profile = Profile::first();
        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'No profile exists yet. Create a profile before adding skills.'
            ], 422);
        }

        $skill = Skill::create([...$validated, 'profile_id' => $profile->id]);

        return response()->json([
            'success' => true,
            'message' => 'Skill created successfully.',
            'data' => $skill
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $skill = Skill::find($id);

        if (!$skill) {
            return response()->json([
                'success' => false,
                'message' => 'Skill not found'
            ], 404);
        }

        $validated = $this->validateSkill($request, true);
        $skill->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Skill updated successfully.',
            'data' => $skill
        ]);
    }

    public function destroy($id)
    {
        $skill = Skill::find($id);

        if (!$skill) {
            return response()->json([
                'success' => false,
                'message' => 'Skill not found'
            ], 404);
        }

        $skill->delete();

        return response()->json([
            'success' => true,
            'message' => 'Skill deleted successfully.'
        ]);
    }

    private function validateSkill(Request $request, bool $isUpdate = false): array
    {
        $rule = $isUpdate ? 'sometimes|required' : 'required';

        return $request->validate([
            'name' => "$rule|string|max:255",
            'category' => 'nullable|string|max:255',
            'proficiency' => 'nullable|integer|min:0|max:100',
            'icon' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer',
        ]);
    }
}
