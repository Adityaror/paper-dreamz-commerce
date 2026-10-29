<?php

namespace App\Filament\Pages;

use App\Models\StorySection;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class StorySectionPage extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-heart';

    protected static ?string $navigationLabel = 'Our Story';

    protected static ?string $title = 'Our Story';

    protected static ?string $navigationGroup = 'Home Page';

    protected static ?int $navigationSort = 5;

    protected static string $view = 'filament.pages.story-section-page';

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(StorySection::current()->toArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('eyebrow')
                    ->maxLength(255)
                    ->helperText('Small uppercase label above the heading, e.g. "The Story Behind Every Creation".'),
                Forms\Components\TextInput::make('heading')
                    ->maxLength(255)
                    ->helperText('e.g. "Handcrafted with".'),
                Forms\Components\TextInput::make('accent_word')
                    ->maxLength(255)
                    ->helperText('Script-styled accent word, e.g. "passion,".'),
                Forms\Components\Textarea::make('body')
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('image')
                    ->image()
                    ->directory('story')
                    ->imageEditor(),
                Forms\Components\TextInput::make('cta_label')
                    ->maxLength(255)
                    ->helperText('e.g. "Know Our Story".'),
                Forms\Components\TextInput::make('cta_link')
                    ->maxLength(255)
                    ->helperText('e.g. "/about".'),
            ])
            ->columns(2)
            ->statePath('data');
    }

    public function save(): void
    {
        StorySection::current()->update($this->form->getState());

        Notification::make()
            ->title('Story section saved')
            ->success()
            ->send();
    }
}
