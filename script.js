// Catálogo dos produtos
const produtos = [
    { id: 1, nome: "KIT REPARO", precoSem: 10000, precoCom: 7000 },
    { id: 2, nome: "CHAVE INGLESA", precoSem: 3000, precoCom: 2000 },
    { id: 3, nome: "PNEU", precoSem: 5000, precoCom: 3000 },
    { id: 4, nome: "RASTREADOR", precoSem: 10000, precoCom: 7000 },
    { id: 5, nome: "KIT DRIFT", precoSem: 10000, precoCom: 7000 },
    { id: 6, nome: "REMOÇÃO DE TUNING", precoSem: 60000, precoCom: 40000 }
];

// Mapeamento das quantidades no carrinho
let carrinho = {};

// Função para formatar valores no padrão brasileiro de milhares (Ex: 40000 -> 40.000)
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR');
}

// Renderiza a lista de produtos na interface
function renderizarProdutos() {
    const container = document.getElementById('listaProdutos');
    container.innerHTML = '';

    produtos.forEach(prod => {
        const itemHtml = `
            <div class="item-produto">
                <div class="botoes-acao">
                    <button class="btn btn-add" onclick="alterarQuantidade(${prod.id}, 1)">+</button>
                    <button class="btn btn-remove" onclick="alterarQuantidade(${prod.id}, -1)">-</button>
                </div>
                <div class="info-produto">
                    <div class="nome-produto">${prod.nome}</div>
                    <div class="precos">
                        S/: ${formatarMoeda(prod.precoSem)} | C/: ${formatarMoeda(prod.precoCom)}
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += itemHtml;
    });
}

// Altera a quantidade do produto no carrinho
function alterarQuantidade(idProduto, mudanca) {
    const qtdAtual = carrinho[idProduto] || 0;
    const novaQtd = qtdAtual + mudanca;

    if (novaQtd > 0) {
        carrinho[idProduto] = novaQtd;
    } else {
        delete carrinho[idProduto];
    }

    atualizarTela();
}

// Reseta todo o sistema para uma nova venda
function resetarSistema() {
    carrinho = {};
    document.getElementById('chkParceria').checked = false;
    atualizarTela();
}

// Atualiza a interface e recalcula os totais em tempo real
function atualizarTela() {
    const temParceria = document.getElementById('chkParceria').checked;
    const statusTexto = document.getElementById('statusParceria');
    
    // Atualiza o texto do status da parceria
    statusTexto.textContent = temParceria ? "Ativado" : "Desativado";
    statusTexto.style.color = temParceria ? "#00a650" : "#aaa";

    const corpoTabela = document.getElementById('corpoTabelaCarrinho');
    corpoTabela.innerHTML = '';

    let totalGeral = 0;

    // Atualiza a tabela do carrinho
    for (const [idStr, qtd] of Object.entries(carrinho)) {
        const id = parseInt(idStr);
        const produto = produtos.find(p => p.id === id);
        
        const precoUnitario = temParceria ? produto.precoCom : produto.precoSem;
        const subtotal = precoUnitario * qtd;
        totalGeral += subtotal;

        const linha = `
            <tr>
                <td>${qtd}x</td>
                <td>${produto.nome}</td>
                <td>${formatarMoeda(precoUnitario)}</td>
                <td>${formatarMoeda(subtotal)}</td>
            </tr>
        `;
        corpoTabela.innerHTML += linha;
    }

    // Cálculo do valor do painel (40% do total)
    const valorDepositoPainel = totalGeral * 0.40;

    // Atualiza os valores na tela
    document.getElementById('valorTotal').textContent = formatarMoeda(totalGeral);
    document.getElementById('valorPainel').textContent = formatarMoeda(valorDepositoPainel);
}

// Inicializa a aplicação
renderizarProdutos();