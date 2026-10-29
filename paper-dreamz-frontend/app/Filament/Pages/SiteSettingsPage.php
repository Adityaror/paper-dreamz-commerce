<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class SiteSettingsPage extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationLabel = 'Site Settings';

    protected static ?string $title = 'Site Settings';

    protected static ?string $navigationGroup = 'Site-wide';

    protected static ?int $navigationSort = 1;

    protected static string $view = 'filament.pages.site-settings-page';

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(SiteSetting::current()->toArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('SEO & Meta')
                    ->schema([
                        Forms\Components\TextInput::make('meta_title')
                            ->maxLength(255),
                        Forms\Components\Textarea::make('meta_description')
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('meta_keywords')
                            ->helperText('Comma-separated keywords.')
                            ->maxLength(2000),
                        Forms\Components\TextInput::make('og_title')
                            ->maxLength(255),
                        Forms\Components\Textarea::make('og_description')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Navbar')
                    ->schema([
                        Forms\Components\TextInput::make('announcement_text')
                            ->maxLength(255)
                            ->helperText('Shown in the top announcement bar.'),
                        Forms\Components\FileUpload::make('logo')
                            ->image()
                            ->directory('site')
                            ->imageEditor(),
                        Forms\Components\TextInput::make('brand_name')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('brand_tagline')
                            ->maxLength(255),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Footer')
                    ->schema([
                        Forms\Components\Textarea::make('footer_blurb')
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('footer_est_year')
                            ->numeric()
                            ->minValue(1900)
                            ->maxValue(now()->year),
                        Forms\Components\TextInput::make('footer_copyright_name')
                            ->maxLength(255),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Contact')
                    ->schema([
                        Forms\Components\TextInput::make('contact_phone')
                            ->tel()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('contact_whatsapp')
                            ->tel()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('contact_email')
                            ->email()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('contact_address')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('business_hours')
                            ->maxLength(255),
                    ])
                    ->columns(3),

                Forms\Components\Section::make('Socials')
                    ->schema([
                        Forms\Components\TextInput::make('instagram_url')
                            ->url()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('facebook_url')
                            ->url()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('youtube_url')
                            ->url()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('pinterest_url')
                            ->url()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('threads_url')
                            ->url()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('whatsapp_url')
                            ->url()
                            ->maxLength(255),
                    ])
                    ->columns(2),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        SiteSetting::current()->update($this->form->getState());

        Notification::make()
            ->title('Settings saved')
            ->success()
            ->send();
    }
}
