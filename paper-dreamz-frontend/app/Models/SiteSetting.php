<?php

namespace App\Models;

use Database\Factories\SiteSettingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    /** @use HasFactory<SiteSettingFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_title',
        'og_description',
        'announcement_text',
        'logo',
        'brand_name',
        'brand_tagline',
        'footer_blurb',
        'footer_est_year',
        'footer_copyright_name',
        'contact_phone',
        'contact_whatsapp',
        'contact_email',
        'contact_address',
        'business_hours',
        'instagram_url',
        'facebook_url',
        'youtube_url',
        'pinterest_url',
        'threads_url',
        'whatsapp_url',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'footer_est_year' => 'integer',
        ];
    }

    /**
     * Fetch the single settings row, creating an empty one if it doesn't exist yet.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate([]);
    }
}
