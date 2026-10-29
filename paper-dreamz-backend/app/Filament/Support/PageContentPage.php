<?php

namespace App\Filament\Support;

use App\Models\PageSection;
use Filament\Actions\Action;
use Filament\Forms;
use Filament\Forms\Components\Component;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Str;

/**
 * One admin screen per website page: each tab edits one `page_sections` row (e.g. "about.hero").
 *
 * Anything left empty falls back to the website's built-in copy, so a blank field never breaks a page.
 */
abstract class PageContentPage extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationGroup = 'Website Pages';

    protected static string $view = 'filament.pages.page-content-page';

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    /**
     * The page's blocks, keyed by `page_sections` key, in tab order.
     *
     * @return array<string, array{label: string, schema: array<int, Component>}>
     */
    abstract protected function sections(): array;

    public function mount(): void
    {
        $state = [];

        foreach (array_keys($this->sections()) as $key) {
            $state[static::stateKey($key)] = PageSection::dataFor($key);
        }

        $this->form->fill($state);
    }

    public function form(Form $form): Form
    {
        $tabs = [];

        foreach ($this->sections() as $key => $section) {
            $tabs[] = Forms\Components\Tabs\Tab::make($section['label'])
                ->schema([
                    Forms\Components\Actions::make([
                        Forms\Components\Actions\Action::make('preview_'.static::stateKey($key))
                            ->label('Preview this section on the website')
                            ->icon('heroicon-m-eye')
                            ->link()
                            ->alpineClickHandler(WebsitePreview::openHandler(WebsitePreview::forPageSection($key), static::getNavigationLabel().' · '.$section['label'])),
                    ])
                        ->alignEnd()
                        ->columnSpanFull(),
                    ...$section['schema'],
                ])
                ->statePath(static::stateKey($key))
                ->columns(2);
        }

        return $form
            ->schema([
                Forms\Components\Tabs::make('Sections')
                    ->tabs($tabs)
                    ->persistTabInQueryString()
                    ->columnSpanFull(),
            ])
            ->statePath('data');
    }

    /**
     * "Preview" opens the block of whichever tab is open. Tabs persist as `?tab=<tabs id>-<label slug>-tab`; the longest
     * matching slug wins, so "Hero" can't claim a "Page Hero" tab. No tab in the URL yet means the first one.
     *
     * @return array<int, Action>
     */
    protected function getHeaderActions(): array
    {
        $tabs = collect($this->sections())
            ->map(fn (array $section, string $key): array => [
                'slug' => Str::slug(Str::transliterate($section['label'], strict: true)),
                'url' => WebsitePreview::forPageSection($key),
                'title' => static::getNavigationLabel().' · '.$section['label'],
            ])
            ->values();

        $byLength = $tabs->sortByDesc(fn (array $tab): int => strlen($tab['slug']))->values();

        return [
            Action::make('preview')
                ->label('Preview')
                ->icon('heroicon-m-eye')
                ->color('gray')
                ->alpineClickHandler(
                    'const tab = new URLSearchParams(location.search).get(\'tab\') ?? \'\'; '
                    .'const tabs = '.json_encode($byLength, JSON_UNESCAPED_SLASHES | JSON_HEX_APOS).'; '
                    .'const open = tabs.find((t) => tab.endsWith(\'-\' + t.slug + \'-tab\')) ?? '.json_encode($tabs->first(), JSON_UNESCAPED_SLASHES | JSON_HEX_APOS).'; '
                    .'$dispatch(\'pd-preview\', { url: open.url, title: open.title })'
                ),
        ];
    }

    public function save(): void
    {
        $state = $this->form->getState();

        foreach (array_keys($this->sections()) as $key) {
            PageSection::query()->updateOrCreate(
                ['key' => $key],
                ['data' => $state[static::stateKey($key)] ?? []],
            );
        }

        Notification::make()
            ->title(static::getNavigationLabel().' saved')
            ->body('Refresh the website to see the changes.')
            ->success()
            ->send();
    }

    /**
     * Livewire state paths treat dots as nesting, so "about.hero" is stored under "about_hero".
     */
    protected static function stateKey(string $key): string
    {
        return str_replace(['.', '-'], '_', $key);
    }

    /**
     * The shared header block of the inner pages: eyebrow, title, script accent, intro and arched photo.
     *
     * @return array<int, Component>
     */
    protected static function heroSchema(): array
    {
        return [
            Forms\Components\TextInput::make('eyebrow')
                ->maxLength(255)
                ->helperText('Small uppercase label above the title.'),
            Forms\Components\TextInput::make('title')
                ->maxLength(255),
            Forms\Components\TextInput::make('accent')
                ->maxLength(255)
                ->helperText('Gold script line under the title.'),
            Forms\Components\Textarea::make('intro')
                ->rows(3)
                ->columnSpanFull(),
            static::image('image', 'Photo'),
            Forms\Components\TextInput::make('image_alt')
                ->label('Photo description')
                ->maxLength(255)
                ->helperText('Describes the photo for search engines and screen readers.'),
        ];
    }

    protected static function image(string $name, ?string $label = null): Forms\Components\FileUpload
    {
        return Forms\Components\FileUpload::make($name)
            ->label($label)
            ->image()
            ->directory('pages')
            ->imageEditor();
    }

    /**
     * A list of single paragraphs, stored as a plain array of strings.
     */
    protected static function paragraphs(string $name = 'paragraphs', ?string $helperText = null): Forms\Components\Repeater
    {
        return Forms\Components\Repeater::make($name)
            ->simple(Forms\Components\Textarea::make('text')->rows(3)->required())
            ->helperText($helperText)
            ->reorderable()
            ->columnSpanFull();
    }

    /**
     * A short list of words or phrases (chips, marquee items), stored as a plain array of strings.
     */
    protected static function tags(string $name, ?string $helperText = null): Forms\Components\TagsInput
    {
        return Forms\Components\TagsInput::make($name)
            ->reorderable()
            ->helperText(trim(($helperText ?? '').' Press Enter after each one.'))
            ->columnSpanFull();
    }
}
