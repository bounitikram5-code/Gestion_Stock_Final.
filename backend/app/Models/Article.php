<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

  protected $fillable = ['nom', 'categorie', 'quantite', 'prix', 'client_id', 'image', 'variantes'];
  protected $casts = [
    'image' => 'array',
    'variantes' => 'array', // <--- Zidi hadi darouri!

];


    public function mouvements() {
    return $this->hasMany(Mouvement::class);
}
public function client() {
        return $this->belongsTo(Client::class, 'client_id');
    }

    // Relation m3a tsawer
    public function images() {
        return $this->hasMany(Image::class); 
    }
    // f Model Article.php
public $timestamps = false;
}