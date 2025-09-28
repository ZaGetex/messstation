# Logo Konfiguration

## Logo austauschen

Das Logo kann einfach ausgetauscht werden, indem Sie die Datei `public/logo.svg` ersetzen.

### Unterstützte Formate:
- SVG (empfohlen für beste Skalierbarkeit)
- PNG
- JPG/JPEG
- WebP

### Logo-Größe ändern

Die Logo-Größe kann in der Datei `src/app/layout.tsx` angepasst werden:

```tsx
<Logo width={50} height={50} />
```

### Logo-Pfad ändern

Falls Sie einen anderen Dateinamen verwenden möchten, können Sie den Pfad in der Logo-Komponente ändern:

```tsx
<Logo 
  src="/ihr-logo.svg" 
  width={60} 
  height={60} 
/>
```

### Logo-Komponente erweitern

Die Logo-Komponente (`src/components/Logo.tsx`) unterstützt folgende Props:
- `src`: Pfad zum Logo (Standard: "/logo.svg")
- `alt`: Alt-Text für Barrierefreiheit
- `width`: Breite in Pixeln
- `height`: Höhe in Pixeln
- `className`: Zusätzliche CSS-Klassen

### Fallback-Logo

Falls das Logo nicht geladen werden kann, wird automatisch ein Fallback-Logo mit den Initialen "MS" angezeigt.
