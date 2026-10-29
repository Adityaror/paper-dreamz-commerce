<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\FooterLinkResource;
use App\Models\FooterLink;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FooterLinkController extends Controller
{
    /**
     * List all active footer links, optionally filtered by group ("quick"|"care"), ordered for display.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $links = FooterLink::query()
            ->where('is_active', true)
            ->when(
                $request->query('group'),
                fn ($query, $group) => $query->where('group', $group)
            )
            ->orderBy('sort_order')
            ->get();

        return FooterLinkResource::collection($links);
    }
}
