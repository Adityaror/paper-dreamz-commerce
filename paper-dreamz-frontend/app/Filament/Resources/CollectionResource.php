<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CollectionResource\Pages;
use App\Filament\Resources\CollectionResource\RelationManagers;
use App\Filament\Support\AssetUrl;
use App\Models\Collection;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class CollectionResource extends Resource
{
    protected static ?string $model = Collection::class;

    protected static ?string $navigationIcon = 'heroicon-o-folder';

    protected static ?string $navigationLabel = 'Categories';

    protected static ?string $modelLabel = 'category';

    protected static ?string $pluralModelLabel = 'categories';

    protected static ?string $navigationGroup = 'Products';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make([
                    Forms\Components\Section::make('Category details')
                        ->schema([
                            Forms\Components\TextInput::make('name')
                                ->required()
                                ->maxLength(255)
                                ->live(onBlur: true)
                                ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),
                            Forms\Components\Select::make('parent_id')
                                ->label('Parent category')
                                ->relationship('parent', 'name', fn ($query) => $query->whereNull('parent_id'))
                                ->placeholder('None (top-level category)')
                                ->helperText('Set this to make the entry a sub-category, e.g. "Luxury envelopes" under "Envelopes".'),
                            Forms\Components\TextInput::make('slug')
                                ->required()
                                ->maxLength(255)
                                ->unique(ignoreRecord: true),
                            Forms\Components\TextInput::make('tag')
                                ->maxLength(255)
                                ->helperText('Small label shown under the collection name, e.g. "Luxury Handmade". On a sub-category with designs, shown as the range tagline.'),
                        ])
                        ->columns(2),
                    Forms\Components\Section::make('Shop page intro')
                        ->description('Used for top-level categories only.')
                        ->collapsible()
                        ->schema([
                            Forms\Components\TextInput::make('accent')
                                ->maxLength(255)
                                ->helperText('Script line under the name on the shop page, e.g. "for every shagun".'),
                            Forms\Components\Textarea::make('description')
                                ->rows(3)
                                ->helperText('Introduction paragraph on the shop page.'),
                            Forms\Components\TagsInput::make('occasions')
                                ->placeholder('Add an occasion')
                                ->helperText('The "Perfect for" chips on the shop page. Press Enter after each one.')
                                ->columnSpanFull(),
                        ]),
                ])->columnSpan(['lg' => 2]),
                Forms\Components\Group::make([
                    Forms\Components\Section::make('Photo')
                        ->schema([
                            Forms\Components\FileUpload::make('image')
                                ->hiddenLabel()
                                ->image()
                                ->directory('collections')
                                ->imageEditor(),
                        ]),
                    Forms\Components\Section::make('Visibility')
                        ->schema([
                            Forms\Components\Toggle::make('is_active')
                                ->label('Show on website')
                                ->default(true)
                                ->required(),
                            Forms\Components\TextInput::make('sort_order')
                                ->required()
                                ->numeric()
                                ->default(0)
                                ->helperText('Lower numbers appear first.'),
                        ]),
                ])->columnSpan(['lg' => 1]),
            ])
            ->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('')
                    ->getStateUsing(fn (Collection $record): ?string => AssetUrl::resolve($record->image))
                    ->square()
                    ->size(48),
                Tables\Columns\TextColumn::make('name')
                    ->formatStateUsing(fn (string $state, Collection $record): string => $record->parent_id ? "↳  {$state}" : $state)
                    ->weight(fn (Collection $record): string => $record->parent_id ? 'normal' : 'semibold')
                    ->extraAttributes(fn (Collection $record): array => $record->parent_id ? ['style' => 'padding-left: 1.5rem'] : [])
                    ->searchable(),
                Tables\Columns\TextColumn::make('slug')
                    ->color('gray')
                    ->size(Tables\Columns\TextColumn\TextColumnSize::Small)
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
                Tables\Columns\TextColumn::make('products_count')
                    ->label('Products')
                    ->counts('products')
                    ->alignCenter(),
                Tables\Columns\ToggleColumn::make('is_active')
                    ->label('Active')
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
            // Keep each sub-collection directly under its parent: order by the top-level group, then parent before children.
            ->defaultSort(fn (Builder $query): Builder => static::orderByHierarchy($query))
            ->modifyQueryUsing(fn (Builder $query): Builder => $query->with('parent'))
            ->reorderable('sort_order')
            ->defaultPaginationPageOption(25)
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
            RelationManagers\ProductsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCollections::route('/'),
            'create' => Pages\CreateCollection::route('/create'),
            'edit' => Pages\EditCollection::route('/{record}/edit'),
        ];
    }

    public static function orderByHierarchy(Builder $query): Builder
    {
        return $query
            ->orderByRaw('COALESCE((SELECT p.sort_order FROM collections p WHERE p.id = collections.parent_id), collections.sort_order)')
            ->orderByRaw('COALESCE(collections.parent_id, collections.id)')
            ->orderByRaw('collections.parent_id IS NOT NULL')
            ->orderBy('collections.sort_order');
    }
}
