<?php

namespace App\Filament\Pages;

use App\Models\CraftBanner;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class CraftBannerPage extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-paint-brush';

    protected static ?string $navigationLabel = 'Craft Banner';

    protected static ?string $title = 'Craft Banner';

    protected static ?string $navigationGroup = 'Home Page';

    protected static ?int $navigationSort = 6;

    protected static string $view = 'filament.pages.craft-banner-page';

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(CraftBanner::current()->toArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('eyebrow')
                    ->maxLength(255)
                    ->helperText('Small uppercase label, e.g. "Craftsmanship In Motion".'),
                Forms\Components\Textarea::make('quote')
                    ->columnSpanFull()
                    ->helperText('The large quote text shown over the banner image.'),
                Forms\Components\FileUpload::make('background_image')
                    ->image()
                    ->directory('craft-banner')
                    ->imageEditor(),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        CraftBanner::current()->update($this->form->getState());

        Notification::make()
            ->title('Craft banner saved')
            ->success()
            ->send();
    }
}
