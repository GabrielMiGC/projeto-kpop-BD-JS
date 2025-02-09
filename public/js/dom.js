function updateList(elementId, data) {
    const list = document.getElementById(elementId);
    list.innerHTML = "";

    if (Array.isArray(data)) {
        data.forEach(item => {
            const li = document.createElement("li");
            li.textContent = JSON.stringify(item);
            li.classList.add("list-item"); 
            list.appendChild(li);
        });
    } else {
        console.error(`Expected an array but got ${typeof data}`);
    }
}