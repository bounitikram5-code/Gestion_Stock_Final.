<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'nom', 'email', 'ville', 'telephone', 'logo', 
        'adresse', 'ice', 'identifiant_fiscal', 'rc', 'patente'
    ];

    // هاد الدالة هي اللي كتربط الكليان مع السلع
    // app/Models/Client.php

// backend/app/Models/Client.php

// Client.php - relation
public function articles() {
    return $this->belongsToMany(Article::class, 'mouvements', 'client_id', 'article_id')
                ->withPivot('quantite'); // ✅ 'quantite' mchi 'quantite_stock'
}
}