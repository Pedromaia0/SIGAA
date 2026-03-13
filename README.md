# SIGAA+

<img src="icons/icon.png" alt="Description" width="200" height="200">

Extensão para [navegadores baseados no Chromium](https://en.wikipedia.org/wiki/Chromium_(web_browser)#Browsers_based_on_Chromium) que adiciona melhorias de usabilidade ao **SIGAA**.
O objetivo é corrigir pequenas limitações da interface original e adicionar utilidades que facilitam o uso diário do sistema.

> Este projeto não possui vínculo oficial com o SIGAA ou com qualquer instituição.

---

# Funcionalidades

## Visualização do horário semanal

A extensão gera automaticamente uma **tabela de horários das aulas** baseada nas informações presentes no SIGAA.

Características:

* organiza as aulas por **dia da semana**
* mostra os **horários em formato de grade**
* permite selecionar **semanas específicas**
* apresenta uma estrutura mais legível que a interface padrão do sistema

Além disso, o horário pode ser **exportado como imagem**. Todo o processo acontece **localmente no navegador**, sem envio de dados externos.

---

## Prevenção de downloads de arquivos

Algumas páginas do SIGAA iniciam downloads automaticamente ao clicar em determinados links.

A extensão intercepta esse comportamento e impede o download automático, permitindo que o usuário:

* visualize arquivos diretamente no navegador
* evite downloads acidentais
* mantenha maior controle sobre os arquivos baixados

---

## Ocultar notas

A extensão adiciona um botão que permite **ocultar ou mostrar as notas** exibidas na página.

Isso pode ser útil em situações como:

* apresentar a tela sem expor notas
* gravar vídeos ou tirar capturas de tela
* usar o sistema em ambientes públicos

A funcionalidade aplica um **blur nas notas**, podendo ser ativada ou desativada instantaneamente.

---

# Instalação no Navegador

A extensão ainda não está publicada na Chrome Web Store.
Para instalar manualmente:

1. Baixe ou clone este repositório:

```
git clone https://github.com/Pedromaia0/SIGAA.git
```

2. Abra o Navegador e acesse:

```
chrome://extensions
```

3. Ative o **Modo do desenvolvedor** (canto superior direito).

4. Clique em **Carregar sem compactação**.

5. Selecione a pasta do projeto da extensão.

Após isso a extensão estará ativa no navegador.

---

# Contribuições

Contribuições são **bem-vindas**.

Algumas formas de contribuir:

* corrigir bugs
* melhorar a interface
* adicionar novas funcionalidades
* otimizar o código

Abra uma **issue** ou envie um **pull request**.

---

# Licença

Este projeto é distribuído sob a licença:

**GNU General Public License (GPL)**

Consulte o arquivo `LICENSE` para mais detalhes.
