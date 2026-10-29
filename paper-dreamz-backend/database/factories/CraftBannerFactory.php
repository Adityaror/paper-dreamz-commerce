<?php

namespace Database\Factories;

use App\Models\CraftBanner;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CraftBanner>
 */
class CraftBannerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'eyebrow' => 'Craftsmanship In Motion',
            'quote' => fake()->sentence(),
            'background_image' => '/images/cinematic_hero_bg.jpg',
        ];
    }
}
