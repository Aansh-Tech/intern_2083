<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Imageable extends Model
{
    use HasFactory;

    protected $table = 'imageables';

    protected $fillable = [
        'image_id',
        'imageable_type',
        'imageable_id',
        'type',
        'display_order',
        'is_primary',
    ];

    protected $casts = [
        'display_order' => 'integer',
        'is_primary' => 'boolean',
    ];

    public function image(): BelongsTo
    {
        return $this->belongsTo(Image::class);
    }

    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }
}
