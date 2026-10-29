<?php

namespace Database\Factories;

use App\Models\Enquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Enquiry>
 */
class EnquiryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => 'contact',
            'name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'city' => fake()->city(),
            'message' => fake()->paragraph(),
            'reference_images' => 0,
            'is_handled' => false,
        ];
    }
}
