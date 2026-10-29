<?php

namespace App\Models;

use Database\Factories\PolicyPageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PolicyPage extends Model
{
    /** @use HasFactory<PolicyPageFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'slug',
        'title',
        'intro',
        'hero_image',
        'sections',
        'sort_order',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sections' => 'array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
