// ===============================
// Configurações (edite aqui)
// ===============================

// Coloque o WhatsApp com DDI + DDD + número (somente dígitos).
// Ex.: "5534999999999"
const WHATSAPP_NUMBER = "5534984333982";

// Coloque um e-mail profissional (se tiver).
// Ex.: "contato@seudominio.com"
const EMAIL_ADDRESS = "torbitonimaristela@gmail.com";

const PROFESSIONAL_NAME = "Maristela Torbitoni";
const CITY = "Uberlândia-MG";

// ===============================
// Helpers
// ===============================
function qs(sel) { return document.querySelector(sel); }

function buildWhatsMessage({ nome, idade, modalidade, mensagem }) {
  const hasNome = !!(nome && nome.trim());
  const hasIdade = !!(idade && idade.trim());
  const hasMsg = !!(mensagem && mensagem.trim());

  // Modalidade: ignorar placeholder
  const mod = (modalidade || "").trim();
  const hasModalidade = !!mod && mod !== "Escolha a modalidade";

  // Se nada importante foi preenchido, manda um texto “padrão” bom
  if (!hasNome && !hasIdade && !hasModalidade && !hasMsg) {
    return [
      `Olá, ${PROFESSIONAL_NAME}!`,
      `Gostaria de informações sobre atendimento psicopedagógico em ${CITY}.`,
      `Poderia me orientar sobre valores, disponibilidade e como funciona a primeira conversa?`,
      `Obrigado(a)!`
    ].join(" ");
  }

  // Se tiver alguma info, monta de forma natural e sem campos vazios
  const parts = [];
  parts.push(`Olá, ${PROFESSIONAL_NAME}!`);

  if (hasNome) parts.push(`Sou ${nome.trim()} e gostaria de informações sobre atendimento psicopedagógico.`);
  else parts.push(`Gostaria de informações sobre atendimento psicopedagógico.`);

  const details = [];
  if (hasIdade) details.push(`idade da criança: ${idade.trim()}`);
  if (hasModalidade) details.push(`preferência: ${mod}`);
  if (details.length) parts.push(`(${details.join(" • ")}).`);

  if (hasMsg) parts.push(`Mensagem: ${mensagem.trim()}`);

  parts.push(`Cidade: ${CITY}.`);
  parts.push(`Obrigado(a)!`);

  return parts.join(" ");
}

function openWhatsApp(text) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  const url = `${base}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener");
}

function setStatus(text) {
  const el = qs("#status");
  if (!el) return;
  el.textContent = text || "";
}

// ===============================
// Init
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Ano automático
  const year = qs("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Menu mobile
  const toggle = qs(".nav__toggle");
  const menu = qs(".nav__menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Fecha o menu ao clicar em um link
    menu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Botão WhatsApp (CTA)
  const btnWhats = qs("#btnWhats");
  if (btnWhats) {
    btnWhats.addEventListener("click", (e) => {
      e.preventDefault();
      const text = buildWhatsMessage({
        nome: "",
        idade: "",
        modalidade: "",
        mensagem: "Gostaria de saber valores, disponibilidade e como funciona a primeira conversa."
      });
      openWhatsApp(text);
    });
  }

  // Botão Email
  const btnEmail = qs("#btnEmail");
  if (btnEmail) {
    btnEmail.setAttribute("href", `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent("Contato - Psicopedagogia")}&body=${encodeURIComponent(`Olá, ${PROFESSIONAL_NAME}!\n\nGostaria de informações sobre atendimento em ${CITY}.\n\nObrigado(a)!`)}`);
  }

  // Formulário -> WhatsApp
  const form = qs("#formContato");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nome = (qs("#nome")?.value || "").trim();
      const idade = (qs("#idade")?.value || "").trim();
      const modalidade = (qs("#modalidade")?.value || "").trim();
      const mensagem = (qs("#mensagem")?.value || "").trim();

      const text = buildWhatsMessage({ nome, idade, modalidade, mensagem });

      if (!WHATSAPP_NUMBER || WHATSAPP_NUMBER === "5534999999999") {
        setStatus("⚠️ Configure seu número de WhatsApp no script.js (WHATSAPP_NUMBER).");
        return;
      }

      setStatus("Abrindo WhatsApp...");
      openWhatsApp(text);
      setTimeout(() => setStatus(""), 2500);
    });
  }
});
