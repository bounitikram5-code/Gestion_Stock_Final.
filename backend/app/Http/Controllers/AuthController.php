<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Identifiants incorrects'], 401);
        }

        if (!$user->is_active) {
            return response()->json(['error' => 'Compte désactivé'], 403);
        }

        $token = $user->createToken('isag-stock-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'        => $user->id,
                'name'      => $user->name,
                'email'     => $user->email,
                'role'      => $user->role,
                'is_active' => $user->is_active,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function listAdmins(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['error' => 'Accès refusé'], 403);
        }
        return response()->json(
            User::select('id','name','email','role','is_active','created_at')
                ->orderBy('created_at','desc')->get()
        );
    }

    public function createAdmin(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['error' => 'Accès refusé'], 403);
        }
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'role'     => 'required|in:admin,manager',
        ]);
        $user = User::create([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
            'role'      => $validated['role'],
            'is_active' => true,
        ]);
        return response()->json(['message' => 'Créé', 'user' => $user], 201);
    }

    public function toggleActive(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['error' => 'Accès refusé'], 403);
        }
        $user = User::findOrFail($id);
        if ($user->id === $request->user()->id) {
            return response()->json(['error' => 'Impossible de modifier votre propre compte'], 400);
        }
        $user->is_active = !$user->is_active;
        $user->save();
        return response()->json(['is_active' => $user->is_active]);
    }

    public function deleteAdmin(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['error' => 'Accès refusé'], 403);
        }
        $user = User::findOrFail($id);
        if ($user->id === $request->user()->id) {
            return response()->json(['error' => 'Impossible de supprimer votre propre compte'], 400);
        }
        $user->tokens()->delete();
        $user->delete();
        return response()->json(['message' => 'Supprimé']);
    }

    public function resetPassword(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['error' => 'Accès refusé'], 403);
        }
        $request->validate(['password' => 'required|min:8']);
        $user = User::findOrFail($id);
        $user->password = Hash::make($request->password);
        $user->save();
        return response()->json(['message' => 'Mot de passe réinitialisé']);
    }
    // Zid had static method f AuthController
public static function log($action, $description = null, $modelType = null, $modelId = null)
{
    $user = auth('sanctum')->user();
    \DB::table('activity_logs')->insert([
        'user_id'    => $user?->id,
        'user_name'  => $user?->name ?? 'Système',
        'action'     => $action,
        'model_type' => $modelType,
        'model_id'   => $modelId,
        'description'=> $description,
        'created_at' => now(),
    ]);
}
}