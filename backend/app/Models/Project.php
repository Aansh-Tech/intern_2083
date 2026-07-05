<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_id',
        'title',
        'slug',
        'subtitle',
        'description',
        'content',
        'github_link',
        'live_link',
        'technologies',
        'is_featured',
        'status',
        'completed_at',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'completed_at' => 'date',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
