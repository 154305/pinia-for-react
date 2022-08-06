const {execSync} = require('child_process')
const fs = require('fs')
const path = require('path')
const https = require('node:https')
const packageJson = require('../package.json')

//更新版本
const updateVersion = ()=>{
    const getAddVersion = (packageJson) => {
        const versions = packageJson.version.split('.');
        versions[2] = String(Number(versions[2]) + 1);
        return versions.join('.')
    }
    packageJson.version = getAddVersion(packageJson)
    console.log(JSON.stringify(packageJson, null, 2))
    fs.writeFileSync(path.resolve(process.cwd(), 'package.json'), JSON.stringify(packageJson, null, 2))
}

updateVersion()

//发布
try {
    execSync('npm publish --registry=https://registry.npmjs.org/');
    console.log('发布成功')
} catch (e) {
    console.error('发布失败')
}
//同步cnpm
try {
    console.log('同步https://npm.taobao.org/sync/' + packageJson.name)
    //同步cnpm源
    https.get('https://npm.taobao.org/sync/' + packageJson.name)
    console.log('同步成功')
} catch (e) {
    console.error('同步失败')
}