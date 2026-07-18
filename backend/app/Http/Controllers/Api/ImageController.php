<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Certificate;
use App\Models\Image;
use App\Models\Imageable;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    /**
     * Whitelist of allowed imageable types.
     * Maps a friendly, client-facing name to the real model class.
     * Never trust a raw class string from the client directly.
     */
    private array $allowedTypes = [
        'profile' => Profile::class,
        'skill' => Skill::class,
        'project' => Project::class,
        'certificate' => Certificate::class,
        'blog_post' => BlogPost::class,
    ];

    /**
     * POST /v1/images
     * Uploads a file AND attaches it to a model in one request.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'imageable_type' => ['required', 'string', 'in:' . implode(',', array_keys($this->allowedTypes))],
            'imageable_id' => ['required', 'integer'],
            'type' => ['nullable', 'string', 'max:100'],
            'is_primary' => ['nullable', 'boolean'],
            'display_order' => ['nullable', 'integer'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:255'],
        ]);

        $modelClass = $this->allowedTypes[$validated['imageable_type']];
        $imageable = $modelClass::find($validated['imageable_id']);

        if (!$imageable) {
            return response()->json([
                'success' => false,
                'message' => ucfirst($validated['imageable_type']) . ' not found',
            ], 404);
        }

        $file = $request->file('image');
        $path = $file->store('images', 'public');

        $image = Image::create([
            'image_path' => $path,
            'filename' => $file->getClientOriginalName(),
            'alt_text' => $validated['alt_text'] ?? null,
            'caption' => $validated['caption'] ?? null,
            'type' => $validated['type'] ?? 'image',
            'size' => $file->getSize(),
            'mime_type' => $file->getClientMimeType(),
        ]);

        $isPrimary = $request->boolean('is_primary');

        // If this is marked primary, unset any existing primary for the same imageable + type
        if ($isPrimary) {
            Imageable::where('imageable_type', $modelClass)
                ->where('imageable_id', $imageable->id)
                ->where('type', $validated['type'] ?? 'gallery')
                ->update(['is_primary' => false]);
        }

        $imageable_link = Imageable::create([
            'image_id' => $image->id,
            'imageable_type' => $modelClass,
            'imageable_id' => $imageable->id,
            'type' => $validated['type'] ?? 'gallery',
            'display_order' => $validated['display_order'] ?? 0,
            'is_primary' => $isPrimary,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Image uploaded and attached successfully.',
            'data' => [
                'image' => $image,
                'attachment' => $imageable_link,
                'url' => Storage::disk('public')->url($path),
            ],
        ], 201);
    }

    /**
     * DELETE /v1/images/{id}
     * $id here is the imageables (attachment) row id, not the images row id.
     * This detaches the image from that specific model. If no other
     * attachment references the same image, the image + file are deleted too.
     */
    public function destroy($id)
    {
        $attachment = Imageable::find($id);

        if (!$attachment) {
            return response()->json([
                'success' => false,
                'message' => 'Image attachment not found',
            ], 404);
        }

        $imageId = $attachment->image_id;
        $attachment->delete();

        $stillUsed = Imageable::where('image_id', $imageId)->exists();

        if (!$stillUsed) {
            $image = Image::find($imageId);
            if ($image) {
                Storage::disk('public')->delete($image->image_path);
                $image->delete();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Image removed successfully.',
        ]);
    }
}
