<?php

namespace Database\Factories;

use App\Models\FooterLink;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FooterLink>
 */
class FooterLinkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'group' => fake()->randomElement(['quick', 'care']),
            'label' => fake()->word(),
            'href' => '#'.fake()->word(),
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
