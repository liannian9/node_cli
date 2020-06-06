#!/usr/bin/env node

const inquirer = require('inquirer'); //cli脚手架中用于交互的插件
const fs = require('fs')
const path = require('path')
const ejs = require('ejs') //模板引擎

inquirer.prompt([
    {
      type:'input',
      name:'name',
      message:'project name?'
    }
  ]).then(answer => {
    // console.log(answer)
    //模板目录
    const tmpDir = path.join(__dirname, 'templates')
    //目标目录
    const destDir = process.cwd() // 当前所在目录
    //将模板下的文件全部转换到目标目录
    myReadfile(tmpDir, destDir, answer)
  
  })

  function myReadfile(MyUrl, destDir, answer) {
    fs.readdir(MyUrl, (err, files) => {
        if (err) throw err
        files.forEach(file => {
            //拼接获取绝对路径，fs.stat(绝对路径,回调函数)
            let fPath = path.join(MyUrl, file);
            let outPath = path.join(destDir, file);
            fs.stat(fPath, (err, stat) => {
                if (stat.isFile()) {
                    //stat 状态中有两个函数一个是stat中有isFile ,isisDirectory等函数进行判断是文件还是文件夹
                    ejs.renderFile(fPath, answer, (err, res) => {
                        fs.writeFileSync(path.join(destDir, file), res)
                      })
                }
                else {
                  //如果当前目录是文件夹就生成文件夹
                    fs.mkdirSync(outPath);
                    myReadfile(fPath, outPath, answer)
                }
            })
        })
    })
}
