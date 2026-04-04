<?php
namespace App\Http\Controllers;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller {
    public function index() {
        return response()->json(\App\Models\Article::all());
    }

public function store(Request $request) {
    {
   
    $validatedData = $request->validate([
        'nom' => 'required|string|max:255', // Kan mktoub 'nom'
        'categorie'   => 'nullable|string',
        'quantite'    => 'required|integer',
        'prix'        => 'required|numeric',
        'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);
    if ($request->hasFile('image_url')) {
        // Hna k-i-t-s-ajel l-fichiers f storage/app/public/articles
        $path = $request->file('image_url')->store('articles', 'public');
        $validatedData['image_url'] = $path; 
    }

    // 2. S-ajli f l-base de données
    $article = Article::create($validatedData);

    return response()->json([
        'message' => 'Article ajouté avec succès!',
        'article' => $article
    ], 201);
}}
public function destroy($id) {
    // 1. Kan-9lbou 3la l-article f l-base de données b dak l-id
    $article = Article::find($id);

    // 2. Ila mal9inahch, kan-3tiw erreur 404 bach React i-3rafha
    if (!$article) {
        return response()->json([
            'message' => 'Article mal9itoch f l-base de données!'
        ], 404);
    }

    // 3. Ila l9inah, kan-ms7ouh
    $article->delete();

    // 4. Kan-rj3ou message dyal naja7
    return response()->json([
        'message' => 'L-article t-msa7 b naja7!'
    ], 200);
}
public function update(Request $request, $id) {
    $article = Article::find($id);

    if (!$article) {
        return response()->json(['message' => 'Article mal9itoch'], 404);
    }

    // Validation
    $validatedData = $request->validate([
        'nom'       => 'required|string|max:255',
        'categorie' => 'nullable|string',
        'quantite'  => 'required|integer',
        'prix'      => 'required|numeric',
        'image_url' => 'nullable', // Khliha haka bach t-9bal hta l-url l-9dim
    ]);

    if ($request->hasFile('image_url')) {
        $path = $request->file('image_url')->store('articles', 'public');
        $validatedData['image_url'] = $path;
    }

    $article->update($validatedData);

    return response()->json(['message' => 'Modifié avec succès!']);
}
}