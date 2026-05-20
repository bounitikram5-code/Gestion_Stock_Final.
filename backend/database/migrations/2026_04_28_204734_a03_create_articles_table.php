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
        //

        Schema::create('articles', function (Blueprint $table) {
  $table->id();
    $table->string('nom');
    $table->decimal('prix', 10, 2);
    $table->integer('quantite');
    $table->string('categorie');
    $table->string('image')->nullable();
    
    // هاد السطر هو اللي كيكري client_id وكيربطو مع جدول clients
    $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
    
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
