<?php
namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller {

    // 1. Bedelna hadi bach tjib smiya d l-client m3a l-article
public function index() {
    // Rej3iha ghi hakka bach t-verifiy
    $articles = Article::with('client')->get(); 
    return response()->json($articles);
}


    public function store(Request $request) {
    // 1. Validation: n-semiwha 'images' hit ghadi n-sifto bezzaf
    $validatedData = $request->validate([
        'nom'       => 'required|string|max:255', 
        'categorie' => 'nullable|string',
        'quantite'  => 'required|integer',
        'prix'      => 'required|numeric',
        'client_id' => 'required|exists:clients,id',
        'images.*'  => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $paths = [];
    // 2. Loop bach n-khzno ga3 t-swar
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $file) {
            $paths[] = $file->store('articles', 'public');
        }
    }

    // 3. Khzen l-array ka JSON f hagl 'image' (li 3ndek f database)
    $article = new Article($validatedData);
    $article->image = $paths; // Darouri t-koni dayra casts array f Model
    $article->save();

    return response()->json([
        'message' => 'Article ajouté avec succès!',
        'article' => $article->load('client')
    ], 201);
}
    public function destroy($id) {
        $article = Article::find($id);
        if (!$article) {
            return response()->json(['message' => 'Article mal9itoch!'], 404);
        }
        $article->delete();
        return response()->json(['message' => 'L-article t-msa7 b naja7!'], 200);
    }

    public function update(Request $request, $id)
{
    $article = Article::findOrFail($id);

    // 1. Validation
    $request->validate([
        'nom' => 'required|string|max:255',
        'prix' => 'required|numeric',
        'client_id' => 'required|exists:clients,id',
    ]);

    // 2. Update dyal l-ma3loumat l-asasiya
    $article->nom = $request->nom;
    $article->prix = $request->prix;
    $article->client_id = $request->client_id;

    // 3. Gestion dyal les variantes o t-sawer dyalhom
    if ($request->has('variantes')) {
        // Parse l-JSON li jay men React
        $variantes = json_decode($request->variantes, true);

        // Loop 3la les variantes bach n-choufou wach fihom t-swira jdiida
        foreach ($variantes as $index => $v) {
            $inputName = "image_variante_" . $index; // Dak l-key li derna f React

            if ($request->hasFile($inputName)) {
                // Ila kant t-swira jdiida, n-storiwha o n-update-iw l-path
                $path = $request->file($inputName)->store('articles', 'public');
                $variantes[$index]['image_url'] = $path;
            }
            // Ila ma-kantch t-swira jdiida, ghadi i-b9a l-image_url l-9dim li siftna f JSON
        }
        
        $article->variantes = $variantes;
    }

    $article->save();

    return response()->json([
        'message' => 'Article modifié avec succès ✨',
        'article' => $article->load('client')
    ], 200);
}
    public function show($id)
{
    try {
        // T-akdi blli l-model smiytou Article
        $article = Article::with('client')->find($id);

        if (!$article) {
            return response()->json(['message' => 'Article introuvable'], 404);
        }

        return response()->json($article);
    } catch (\Exception $e) {
        // Had l-ligne kat-khllik t-choufi l-khta2 f l-Response dyal network
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
}