fetch('../Pagina_principala/index.html')
  .then(response => response.text())
  .then(html => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv);
  })
  .catch(error => {
    console.error("Error loading footer:", error);
  });