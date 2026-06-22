<?php
namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller {

    // ── Helper: sajjel l-action
    private function log($action, $description = null, $modelId = null)
    {
        $user = auth('sanctum')->user();
        DB::table('activity_logs')->insert([
            'user_id'     => $user?->id,
            'user_name'   => $user?->name ?? 'Système',
            'action'      => $action,
            'model_type'  => 'Article',
            'model_id'    => $modelId,
            'description' => $description,
            'created_at'  => now(),
        ]);
    }

    public function index() {
        $articles = Article::with('client')->get();
        return response()->json($articles);
    }

    public function store(Request $request) {
        $validatedData = $request->validate([
            'nom'       => 'required|string|max:255',
            'categorie' => 'nullable|string',
            'quantite'  => 'required|integer',
            'prix'      => 'required|numeric',
            'client_id' => 'required|exists:clients,id',
            'images.*'  => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $paths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $paths[] = $file->store('articles', 'public');
            }
        }

        $article = new Article($validatedData);
        $article->image = $paths;
        $article->save();

        // ── Log
        $this->log('Ajout article', "Article ajouté: {$article->nom}", $article->id);

        return response()->json([
            'message' => 'Article ajouté avec succès!',
            'article' => $article->load('client')
        ], 201);
    }

    public function destroy($id) {
        $article = Article::find($id);
        if (!$article) {
            return response()->json(['message' => 'Article introuvable!'], 404);
        }
        $nom = $article->nom;
        $article->delete();

        // ── Log
        $this->log('Suppression article', "Article supprimé: {$nom}", $id);

        return response()->json(['message' => 'Article supprimé avec succès!'], 200);
    }

    public function update(Request $request, $id) {
        $article = Article::findOrFail($id);

        $request->validate([
            'nom'       => 'required|string|max:255',
            'prix'      => 'required|numeric',
            'client_id' => 'required|exists:clients,id',
        ]);

        $article->nom       = $request->nom;
        $article->prix      = $request->prix;
        $article->client_id = $request->client_id;

        if ($request->has('variantes')) {
            $variantes = json_decode($request->variantes, true);
            foreach ($variantes as $index => $v) {
                $inputName = "image_variante_" . $index;
                if ($request->hasFile($inputName)) {
                    $path = $request->file($inputName)->store('articles', 'public');
                    $variantes[$index]['image_url'] = $path;
                }
            }
            $article->variantes = $variantes;
        }

        $article->save();

        // ── Log
        $this->log('Modification article', "Article modifié: {$article->nom}", $id);

        return response()->json([
            'message' => 'Article modifié avec succès!',
            'article' => $article->load('client')
        ], 200);
    }

    public function show($id) {
        try {
            $article = Article::with('client')->find($id);
            if (!$article) {
                return response()->json(['message' => 'Article introuvable'], 404);
            }
            return response()->json($article);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
