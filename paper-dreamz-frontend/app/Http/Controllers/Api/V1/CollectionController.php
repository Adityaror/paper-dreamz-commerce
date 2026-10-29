<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CollectionResource;
use App\Models\Collection;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CollectionController extends Controller
{
    /**
     * List all active collections, ordered for display.
     */
    public function index(): AnonymousResourceCollection
    {
        $collections = Collection::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return CollectionResource::collection($collections);
    }

    /**
     * Show a single active collection by slug.
     */
    public function show(string $slug): CollectionResource
    {
        $collection = Collection::query()
            ->where('is_active', true)
            ->where('slug', $slug)
            ->firstOrFail();

        return new CollectionResource($collection);
    }
}
