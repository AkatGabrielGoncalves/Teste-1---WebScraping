# **Teste-1---WebScraping**

- This project is part of a set of other tests. Check it out:
  - [Test 2 - Transformação de dados](https://github.com/AkatGabrielGoncalves/Teste-2---Transformacao-de-dados)
  - [Test 3 - Banco de dados](https://github.com/AkatGabrielGoncalves/Teste-3---Banco-de-dados)
  - [Test 4 - Frontend](https://github.com/AkatGabrielGoncalves/Teste-4---FrontEnd)

## **What does this project do?**
- It scraps [this](https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss) website to find the latest version of the Componente Organizacional of Padrão TISS.
- How:
  - Find the href from [URL](https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss) which leads to [URL](https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss/padrao-tiss-2013-agosto-2021) then find the href that downloads the PDF (padrao_tiss_componente_organizacional_202108.pdf)

## **How to run**
- Install dependencies.
```
yarn install
```
- Run the script.
```
yarn start
```
### **Dependencies**

- Axios

## **Details**

- Written in javascript, it uses axios and regex to find the html tags and captures it's href attribute.