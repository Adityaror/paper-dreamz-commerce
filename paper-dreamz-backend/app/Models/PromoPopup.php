<?php

namespace App\Models;

use Database\Factories\PromoPopupFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromoPopup extends Model
{
    /** @use HasFactory<PromoPopupFactory> */
    use HasFactory;

    /**
     * Homepage product tabs the popup can link to, mapped to their Product flag column.
     *
     * @var array<string, string>
     */
    public const CATEGORY_COLUMNS = [
        'new-arrivals' => 'is_new_arrival',
        'hot-deals' => 'is_hot_deal',
        'best-sellers' => 'is_best_seller',
    ];

    /**
     * @var array<string, string>
     */
    public const CATEGORY_LABELS = [
        'new-arrivals' => 'New Arrivals',
        'hot-deals' => 'Hot Deals',
        'best-sellers' => 'Best Sellers',
    ];

    /**
     * Mirrors the column defaults so a freshly created row has them before it is re-fetched.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'is_enabled' => true,
        'category' => 'new-arrivals',
        'delay_seconds' => 3,
    ];

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'is_enabled',
        'category',
        'eyebrow',
        'title',
        'message',
        'button_label',
        'image',
        'delay_seconds',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',
            'delay_seconds' => 'integer',
        ];
    }

    /**
     * Fetch the single promo popup row, creating an empty one if it doesn't exist yet.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate([]);
    }

    /**
     * The newest active product in the linked category, used as the popup's
     * preview so it stays current as the client adds products.
     */
    public function featuredProduct(): ?Product
    {
        return $this->categoryProducts()->latest('id')->first();
    }

    public function categoryProductCount(): int
    {
        return $this->categoryProducts()->count();
    }

    /**
     * @return Builder<Product>
     */
    protected function categoryProducts(): Builder
    {
        $column = self::CATEGORY_COLUMNS[$this->category] ?? self::CATEGORY_COLUMNS['new-arrivals'];

        return Product::query()->where('is_active', true)->where($column, true);
    }
}
