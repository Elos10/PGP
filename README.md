# PGP SEMED

Sistema web para controle de necessidade de professores, matriz curricular, distribuição de aulas, equidade, movimentações e perfis de acesso.

## Acesso de demonstração

- Usuário: `admin@semed.local`
- Senha: `Admin@123`

## Firebase

1. Crie um projeto no Firebase.
2. Ative o Cloud Firestore.
3. Ative o provedor de autenticação `Anonymous` em Authentication.
4. Cadastre os secrets do GitHub listados abaixo.
5. Faça push para a branch `main`.

O arquivo `firebase-config.js` é gerado automaticamente pelo GitHub Actions durante o deploy e não deve ser versionado.

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

Configure no GitHub os secrets:

- `FIREBASE_PROJECT_ID`: ID do projeto Firebase.
- `FIREBASE_SERVICE_ACCOUNT`: JSON completo da service account do Firebase.
- `FIREBASE_API_KEY`: API key do app web Firebase.
- `FIREBASE_APP_ID`: app ID do app web Firebase.
- `FIREBASE_MESSAGING_SENDER_ID`: messaging sender ID do app web Firebase.

O workflow publica o Firebase Hosting e também as regras/indexes do Firestore.
