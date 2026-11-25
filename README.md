# Manutenção - Regional 2 Laghetto

Todos os arquivos ficam soltos na raiz (sem pastas).

- `index.html` - portal da R2 (escolha de hotel + dashboard do Gerente) e o sistema compartilhado. Para atualizar o sistema, troque só este arquivo.
- `<hotel>.html` - endereço próprio de cada hotel (ex.: golden.html), instalável no celular.
- `manifest-<hotel>.json` e `icon-<hotel>-*.png` - nome e ícone do app de cada hotel.

Banco: Supabase "Manutencao R2" (conta manutencao2). Tabelas `r2_*` com a coluna `hotel`.

Versao do sistema: 2026-11-25.2
