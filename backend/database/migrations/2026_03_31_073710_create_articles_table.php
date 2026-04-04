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
       Schema::create('articles', function (Blueprint $table) {
        $table->id();
        $table->string('nom');            // Hada hwa 'designation' f React
        $table->string('categorie')->nullable();
        $table->integer('quantite')->default(0);
        $table->decimal('prix', 10, 2);   // Hada hwa 'prix_achat' f React
        $table->string('image_url')->nullable();
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
