async function loadComponent(url, elementId) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ao carregar ${url}`);
        const html = await response.text();
        document.getElementById(elementId).insertAdjacentHTML("beforeend", html);
    } catch (error) {
        console.error("Erro ao carregar componente:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent("components/forms.html", "content");
    await loadComponent("components/lists.html", "content");


    addEventListeners();

    await fetchData("/conglomerados", "listaConglomerados");
    await fetchData("/empresas", "listaEmpresas");
    await fetchData("/grupos", "listaGrupos");
    await fetchData("/artistas", "listaArtistas");
    await fetchData("/discografia", "listaDiscografia");
});

async function carregarPapeis() {
    try {
        const response = await fetch('/papeis');
        if (!response.ok) throw new Error('Erro ao carregar papéis');

        const papeis = await response.json();
        console.log("Papéis carregados:", papeis);

        const selects = [
            document.getElementById('artistaPapel'),
            document.getElementById('artistaPapelAlterar')
        ];

        selects.forEach(select => {
            if (select) {
                select.innerHTML = ''; // Limpar opções anteriores
                papeis.forEach(papel => {
                    const option = document.createElement('option');
                    option.value = papel.nome;
                    option.textContent = papel.nome;
                    select.appendChild(option);
                });
            }
        });
    } catch (error) {
        console.error('Erro ao carregar papéis:', error);
    }
}


document.addEventListener("DOMContentLoaded", carregarPapeis);


function addEventListeners() {
    const conglomeradoForm = document.getElementById("conglomeradoForm");
    if (conglomeradoForm) {
        conglomeradoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nome = document.getElementById("conglomeradoNome").value;
            await postData("/conglomerados", { nome });
            fetchData("/conglomerados", "listaConglomerados");
        });
    }

    const alterarConglomeradoForm = document.getElementById("alterarConglomeradoForm");
    if (alterarConglomeradoForm) {
        alterarConglomeradoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("conglomeradoIdAlterar").value;
            const novoNome = document.getElementById("conglomeradoNovoNome").value;


            await putData(`/conglomerados/${id}`, { novoNome });
            fetchData("/conglomerados", "listaConglomerados");
        });
    }

    const deletarConglomeradoForm = document.getElementById("deletarConglomeradoForm");
    if (deletarConglomeradoForm) {
        deletarConglomeradoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nome = document.getElementById("conglomeradoNomeDeletar").value;

            try {
                await deleteData(`/conglomerados/${nome}`);
                alert("Conglomerado deletado com sucesso!");
                fetchData("/conglomerados", "listaConglomerados");
            } catch (err) {
                console.error("Erro ao deletar conglomerado:", err);
                alert(err.message);
            }
        });
    }

    const empresaForm = document.getElementById("empresaForm");
    if (empresaForm) {
        empresaForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nome = document.getElementById("empresaNome").value;
            const valorMercado = document.getElementById("valorMercado").value;
            const conglomeradoId = document.getElementById("conglomeradoId").value;
            console.log('Dados enviados:', { nome, conglomerado_id: conglomeradoId, valor_de_mercado: valorMercado });
            await postData("/empresas", {
                nome,
                valor_de_mercado: valorMercado,
                conglomerado_id: conglomeradoId
            });

            fetchData("/empresas", "listaEmpresas");
        });
    }
    
    const alterarEmpresaForm = document.getElementById("alterarEmpresaForm");
    if (alterarEmpresaForm) {
        alterarEmpresaForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("empresaIdAlterar").value;
            const nome = document.getElementById("empresaNomeAlterar").value;
            const valorMercado = document.getElementById("empresaValorMercadoAlterar").value;
            const conglomeradoId = document.getElementById("empresaConglomeradoIdAlterar").value;
            await putData(`/empresas/${id}`, {
                nome: novoNome,
                valor_de_mercado: valorMercado,
                conglomerado_id: conglomeradoId
            });
            fetchData("/empresas", "listaEmpresas");
        });
    }

    const deletarEmpresaForm = document.getElementById("deletarEmpresaForm");
    if (deletarEmpresaForm) {
        deletarEmpresaForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nome = document.getElementById("empresaNomeDeletar").value;

            try {
                await deleteData(`/empresas/${nome}`);
                alert("Empresa deletada com sucesso!");
                fetchData("/empresas", "listaEmpresas");
            } catch (err) {
                console.error("Erro ao deletar empresa:", err);
                alert(err.message);
            }
        });
    }

    const grupoForm = document.getElementById("grupoForm");
    if (grupoForm) {
        grupoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nome = document.getElementById("grupoNome").value;
            const disbanded = (document.getElementById("grupoDisbanded").value || "false") === "true";
            const debute = document.getElementById("grupoDebute").value || null;
            const idEmpresa = parseInt(document.getElementById("grupoEmpresaId").value);

            if (isNaN(idEmpresa)) {
                alert("O ID da empresa deve ser um número válido!");
                return;
            }

            await postData("/grupos", {
                nome,
                disbanded,
                debute,
                id_empresa: idEmpresa,
            });

            fetchData("/grupos", "listaGrupos");
        });
    }

    const alterarGrupoForm = document.getElementById("alterarGrupoForm");
    if (alterarGrupoForm) {
        alterarGrupoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("grupoIdAlterar").value;
            const nome = document.getElementById("grupoNomeAlterar").value;
            const disbanded = (document.getElementById("grupoDisbandedAlterar").value || "false") === "true";
            const debute = document.getElementById("grupoDebuteAlterar").value || null;
            const idEmpresa = parseInt(document.getElementById("grupoEmpresaIdAlterar").value);

            if (isNaN(idEmpresa)) {
                alert("O ID da empresa deve ser um número válido!");
                return;
            }

            await putData(`/grupos/${id}`, {
                nome,
                disbanded,
                debute,
                id_empresa: idEmpresa,
            });

            fetchData("/grupos", "listaGrupos");
        });
    }

    const deletarGrupoForm = document.getElementById("deletarGrupoForm");
    if (deletarGrupoForm) {
        deletarGrupoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nome = document.getElementById("grupoNomeDeletar").value;

            try {
                await deleteData(`/grupos/${nome}`);
                alert("Grupo deletado com sucesso!");
                fetchData("/grupos", "listaGrupos");
            } catch (err) {
                console.error("Erro ao deletar grupo:", err);
                alert(err.message);
            }
        });
    }

    const artistaForm = document.getElementById("artistaForm");
    if (artistaForm) {
        artistaForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nome = document.getElementById("artistaNome").value;
            const ativo = (document.getElementById("artistaAtivo").value || "false") === "true";
            const mesesTreino = document.getElementById("artistaMesesTreino").value;
            const papel = document.getElementById("artistaPapel").value;
            const debute = document.getElementById("artistaDebute").value || null;
            const idGrupo = parseInt(document.getElementById("artistaGrupoId").value);

            if (isNaN(idGrupo)) {
                alert("O ID do grupo deve ser um número válido!");
                return;
            }

            await postData("/artistas", {
                nome,
                ativo,
                meses_treino: mesesTreino,
                papel,
                debute,
                id_grupo: idGrupo,
            });

            fetchData("/artistas", "listaArtistas");
        });
    }

    const alterarArtistaForm = document.getElementById("alterarArtistaForm");
    if (alterarArtistaForm) {
        alterarArtistaForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("artistaIdAlterar").value;
            const nome = document.getElementById("artistaNomeAlterar").value;
            const ativo = (document.getElementById("artistaAtivoAlterar").value || "false") === "true";
            const mesesTreino = document.getElementById("artistaMesesTreinoAlterar").value;
            const papel = document.getElementById("artistaPapelAlterar").value;
            const debute = document.getElementById("artistaDebuteAlterar").value || null;
            const idGrupo = parseInt(document.getElementById("artistaGrupoIdAlterar").value);

            if (isNaN(idGrupo)) {
                alert("O ID do grupo deve ser um número válido!");
                return;
            }

            await putData(`/artistas/${id}`, {
                nome,
                ativo,
                meses_treino: mesesTreino,
                papel,
                debute,
                id_grupo: idGrupo,
            });

            fetchData("/artistas", "listaArtistas");
        });
    }

    const deletarArtistaForm = document.getElementById("deletarArtistaForm");
    if (deletarArtistaForm) {
        deletarArtistaForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nome = document.getElementById("artistaNomeDeletar").value;

            try {
                await deleteData(`/artistas/${nome}`);
                alert("Artista deletado com sucesso!");
                fetchData("/artistas", "listaArtistas");
            } catch (err) {
                console.error("Erro ao deletar artista:", err);
                alert(err.message);
            }
        });
    }

    const discoForm = document.getElementById("discoForm");
    if (discoForm) {
        console.log("discoForm encontrado");
        discoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nome = document.getElementById("discoNome").value;
            const compositores = document.getElementById("discoCompositores").value || null;
            const lancamento = document.getElementById("discoLancamento").value;
            console.log("Dados do disco:", { nome, compositores, lancamento });
            await postData("/discografia", { nome, compositores, lancamento });
            fetchData("/discografia", "listaDiscografia");
        });
    } else {
        console.log("discoForm não encontrado");
    }

    const alterarDiscoForm = document.getElementById("alterarDiscoForm");
    if (alterarDiscoForm) {
        alterarDiscoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("discoIdAlterar").value;
            const novoNome = document.getElementById("discoNomeAlterar").value || null;
            const compositores = document.getElementById("discoCompositoresAlterar").value || null;
            const lancamento = document.getElementById("discoLancamentoAlterar").value || null;

            await putData(`/discografia/${id}`, { novoNome, compositores, lancamento });
            fetchData("/discografia", "listaDiscografia");
        });
    }

    const deletarDiscoForm = document.getElementById("deletarDiscoForm");
    if (deletarDiscoForm) {
        deletarDiscoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("discoIdDeletar").value;

            try {
                await deleteData(`/discografia/${id}`);
                alert("Disco deletado com sucesso!");
                fetchData("/discografia", "listaDiscografia");
            } catch (err) {
                console.error("Erro ao deletar disco:", err);
                alert(err.message);
            }
        });
    }
}
