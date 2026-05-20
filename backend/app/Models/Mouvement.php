<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mouvement extends Model
{
    use HasFactory;

    // 1. تـأكدي باللي عندك client_id هنايا وسط الـ fillable
    protected $fillable = [
        'article_id', 
        'client_id', // 👈 ضروري تكون هادي هنايا
        'type', 
        'quantite', 
        'date', 
        'tiers'
    ];

    // 2. 🌟 حطي الـ function هنايا لداخل:
    public function client() {
        return $this->belongsTo(Client::class);
    }

    // هادي ديجا غاتكون عندك حيت الموفمون تابه للـ Article
    public function article() {
        return $this->belongsTo(Article::class);
    }
}