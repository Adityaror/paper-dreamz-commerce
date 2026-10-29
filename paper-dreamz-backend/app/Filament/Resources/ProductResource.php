<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Support\AssetUrl;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationGroup = 'Products';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make([
                    Forms\Components\Section::make('Product details')
                        ->schema([
                            Forms\Components\TextInput::make('name')
                                ->required()
                                ->maxLength(255)
                                ->live(onBlur: true)
                                ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),
                            Forms\Components\Select::make('collection_id')
                                ->label('Category')
                                ->relationship('collection', 'name')
                                ->default(fn (): ?int => request()->integer('collection') ?: null)
                                ->searchable()
                                ->preload(),
                            Forms\Components\TextInput::make('code')
                                ->label('Design code')
                                ->maxLength(50)
                                ->unique(ignoreRecord: true)
                                ->helperText('e.g. "WE0001". Shown on the shop card and used in links like /shop#we0001.'),
                            Forms\Components\TextInput::make('slug')
                                ->required()
                                ->maxLength(255)
                                ->unique(ignoreRecord: true)
                                ->helperText('Filled in from the name. Only change it if you know why.'),
                            Forms\Components\Select::make('badge')
                                ->options([
                                    'New' => 'New',
                                    'Bestseller' => 'Bestseller',
                                    'Trending' => 'Trending',
                                    'Signature' => 'Signature',
                                ])
                                ->native(false),
                            Forms\Components\TextInput::make('tag')
                                ->maxLength(255)
                                ->helperText('Small label above the product name, e.g. "Top Picks".'),
                            Forms\Components\Textarea::make('description')
                                ->rows(3)
                                ->columnSpanFull(),
                        ])
                        ->columns(2),
                    Forms\Components\Section::make('Price')
                        ->schema([
                            Forms\Components\TextInput::make('price')
                                ->required()
                                ->numeric()
                                ->prefix('₹')
                                ->helperText('Shown in the homepage New Arrivals / Hot Deals / Best Sellers tabs. For designs sold in packs, use the smallest pack\'s price.'),
                            Forms\Components\TextInput::make('compare_price')
                                ->label('Original price (for Hot Deals)')
                                ->numeric()
                                ->prefix('₹')
                                ->helperText('Optional. Shown struck through next to the price; should be higher than the price.'),
                            Forms\Components\TextInput::make('unit')
                                ->maxLength(255)
                                ->helperText('e.g. "Set of 10" or "Piece".'),
                        ])
                        ->columns(3),
                    Forms\Components\Section::make('Sizes & pack prices')
                        ->description('Designs with at least one size are shown on the shop page with a pack picker. Packs of 25 or more can carry a custom name.')
                        ->collapsible()
                        ->schema([
                            Forms\Components\Repeater::make('sizes')
                                ->hiddenLabel()
                                ->schema([
                                    Forms\Components\TextInput::make('label')
                                        ->required()
                                        ->default('Standard')
                                        ->maxLength(50),
                                    Forms\Components\TextInput::make('dimensions')
                                        ->maxLength(255)
                                        ->placeholder('3.5 × 6.5 in (8.89 × 16.51 cm) approx.'),
                                    Forms\Components\TextInput::make('capacity')
                                        ->label('Cash capacity')
                                        ->maxLength(255)
                                        ->placeholder('Up to ₹11,000'),
                                    Forms\Components\Repeater::make('packs')
                                        ->schema([
                                            Forms\Components\TextInput::make('qty')
                                                ->label('Pieces in pack')
                                                ->required()
                                                ->integer()
                                                ->minValue(1),
                                            Forms\Components\TextInput::make('price')
                                                ->label('Pack price')
                                                ->required()
                                                ->numeric()
                                                ->prefix('₹'),
                                        ])
                                        ->columns(2)
                                        ->defaultItems(1)
                                        ->reorderable()
                                        ->columnSpanFull(),
                                ])
                                ->columns(3)
                                ->itemLabel(fn (array $state): ?string => $state['label'] ?? null)
                                ->addActionLabel('Add size')
                                ->collapsible()
                                ->defaultItems(0),
                        ]),
                ])->columnSpan(['lg' => 2]),
                Forms\Components\Group::make([
                    Forms\Components\Section::make('Photo')
                        ->schema([
                            Forms\Components\FileUpload::make('image')
                                ->hiddenLabel()
                                ->image()
                                ->directory('products')
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
                                ->helperText('Lower numbers appear first. You can also drag rows in the product list.'),
                        ]),
                    Forms\Components\Section::make('Homepage tabs')
                        ->description('A product can be in more than one.')
                        ->schema([
                            Forms\Components\Toggle::make('is_new_arrival')->label('New Arrival'),
                            Forms\Components\Toggle::make('is_hot_deal')->label('Hot Deal'),
                            Forms\Components\Toggle::make('is_best_seller')->label('Best Seller'),
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
                    ->getStateUsing(fn (Product $record): ?string => AssetUrl::resolve($record->image))
                    ->square()
                    ->size(48),
                Tables\Columns\TextColumn::make('name')
                    ->weight('semibold')
                    ->wrap()
                    ->searchable(),
                Tables\Columns\TextColumn::make('collection.name')
                    ->label('Category')
                    ->color('gray')
                    ->wrap()
                    ->sortable(),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('badge')
                    ->badge()
                    ->placeholder('—')
                    ->searchable(),
                Tables\Columns\TextColumn::make('tag')
                    ->badge()
                    ->placeholder('—')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('price')
                    ->money('INR')
                    ->alignEnd()
                    ->sortable(),
                Tables\Columns\TextColumn::make('unit')
                    ->color('gray')
                    ->placeholder('—')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\ToggleColumn::make('is_new_arrival')->label('New')->alignCenter(),
                Tables\Columns\ToggleColumn::make('is_hot_deal')->label('Hot Deal')->alignCenter(),
                Tables\Columns\ToggleColumn::make('is_best_seller')->label('Best Seller')->alignCenter(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Order')
                    ->numeric()
                    ->alignCenter()
                    ->sortable(),
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
            ->modifyQueryUsing(fn ($query) => $query->with('collection'))
            ->defaultPaginationPageOption(25)
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_new_arrival')->label('New Arrival'),
                Tables\Filters\TernaryFilter::make('is_hot_deal')->label('Hot Deal'),
                Tables\Filters\TernaryFilter::make('is_best_seller')->label('Best Seller'),
                Tables\Filters\SelectFilter::make('collection_id')
                    ->label('Category')
                    ->relationship('collection', 'name'),
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
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
