<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteSettingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->meta_keywords,
            'og_title' => $this->og_title,
            'og_description' => $this->og_description,
            'announcement_text' => $this->announcement_text,
            'logo' => $this->logo,
            'brand_name' => $this->brand_name,
            'brand_tagline' => $this->brand_tagline,
            'footer_blurb' => $this->footer_blurb,
            'footer_est_year' => $this->footer_est_year,
            'footer_copyright_name' => $this->footer_copyright_name,
            'contact_phone' => $this->contact_phone,
            'contact_whatsapp' => $this->contact_whatsapp,
            'contact_email' => $this->contact_email,
            'contact_address' => $this->contact_address,
            'business_hours' => $this->business_hours,
            'instagram_url' => $this->instagram_url,
            'facebook_url' => $this->facebook_url,
            'youtube_url' => $this->youtube_url,
            'pinterest_url' => $this->pinterest_url,
            'threads_url' => $this->threads_url,
            'whatsapp_url' => $this->whatsapp_url,
        ];
    }
}
