<?php

namespace App\Providers\Filament;

use App\Filament\Pages\Dashboard;
use App\Filament\Support\AdminNavigation;
use App\Filament\Support\WebsitePreview;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Resources\Pages\CreateRecord;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Colors\Color;
use Filament\View\PanelsRenderHook;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\HtmlString;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            // Palette mirrors the frontend's globals.css: gold accent, cream light surfaces, emerald dark surfaces.
            ->colors([
                'primary' => Color::hex('#c5a059'),
                'gray' => [
                    50 => '250, 247, 242',  // cream
                    100 => '243, 236, 223', // cream-2
                    200 => '229, 220, 203',
                    300 => '207, 199, 184', // ivory-dim
                    400 => '168, 157, 141',
                    500 => '122, 111, 97',  // taupe
                    600 => '92, 82, 72',
                    700 => '61, 52, 46',
                    800 => '22, 61, 41',    // emerald-2
                    900 => '15, 43, 30',    // emerald
                    950 => '10, 31, 20',    // bottle-green
                ],
            ])
            ->font('Urbanist')
            ->brandName('Paper Dreamz')
            ->brandLogo(fn (): HtmlString => new HtmlString(
                '<span style="display:flex;align-items:center;gap:.625rem;height:100%">'
                .'<img src="'.asset('images/logo-mark-sm.png').'" alt="Paper Dreamz by Ruchi Mishra" style="height:100%;width:auto">'
                .'<span style="display:flex;flex-direction:column;align-items:center;font-family:\'Cormorant Garamond\',Georgia,serif;line-height:1.15;white-space:nowrap">'
                .'<span class="pd-brand-name" style="font-size:1.05rem;letter-spacing:.16em">PAPER DREAMZ</span>'
                .'<span class="pd-brand-name" style="display:flex;align-items:center;gap:.4rem;font-size:.7rem;letter-spacing:.15em;line-height:1">'
                .'<span style="width:1.25rem;height:1px;background:currentColor;opacity:.7"></span>by<span style="width:1.25rem;height:1px;background:currentColor;opacity:.7"></span>'
                .'</span>'
                .'<span class="pd-brand-name" style="font-size:.6rem;letter-spacing:.22em">RUCHI MISHRA</span>'
                .'</span>'
                .'</span>'
            ))
            ->brandLogoHeight('2.5rem')
            ->sidebarWidth('17rem')
            ->sidebarCollapsibleOnDesktop()
            // One group per area of the website; "Home Page" items follow the order the sections appear on the homepage.
            ->navigationGroups(['Inbox', 'Products', 'Home Page', 'Website Pages', 'Site-wide'])
            ->favicon(asset('favicon.ico'))
            ->renderHook(PanelsRenderHook::HEAD_END, fn (): HtmlString => new HtmlString(<<<'HTML'
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&display=swap" rel="stylesheet">
                <style>
                    .pd-brand-name { color: #2c2420; }
                    .dark .pd-brand-name { color: #ffffff; }
                    .fi-sidebar, .fi-topbar > nav { border-color: rgb(197 160 89 / 0.25) !important; }
                    .fi-sidebar-item-active > a { box-shadow: inset 3px 0 0 #c5a059; }
                    .pd-quick-link { transition: border-color .15s, background-color .15s; }
                    .pd-quick-link:hover { border-color: rgb(197 160 89 / 0.6); background-color: rgb(197 160 89 / 0.06); }
                    .fi-simple-layout { background: radial-gradient(circle at top, #163d29, #0a1f14 70%); }
                    .pd-step-buttons { display: flex; gap: .5rem; }
                    /* Website preview side panel (filament.components.website-preview-panel). */
                    [x-cloak] { display: none !important; }
                    .pd-preview-panel { position: fixed; inset: 0 0 0 auto; z-index: 40; width: min(46vw, 760px); display: flex; flex-direction: column; background: #fff; border-left: 1px solid rgb(197 160 89 / .35); box-shadow: -12px 0 32px rgb(0 0 0 / .12); }
                    .dark .pd-preview-panel { background: rgb(10 31 20); }
                    .pd-preview-bar { display: flex; align-items: center; gap: .5rem; padding: .75rem 1rem; border-bottom: 1px solid rgb(197 160 89 / .25); }
                    .pd-preview-eyebrow { font-size: .7rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: rgb(122 111 97); }
                    .pd-preview-title { font-size: .875rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                    .pd-preview-devices { display: flex; padding: 2px; border: 1px solid rgb(197 160 89 / .35); border-radius: .5rem; }
                    .pd-preview-devices button { padding: .25rem .6rem; font-size: .75rem; font-weight: 500; border-radius: .375rem; color: rgb(92 82 72); }
                    .dark .pd-preview-devices button { color: rgb(207 199 184); }
                    .pd-preview-devices button.is-active { background: #c5a059; color: #fff; }
                    .pd-preview-hint { padding: .5rem 1rem; font-size: .75rem; background: rgb(197 160 89 / .1); color: rgb(92 82 72); border-bottom: 1px solid rgb(197 160 89 / .25); }
                    .dark .pd-preview-hint { color: rgb(207 199 184); }
                    .pd-preview-viewport { position: relative; flex: 1; overflow: hidden; background: rgb(243 236 223); }
                    .pd-preview-viewport iframe { position: absolute; top: 0; border: 0; background: #fff; transform-origin: top left; }
                    @media (min-width: 1024px) { body.pd-preview-open .fi-main-ctn { padding-right: min(46vw, 760px); } }
                    @media (max-width: 1023px) { .pd-preview-panel { width: 100vw; } }
                </style>
            HTML))
            // Every page header: previous / next section, "Preview" on the website, and close (X). Create/edit pages close
            // back to their list (edit pages get record navigation and preview from HasRecordNavigation); the rest to the dashboard.
            ->renderHook(PanelsRenderHook::PAGE_HEADER_ACTIONS_AFTER, function (array $scopes): string {
                $page = $scopes[0] ?? null;
                $resource = $scopes[1] ?? null;

                if (! $page || is_a($page, BaseDashboard::class, true)) {
                    return '';
                }

                if ($resource && ! is_a($page, ListRecords::class, true)) {
                    return view('filament.components.page-header-tools', [
                        'previous' => null,
                        'next' => null,
                        // Edit pages preview their own record (HasRecordNavigation); a new record shows where it will appear.
                        'previewUrl' => is_a($page, CreateRecord::class, true) ? WebsitePreview::forScreen($resource) : null,
                        'previewTitle' => ucfirst($resource::getPluralModelLabel()),
                        'closeUrl' => $resource::getUrl('index'),
                        'closeLabel' => 'Back to '.ucfirst($resource::getPluralModelLabel()),
                    ])->render();
                }

                $screen = $resource ?? $page;

                return view('filament.components.page-header-tools', [
                    ...AdminNavigation::neighbours($resource ? $resource::getUrl('index') : $page::getUrl()),
                    'previewUrl' => WebsitePreview::forScreen($screen),
                    'previewTitle' => $resource ? ucfirst($resource::getPluralModelLabel()) : $page::getNavigationLabel(),
                    'closeUrl' => Dashboard::getUrl(),
                    'closeLabel' => 'Close',
                ])->render();
            })
            ->renderHook(PanelsRenderHook::BODY_END, fn (): string => view('filament.components.website-preview-panel')->render())
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
