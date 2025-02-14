

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
    await carregarPapeis();

    setTimeout(carregarPremios, 500);
});


async function carregarPapeis() {
    try {
        const response = await fetch('/api/papeis');
        if (!response.ok) throw new Error('Erro ao carregar papéis');

        const papeis = await response.json();
        console.log("Papéis carregados:", papeis); 


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



async function carregarPremios() {
    try {
        const response = await fetch('/api/premios'); 
        if (!response.ok) throw new Error('Erro ao carregar prêmios');

        const premios = await response.json();
        console.log("Prêmios carregados:", premios);

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
                await postData("/premios/artista", { id_premio: parseInt(id_premio), id_artista: parseInt(id_artista) });
            }
            if (id_grupo) {
                await postData("/premios/grupo", { id_premio: parseInt(id_premio), id_grupo: parseInt(id_grupo) });
            }
    
            alert("Prêmio atribuído com sucesso!");
            carregarPremios();
        } catch (err) {
            console.error("Erro ao atribuir prêmio:", err);
            alert(err.message);
        }
    });

    document.getElementById('atribuirGrupoDiscoForm').addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const id_discografia = parseInt(document.getElementById('idDiscografiaGrupo').value);
        const id_grupo = parseInt(document.getElementById('idGrupoDisco').value);
    
        if (isNaN(id_discografia) || isNaN(id_grupo)) {
            alert("IDs devem ser números inteiros.");
            return;
        }
    
        try {
            const response = await fetch('/api/pesquisas/atribuir_grupo_disco', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_discografia, id_grupo })
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Erro ao atribuir disco ao grupo");
    
            alert("Disco atribuído ao grupo com sucesso!");
        } catch (error) {
            console.error('Erro ao atribuir disco ao grupo:', error);
        }
    });
    
    document.getElementById('atribuirArtistaDiscoForm').addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const id_discografia = parseInt(document.getElementById('idDiscografiaArtista').value);
        const id_artista = parseInt(document.getElementById('idArtistaDisco').value);
    
        if (isNaN(id_discografia) || isNaN(id_artista)) {
            alert("IDs devem ser números inteiros.");
            return;
        }
    
        try {
            const response = await fetch('/api/pesquisas/atribuir_artista_disco', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_discografia, id_artista })
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Erro ao atribuir disco ao artista");
    
            alert("Disco atribuído ao artista com sucesso!");
        } catch (error) {
            console.error('Erro ao atribuir disco ao artista:', error);
        }
    });
    
    
}

async function buscarPremiosGrupo(id) {
    try {
        const response = await fetch(`/api/pesquisas/grupo_premio/${id}`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json(); 

        mostrarResultadoPesquisa(data, `Prêmios do grupo ${id}`);
    } catch (error) {
        console.error('Erro completo:', error);
        mostrarResultadoPesquisa([], `Falha na busca: ${error.message}`);
    }
}

async function buscarPremiosArtista(id) {
    try {
        const response = await fetch(`/api/pesquisas/artista_premio/${id}`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        mostrarResultadoPesquisa(data, `Prêmios do artista ${id}`);
    } catch (error) {
        console.error('Erro ao buscar prêmios do artista:', error);
    }
}

async function buscarArtistasDisco(disco_id) {
    try {
        const response = await fetch(`/api/pesquisas/disco_artista/${disco_id}`);
        if (!response.ok) throw new Error('Erro ao buscar artistas do disco');

        const data = await response.json();
        mostrarResultadoPesquisa(data, `Artistas que participaram do disco ${disco_id}`);
    } catch (error) {
        console.error('Erro ao buscar artistas do disco:', error);
    }
}

async function buscarGruposDisco(disco_id) {
    try {
        const response = await fetch(`/api/pesquisas/disco_grupo/${disco_id}`);
        if (!response.ok) throw new Error('Erro ao buscar grupos do disco');

        const data = await response.json();
        mostrarResultadoPesquisa(data, `Grupos que participaram do disco ${disco_id}`);
    } catch (error) {
        console.error('Erro ao buscar grupos do disco:', error);
    }
}

async function atribuirGrupoADisco(id_discografia, id_grupo) {
    try {
        const response = await fetch('/api/pesquisas/atribuir_grupo_disco', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_discografia, id_grupo })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Erro ao atribuir grupo ao disco");

        alert("Grupo atribuído ao disco com sucesso!");
    } catch (error) {
        console.error('Erro ao atribuir grupo ao disco:', error);
    }
}

async function atribuirArtistaADisco(id_discografia, id_artista) {
    try {
        const response = await fetch('/api/pesquisas/atribuir_artista_disco', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_discografia, id_artista })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Erro ao atribuir artista ao disco");

        alert("Artista atribuído ao disco com sucesso!");
    } catch (error) {
        console.error('Erro ao atribuir artista ao disco:', error);
    }
}

async function buscarPapeisArtista(id_artista) {
    try {
        const response = await fetch(`/api/pesquisas/artista_papel/${id_artista}`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        mostrarResultadoPesquisa(data, `Papéis do artista ${id_artista}`);
    } catch (error) {
        console.error('Erro ao buscar papéis do artista:', error);
    }
}

function mostrarResultadoPesquisa(data, titulo) {
    const resultadoPesquisa = document.getElementById('resultadoPesquisa');
    resultadoPesquisa.innerHTML = `
        <div class="resultado-header">
            <h3>${titulo}</h3>
        </div>
    `;

    if (data.length === 0) {
        resultadoPesquisa.innerHTML += `
            <div class="sem-resultados">
                Nenhum resultado encontrado
            </div>
        `;
        return;
    }

    const table = document.createElement('table');
    table.className = 'resultado-table';

    const headerRow = document.createElement('tr');
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key.replace(/_/g, ' ').toUpperCase();
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    data.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    resultadoPesquisa.appendChild(table);
}


function executarPesquisa() {
    const tipoPesquisa = document.getElementById('tipoPesquisa').value;
    const idPesquisa = document.getElementById('idPesquisa').value;
    const resultadoPesquisa = document.getElementById('resultadoPesquisa');

    resultadoPesquisa.innerHTML = '';

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
            case 'disco_grupo':
                buscarGruposDisco(idPesquisa);
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