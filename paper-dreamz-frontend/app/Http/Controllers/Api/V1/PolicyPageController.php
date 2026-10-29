<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PolicyPageResource;
use App\Models\PolicyPage;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PolicyPageController extends Controller
{
    /**
     * List all active policy pages, ordered for display.
     */
    public function index(): AnonymousResourceCollection
    {
        $policies = PolicyPage::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return PolicyPageResource::collection($policies);
    }

    /**
     * Show a single active policy page by slug.
     */
    public function show(string $slug): PolicyPageResource
    {
        $policy = PolicyPage::query()
            ->where('is_active', true)
            ->where('slug', $slug)
            ->firstOrFail();

        return new PolicyPageResource($policy);
    }
}
