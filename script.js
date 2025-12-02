const ABNT = {
    pageWidth: 210,
    pageHeight: 297,
    marginTop: 30,
    marginBottom: 20,
    marginLeft: 30,
    marginRight: 20,
    fontSize: 12,
    lineHeight: 1.5,
    paragraphIndent: 15,
    get contentWidth() {
        return this.pageWidth - this.marginLeft - this.marginRight;
    },
    get contentHeight() {
        return this.pageHeight - this.marginTop - this.marginBottom;
    }
};

const btnGerar = document.getElementById('btnGerar');
const processingOverlay = document.getElementById('processingOverlay');
const btnTema = document.getElementById('btnTema');

btnGerar.addEventListener('click', iniciarProcessamento);
btnTema.addEventListener('click', alternarTema);

function alternarTema() {
    const body = document.body;
    const icone = btnTema.querySelector('.tema-icone');
    
    body.classList.add('tema-transicao');
    body.classList.toggle('tema-claro');
    
    if (body.classList.contains('tema-claro')) {
        icone.textContent = '☀️';
        localStorage.setItem('tema', 'claro');
    } else {
        icone.textContent = '🌙';
        localStorage.setItem('tema', 'escuro');
    }
    
    setTimeout(() => {
        body.classList.remove('tema-transicao');
    }, 500);
}

function carregarTema() {
    const temaSalvo = localStorage.getItem('tema');
    const icone = btnTema.querySelector('.tema-icone');
    
    if (temaSalvo === 'claro') {
        document.body.classList.add('tema-claro');
        icone.textContent = '☀️';
    } else {
        icone.textContent = '🌙';
    }
}

carregarTema();

async function iniciarProcessamento() {
    const dados = coletarDados();
    
    if (!validarDados(dados)) {
        return;
    }
    
    processingOverlay.classList.add('active');
    await executarAnimacaoPassos();
    await gerarPDF(dados);
    
    setTimeout(() => {
        processingOverlay.classList.remove('active');
        resetarAnimacao();
    }, 500);
}

function coletarDados() {
    return {
        instituicao: document.getElementById('instituicao').value.trim().toUpperCase(),
        curso: document.getElementById('curso').value.trim().toUpperCase(),
        titulo: document.getElementById('titulo').value.trim().toUpperCase(),
        autor: document.getElementById('autor').value.trim().toUpperCase(),
        orientador: document.getElementById('orientador').value.trim(),
        cidade: document.getElementById('cidade').value.trim(),
        ano: document.getElementById('ano').value.trim() || new Date().getFullYear().toString(),
        conteudo: document.getElementById('conteudo').value.trim(),
        fonte: document.querySelector('input[name="fonte"]:checked').value,
        incluirCapa: document.getElementById('incluirCapa').checked,
        incluirSumario: document.getElementById('incluirSumario').checked
    };
}

function validarDados(dados) {
    if (!dados.titulo) {
        alert('Por favor, preencha o título do trabalho.');
        return false;
    }
    if (!dados.conteudo) {
        alert('Por favor, cole o conteúdo do trabalho.');
        return false;
    }
    return true;
}

async function executarAnimacaoPassos() {
    const steps = document.querySelectorAll('.step');
    const progressFill = document.querySelector('.progress-fill');
    
    for (let i = 0; i < steps.length; i++) {
        if (i > 0) {
            steps[i - 1].classList.remove('active');
            steps[i - 1].classList.add('completed');
        }
        
        steps[i].classList.add('active');
        progressFill.style.width = `${((i + 1) / steps.length) * 100}%`;
        await delay(800);
    }
    
    steps[steps.length - 1].classList.remove('active');
    steps[steps.length - 1].classList.add('completed');
    await delay(300);
}

function resetarAnimacao() {
    const steps = document.querySelectorAll('.step');
    const progressFill = document.querySelector('.progress-fill');
    
    steps.forEach(step => {
        step.classList.remove('active', 'completed');
    });
    progressFill.style.width = '0%';
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function gerarPDF(dados) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    const fontName = dados.fonte === 'times' ? 'times' : 'helvetica';
    const secoes = extrairSecoes(dados.conteudo);
    let sumarioItens = [];
    let paginasPreTextuais = 0;
    
    if (dados.incluirCapa) {
        gerarCapa(doc, dados, fontName);
        doc.addPage();
        paginasPreTextuais++;
    }
    
    let paginaSumarioIndex = null;
    if (dados.incluirSumario) {
        paginaSumarioIndex = doc.internal.getNumberOfPages();
        doc.addPage();
        paginasPreTextuais++;
    }
    
    const paginaInicioConteudo = doc.internal.getNumberOfPages();
    let primeiraSecao = true;
    
    for (let i = 0; i < secoes.length; i++) {
        const secao = secoes[i];
        
        if (!primeiraSecao) {
            doc.addPage();
        }
        primeiraSecao = false;
        
        const paginaPDFAtual = doc.internal.getNumberOfPages();
        const numeroExibido = paginaPDFAtual - paginasPreTextuais;
        
        if (secao.titulo) {
            sumarioItens.push({
                titulo: secao.titulo,
                paginaPDF: paginaPDFAtual,
                paginaExibida: numeroExibido,
                nivel: secao.nivel
            });
        }
        
        gerarSecao(doc, secao, fontName);
    }
    
    if (dados.incluirSumario && sumarioItens.length > 0) {
        doc.setPage(paginaSumarioIndex);
        gerarSumario(doc, sumarioItens, fontName);
    }
    
    const totalPaginas = doc.internal.getNumberOfPages();
    const paginaInicioNumeracao = paginaInicioConteudo;
    
    for (let i = paginaInicioNumeracao; i <= totalPaginas; i++) {
        doc.setPage(i);
        const numeroExibido = i - paginaInicioNumeracao + 1;
        adicionarNumeroPagina(doc, numeroExibido, fontName);
    }
    
    const nomeArquivo = dados.titulo 
        ? `${dados.titulo.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '_')}_ABNT.pdf`
        : 'trabalho_ABNT.pdf';
    
    doc.save(nomeArquivo);
}

function gerarCapa(doc, dados, fontName) {
    const centerX = ABNT.pageWidth / 2;
    
    doc.setFont(fontName, 'bold');
    doc.setFontSize(14);
    
    let y = ABNT.marginTop;
    
    if (dados.instituicao) {
        const instLinhas = doc.splitTextToSize(dados.instituicao, ABNT.contentWidth);
        doc.text(instLinhas, centerX, y, { align: 'center' });
        y += instLinhas.length * 7 + 4;
    }
    
    if (dados.curso) {
        doc.setFont(fontName, 'normal');
        const cursoLinhas = doc.splitTextToSize(dados.curso, ABNT.contentWidth);
        doc.text(cursoLinhas, centerX, y, { align: 'center' });
    }
    
    if (dados.autor) {
        doc.setFont(fontName, 'normal');
        doc.setFontSize(12);
        doc.text(dados.autor, centerX, y + 60, { align: 'center' });
    }
    
    doc.setFont(fontName, 'bold');
    doc.setFontSize(14);
    const tituloY = ABNT.pageHeight / 2;
    
    const tituloLinhas = doc.splitTextToSize(dados.titulo, ABNT.contentWidth);
    doc.text(tituloLinhas, centerX, tituloY, { align: 'center' });
    
    if (dados.orientador) {
        doc.setFont(fontName, 'normal');
        doc.setFontSize(12);
        doc.text(`Orientador: ${dados.orientador}`, centerX, tituloY + 40, { align: 'center' });
    }
    
    doc.setFont(fontName, 'normal');
    doc.setFontSize(12);
    const rodapeY = ABNT.pageHeight - ABNT.marginBottom - 20;
    
    if (dados.cidade) {
        doc.text(dados.cidade.toUpperCase(), centerX, rodapeY, { align: 'center' });
    }
    doc.text(dados.ano, centerX, rodapeY + 8, { align: 'center' });
}

function gerarSumario(doc, itens, fontName) {
    const centerX = ABNT.pageWidth / 2;
    const lineHeight = 10;
    
    doc.setFont(fontName, 'bold');
    doc.setFontSize(14);
    doc.text('SUMÁRIO', centerX, ABNT.marginTop, { align: 'center' });
    
    doc.setFont(fontName, 'normal');
    doc.setFontSize(12);
    
    let y = ABNT.marginTop + 20;
    let contadorSecao = 0;
    
    itens.forEach((item) => {
        const indent = item.nivel === 2 ? 10 : 0;
        
        if (item.nivel === 1) {
            contadorSecao++;
        }
        
        const numeracao = item.nivel === 1 ? `${contadorSecao}` : '';
        const textoTitulo = numeracao ? `${numeracao} ${item.titulo}` : item.titulo;
        const maxTituloWidth = ABNT.contentWidth - 30;
        const tituloLinhas = doc.splitTextToSize(textoTitulo, maxTituloWidth);
        const tituloExibido = tituloLinhas[0] + (tituloLinhas.length > 1 ? '...' : '');
        const xTexto = ABNT.marginLeft + indent;
        
        doc.setTextColor(0, 0, 0);
        doc.text(tituloExibido, xTexto, y);
        
        const paginaStr = item.paginaExibida.toString();
        doc.text(paginaStr, ABNT.pageWidth - ABNT.marginRight, y, { align: 'right' });
        
        const textoWidth = doc.getTextWidth(tituloExibido);
        const paginaWidth = doc.getTextWidth(paginaStr);
        const pontosInicio = xTexto + textoWidth + 3;
        const pontosFim = ABNT.pageWidth - ABNT.marginRight - paginaWidth - 3;
        
        doc.setTextColor(150, 150, 150);
        let pontosX = pontosInicio;
        while (pontosX < pontosFim) {
            doc.text('.', pontosX, y);
            pontosX += 2.5;
        }
        doc.setTextColor(0, 0, 0);
        
        const linkHeight = lineHeight;
        const linkWidth = ABNT.contentWidth;
        
        doc.link(xTexto, y - lineHeight + 3, linkWidth, linkHeight, { pageNumber: item.paginaPDF });
        
        y += lineHeight;
    });
}

function extrairSecoes(conteudo) {
    const linhas = conteudo.split('\n');
    const secoes = [];
    let secaoAtual = null;
    
    linhas.forEach(linha => {
        const linhaLimpa = linha.trim();
        
        if (linhaLimpa.startsWith('# ')) {
            if (secaoAtual) {
                secoes.push(secaoAtual);
            }
            secaoAtual = {
                tipo: 'secao',
                titulo: linhaLimpa.substring(2).toUpperCase(),
                nivel: 1,
                paragrafos: []
            };
        }
        else if (linhaLimpa.startsWith('## ')) {
            if (secaoAtual) {
                secaoAtual.paragrafos.push({
                    tipo: 'subtitulo',
                    texto: linhaLimpa.substring(3).toUpperCase()
                });
            }
        }
        else if (linhaLimpa) {
            if (!secaoAtual) {
                secaoAtual = {
                    tipo: 'secao',
                    titulo: '',
                    nivel: 1,
                    paragrafos: []
                };
            }
            secaoAtual.paragrafos.push({
                tipo: 'paragrafo',
                texto: linhaLimpa
            });
        }
    });
    
    if (secaoAtual) {
        secoes.push(secaoAtual);
    }
    
    if (secoes.length === 0) {
        secoes.push({
            tipo: 'secao',
            titulo: '',
            nivel: 1,
            paragrafos: [{
                tipo: 'paragrafo',
                texto: conteudo
            }]
        });
    }
    
    return secoes;
}

function gerarSecao(doc, secao, fontName) {
    let y = ABNT.marginTop;
    const lineHeight = ABNT.fontSize * ABNT.lineHeight * 0.352778;
    
    if (secao.titulo) {
        doc.setFont(fontName, 'bold');
        doc.setFontSize(12);
        
        const tituloLinhas = doc.splitTextToSize(secao.titulo, ABNT.contentWidth);
        
        tituloLinhas.forEach((linha) => {
            if (y > ABNT.pageHeight - ABNT.marginBottom) {
                doc.addPage();
                y = ABNT.marginTop;
            }
            doc.text(linha, ABNT.marginLeft, y);
            y += lineHeight;
        });
        
        y += lineHeight;
    }
    
    doc.setFont(fontName, 'normal');
    doc.setFontSize(12);
    
    secao.paragrafos.forEach(item => {
        if (item.tipo === 'subtitulo') {
            if (y > ABNT.pageHeight - ABNT.marginBottom - lineHeight * 3) {
                doc.addPage();
                y = ABNT.marginTop;
            }
            
            y += lineHeight;
            doc.setFont(fontName, 'italic');
            doc.setFontSize(12);
            
            const subtituloLinhas = doc.splitTextToSize(item.texto, ABNT.contentWidth);
            
            subtituloLinhas.forEach((linha) => {
                if (y > ABNT.pageHeight - ABNT.marginBottom) {
                    doc.addPage();
                    y = ABNT.marginTop;
                }
                
                doc.text(linha, ABNT.marginLeft, y);
                y += lineHeight;
            });
            
            doc.setFont(fontName, 'normal');
            y += lineHeight;
        } else {
            const texto = item.texto;
            const linhas = doc.splitTextToSize(texto, ABNT.contentWidth - ABNT.paragraphIndent);
            
            linhas.forEach((linha, index) => {
                if (y > ABNT.pageHeight - ABNT.marginBottom) {
                    doc.addPage();
                    y = ABNT.marginTop;
                }
                
                const x = index === 0 ? ABNT.marginLeft + ABNT.paragraphIndent : ABNT.marginLeft;
                
                if (index < linhas.length - 1 && linhas.length > 1) {
                    doc.text(linha, x, y, { 
                        maxWidth: index === 0 ? ABNT.contentWidth - ABNT.paragraphIndent : ABNT.contentWidth,
                        align: 'justify'
                    });
                } else {
                    doc.text(linha, x, y);
                }
                
                y += lineHeight;
            });
            
            y += lineHeight * 0.5;
        }
    });
}

function adicionarNumeroPagina(doc, numero, fontName) {
    doc.setFont(fontName, 'normal');
    doc.setFontSize(10);
    doc.text(
        numero.toString(),
        ABNT.pageWidth - ABNT.marginRight,
        ABNT.marginTop - 10,
        { align: 'right' }
    );
}
