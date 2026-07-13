<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_id',
        'skill_id',
        'title',
        'issuer',
        'issue_date',
        'expiry_date',
        'credential_url',
        'image',
        'description',
        'display_order',
    ];

    protected $casts = [
        'skill_id' => 'integer',
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'display_order' => 'integer',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class);
    }
}
