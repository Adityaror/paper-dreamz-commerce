<?php

namespace App\Filament\Pages;

use App\Models\ExperienceSection;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class ExperienceSectionPage extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationLabel = 'Testimonials Heading';

    protected static ?string $title = 'Testimonials Heading';

    protected static ?string $navigationGroup = 'Home Page';

    protected static ?string $navigationParentItem = 'Testimonials';

    protected static ?int $navigationSort = 8;

    protected static string $view = 'filament.pages.experience-section-page';

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(ExperienceSection::current()->toArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('heading')
                    ->maxLength(255)
                    ->helperText('e.g. "The Experience".'),
                Forms\Components\TextInput::make('subtext')
                    ->maxLength(255)
                    ->helperText('Line under the heading of the homepage testimonials section.'),
            ])
            ->columns(1)
            ->statePath('data');
    }

    public function save(): void
    {
        ExperienceSection::current()->update($this->form->getState());

        Notification::make()
            ->title('Testimonials heading saved')
            ->success()
            ->send();
    }
}
