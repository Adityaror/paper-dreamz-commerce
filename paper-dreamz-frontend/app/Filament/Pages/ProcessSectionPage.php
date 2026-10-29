<?php

namespace App\Filament\Pages;

use App\Models\ProcessSection;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class ProcessSectionPage extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-adjustments-horizontal';

    protected static ?string $navigationLabel = 'How It\'s Made';

    protected static ?string $title = 'How It\'s Made';

    protected static ?string $navigationGroup = 'Home Page';

    protected static ?int $navigationSort = 9;

    protected static string $view = 'filament.pages.process-section-page';

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(ProcessSection::current()->toArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('heading')
                    ->maxLength(255)
                    ->helperText('e.g. "Craftsmanship in Motion".'),
                Forms\Components\TextInput::make('subtext')
                    ->maxLength(255)
                    ->helperText('e.g. "From initial sketch to heirloom finish—explore the 5-step masterclass..."'),
            ])
            ->columns(1)
            ->statePath('data');
    }

    public function save(): void
    {
        ProcessSection::current()->update($this->form->getState());

        Notification::make()
            ->title('Process section saved')
            ->success()
            ->send();
    }
}
