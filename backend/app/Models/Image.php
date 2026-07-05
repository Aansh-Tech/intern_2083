<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;

    protected $fillable = [
        'image_path',
        'filename',
        'alt_text',
        'caption',
        'type',
        'size',
        'mime_type',
    ];
}
