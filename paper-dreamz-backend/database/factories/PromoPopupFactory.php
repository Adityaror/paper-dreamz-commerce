<?php

namespace Database\Factories;

use App\Models\PromoPopup;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PromoPopup>
 */
class PromoPopupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'is_enabled' => true,
            'category' => 'new-arrivals',
            'eyebrow' => 'Just In',
            'title' => fake()->sentence(3),
            'message' => fake()->sentence(),
            'button_label' => 'Explore Now',
            'image' => null,
            'delay_seconds' => 3,
        ];
    }
}
