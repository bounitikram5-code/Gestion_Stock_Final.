<?php
namespace App\Http\Controllers;

use App\Models\Mouvement;
use App\Models\Article;
use Illuminate\Http\Request;

class MouvementController extends Controller {
    // 1. Chofi ga3 l-mouvements (Historique)
    public function index() {
        return response()->json(Mouvement::with('article')->latest()->get());
    }

    // 2. S-ajli Mouvement jdid
   public function store(Request $request) {
    // return response()->json($request->all());
 $article = \App\Models\Article::find($request->article_id);

    if (!$article) {
        return response()->json(['message' => 'Article introuvable!'], 404);
    }

    if (str_contains($request->type, 'Sortie')) {
        
        // 🔒 هاد الجزء هو اللي خاصك تزيدي دابا:
        if ($article->quantite < (int)$request->quantite) {
            return response()->json(['error' => 'الكمية غير كافية في الستوك!'], 400);
        }
        // 🔒 ------------------------------

        $article->quantite -= (int)$request->quantite; 
    } else {
        $article->quantite += (int)$request->quantite;
    }

    $article->save();

    \App\Models\Mouvement::create($request->all());
    
    return response()->json(['message' => 'Mouvement enregistré!']);

}
}