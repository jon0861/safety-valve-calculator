/* ---------------------------------------------------
   pdf.js – Echte PDF Vorschau + Logo
--------------------------------------------------- */

function generatePDF(contentHTML, title = "PDF Export") {
    const pdfWindow = window.open("", "_blank");

    pdfWindow.document.write(`
        <html>
        <head>
            <title>${title}</title>
            <style>
                body { font-family: Arial; padding: 20px; }
                .logo { width: 160px; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #444; padding: 8px; }
                th { background: #e5e5e5; }
            </style>
        </head>
        <body>

            <img src="img/logo.svg" class="logo">

            ${contentHTML}

            <script>window.print();</script>
        </body>
        </html>
    `);

    pdfWindow.document.close();
}

window.generatePDF = generatePDF;