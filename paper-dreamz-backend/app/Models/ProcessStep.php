<?php

namespace App\Models;

use Database\Factories\ProcessStepFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProcessStep extends Model
{
    /** @use HasFactory<ProcessStepFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'step_number',
        'title',
        'tag',
        'description',
        'image',
        'highlights',
        'sort_order',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'highlights' => 'array',
            'is_active' => 'boolean',
            'step_number' => 'integer',
            'sort_order' => 'integer',
        ];
    }
}
