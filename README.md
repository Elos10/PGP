# PGP SEMED

Sistema web para controle de necessidade de professores, matriz curricular, distribuição de aulas, equidade, movimentações e perfis de acesso.

## Executar localmente

Abra `index.html` no navegador ou sirva a pasta com um servidor estático.

Credenciais de demonstração:

- Usuário: `admin@semed.local`
- Senha: `Admin@123`

## Firebase

1. Crie um projeto no Firebase.
2. Ative o Cloud Firestore.
3. Ative o provedor de autenticação `Anonymous` em Authentication.
4. Copie `firebase-config.example.js` para `firebase-config.js`.
5. Preencha os dados do app web Firebase em `firebase-config.js`.
6. Altere `enabled` para `true`.
7. Publique as regras com o Firebase CLI quando estiver autenticado.

Enquanto o Firebase não estiver habilitado, o sistema usa armazenamento local do navegador.

## GitHub

O projeto já contém `.gitignore`, README e workflow base para Firebase Hosting.

Para publicar:

```powershell
git init
git add .
git commit -m "Versao inicial do PGP SEMED"
git branch -M main
git remote add origin URL_DO_REPOSITORIO
git push -u origin main
```

## Deploy via Firebase Hosting

Configure no GitHub o secret `FIREBASE_SERVICE_ACCOUNT` com a service account do Firebase e ajuste o `projectId` no workflow.
