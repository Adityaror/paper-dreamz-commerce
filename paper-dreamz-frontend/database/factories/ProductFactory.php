<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'collection_id' => null,
            'name' => $name,
            'slug' => Str::slug($name),
            'badge' => fake()->randomElement(['New', 'Bestseller', 'Trending', 'Signature']),
            'tag' => fake()->words(2, true),
            'price' => fake()->randomFloat(2, 500, 3000),
            'unit' => 'Set of 10',
            'image' => '/images/placeholder.jpg',
            'description' => fake()->sentence(),
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
