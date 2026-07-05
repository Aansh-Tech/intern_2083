<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_id',
        'platform',
        'icon',
        'url',
        'display_order',
    ];

    protected $casts = [
        'display_order' => 'integer',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
