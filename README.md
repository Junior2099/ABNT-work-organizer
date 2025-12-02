# Formatador ABNT

Ferramenta web para formatar trabalhos acadêmicos seguindo as normas da ABNT (Associação Brasileira de Normas Técnicas).

![Preview](https://img.shields.io/badge/Status-Concluído-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Funcionalidades

- **Capa automática** com instituição, curso, título, autor, orientador, cidade e ano
- **Sumário clicável** gerado automaticamente com links para cada seção
- **Formatação ABNT completa:**
  - Papel A4 (210 × 297 mm)
  - Margens: 3cm (superior/esquerda) e 2cm (inferior/direita)
  - Fonte Times New Roman ou Arial, tamanho 12pt
  - Espaçamento entre linhas 1,5
  - Recuo de parágrafo 1,5cm
  - Alinhamento justificado
- **Numeração automática** das páginas
- **Exportação para PDF** direto no navegador
- **Tema claro/escuro** com animações suaves

## 🚀 Como Usar

1. Abra o arquivo `index.html` no navegador
2. Preencha as informações da capa (instituição, curso, título, etc.)
3. Cole o conteúdo do trabalho usando marcações:

```markdown
# INTRODUÇÃO
Texto da introdução...

# DESENVOLVIMENTO
## Primeira Seção
Texto da primeira seção...

## Segunda Seção
Texto da segunda seção...

# CONCLUSÃO
Texto da conclusão...

# REFERÊNCIAS
SOBRENOME, Nome. Título. Cidade: Editora, Ano.
```

4. Escolha a fonte (Times New Roman ou Arial)
5. Marque as opções desejadas (Capa e Sumário)
6. Clique em **"Gerar PDF ABNT"**
7. Aguarde a animação e o PDF será baixado automaticamente

## 📁 Estrutura de Arquivos

```
formatador-abnt/
├── index.html    # Página principal
├── style.css     # Estilos e temas
├── script.js     # Lógica de geração do PDF
└── README.md     # Documentação
```

## 🎨 Temas

O site possui dois temas disponíveis:

- **Tema Escuro** (padrão): Fundo escuro com acentos em laranja
- **Tema Claro**: Fundo claro com cards brancos

Clique no botão 🌙/☀️ no canto superior direito para alternar. O tema escolhido é salvo automaticamente.

## 📝 Marcações Suportadas

| Marcação | Resultado |
|----------|-----------|
| `# Título` | Seção principal (negrito, MAIÚSCULAS) |
| `## Subtítulo` | Subseção (itálico, MAIÚSCULAS) |
| Texto normal | Parágrafo com recuo de 1,5cm |

## 🛠️ Tecnologias

- HTML5
- CSS3 (variáveis CSS, animações, flexbox, grid)
- JavaScript (ES6+)
- [jsPDF](https://github.com/parallax/jsPDF) - Geração de PDF no navegador

## 📐 Normas ABNT Aplicadas

| Elemento | Especificação |
|----------|---------------|
| Papel | A4 (210 × 297 mm) |
| Margem superior | 3 cm |
| Margem inferior | 2 cm |
| Margem esquerda | 3 cm |
| Margem direita | 2 cm |
| Fonte | Times New Roman ou Arial |
| Tamanho da fonte | 12pt |
| Espaçamento | 1,5 entre linhas |
| Recuo de parágrafo | 1,5 cm |
| Alinhamento | Justificado |
| Numeração | Canto superior direito |

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

Desenvolvido com ❤️ para facilitar a vida de estudantes e pesquisadores.

