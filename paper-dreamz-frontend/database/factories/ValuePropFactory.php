<?php

namespace Database\Factories;

use App\Models\ValueProp;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ValueProp>
 */
class ValuePropFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->words(2, true),
            'description' => fake()->sentence(),
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
