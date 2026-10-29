<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProcessSectionResource;
use App\Http\Resources\ProcessStepResource;
use App\Models\ProcessSection;
use App\Models\ProcessStep;
use Illuminate\Http\JsonResponse;

class ProcessStepController extends Controller
{
    /**
     * Show the process section header plus its active steps, ordered for display.
     */
    public function index(): JsonResponse
    {
        $steps = ProcessStep::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => [
                'section' => new ProcessSectionResource(ProcessSection::current()),
                'steps' => ProcessStepResource::collection($steps),
            ],
        ]);
    }
}
