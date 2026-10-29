<?php

namespace App\Models;

use Database\Factories\PageSectionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageSection extends Model
{
    /** @use HasFactory<PageSectionFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'key',
        'data',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'data' => 'array',
        ];
    }

    /**
     * Content of the section stored under `$key`, or an empty array when it hasn't been saved yet.
     *
     * @return array<string, mixed>
     */
    public static function dataFor(string $key): array
    {
        return static::query()->where('key', $key)->value('data') ?? [];
    }
}
