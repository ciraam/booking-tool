## 🎯 Objectifs du projet

L’objectif de cet outil est de fournir un système simple, efficace et centralisé permettant :

* la gestion des disponibilités en temps réel,
* un suivi des réservations et la possibilité de les exporter,
* la réduction des erreurs et des doubles réservations,
* la facilitation du travail administratif de l’association.

Cet outil est pensé pour être utilisé par des bénévoles, des adhérents et les responsables de l’association.

---

## 🛠️ Installation du Projet

1. **Cloner le dépôt :**

```bash
git clone https://github.com/ciraam/booking-tool.git
```

2. **Installer les dépendances :**

```bash
npm install
```

3. **Configurer MySQL via WampServer (oui je suis chiant 😂):**

   * Lancez WampServer
   * Ouvrez **phpMyAdmin**
   * Créez une base de données (exemple : `bookify`)

4. **Configurer Prisma :**
    Si nom de bd autre que `bookify`, modifiez le fichier `.env` à la racine :
> Le fichier `.env` a été laissé volontairement à la racine pour le bon fonctionnement du projet, il ne sera évidemment pas le même en prod

```env
DATABASE_URL="mysql://root:@localhost:3306/bookify"
```

> Adapter `root`, le mot de passe et le nom de la base selon votre configuration Wamp.

5. **Synchroniser le schéma Prisma avec MySQL :**

```bash
npx prisma migrate dev --name init
```

6. **Lancer le serveur en mode développement :**

```bash
npm run dev
```

Le projet sera disponible sur :

```
http://localhost:3000
```

---


