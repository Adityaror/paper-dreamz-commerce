<?php

namespace App\Providers;

use App\Filament\Support\AssetUrl;
use Closure;
use Filament\Forms\Components\FileUpload;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->previewFrontendAssetsInFileUploads();
    }

    /**
     * Seeded content points at the frontend's own `public/` files ("/images/x.webp"), which aren't on Laravel's disk.
     * By default Filament drops such paths when the form loads, so saving any form would blank its photos. Skipping the
     * disk check keeps them, and they're previewed through the `public/frontend-assets` symlink; the stored path is
     * left untouched unless the admin uploads a replacement.
     *
     * Every upload box also gets a larger preview, an "open" button, and shrinks oversized camera photos before upload.
     */
    protected function previewFrontendAssetsInFileUploads(): void
    {
        FileUpload::configureUsing(function (FileUpload $upload): void {
            $upload
                ->fetchFileInformation(false)
                ->openable()
                ->imagePreviewHeight('220')
                ->imageResizeMode('contain')
                ->imageResizeTargetWidth('2400')
                ->imageResizeTargetHeight('2400')
                ->imageResizeUpscale(false);

            /** @var Closure $default */
            $default = (fn () => $this->getUploadedFileUsing)->call($upload);

            $upload->getUploadedFileUsing(function (FileUpload $component, string $file, string|array|null $storedFileNames) use ($default): ?array {
                if (! str_starts_with($file, '/')) {
                    $uploaded = $component->evaluate($default, ['file' => $file, 'storedFileNames' => $storedFileNames]);

                    return $uploaded === null ? null : [...$uploaded, 'url' => AssetUrl::resolve($file)];
                }

                return [
                    'name' => basename($file),
                    'size' => 0,
                    'type' => null,
                    'url' => AssetUrl::resolve($file),
                ];
            });
        }, isImportant: true); // Plain configureUsing() runs before FileUpload::setUp(), which would reinstate the default preview callback.
    }
}
