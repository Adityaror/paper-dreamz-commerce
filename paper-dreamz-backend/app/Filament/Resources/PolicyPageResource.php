<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PolicyPageResource\Pages;
use App\Filament\Support\AssetUrl;
use App\Models\PolicyPage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PolicyPageResource extends Resource
{
    protected static ?string $model = PolicyPage::class;

    protected static ?string $navigationIcon = 'heroicon-o-scale';

    protected static ?string $navigationLabel = 'Policy Pages';

    protected static ?string $navigationGroup = 'Website Pages';

    protected static ?int $navigationSort = 20;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true)
                    ->disabledOn('edit')
                    ->helperText('Page address, e.g. "shipping-delivery" for /shipping-delivery. The four policy pages already exist on the website.'),
                Forms\Components\Textarea::make('intro')
                    ->rows(2)
                    ->helperText('Line under the page title.')
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('hero_image')
                    ->image()
                    ->directory('policies')
                    ->imageEditor(),
                Forms\Components\Repeater::make('sections')
                    ->schema([
                        Forms\Components\TextInput::make('heading')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('body')
                            ->rows(5)
                            ->helperText('Leave a blank line between paragraphs.'),
                    ])
                    ->itemLabel(fn (array $state): ?string => $state['heading'] ?? null)
                    ->collapsible()
                    ->reorderable()
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->helperText('Order in the policies menu. Lower numbers appear first.'),
                Forms\Components\Toggle::make('is_active')
                    ->default(true)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('hero_image')
                    ->label('Image')
                    ->getStateUsing(fn (PolicyPage $record): ?string => AssetUrl::resolve($record->hero_image))
                    ->square(),
                Tables\Columns\TextColumn::make('title')
                    ->searchable(),
                Tables\Columns\TextColumn::make('slug')
                    ->prefix('/'),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Order')
                    ->numeric()
                    ->alignCenter()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->alignCenter(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->actions([
                Tables\Actions\EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPolicyPages::route('/'),
            'create' => Pages\CreatePolicyPage::route('/create'),
            'edit' => Pages\EditPolicyPage::route('/{record}/edit'),
        ];
    }
}
