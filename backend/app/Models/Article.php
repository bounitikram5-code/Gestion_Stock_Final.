<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    // Hada hwa s-s-tar li ghadi i-7el l-mouchkil d 500
    protected $fillable = ['nom', 'categorie', 'quantite', 'prix', 'image_url'];
    public function mouvements() {
    return $this->hasMany(Mouvement::class);
}
}