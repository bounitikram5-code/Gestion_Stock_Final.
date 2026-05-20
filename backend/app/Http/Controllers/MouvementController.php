<?php

namespace App\Http\Controllers;

use App\Models\Mouvement;
use App\Models\Article;
use App\Models\Client; // 👥 زدنا الموديل ديال الكليان هنا
use Illuminate\Http\Request;

class MouvementController extends Controller {
    public function up(): void
{
    Schema::table('mouvements', function (Blueprint $table) {
        $table->foreignId('client_id')
              ->nullable()
              ->constrained('clients')
              ->onDelete('cascade');
        $table->string('tiers')->nullable();
        $table->date('date')->nullable();
    });
}
   
    public function index() {
        // غايرجع الموفمون مع الـ article والـ client ديالو باش يبان كولشي فالجدول
        return response()->json(Mouvement::with(['article', 'client'])->latest()->get());
    }

    public function store(Request $request) {
        // 1. التثبت من وجود السلعة
        $article = Article::find($request->article_id);
        if (!$article) {
            return response()->json(['message' => 'Article introuvable!'], 404);
        }

        // 2. التثبت من وجود الكليان (حيت دابا الموفمون مرتبط بكليان محدد)
        $client = Client::find($request->client_id);
        if (!$client) {
            return response()->json(['message' => 'Client introuvable!'], 404);
        }

        // 3. إدارة الكمية ف الستوك العام ديال الـ Article
        if (str_contains($request->type, 'Sortie')) {
            if ($article->quantite < (int)$request->quantite) {
                // الميسيج بالدارجة والعربية كيطلع زوين ف الـ Alert
                return response()->json(['error' => 'الكمية غير كافية في الستوك الحالي!'], 400);
            }
            $article->quantite -= (int)$request->quantite; 
        } else {
            $article->quantite += (int)$request->quantite;
        }

        // حفظ التغيير ف الستوك
        $article->save();

        // 4. تسجيل الحركة ف الداتابيز مع ربطها بالـ client_id والـ article_id
        $mouvement = Mouvement::create([
            'article_id' => $request->article_id,
            'client_id'  => $request->client_id, // 👈 هادي هي الأهم باش يتسجل شكون الكليان
            'type'       => $request->type,
            'quantite'   => $request->quantite,
            'date'       => $request->date ?? now()->toDateString(),
            'tiers'      => $client->nom // كإجراء احتياطي يلا كنتِ مستعملة خانة tiers ف السيرفر
        ]);
        
        // غانرجعو الـ id ديال الموفمون الجديد باش الـ React يقدر يكتبو ف الـ Bon ديريكت
        return response()->json([
            'message' => 'Mouvement enregistré avec succès!',
            'id' => $mouvement->id
        ]);
    }
    public function getClientArticles($id) {
    $client = Client::with(['articles' => function($query) {
        $query->withPivot('quantite');
    }])->find($id);

    if (!$client) {
        return response()->json(['message' => 'Client introuvable'], 404);
    }

    return response()->json($client->articles);
}
}