<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CraftBannerResource;
use App\Models\CraftBanner;
use Illuminate\Http\JsonResponse;

class CraftBannerController extends Controller
{
    /**
     * Show the single craft banner row.
     */
    public function show(): JsonResponse
    {
        return (new CraftBannerResource(CraftBanner::current()))
            ->response()
            ->setStatusCode(200);
    }
}
