<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mouvement extends Model {
    protected $fillable = ['article_id', 'type', 'quantite','tiers','date'];

    // Rabt m3a l-article
    public function article() {
        return $this->belongsTo(Article::class);
    }
}