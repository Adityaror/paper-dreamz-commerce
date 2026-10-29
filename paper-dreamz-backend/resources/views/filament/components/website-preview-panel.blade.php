{{-- Rendered once per admin page (see AdminPanelProvider). Opened by a `pd-preview` event ({url, title}) from any
     "Preview" button: shows the website beside the form, scrolled to the section being edited. The page is drawn at
     real desktop or phone width and scaled down to fit, so it looks exactly like the live site.
     Styled with the `pd-preview-*` rules in the panel's head styles: Filament's prebuilt CSS lacks most Tailwind classes. --}}
<div
    x-data="{
        open: false,
        url: null,
        title: '',
        device: 'desktop',
        scale: 1,
        get frameWidth() { return this.device === 'desktop' ? 1280 : 390 },
        show(detail) {
            this.title = detail.title
            this.url = detail.url
            this.open = true
            this.$nextTick(() => this.fit())
        },
        reload() {
            const url = this.url
            this.url = null
            this.$nextTick(() => this.url = url)
        },
        setDevice(device) {
            this.device = device
            this.$nextTick(() => this.fit())
        },
        fit() {
            if (! this.$refs.viewport) return
            this.scale = Math.min(1, this.$refs.viewport.clientWidth / this.frameWidth)
        },
    }"
    x-on:pd-preview.window="show($event.detail)"
    x-on:keydown.escape.window="open = false"
    x-on:resize.window="fit()"
    x-effect="document.body.classList.toggle('pd-preview-open', open)"
>
    <aside x-show="open" x-cloak class="pd-preview-panel" aria-label="Website preview">
        <div class="pd-preview-bar">
            <div style="min-width: 0; flex: 1;">
                <p class="pd-preview-eyebrow">Website preview</p>
                <p class="pd-preview-title" x-text="title"></p>
            </div>

            <div class="pd-preview-devices">
                <button type="button" x-on:click="setDevice('desktop')" x-bind:class="{ 'is-active': device === 'desktop' }">Desktop</button>
                <button type="button" x-on:click="setDevice('mobile')" x-bind:class="{ 'is-active': device === 'mobile' }">Phone</button>
            </div>

            <x-filament::icon-button icon="heroicon-o-arrow-path" color="gray" label="Reload preview" tooltip="Reload (after saving)" x-on:click="reload()" />
            <x-filament::icon-button tag="a" icon="heroicon-o-arrow-top-right-on-square" color="gray" label="Open in new tab" tooltip="Open in new tab" x-bind:href="url" target="_blank" />
            <x-filament::icon-button icon="heroicon-o-x-mark" color="gray" label="Close preview" tooltip="Close preview" x-on:click="open = false" />
        </div>

        <p class="pd-preview-hint">The section you're editing is outlined in gold. Save your changes, then press reload to see them.</p>

        <div x-ref="viewport" class="pd-preview-viewport">
            <template x-if="url">
                <iframe
                    x-bind:src="url"
                    x-bind:title="'Preview: ' + title"
                    x-bind:style="`width: ${frameWidth}px; height: ${100 / scale}%; transform: scale(${scale}); left: ${device === 'mobile' ? `calc(50% - ${frameWidth * scale / 2}px)` : '0'}`"
                ></iframe>
            </template>
        </div>
    </aside>
</div>
