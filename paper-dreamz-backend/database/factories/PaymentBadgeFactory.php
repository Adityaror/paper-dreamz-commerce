<?php

namespace Database\Factories;

use App\Models\PaymentBadge;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaymentBadge>
 */
class PaymentBadgeFactory extends Factory
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
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
