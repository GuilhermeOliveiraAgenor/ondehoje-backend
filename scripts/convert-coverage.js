/* eslint-disable @typescript-eslint/no-var-requires */
const puppeteer = require('puppeteer')
const { PDFDocument } = require('pdf-lib')
const { glob } = require('glob')
const path = require('path')
const fs = require('fs')

// ---------------- CONFIGURAÇÕES ----------------
// Ajuste este caminho se sua pasta coverage estiver em outro lugar
// O padrão do vitest com 'src' costuma ser: coverage/src/domain
const COVERAGE_DOMAIN_DIR = path.resolve(__dirname, '../coverage')
const OUTPUT_DIR = path.resolve(__dirname, '../coverage/pdf-reports')

// Padrão para encontrar seus Use Cases (ajuste conforme sua estrutura)
// Estamos procurando arquivos .ts.html dentro de pastas use-cases
const USE_CASE_PATTERN = '**/use-cases/**/index.html'
// -----------------------------------------------

;(async () => {
  // 1. Verifica se a pasta de coverage existe
  if (!fs.existsSync(COVERAGE_DOMAIN_DIR)) {
    console.error(`Erro: Pasta não encontrada: ${COVERAGE_DOMAIN_DIR}`)
    console.error('Rode "npx vitest run --coverage" primeiro.')
    process.exit(1)
  }

  // 2. Cria pasta de saída para os PDFs
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // 3. Identifica os Domínios (pastas diretas dentro de src/domain)
  const domains = fs.readdirSync(COVERAGE_DOMAIN_DIR).filter((file) => {
    return fs.statSync(path.join(COVERAGE_DOMAIN_DIR, file)).isDirectory()
  })

  console.log(`🔎 Domínios encontrados: ${domains.join(', ')}`)

  const browser = await puppeteer.launch()

  // 4. Loop por cada domínio
  for (const domain of domains) {
    const domainPath = path.join(COVERAGE_DOMAIN_DIR, domain)

    // Busca todos os HTMLs de use-cases dentro deste domínio
    // O glob retorna caminhos com barras normais (/), o que é bom para consistência
    const htmlFiles = await glob(USE_CASE_PATTERN, {
      cwd: domainPath,
      absolute: true,
    })

    if (htmlFiles.length === 0) {
      console.log(`⚠️  Nenhum Use Case encontrado em: ${domain} (pulei)`)
      continue
    }

    console.log(
      `\n📄 Processando ${domain}: ${htmlFiles.length} arquivos encontrados...`,
    )

    // Cria um novo documento PDF vazio para este domínio
    const mergedPdf = await PDFDocument.create()

    for (const file of htmlFiles) {
      const page = await browser.newPage()

      // Carrega o HTML local
      await page.goto(`file://${file}`, { waitUntil: 'networkidle0' })

      // Gera o PDF desta página específica (Use Case) na memória (buffer)
      const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true, // Melhor para visualizar código
        printBackground: true, // Mantém as cores verde/vermelho
        margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
      })

      // Carrega o PDF gerado na memória para o pdf-lib
      const sourcePdf = await PDFDocument.load(pdfBuffer)

      // Copia todas as páginas do PDF gerado para o PDF final
      const copiedPages = await mergedPdf.copyPages(
        sourcePdf,
        sourcePdf.getPageIndices(),
      )
      copiedPages.forEach((page) => mergedPdf.addPage(page))

      await page.close()
      process.stdout.write('.') // Feedback visual de progresso
    }

    // Salva o PDF final do domínio
    const pdfBytes = await mergedPdf.save()
    const outputPath = path.join(OUTPUT_DIR, `${domain}-use-cases.pdf`)
    fs.writeFileSync(outputPath, pdfBytes)

    console.log(`\n✅ Salvo: ${outputPath}`)
  }

  const page = await browser.newPage()
  const coveragePath = path.resolve(__dirname, '../coverage/index.html')
  await page.goto(`file://${coveragePath}`, { waitUntil: 'networkidle0' })
  const outputPath = path.join(OUTPUT_DIR, 'coverage-report.pdf')

  await page.pdf({
    path: outputPath, // Nome do arquivo de saída
    format: 'A4',
    landscape: true, // Importante para ver o código
    printBackground: true, // Mantém as cores (verde/vermelho)
    margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
  })

  await browser.close()
  console.log('\n✨ Todos os relatórios foram gerados com sucesso!')
})()
