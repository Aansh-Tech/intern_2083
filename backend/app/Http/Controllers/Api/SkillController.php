<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;

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
}
