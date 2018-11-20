const modal = document.getElementById('myModal');

function modalShow () {
    modal.style.display = "block";
}

function closeSpan() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
