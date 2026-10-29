<?php

namespace App\Models;

use Database\Factories\ExperienceSectionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExperienceSection extends Model
{
    /** @use HasFactory<ExperienceSectionFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'heading',
        'subtext',
    ];

    /**
     * Fetch the single experience section row, creating an empty one if it doesn't exist yet.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate([]);
    }
}
