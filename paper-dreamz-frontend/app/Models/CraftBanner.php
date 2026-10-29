<?php

namespace App\Models;

use Database\Factories\CraftBannerFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CraftBanner extends Model
{
    /** @use HasFactory<CraftBannerFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'eyebrow',
        'quote',
        'background_image',
    ];

    /**
     * Fetch the single craft banner row, creating an empty one if it doesn't exist yet.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate([]);
    }
}
