<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExperienceSectionResource;
use App\Http\Resources\TestimonialResource;
use App\Models\ExperienceSection;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;

class TestimonialController extends Controller
{
    /**
     * Show the "Experience" section header plus its active testimonials, ordered for display.
     */
    public function index(): JsonResponse
    {
        $testimonials = Testimonial::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => [
                'section' => new ExperienceSectionResource(ExperienceSection::current()),
                'items' => TestimonialResource::collection($testimonials),
            ],
        ]);
    }
}
