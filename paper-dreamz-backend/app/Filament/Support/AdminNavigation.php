<?php

namespace App\Filament\Support;

use Filament\Facades\Filament;
use Filament\Navigation\NavigationItem;

class AdminNavigation
{
    /**
     * The screens before and after the one at `$url`, in sidebar order (sub-items follow their parent), so admins can
     * step through the site section by section. Matched by URL rather than the active route, which is
     * `livewire.update` when the page re-renders after a save.
     *
     * @return array{previous: ?NavigationItem, next: ?NavigationItem}
     */
    public static function neighbours(string $url): array
    {
        $items = static::flatten();

        $index = collect($items)->search(fn (NavigationItem $item): bool => $item->getUrl() === $url);

        if ($index === false) {
            return ['previous' => null, 'next' => null];
        }

        return [
            'previous' => $items[$index - 1] ?? null,
            'next' => $items[$index + 1] ?? null,
        ];
    }

    /**
     * @return array<int, NavigationItem>
     */
    protected static function flatten(): array
    {
        $items = [];

        foreach (Filament::getNavigation() as $group) {
            // The ungrouped Dashboard isn't a website section.
            if ($group->getLabel() === null) {
                continue;
            }

            foreach ($group->getItems() as $item) {
                $items[] = $item;

                foreach ($item->getChildItems() as $child) {
                    $items[] = $child;
                }
            }
        }

        return $items;
    }
}
