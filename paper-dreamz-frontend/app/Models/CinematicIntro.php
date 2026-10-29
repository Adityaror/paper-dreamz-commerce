<?php

namespace App\Models;

use Database\Factories\CinematicIntroFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CinematicIntro extends Model
{
    /** @use HasFactory<CinematicIntroFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'video',
        'mobile_video',
        'poster_image',
        'skip_label',
    ];

    /**
     * Fetch the single cinematic intro row, creating an empty one if it doesn't exist yet.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate([]);
    }
}
