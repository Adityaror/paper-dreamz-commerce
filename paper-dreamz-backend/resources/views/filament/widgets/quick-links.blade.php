<x-filament-widgets::widget>
    <x-filament::section heading="Edit your website" description="Shortcuts to the screens used most. Everything else is in the sidebar." compact>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            @foreach ($groups as $group => $links)
                <div style="display: flex; flex-wrap: wrap; align-items: center; gap: .5rem;">
                    <span class="text-xs font-semibold text-gray-500 dark:text-gray-400" style="width: 6.5rem; flex-shrink: 0; text-transform: uppercase; letter-spacing: .08em;">{{ $group }}</span>

                    @foreach ($links as $link)
                        <a href="{{ $link['url'] }}" class="pd-quick-link inline-flex items-center gap-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-950 dark:border-white/10 dark:text-white" style="padding: .4rem .75rem;">
                            <x-filament::icon :icon="$link['icon']" class="h-4 w-4 text-primary-600 dark:text-primary-400" />
                            {{ $link['label'] }}
                        </a>
                    @endforeach
                </div>
            @endforeach
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
