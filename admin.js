const urlScript = "https://script.google.com/macros/s/AKfycbx3iSrjhJ09t3cKdZyxCe7pTAmktEzSEZW7MzdsDm_4wzy12JdJjPZEkWF341t5PMlWAw/exec"
const senhaCorreta = "admin123"; // Troca para a tua senha real

function verificarSenha() {
  const senha = document.getElementById("senha").value;
  if (senha === senhaCorreta) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("adminSection").style.display = "block";
    carregarPratos();
  } else {
    alert("Senha incorreta");
  }
}

document.getElementById("formPrato").addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const descricao = document.getElementById("descricao").value;
  const imagem = document.getElementById("imagem").value;
  const nomeOriginal = document.getElementById("nomeOriginal").value;

  const params = new URLSearchParams();
  params.append("action", nomeOriginal ? "editPrato" : "addPrato");
  params.append("nome", nome);
  params.append("descricao", descricao);
  params.append("imagem", imagem);
  if (nomeOriginal) params.append("nomeOriginal", nomeOriginal);

  fetch(`${urlScript}?${params.toString()}`, { method: "POST" })
    .then(() => {
      alert("Prato salvo com sucesso!");
      document.getElementById("formPrato").reset();
      document.getElementById("nomeOriginal").value = "";
      carregarPratos();
    });
});

function carregarPratos() {
  fetch(`${urlScript}?action=getPratos`, { method: "POST" })
    .then(res => res.json())
    .then(pratos => {
      const container = document.getElementById("listaPratos");
      container.innerHTML = "";
      pratos.forEach(prato => {
        const card = document.createElement("div");
        card.className = "prato";

        card.innerHTML = `
          <img src="${prato.Imagem}" alt="${prato.Nome}" />
          <h4>${prato.Nome}</h4>
          <p>${prato.Descrição}</p>
          <p><strong>Ativo:</strong> ${prato.Ativo}</p>
          <button onclick="editarPrato('${prato.Nome}', '${prato.Descrição}', '${prato.Imagem}')">Editar</button>
          <button onclick="alternarPrato('${prato.Nome}')">${prato.Ativo === "Sim" ? "Ocultar" : "Ativar"}</button>
        `;
        container.appendChild(card);
      });
    });
}

function editarPrato(nome, descricao, imagem) {
  document.getElementById("nome").value = nome;
  document.getElementById("descricao").value = descricao;
  document.getElementById("imagem").value = imagem;
  document.getElementById("nomeOriginal").value = nome;
}

function alternarPrato(nome) {
  const params = new URLSearchParams();
  params.append("action", "togglePrato");
  params.append("nome", nome);

  fetch(`${urlScript}?${params.toString()}`, { method: "POST" })
    .then(() => carregarPratos());
}
