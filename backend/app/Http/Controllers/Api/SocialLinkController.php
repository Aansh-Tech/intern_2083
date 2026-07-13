<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialLink;

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
}
