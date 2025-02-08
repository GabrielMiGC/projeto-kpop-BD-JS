function updateList(elementId, data) {
    const list = document.getElementById(elementId);
    list.innerHTML = "";

    data.forEach(item => {
        const li = document.createElement("li");
        li.textContent = JSON.stringify(item);
        list.appendChild(li);
    });
}
