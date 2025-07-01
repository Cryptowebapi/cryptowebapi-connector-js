#!/bin/bash

# Bricht das Skript sofort ab, wenn ein Befehl fehlschlägt.
set -e

# --- 1. Überprüfen, ob das Git-Arbeitsverzeichnis sauber ist ---
if ! git diff-index --quiet HEAD --; then
    echo "❌ Fehler: Das Arbeitsverzeichnis ist nicht sauber. Bitte committe oder stashe deine Änderungen."
    exit 1
fi
echo "✅ Git-Arbeitsverzeichnis ist sauber."

# --- 2. Neueste Änderungen vom Remote holen ---
echo "🔄 Hole die neuesten Änderungen vom Git-Remote..."
git pull

# --- 3. Abhängigkeiten installieren ---
echo "📦 Installiere Abhängigkeiten..."
npm install

# --- 4. Tests ausführen ---
echo "🧪 Führe Tests aus..."
npm test

# --- 5. Projekt bauen ---
echo "🏗️  Baue das Projekt..."
npm run build

# --- 6. Version erhöhen ---
echo "🆙 Wähle die Art der Versionserhöhung (patch, minor, oder major):"
read -r version_type

if [[ "$version_type" != "patch" && "$version_type" != "minor" && "$version_type" != "major" ]]; then
    echo "❌ Ungültiger Versionstyp. Bitte 'patch', 'minor' oder 'major' verwenden."
    exit 1
fi

echo "Erhöhe die Version um '$version_type'..."
npm version "$version_type"

# --- 7. Überprüfen, ob bei npm angemeldet ---
echo "🔐 Überprüfe npm-Anmeldung..."
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ Du bist nicht bei npm angemeldet."
    echo "   Bitte melde dich zuerst an mit:"
    echo "   npm login"
    echo ""
    echo "   Oder falls du noch keinen npm-Account hast:"
    echo "   npm adduser"
    exit 1
fi
echo "✅ Bei npm angemeldet als: $(npm whoami)"

# --- 8. Auf npm veröffentlichen ---
echo "🚀 Veröffentliche auf npm..."
npm publish

# --- 9. Git-Commits und -Tags pushen ---
echo "⬆️  Pushe Commits und Tags zu Git..."
git push --follow-tags

echo "🎉 Veröffentlichung erfolgreich abgeschlossen!"
