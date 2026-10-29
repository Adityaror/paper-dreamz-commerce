<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExperienceItemResource;
use App\Http\Resources\ExperienceSectionResource;
use App\Models\ExperienceItem;
use App\Models\ExperienceSection;
use Illuminate\Http\JsonResponse;

class ExperienceController extends Controller
{
    /**
     * Show the experience section header plus its active items, ordered for display.
     */
    public function index(): JsonResponse
    {
        $items = ExperienceItem::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => [
                'section' => new ExperienceSectionResource(ExperienceSection::current()),
                'items' => ExperienceItemResource::collection($items),
            ],
        ]);
    }
}
