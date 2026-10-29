<?php

namespace App\Filament\Pages;

use App\Models\CinematicIntro;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class CinematicIntroPage extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-film';

    protected static ?string $navigationLabel = 'Opening Video';

    protected static ?string $title = 'Opening Video';

    protected static ?string $navigationGroup = 'Home Page';

    protected static ?int $navigationSort = 1;

    protected static string $view = 'filament.pages.cinematic-intro-page';

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(CinematicIntro::current()->toArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\FileUpload::make('video')
                    ->acceptedFileTypes(['video/mp4'])
                    ->directory('cinematic-intro')
                    ->helperText('Opening cinematic video played before the site on tablets and desktops (MP4).'),
                Forms\Components\FileUpload::make('mobile_video')
                    ->acceptedFileTypes(['video/mp4'])
                    ->directory('cinematic-intro')
                    ->helperText('Portrait version played on phones (MP4). Leave empty to use the main video everywhere.'),
                Forms\Components\FileUpload::make('poster_image')
                    ->image()
                    ->directory('cinematic-intro')
                    ->imageEditor()
                    ->helperText('Shown while the video loads, and as the blurred backdrop.'),
                Forms\Components\TextInput::make('skip_label')
                    ->maxLength(255)
                    ->helperText('Label for the skip-intro button, e.g. "Skip Intro".'),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        CinematicIntro::current()->update($this->form->getState());

        Notification::make()
            ->title('Cinematic intro saved')
            ->success()
            ->send();
    }
}
