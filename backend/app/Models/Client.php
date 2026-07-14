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
    return $this->hasMany(Article::class,  'client_id'); // ✅ 'quantite' mchi 'quantite_stock'
}
public function mouvements() {
    return $this->hasMany(Mouvement::class, 'client_id');
}
}