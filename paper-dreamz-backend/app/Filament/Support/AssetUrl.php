<?php

namespace App\Filament\Support;

use Illuminate\Support\Facades\Storage;

class AssetUrl
{
    /**
     * Seeded images are frontend /public paths ("/images/..."), served by the backend through the `public/frontend-assets`
     * symlink; uploads live on Laravel's public disk.
     *
     * URLs are built on the host the admin is opened on (localhost or 127.0.0.1), not APP_URL: Filament fetches upload
     * previews with JavaScript, so another host is blocked as cross-origin. They stay absolute because table image
     * columns treat anything that isn't a full URL as a storage path and show nothing.
     */
    public static function resolve(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        if (preg_match('#^https?://#i', $path)) {
            return $path;
        }

        if (str_starts_with($path, '/')) {
            return url('frontend-assets'.$path);
        }

        return url(parse_url(Storage::disk('public')->url($path), PHP_URL_PATH));
    }
}
