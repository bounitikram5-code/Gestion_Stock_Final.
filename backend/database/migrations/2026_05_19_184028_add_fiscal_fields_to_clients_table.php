<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->string('adresse')->nullable()->after('telephone');
            $table->string('ice')->nullable()->after('adresse');
            $table->string('identifiant_fiscal')->nullable()->after('ice');
            $table->string('rc')->nullable()->after('identifiant_fiscal');
            $table->string('patente')->nullable()->after('rc');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['adresse', 'ice', 'identifiant_fiscal', 'rc', 'patente']);
        });
    }
};