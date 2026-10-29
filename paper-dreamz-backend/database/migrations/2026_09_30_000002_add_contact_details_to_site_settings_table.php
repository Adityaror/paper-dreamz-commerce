<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('contact_whatsapp')->nullable()->after('contact_phone');
            $table->string('business_hours')->nullable()->after('contact_address');
            $table->string('pinterest_url')->nullable()->after('youtube_url');
        });

        // Bring the existing settings row (if any) in line with the brand's real contact details.
        DB::table('site_settings')->update([
            'contact_phone' => '9999980586',
            'contact_whatsapp' => '76690 06999',
            'contact_email' => 'Paperdreamz.orders@gmail.com',
            'business_hours' => '11am to 6pm',
            'footer_est_year' => 2010,
            'instagram_url' => 'https://www.instagram.com/paperdreamz_ruchi?stkn=MWo4aXI3amdoaTN5eg%3D%3D&utm_source=qr',
            'facebook_url' => 'https://www.facebook.com/share/1EEz4maxTH/?mibextid=wwXIfr',
            'youtube_url' => 'https://youtube.com/@paperdreamz2017?si=hM0lk9JFlgQ_2_Kw',
            'pinterest_url' => 'https://pin.it/575TwFYzX',
            'whatsapp_url' => 'https://wa.me/917669006999',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn(['contact_whatsapp', 'business_hours', 'pinterest_url']);
        });
    }
};
