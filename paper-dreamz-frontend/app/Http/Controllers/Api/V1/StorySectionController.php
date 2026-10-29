<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StorySectionResource;
use App\Models\StorySection;
use Illuminate\Http\JsonResponse;

class StorySectionController extends Controller
{
    /**
     * Show the single story section row.
     */
    public function show(): JsonResponse
    {
        return (new StorySectionResource(StorySection::current()))
            ->response()
            ->setStatusCode(200);
    }
}
