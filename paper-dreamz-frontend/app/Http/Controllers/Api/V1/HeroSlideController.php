<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\HeroSlideResource;
use App\Models\HeroSlide;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class HeroSlideController extends Controller
{
    /**
     * List all active hero slides, ordered for display.
     */
    public function index(): AnonymousResourceCollection
    {
        $slides = HeroSlide::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return HeroSlideResource::collection($slides);
    }
}
