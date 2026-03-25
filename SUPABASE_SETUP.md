# Intégration Supabase - Migration depuis localStorage

## 🚀 Étapes d'installation

### 1. Créer les tables dans Supabase

1. Ouvrez votre dashboard Supabase: https://app.supabase.com
2. Allez dans **SQL Editor** → **New Query**
3. Copiez-collez le contenu du fichier `supabase_schema.sql`
4. Cliquez **Run** pour créer les tables et les indexes

### 2. Les tables sont maintenant actives

Après l'exécution du SQL, vous aurez:
- Table `missions` : stocke les missions complètes avec tous les stops
- Table `messages` : stocke les messages entre bureau et chauffeurs

### 3. L'app est déjà configurée ✓

Les fichiers suivants sont à jour:
- `index.html` : utilise la librairie Supabase et appelle les fonctions de sauvegarde
- `supabase_config.js` : gère la connexion et les fonctions CRUD
- `supabase_schema.sql` : définit la structure des tables

## 📝 Fonctionnement

### Au démarrage
L'app va:
1. Charger les données depuis **Supabase** (via `supabase_config.js`)
2. Si pas de données Supabase, elle utilise le **localStorage** comme fallback
3. Les deux systèmes restent synchronisés

### À chaque opération
- **✉️ Messages envoyés** → Sauvegardés dans **Supabase** + localStorage
- **✓ Mission terminée** → Sauvegardée dans **Supabase** + localStorage
- **🚛 Stop complété** → Sauvegardé dans **Supabase** + localStorage

### Avantages de cette approche
✅ Données synchronisées en temps réel  
✅ Historique centralisé au niveau Supabase  
✅ Fallback localStorage si pas de connexion  
✅ Aucune modification nécessaire à l'interface

## 🔧 Configuration personnalisée

Si vous voulez modifier les credentials Supabase:
- Ouvrez `supabase_config.js`
- Modifiez les lignes 5-6:
```javascript
const SUPABASE_URL  = 'https://...supabase.co';
const SUPABASE_ANON = 'sb_publishable_...';
```

## 📊 Requêtes SQL utiles

### Récupérer toutes les missions
```sql
SELECT * FROM missions WHERE completed = true ORDER BY dayStartTs DESC;
```

### Récupérer les messages d'aujourd'hui
```sql
SELECT * FROM messages 
WHERE ts >= EXTRACT(EPOCH FROM CURRENT_DATE) * 1000
ORDER BY ts DESC;
```

### Statistiques par chauffeur
```sql
SELECT driver, COUNT(*) as total_missions, COUNT(DISTINCT date) as working_days
FROM missions WHERE completed = true
GROUP BY driver ORDER BY total_missions DESC;
```

## 🔐 Sécurité

Les politiques Row Level Security (RLS) sont activées:
- Les données sont lisibles/modifiables par tous (anon key)
- Pour une meilleure sécurité en production, ajoutez l'authentification

## 📱 Tests

1. **Tester une mission**:
   - Démarrer une journée
   - Ajouter des stops
   - Terminer et vérifier dans Supabase SQL Editor

2. **Vérifier les données**:
   - SQL Editor → Cliquez sur la table
   - Vous devez voir vos nouvelles missions/messages

## ❓ Dépannage

### Les données ne sauvegardent pas
1. Vérifiez la console du navigateur (F12): y a-t-il des erreurs?
2. Vérifiez que les tables existent dans Supabase
3. Vérifiez que les credentials sont corrects dans `supabase_config.js`

### Les anciennes données du localStorage ne sont pas récupérées
- Elles s'affichent au démarrage si Supabase est vide
- Une fois que vous commencez à travailler, tout nouveau est dans Supabase

### Les tables n'ont pas de données
- Cela peut être normal si c'est la première utilisation
- Commencez une journée et terminez-la pour tester

---

**Questions?** Vérifiez le fichier `supabase_config.js` pour debugging.
