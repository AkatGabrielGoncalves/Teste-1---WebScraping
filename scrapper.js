const axios = require('axios').default
const fs = require('fs')
const path = require('path')

const getUrl = async (url, regex) => {
  try {
    console.log(`Acessing: ${url}`)
    const { data } = await axios.get(url, { responseType: 'text' })
  
    //remove all whitespaces, tabs, newlines
    const parsedData = data.replace(/[ \t\n]+/g, '')

    const hrefRegex = regex
    const { groups: { href } } = parsedData.match(hrefRegex)

    if (!href) throw new Error('Failed to get url href.')

    console.log(`Next link found.`)

    return href
  } catch(err) {
    console.log('Failed to get.', err)
  }
}

const downloadAndSavePdf = async (tissPdfUrl) => {
  try {
    console.log(`Trying to download: ${tissPdfUrl}`)
    const response = await axios.get(tissPdfUrl, { responseType: 'stream' })

    //get our filename
    const { groups: { filename } } = tissPdfUrl.match(/\/(?<filename>(?:.(?!\/))+$)/)

    const downloadLocation = path.resolve(__dirname, filename)
  
    const writeStream = fs.createWriteStream(downloadLocation)

    writeStream.on('finish', () => {
      console.log('Download Succeded.')
    })

    writeStream.on('error', () => {
      console.log('Download Failed.')
    })
  
    response.data.pipe(writeStream)

    return filename
  } catch (err) {
    console.log('Download Failed.', err)
  }
}

const scrapper = async () => {
  const tissUrl = 'https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss'
  console.log('Downloading using this Url as start:', tissUrl)

  const latestTissUrlRegex = /<pclass="callout">.*?href="(?<href>.*?)".*?<\/p>/
  const tissPdfUrlRegex = /<tr><td>ComponenteOrganizacional<\/td><td>.*?href="(?<href>.*?)".*?<\/tr>/

  const latestTissUrl = await getUrl(tissUrl, latestTissUrlRegex)
  const tissPdfUrl = await getUrl(latestTissUrl, tissPdfUrlRegex)
  const filename = await downloadAndSavePdf(tissPdfUrl)

  return filename
};

(async () => await scrapper())()
