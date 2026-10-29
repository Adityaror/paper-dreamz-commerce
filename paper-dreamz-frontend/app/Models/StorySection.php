<?php

namespace App\Models;

use Database\Factories\StorySectionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StorySection extends Model
{
    /** @use HasFactory<StorySectionFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'eyebrow',
        'heading',
        'accent_word',
        'body',
        'image',
        'cta_label',
        'cta_link',
    ];

    /**
     * Fetch the single story section row, creating an empty one if it doesn't exist yet.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate([]);
    }
}
