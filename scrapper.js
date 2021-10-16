const axios = require('axios').default
const fs = require('fs')
const path = require('path')

const hrefRegex = /href="(?<href>.*?)"/

const getTissLastVersionUrl = async (url) => {
  try {
    const { data } = await axios.get(url, { responseType: 'text' })
  
    //remove all whitespaces, tabs, newlines
    const parsedData = data.replace(/[ \t\n]+/g, '')
  
    const htmlPTagRegex = /<pclass="callout">(?<pTag>.*?)<\/p>/
    const { groups: { pTag } } = parsedData.match(htmlPTagRegex)

    const href = pTag.match(hrefRegex).groups.href

    if (!href) throw new Error('Failed to get tiss last version URL.')

    return href
  } catch(err) {
    console.log('Failed to get.', err)
  }
}

const getPdfUrl = async (tissLastVersionUrl) => {
  try {
    const { data } = await axios.get(tissLastVersionUrl, { responseType: 'text' })
  
    //remove all whitespaces, tabs, newlines
    const parsedData = data.replace(/[ \t\n]+/g, '')
  
    const trTagRegex = /<tr><td>ComponenteOrganizacional<\/td><td>(?<trTag>.*?)<\/tr>/
    const { groups: { trTag } } = parsedData.match(trTagRegex)
  
    const href = trTag.match(hrefRegex).groups.href

    if (!href) throw new Error('Failed to get tiss PDF URL.')

    return href
  } catch (err) {
    console.log('Failed to get.', err)
  }
}

const downloadAndSavePdf = async (tissPdfUrl) => {
  try {
    const response = await axios.get(tissPdfUrl, { responseType: 'stream' })
  
    //get our filename
    const { groups: { filename } } = tissPdfUrl.match(/\/(?<filename>(?:.(?!\/))+$)/)

    const downloadLocation = path.resolve(__dirname, 'downloads', filename)
  
    const writeStream = fs.createWriteStream(downloadLocation)
  
    await response.data.pipe(writeStream)
    console.log('Download Succeded.')
    return filename
  } catch (err) {
    console.log('Download Failed.', err)
  }
}

const scrapper = async () => {
  const tissUrl = 'https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss'

  const lastVersionUrl = await getTissLastVersionUrl(tissUrl)
  const tissPdfUrl = await getPdfUrl(lastVersionUrl)
  const filename = await downloadAndSavePdf(tissPdfUrl)

  return filename
}

scrapper().then()
