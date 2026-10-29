<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ExperienceItemResource\Pages;
use App\Filament\Support\AssetUrl;
use App\Models\ExperienceItem;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ExperienceItemResource extends Resource
{
    protected static ?string $model = ExperienceItem::class;

    protected static ?string $navigationIcon = 'heroicon-o-photo';

    /**
     * The homepage "Experience" section now shows testimonials (see TestimonialResource); these old occasion tiles are no longer displayed.
     */
    protected static bool $shouldRegisterNavigation = false;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255)
                    ->helperText('e.g. "Weddings".'),
                Forms\Components\TextInput::make('tag')
                    ->maxLength(255)
                    ->helperText('e.g. "Royal Shagun & Invitation Suites".'),
                Forms\Components\FileUpload::make('image')
                    ->image()
                    ->directory('experience')
                    ->imageEditor(),
                Forms\Components\TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->helperText('Lower numbers appear first. The first item is the featured card.'),
                Forms\Components\Toggle::make('is_active')
                    ->default(true)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('')
                    ->getStateUsing(fn (ExperienceItem $record): ?string => AssetUrl::resolve($record->image))
                    ->square()
                    ->size(48),
                Tables\Columns\TextColumn::make('title')
                    ->weight('semibold')
                    ->wrap()
                    ->searchable(),
                Tables\Columns\TextColumn::make('tag')
                    ->badge()
                    ->placeholder('—')
                    ->searchable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Order')
                    ->numeric()
                    ->alignCenter()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->alignCenter(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultPaginationPageOption(25)
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListExperienceItems::route('/'),
            'create' => Pages\CreateExperienceItem::route('/create'),
            'edit' => Pages\EditExperienceItem::route('/{record}/edit'),
        ];
    }
}
