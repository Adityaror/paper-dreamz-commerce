<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PromoPopupResource;
use App\Models\PromoPopup;
use Illuminate\Http\JsonResponse;

class PromoPopupController extends Controller
{
    /**
     * Show the single promo popup row.
     */
    public function show(): JsonResponse
    {
        return (new PromoPopupResource(PromoPopup::current()))
            ->response()
            ->setStatusCode(200);
    }
}
