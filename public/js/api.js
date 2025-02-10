const API_BASE = "/api";

async function fetchData(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return [];
    }
}

async function postData(endpoint, body) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro: ${errorData.error || response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao enviar dados:", error);
        alert("Erro ao enviar dados. Verifique o console para mais detalhes.");
    }
}

async function putData(endpoint, body) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(`Erro: ${errorData.error || response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao atualizar dados:", error);
        alert("Erro ao atualizar dados. Verifique o console para mais detalhes.");
    }
}

async function deleteData(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(`Erro: ${errorData.error || response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao deletar dados:", error);
        alert("Erro ao deletar dados. Verifique o console para mais detalhes.");
    }
}
