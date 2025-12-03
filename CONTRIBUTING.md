## Como contribuir

Este guia detalhado irá ensiná-lo a contribuir para o projeto `mxs2/stefanini-challenge` no GitHub, abordando desde a criação de um "fork" até o envio de um "pull request" para a branch `develop`, utilizando as boas práticas de "Conventional Commits".

### Passo 1: Criando um "Fork" do Repositório

A primeira etapa para contribuir com um projeto no qual você não tem permissão de escrita direta é criar um "fork". Um fork é uma cópia pessoal do repositório original que fica sob o seu controle no GitHub.

1.  **Acesse o Repositório:** Navegue até a página do repositório que deseja contribuir: [https://github.com/mxs2/stefanini-challenge](https://github.com/mxs2/stefanini-challenge).

2.  **Crie o Fork:** No canto superior direito da página, clique no botão "Fork". O GitHub criará uma cópia do repositório em sua conta.

### Passo 2: Clonando o seu Fork e Configurando os Remotes

Agora que você tem uma cópia do projeto, precisa trazê-la para o seu ambiente de desenvolvimento local.

1.  **Clone o seu Fork:** Na página do seu fork (ex: `https://github.com/seu-usuario/stefanini-challenge`), clique no botão verde "Code" e copie a URL (HTTPS ou SSH). Em seu terminal, execute o seguinte comando, substituindo `sua-url-do-fork` pela URL copiada:

    ```bash
    git clone sua-url-do-fork
    ```

2.  **Navegue para o Diretório:** Entre na pasta do projeto que você acabou de clonar:

    ```bash
    cd stefanini-challenge
    ```

#### Entendendo `origin` e `upstream` com `set-url`

Ao clonar o seu fork, o Git automaticamente configura um "remote" chamado `origin`, que aponta para o seu repositório forkado no GitHub. Para manter seu fork atualizado com o projeto original e para enviar suas contribuições de volta, você precisa configurar um segundo remote, convencionalmente chamado de `upstream`, que aponta para o repositório original.

  * **`origin`**: Refere-se ao seu fork. É para onde você enviará suas alterações pessoais.
  * **`upstream`**: Refere-se ao repositório original do qual você criou o fork. É de onde você buscará as atualizações.

**Configurando o `upstream`:**
Execute o seguinte comando para adicionar o repositório original como um remote chamado `upstream`:

```bash
git remote add upstream https://github.com/mxs2/stefanini-challenge.git
```

**Verificando os Remotes:**
Para confirmar que os remotes foram configurados corretamente, utilize o comando:

```bash
git remote -v
```

A saída deverá ser semelhante a esta:

```
origin  https://github.com/seu-usuario/stefanini-challenge.git (fetch)
origin  https://github.com/seu-usuario/stefanini-challenge.git (push)
upstream        https://github.com/mxs2/stefanini-challenge.git (fetch)
upstream        https://github.com/mxs2/stefanini-challenge.git (push)
```

O comando `git remote set-url` é útil para *alterar* a URL de um remote existente. Por exemplo, se você clonou o repositório original e depois fez um fork, você pode alterar o `origin` para apontar para o seu fork da seguinte maneira:

```bash
git remote set-url origin https://github.com/seu-usuario/stefanini-challenge.git
```

### Passo 3: Criando uma Nova Branch para suas Alterações

É uma boa prática criar uma nova branch para cada nova funcionalidade ou correção. Isso mantém o histórico do projeto organizado.

1.  **Sincronize com o `upstream`:** Antes de criar sua branch, garanta que seu repositório local está atualizado com as últimas alterações do projeto original.

    ```bash
    git fetch upstream
    git checkout develop
    git merge upstream/develop
    ```

2.  **Crie e Mude para a Nova Branch:** Crie uma nova branch a partir da `develop` e mude para ela. Escolha um nome descritivo para a sua branch.

    ```bash
    git checkout -b nome-da-sua-branch
    ```

### Passo 4: Fazendo as Alterações e Commits com Conventional Commits

Com a sua nova branch criada, você pode começar a fazer as alterações no código. Após modificar os arquivos, você precisará "commitar" essas mudanças. O projeto `stefanini-challenge` exige o uso de **Conventional Commits**, um padrão que torna o histórico de commits mais legível e fácil de automatizar.

A estrutura de um commit convencional é:

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé opcional]
```

**Tipos Comuns de Commits:**

  * **`feat`**: Para novas funcionalidades.
  * **`fix`**: Para correções de bugs.
  * **`docs`**: Para alterações na documentação.
  * **`style`**: Para alterações de formatação de código que não afetam a lógica.
  * **`refactor`**: Para refatorações de código que não corrigem um bug nem adicionam uma funcionalidade.
  * **`test`**: Para adição ou modificação de testes.
  * **`chore`**: Para atualizações de tarefas de build, configuração, etc.

**Exemplo de Commit:**

Suponha que você adicionou uma nova funcionalidade de login. Seu commit poderia ser:

```bash
git add .
git commit -m "feat(auth): adiciona funcionalidade de login com email e senha"
```

### Passo 5: Enviando suas Alterações para o seu Fork (`origin`)

Após realizar os commits, envie a sua branch para o seu repositório forkado no GitHub:

```bash
git push origin nome-da-sua-branch
```

### Passo 6: Criando o Pull Request (PR)

Com a sua branch no seu fork, você pode agora criar um Pull Request para solicitar que suas alterações sejam incorporadas ao repositório original.

1.  **Acesse o seu Fork no GitHub:** Vá para a página do seu fork no GitHub (`https://github.com/seu-usuario/stefanini-challenge`).

2.  **Inicie o Pull Request:** O GitHub geralmente exibirá uma notificação para criar um Pull Request a partir da sua branch recém-enviada. Clique em "Compare & pull request". Se a notificação não aparecer, vá para a aba "Pull requests" e clique em "New pull request".

3.  **Selecione as Branches Corretas:**

      * **Base repository:** `mxs2/stefanini-challenge`
      * **Base branch:** `develop`
      * **Head repository:** `seu-usuario/stefanini-challenge`
      * **Compare branch:** `nome-da-sua-branch`

4.  **Descreva o seu Pull Request:**

      * Dê um título claro e conciso ao seu PR.
      * Na descrição, detalhe as alterações que você fez, o motivo e qualquer outra informação relevante que possa ajudar os mantenedores do projeto a revisar seu código.

5.  **Envie o Pull Request:** Clique em "Create pull request".

Pronto\! Você criou com sucesso um fork, fez suas alterações seguindo as convenções de commit e enviou um pull request para a branch `develop` do projeto `stefanini-challenge`. Agora, os mantenedores do projeto revisarão suas alterações e, se estiver tudo certo, as incorporarão ao projeto.
