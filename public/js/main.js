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

async function atualizarListas() {
    const conglomerados = await fetchData("/api/conglomerados");
    updateList("listaConglomerados", conglomerados);

    const empresas = await fetchData("/api/empresas");
    updateList("listaEmpresas", empresas);

    const grupos = await fetchData("/api/grupos");
    updateList("listaGrupos", grupos);

    const artistas = await fetchData("/api/artistas");
    updateList("listaArtistas", artistas);

    const discografia = await fetchData("/api/discografia");
    updateList("listaDiscografia", discografia);
}


document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("components/forms.html", "content");
    await loadComponent("components/lists.html", "content");
    
    addEventListeners();
    await atualizarListas();

    setTimeout(carregarPremios, 500);
});


async function carregarPapeis() {
    try {
        const response = await fetch('/papeis');
        if (!response.ok) throw new Error('Erro ao carregar papéis');

        const papeis = await response.json();
        console.log("Papéis carregados:", papeis); // Debug


        const selects = [
            document.getElementById('artistaPapel'),
            document.getElementById('artistaPapelAlterar')
        ];

        selects.forEach(select => {
            if (select) {
                select.innerHTML = '';

                const defaultOption = document.createElement('option');
                defaultOption.value = "";
                defaultOption.textContent = "Selecione um papel";
                defaultOption.disabled = true;
                defaultOption.selected = true;
                select.appendChild(defaultOption);

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

async function carregarPremios() {
    try {
        const response = await fetch('/premios'); // Certifique-se de que esta rota está correta
        if (!response.ok) throw new Error('Erro ao carregar prêmios');

        const premios = await response.json();
        console.log("Prêmios carregados:", premios); // Verifique se os prêmios estão sendo recebidos

        const tabela = document.getElementById("tabelaPremios");

        if (!tabela) {
            console.error("Erro: Elemento tabelaPremios não encontrado no DOM!");
            return;
        }

        tabela.innerHTML = ""; 

        premios.forEach(premio => {
            const tr = document.createElement("tr");

            const tdId = document.createElement("td");
            tdId.textContent = premio.id_premio;

            const tdNome = document.createElement("td");
            tdNome.textContent = premio.nome;

            tr.appendChild(tdId);
            tr.appendChild(tdNome);
            tabela.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar prêmios:', error);
    }
}
document.addEventListener("DOMContentLoaded", carregarPremios);

function addEventListeners() {
    const conglomeradoForm = document.getElementById("conglomeradoForm");
    if (conglomeradoForm) {
        conglomeradoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nome = document.getElementById("conglomeradoNome").value;
            await postData("/conglomerados", { nome });
            await atualizarListas();
        });
    }

    const alterarConglomeradoForm = document.getElementById("alterarConglomeradoForm");
    if (alterarConglomeradoForm) {
        alterarConglomeradoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("conglomeradoIdAlterar").value;
            const novoNome = document.getElementById("conglomeradoNovoNome").value;


            await putData(`/conglomerados/${id}`, { novoNome });
            await atualizarListas();

        });
    }

    const deletarConglomeradoForm = document.getElementById("deletarConglomeradoForm");
    if (deletarConglomeradoForm) {
        deletarConglomeradoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nome = document.getElementById("conglomeradoNomeDeletar").value;

            try {
                await deleteData(`/conglomerados/${nome}`);
                await atualizarListas();
                alert("Conglomerado deletado com sucesso!");
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

            await atualizarListas();
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
            await atualizarListas();
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
                await atualizarListas();
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

            await atualizarListas();
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

            await atualizarListas();
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
                await atualizarListas();
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
            const idGrupo = parseInt(document.getElementById("artistaGrupoId").value || null);

            console.log('Dados enviados:', { nome, ativo, meses_treino: mesesTreino, papel, debute, id_grupo: idGrupo });

            await postData("/artistas", {
                nome,
                ativo,
                meses_treino: mesesTreino,
                papel,
                debute,
                id_grupo: idGrupo,
            });

            await atualizarListas();
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
            const idGrupo = parseInt(document.getElementById("artistaGrupoIdAlterar").value || null);


            await putData(`/artistas/${id}`, {
                nome,
                ativo,
                meses_treino: mesesTreino,
                papel,
                debute,
                id_grupo: idGrupo,
            });

            await atualizarListas();
        });
    }

    const deletarArtistaForm = document.getElementById("deletarArtistaForm");
    if (deletarArtistaForm) {
        deletarArtistaForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("artistaIdDeletar").value;

            if (!id) {
                alert("Por favor, insira um ID válido.");
                return;
            }

            try {
                await deleteData(`/artistas/${id}`);
                alert("Artista deletado com sucesso!");
                await atualizarListas();
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
            await atualizarListas();
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
            await atualizarListas();
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
                await atualizarListas();
            } catch (err) {
                console.error("Erro ao deletar disco:", err);
                alert(err.message);
            }
        });
    }

    document.getElementById("atribuirPremioForm").addEventListener("submit", async (e) => {
        e.preventDefault();
    
        const id_premio = document.getElementById("idPremio").value;
        const id_artista = document.getElementById("idArtista").value || null;
        const id_grupo = document.getElementById("idGrupo").value || null;
    
        try {
            if (id_artista) {
                await postData("/premios/atribuir/artista", { id_premio: parseInt(id_premio), id_artista: parseInt(id_artista) });
            }
            if (id_grupo) {
                await postData("/premios/atribuir/grupo", { id_premio: parseInt(id_premio), id_grupo: parseInt(id_grupo) });
            }
    
            alert("Prêmio atribuído com sucesso!");
            carregarPremios(); // Atualiza a lista de prêmios
        } catch (err) {
            console.error("Erro ao atribuir prêmio:", err);
            alert(err.message);
        }
        
    });
}

function executarPesquisa() {
    const tipoPesquisa = document.getElementById('tipoPesquisa').value;
    const idPesquisa = document.getElementById('idPesquisa').value;
    const resultadoPesquisa = document.getElementById('resultadoPesquisa');

    // Limpar resultados anteriores
    resultadoPesquisa.innerHTML = '';

    // Lógica para executar a pesquisa com base no tipo e ID
    if (idPesquisa) {
        switch (tipoPesquisa) {
            case 'grupo_premio':
                buscarPremiosGrupo(idPesquisa);
                break;
            case 'artista_premio':
                buscarPremiosArtista(idPesquisa);
                break;
            case 'disco_artista':
                buscarArtistasDisco(idPesquisa);
                break;
            case 'artista_papel':
                buscarPapeisArtista(idPesquisa);
                break;
            default:
                resultadoPesquisa.innerHTML = 'Tipo de pesquisa inválido.';
        }
    } else {
        resultadoPesquisa.innerHTML = 'Por favor, insira um ID válido para a pesquisa.';
    }
}

function buscarPremiosGrupo(id) {
    // Implementar lógica para buscar prêmios de um grupo
    console.log(`Buscando prêmios para o grupo com ID ${id}`);
}

function buscarPremiosArtista(id) {
    // Implementar lógica para buscar prêmios de um artista
    console.log(`Buscando prêmios para o artista com ID ${id}`);
}

function buscarArtistasDisco(disco_id) {
    "SELECT * FROM discografia_artista WHERE disco_id = $1";
    console.log(`Buscando artistas para o disco com ID ${disco_id}`);
}

function buscarPapeisArtista(nome_papel) {
    'SELECT * FROM artistas WHERE papel = $1';
    console.log(`Buscando papéis para o artista com ID ${nome_papel}`);
}
