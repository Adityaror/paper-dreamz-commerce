{{-- Rendered in every page header (see AdminPanelProvider) so admins can leave a section without using the sidebar. --}}
<x-filament::icon-button
    tag="a"
    :href="$url"
    icon="heroicon-o-x-mark"
    color="gray"
    size="lg"
    :label="$label"
    :tooltip="$label"
    class="pd-close-page"
/>
