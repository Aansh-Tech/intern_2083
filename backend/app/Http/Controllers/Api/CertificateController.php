<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Profile;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function index()
    {
        $certificates = Certificate::orderBy('display_order')->get();

        return response()->json([
            'success' => true,
            'data' => $certificates
        ]);
    }

    public function show($id)
    {
        $certificate = Certificate::find($id);

        if (!$certificate) {
            return response()->json([
                'success' => false,
                'message' => 'Certificate not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $certificate
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateCertificate($request);

        $profile = Profile::first();
        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'No profile exists yet. Create a profile before adding certificates.'
            ], 422);
        }

        $certificate = Certificate::create([...$validated, 'profile_id' => $profile->id]);

        return response()->json([
            'success' => true,
            'message' => 'Certificate created successfully.',
            'data' => $certificate
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $certificate = Certificate::find($id);

        if (!$certificate) {
            return response()->json([
                'success' => false,
                'message' => 'Certificate not found'
            ], 404);
        }

        $validated = $this->validateCertificate($request, true);
        $certificate->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Certificate updated successfully.',
            'data' => $certificate
        ]);
    }

    public function destroy($id)
    {
        $certificate = Certificate::find($id);

        if (!$certificate) {
            return response()->json([
                'success' => false,
                'message' => 'Certificate not found'
            ], 404);
        }

        $certificate->delete();

        return response()->json([
            'success' => true,
            'message' => 'Certificate deleted successfully.'
        ]);
    }

    private function validateCertificate(Request $request, bool $isUpdate = false): array
    {
        $rule = $isUpdate ? 'sometimes|required' : 'required';

        return $request->validate([
            'skill_id' => 'nullable|exists:skills,id',
            'title' => "$rule|string|max:255",
            'issuer' => "$rule|string|max:255",
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date',
            'credential_url' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'display_order' => 'nullable|integer',
        ]);
    }
}
