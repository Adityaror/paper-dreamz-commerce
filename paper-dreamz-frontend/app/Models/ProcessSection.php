<?php

namespace App\Models;

use Database\Factories\ProcessSectionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProcessSection extends Model
{
    /** @use HasFactory<ProcessSectionFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'heading',
        'subtext',
    ];

    /**
     * Fetch the single process section row, creating an empty one if it doesn't exist yet.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate([]);
    }
}
