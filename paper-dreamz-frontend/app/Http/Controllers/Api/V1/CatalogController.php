<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CatalogCollectionResource;
use App\Models\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CatalogController extends Controller
{
    /**
     * The full shop tree: active top-level collections, their active sub-collections, and each level's active products.
     */
    public function index(): AnonymousResourceCollection
    {
        $active = fn (HasMany $query) => $query->where('is_active', true)->orderBy('sort_order');

        $collections = Collection::query()
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->with([
                'products' => $active,
                'children' => $active,
                'children.products' => $active,
            ])
            ->get();

        return CatalogCollectionResource::collection($collections);
    }
}
