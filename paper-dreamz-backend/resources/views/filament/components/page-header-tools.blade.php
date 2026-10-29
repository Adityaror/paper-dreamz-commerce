{{-- Rendered in every page header (see AdminPanelProvider): step to the previous / next section, preview it on the
     website, and close back to the list or dashboard. --}}
@if ($previous || $next)
    <div class="pd-step-buttons">
        @if ($previous)
            <x-filament::button tag="a" :href="$previous->getUrl()" color="gray" outlined icon="heroicon-m-arrow-left" :tooltip="'Previous: '.$previous->getLabel()">
                {{ $previous->getLabel() }}
            </x-filament::button>
        @endif

        @if ($next)
            <x-filament::button tag="a" :href="$next->getUrl()" color="gray" outlined icon="heroicon-m-arrow-right" icon-position="after" :tooltip="'Next: '.$next->getLabel()">
                {{ $next->getLabel() }}
            </x-filament::button>
        @endif
    </div>
@endif

@if ($previewUrl)
    <x-filament::button color="gray" icon="heroicon-m-eye" x-on:click="{{ \App\Filament\Support\WebsitePreview::openHandler($previewUrl, $previewTitle) }}">
        Preview
    </x-filament::button>
@endif

@include('filament.components.close-page-button', ['url' => $closeUrl, 'label' => $closeLabel])
