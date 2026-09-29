# Portfólio — Raul Ramos

Site pessoal estático (HTML, CSS e JS puro) publicado no GitHub Pages.

## Estrutura

```
index.html          conteúdo (sobre, habilidades, projetos, contato)
css/style.css       tema claro/escuro e layout responsivo
js/background.js    fundo animado de partículas (canvas)
js/main.js          troca de tema, animação de entrada, ano do rodapé
```

## Como editar

- Textos e projetos: edite `index.html`. Os pontos pendentes estão marcados com `TODO(...)`.
- Cores: variáveis no topo de `css/style.css` (`:root` e `[data-theme="light"]`).
- Animação: objeto `CONFIG` em `js/background.js` (densidade, distância das linhas, velocidade).

## Rodar localmente

```
python -m http.server 8080 --bind 127.0.0.1
```

Abra http://127.0.0.1:8080.
