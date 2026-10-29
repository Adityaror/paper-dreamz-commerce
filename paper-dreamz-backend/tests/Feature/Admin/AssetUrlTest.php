<?php

namespace Tests\Feature\Admin;

use App\Filament\Support\AssetUrl;
use Filament\Tables\Columns\ImageColumn;
use Tests\TestCase;

class AssetUrlTest extends TestCase
{
    public function test_seeded_frontend_images_are_previewed_through_the_frontend_assets_symlink(): void
    {
        $this->assertSame(url('frontend-assets/images/products/we0001.webp'), AssetUrl::resolve('/images/products/we0001.webp'));
    }

    public function test_uploaded_images_resolve_to_a_same_origin_storage_path(): void
    {
        $this->assertSame(url('storage/products/photo.jpg'), AssetUrl::resolve('products/photo.jpg'));
    }

    public function test_resolved_urls_are_absolute_so_table_image_columns_render_them(): void
    {
        $column = ImageColumn::make('image');

        $this->assertSame(AssetUrl::resolve('/images/a.webp'), $column->getImageUrl(AssetUrl::resolve('/images/a.webp')));
    }

    public function test_absolute_and_empty_values_are_passed_through(): void
    {
        $this->assertSame('https://cdn.example.com/a.jpg', AssetUrl::resolve('https://cdn.example.com/a.jpg'));
        $this->assertNull(AssetUrl::resolve(null));
        $this->assertNull(AssetUrl::resolve(''));
    }
}
