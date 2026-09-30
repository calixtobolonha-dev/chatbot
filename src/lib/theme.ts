export type Theme = "dark" | "light";

export const DEFAULT_THEME: Theme = "dark";
export const THEME_STORAGE_KEY = "chatbot-gl-theme";

/*
  Script que roda no <head>, antes da página aparecer, para aplicar o tema salvo.
  Sem ele, quem escolheu o tema claro veria a tela escura piscar ao abrir.
  O try/catch cobre navegadores que bloqueiam o localStorage (ex.: janela anônima).
*/
export const THEME_INIT_SCRIPT = `
(function () {
  var theme = "${DEFAULT_THEME}";
  try {
    var saved = localStorage.getItem("${THEME_STORAGE_KEY}");
    if (saved === "light" || saved === "dark") theme = saved;
  } catch (error) {}
  document.documentElement.dataset.theme = theme;
})();
`;
