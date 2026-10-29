<?php

namespace App\Filament\Resources\CollectionResource\RelationManagers;

use App\Filament\Resources\ProductResource;
use App\Filament\Support\AssetUrl;
use App\Models\Product;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

/**
 * The designs inside a category, listed under its edit form. Adding and editing open the full product screen.
 */
class ProductsRelationManager extends RelationManager
{
    protected static string $relationship = 'products';

    protected static ?string $title = 'Products in this category';

    protected static ?string $icon = 'heroicon-o-shopping-bag';

    public function isReadOnly(): bool
    {
        return false;
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('')
                    ->getStateUsing(fn (Product $record): ?string => AssetUrl::resolve($record->image))
                    ->square()
                    ->size(56),
                Tables\Columns\TextColumn::make('code')
                    ->label('Code')
                    ->placeholder('—')
                    ->searchable(),
                Tables\Columns\TextColumn::make('name')
                    ->weight('semibold')
                    ->wrap()
                    ->searchable(),
                Tables\Columns\TextColumn::make('price')
                    ->money('INR')
                    ->alignEnd()
                    ->sortable(),
                Tables\Columns\ToggleColumn::make('is_active')
                    ->label('Active')
                    ->alignCenter(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->recordUrl(fn (Product $record): string => ProductResource::getUrl('edit', ['record' => $record]))
            ->headerActions([
                Tables\Actions\Action::make('create')
                    ->label('Add product')
                    ->icon('heroicon-m-plus')
                    ->url(fn (): string => ProductResource::getUrl('create', ['collection' => $this->getOwnerRecord()->getKey()])),
            ])
            ->actions([
                Tables\Actions\Action::make('edit')
                    ->label('Edit')
                    ->icon('heroicon-m-pencil-square')
                    ->url(fn (Product $record): string => ProductResource::getUrl('edit', ['record' => $record])),
            ])
            ->emptyStateHeading('No products yet')
            ->emptyStateDescription('Products added to this category appear here.');
    }
}
