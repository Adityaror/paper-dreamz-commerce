<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    /**
     * List all active products, ordered for display.
     *
     * Supports optional `?collection=<slug>` filtering and
     * `?category=new-arrivals|hot-deals|best-sellers` filtering.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = Product::query()
            ->with('collection')
            ->where('is_active', true)
            ->when($request->string('collection')->isNotEmpty(), function ($query) use ($request) {
                $query->whereHas('collection', function ($query) use ($request) {
                    $query->where('slug', $request->string('collection'));
                });
            })
            ->when($request->string('category')->toString(), function ($query, string $category) {
                $column = [
                    'new-arrivals' => 'is_new_arrival',
                    'hot-deals' => 'is_hot_deal',
                    'best-sellers' => 'is_best_seller',
                ][$category] ?? null;

                if ($column) {
                    $query->where($column, true);
                }
            })
            ->orderBy('sort_order')
            ->get();

        return ProductResource::collection($products);
    }

    /**
     * Show a single active product by slug.
     */
    public function show(string $slug): ProductResource
    {
        $product = Product::query()
            ->with('collection')
            ->where('is_active', true)
            ->where('slug', $slug)
            ->firstOrFail();

        return new ProductResource($product);
    }
}
