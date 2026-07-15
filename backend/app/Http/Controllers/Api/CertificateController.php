<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CertificateController extends Controller
{
    public function index()
    {
        $certificates = Certificate::with('images.image')
            ->orderBy('display_order')
            ->get()
            ->map(fn ($certificate) => $this->withImages($certificate));

        return response()->json([
            'success' => true,
            'data' => $certificates
        ]);
    }

    public function show($id)
    {
        $certificate = Certificate::with('images.image')->find($id);

        if (!$certificate) {
            return response()->json([
                'success' => false,
                'message' => 'Certificate not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->withImages($certificate)
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

    /**
     * Adds a ready-to-use 'images' array (with 'url' per image) onto the
     * certificate, same shape/pattern as ProfileController::transformImages.
     */
    private function withImages(Certificate $certificate)
    {
        $data = $certificate->toArray();

        $data['images'] = $certificate->images->map(function ($attachment) {
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
