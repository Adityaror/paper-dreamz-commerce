<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CinematicIntroResource;
use App\Models\CinematicIntro;
use Illuminate\Http\JsonResponse;

class CinematicIntroController extends Controller
{
    /**
     * Show the single cinematic intro row.
     */
    public function show(): JsonResponse
    {
        return (new CinematicIntroResource(CinematicIntro::current()))
            ->response()
            ->setStatusCode(200);
    }
}
