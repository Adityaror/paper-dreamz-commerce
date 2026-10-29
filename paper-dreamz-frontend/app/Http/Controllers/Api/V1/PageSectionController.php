<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PageSection;
use Illuminate\Http\JsonResponse;

class PageSectionController extends Controller
{
    /**
     * Show the saved content of one page section, e.g. `about.hero`.
     */
    public function show(string $key): JsonResponse
    {
        $section = PageSection::query()->where('key', $key)->firstOrFail();

        return response()->json(['data' => (object) ($section->data ?? [])]);
    }
}
