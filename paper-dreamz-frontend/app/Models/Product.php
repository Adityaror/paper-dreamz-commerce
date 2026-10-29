<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'collection_id',
        'code',
        'name',
        'slug',
        'badge',
        'tag',
        'price',
        'compare_price',
        'unit',
        'sizes',
        'image',
        'description',
        'is_new_arrival',
        'is_hot_deal',
        'is_best_seller',
        'sort_order',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'compare_price' => 'decimal:2',
            'sizes' => 'array',
            'is_new_arrival' => 'boolean',
            'is_hot_deal' => 'boolean',
            'is_best_seller' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }
}
