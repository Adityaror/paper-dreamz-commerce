<?php

namespace Database\Factories;

use App\Models\NavLink;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NavLink>
 */
class NavLinkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'label' => fake()->word(),
            'href' => '#'.fake()->word(),
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
