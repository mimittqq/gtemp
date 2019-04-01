const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs-extra')

const rootPath = path.join(__dirname, '')
const argv = process.argv.slice(2)
const targetPath = path.join(rootPath, argv[0])
const configPath = path.join(rootPath, './gtemp.config.js')

inquirer.prompt({
  name: 'chooseTemp',
  type: 'list',
  message: '请选择需要生成的模板',
  choices: getFilesInDir(getTemplatesDir()),
})
.then((res) => {
  const { chooseTemp } = res
  const tempPath = path.join(getTemplatesDir(), chooseTemp)
  
  copyFile(tempPath, targetPath)
})

function getTemplatesDir() {
  return path.join(rootPath, './__templates__')
}

function getFilesInDir(dirPath) {
  return fs.readdirSync(dirPath)
}

function copyFile(src, dist) {
  const srcHandleFileQueue = []
  srcHandleFileQueue.push(src)

  do {
    const file = srcHandleFileQueue.shift()
    const isFile = fs.statSync(file).isFile()
    
    if (isFile) {
      const distPath = path.join(dist, path.relative(getTemplatesDir(), file))
      
      fs.ensureFile(distPath)
      .then(() => {
        fs.copy(file, distPath)
      })
    } else {
      const files = getFilesInDir(file)
      
      files.forEach((pth) => {
        const _fileSrc = path.join(file, pth)
        srcHandleFileQueue.push(_fileSrc)
      })
    }

  } while (srcHandleFileQueue.length)
}