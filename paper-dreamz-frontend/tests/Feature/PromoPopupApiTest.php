<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\PromoPopup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PromoPopupApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_the_popup_with_the_newest_product_in_its_category(): void
    {
        PromoPopup::factory()->create(['category' => 'hot-deals', 'title' => 'Big savings']);
        Product::factory()->create(['name' => 'Older Deal', 'is_hot_deal' => true, 'is_active' => true]);
        Product::factory()->create(['name' => 'Newest Deal', 'is_hot_deal' => true, 'is_active' => true]);
        Product::factory()->create(['name' => 'Hidden Deal', 'is_hot_deal' => true, 'is_active' => false]);
        Product::factory()->create(['name' => 'Not A Deal', 'is_hot_deal' => false, 'is_active' => true]);

        $this->getJson('/api/v1/promo-popup')
            ->assertOk()
            ->assertJsonPath('data.is_enabled', true)
            ->assertJsonPath('data.category', 'hot-deals')
            ->assertJsonPath('data.title', 'Big savings')
            ->assertJsonPath('data.product_count', 2)
            ->assertJsonPath('data.featured_product.name', 'Newest Deal');
    }

    public function test_it_creates_an_empty_row_when_none_exists(): void
    {
        $this->getJson('/api/v1/promo-popup')
            ->assertOk()
            ->assertJsonPath('data.category', 'new-arrivals')
            ->assertJsonPath('data.featured_product', null);

        $this->assertDatabaseCount('promo_popups', 1);
    }
}
