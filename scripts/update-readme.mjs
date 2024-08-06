import { readFileSync, writeFileSync } from 'node:fs'

const readmeContent = readFileSync('README.md', 'utf8')

const currentYear = new Date().getFullYear()

const updatedReadmeContent = readmeContent.replace(
  /Copyright © \d{4}/,
  `Copyright © ${currentYear}`,
)

writeFileSync('README.md', updatedReadmeContent)
