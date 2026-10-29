<?php

namespace App\Filament\Support;

use App\Filament\Resources\CollectionResource;
use Filament\Actions\Action;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;

/**
 * Header buttons for resource edit pages: step to the previous / next record in list order, and preview the record on
 * the website. Pages using it must extend Filament\Resources\Pages\EditRecord.
 */
trait HasRecordNavigation
{
    /**
     * @return array<int, Action>
     */
    protected function recordNavigationActions(): array
    {
        $resource = static::getResource();
        $ids = $this->orderedRecordQuery()->pluck($this->record->getKeyName())->all();
        $index = array_search($this->record->getKey(), $ids);
        $previewUrl = WebsitePreview::forRecord($resource, $this->record);
        $label = $resource::getModelLabel();

        return array_values(array_filter([
            Action::make('previousRecord')
                ->label('Previous')
                ->tooltip('Previous '.$label)
                ->icon('heroicon-m-arrow-left')
                ->color('gray')
                ->outlined()
                ->url(fn (): string => $resource::getUrl('edit', ['record' => $ids[$index - 1]]))
                ->visible($index !== false && $index > 0),
            Action::make('nextRecord')
                ->label('Next')
                ->tooltip('Next '.$label)
                ->icon('heroicon-m-arrow-right')
                ->iconPosition('after')
                ->color('gray')
                ->outlined()
                ->url(fn (): string => $resource::getUrl('edit', ['record' => $ids[$index + 1]]))
                ->visible($index !== false && $index < count($ids) - 1),
            $previewUrl ? Action::make('preview')
                ->label('Preview')
                ->icon('heroicon-m-eye')
                ->color('gray')
                ->alpineClickHandler(WebsitePreview::openHandler($previewUrl, $this->getRecordTitle())) : null,
        ]));
    }

    /**
     * Same order as the resource's list: categories by hierarchy, sortable content by its order, the rest newest first.
     */
    protected function orderedRecordQuery(): Builder
    {
        $resource = static::getResource();
        $query = $resource::getEloquentQuery();

        if ($resource === CollectionResource::class) {
            return CollectionResource::orderByHierarchy($query);
        }

        if (Schema::hasColumn($query->getModel()->getTable(), 'sort_order')) {
            return $query->orderBy('sort_order')->orderBy($query->getModel()->getKeyName());
        }

        return $query->latest($query->getModel()->getKeyName());
    }
}
