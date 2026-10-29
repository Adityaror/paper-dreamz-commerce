<?php

namespace App\Filament\Pages;

use App\Models\PromoPopup;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class PromoPopupPage extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-megaphone';

    protected static ?string $navigationLabel = 'Promo Popup';

    protected static ?string $title = 'Promo Popup';

    protected static ?string $navigationGroup = 'Site-wide';

    protected static ?int $navigationSort = 5;

    protected static string $view = 'filament.pages.promo-popup-page';

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(PromoPopup::current()->toArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Visibility')
                    ->description('A small card in the bottom-right corner of the website that takes visitors to a product section.')
                    ->columns(2)
                    ->schema([
                        Forms\Components\Toggle::make('is_enabled')
                            ->label('Show popup on the website')
                            ->columnSpanFull(),
                        Forms\Components\Select::make('category')
                            ->label('Takes visitors to')
                            ->options(PromoPopup::CATEGORY_LABELS)
                            ->default('new-arrivals')
                            ->required()
                            ->selectablePlaceholder(false)
                            ->live()
                            ->helperText(fn (Get $get): string => sprintf(
                                '%d active product(s) are currently marked as %s.',
                                (new PromoPopup(['category' => $get('category')]))->categoryProductCount(),
                                PromoPopup::CATEGORY_LABELS[$get('category')] ?? 'New Arrivals',
                            )),
                        Forms\Components\TextInput::make('delay_seconds')
                            ->label('Appear after (seconds)')
                            ->numeric()
                            ->minValue(0)
                            ->maxValue(60)
                            ->default(3)
                            ->required(),
                    ]),
                Forms\Components\Section::make('Content')
                    ->description('Leave any field blank to use the default wording for the chosen section.')
                    ->columns(2)
                    ->schema([
                        Forms\Components\TextInput::make('eyebrow')
                            ->maxLength(40)
                            ->placeholder('Just In')
                            ->helperText('Small uppercase label above the title.'),
                        Forms\Components\TextInput::make('button_label')
                            ->maxLength(30)
                            ->placeholder('Explore Now'),
                        Forms\Components\TextInput::make('title')
                            ->maxLength(80)
                            ->placeholder('New Arrivals are here')
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('message')
                            ->maxLength(200)
                            ->rows(2)
                            ->placeholder('Fresh shagun suites and keepsakes, straight from our atelier.')
                            ->columnSpanFull(),
                        Forms\Components\FileUpload::make('image')
                            ->image()
                            ->directory('promo-popup')
                            ->imageEditor()
                            ->helperText('Optional. If empty, the newest product in the chosen section is shown automatically.')
                            ->columnSpanFull(),
                    ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $popup = PromoPopup::current();
        $popup->fill($this->form->getState());
        // Always bump updated_at so visitors who closed the previous popup see this one.
        $popup->touch();

        Notification::make()
            ->title('Promo popup saved')
            ->success()
            ->send();
    }
}
