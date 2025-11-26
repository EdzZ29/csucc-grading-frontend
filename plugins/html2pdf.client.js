import html2pdf from "html2pdf.js";

export default (context, inject) => {
  inject("html2pdf", html2pdf);
};
