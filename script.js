const urlScript = "https://script.google.com/macros/s/AKfycbx3iSrjhJ09t3cKdZyxCe7pTAmktEzSEZW7MzdsDm_4wzy12JdJjPZEkWF341t5PMlWAw/exec"

let pratoSelecionado = null;

// Carregar pratos ativos da folha "Pratos"
function carregarPratos() {
  fetch(`${urlScript}?action=getPratos`, { method: "POST" })
    .then(res => res.json())
    .then(pratos => {
      const lista = document.getElementById("listaPratos");
      lista.innerHTML = "";
      pratos
        .filter(p => p.Ativo === "Sim")
        .forEach(prato => {
          const div = document.createElement("div");
          div.classList.add("prato");
          div.innerHTML = `
            <img src="${prato.Imagem}" alt="${prato.Nome}" />
            <h4>${prato.Nome}</h4>
            <p>${prato.Descrição}</p>
          `;
          div.addEventListener("click", () => {
            document.querySelectorAll(".prato").forEach(p => p.classList.remove("selecionado"));
            div.classList.add("selecionado");
            pratoSelecionado = prato.Nome;
          });
          lista.appendChild(div);
        });
    });
}

// Submeter reserva
document.getElementById("reservaForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const data = document.getElementById("data").value;
  const obs = document.getElementById("obs").value;

  if (!pratoSelecionado) {
    alert("Por favor selecione um prato.");
    return;
  }

  const params = new URLSearchParams();
  params.append("action", "addReserva");
  params.append("nome", nome);
  params.append("data", data);
  params.append("prato", pratoSelecionado);
  params.append("observacoes", obs);

  fetch(`${urlScript}?${params.toString()}`, { method: "POST" })
    .then(() => {
      document.getElementById("mensagem").innerText = "✅ Reserva enviada com sucesso!";
      document.getElementById("reservaForm").reset();
      document.querySelectorAll(".prato").forEach(p => p.classList.remove("selecionado"));
      pratoSelecionado = null;
    });
});

carregarPratos();
