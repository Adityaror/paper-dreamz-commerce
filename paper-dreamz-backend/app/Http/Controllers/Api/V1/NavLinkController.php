<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\NavLinkResource;
use App\Models\NavLink;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NavLinkController extends Controller
{
    /**
     * List all active nav links, ordered for display.
     */
    public function index(): AnonymousResourceCollection
    {
        $links = NavLink::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return NavLinkResource::collection($links);
    }
}
