import { material, project } from '@alilc/lowcode-engine';
import { filterPackages } from '@alilc/lowcode-plugin-inject'
import { Message, Dialog } from '@alifd/next';
import { IPublicEnumTransformStage } from '@alilc/lowcode-types';
// import schema from './schema.json';
import * as CodeGenerator from '../../lowcode/standalone-loader';

// import CodeGen from '../../lowcode/standalone';
// import CodeGenerator2 from '../../lowcode/cli';
// const CodeGenerator2 = require('../../lowcode/cli')
export const saveFiles = async (scenarioName: string = 'unknown') => {
  // setProjectSchemaToLocalStorage(scenarioName);
  // await setPackagesToLocalStorage(scenarioName);
  const schema = await getPackagesToLocalStorage(scenarioName);
  console.log(3, schema);
  
  await CodeGenerator.init();
  const result = await CodeGenerator.generateCode({
    solution: 'nextjs', // 出码方案 (目前内置有 icejs、icejs3 和 rax )
    schema, // 编排搭建出来的 schema
  });
  console.log(8, result, CodeGenerator);
  try {
    const result2 = await CodeGenerator.generateZip({
      project: result, // 上一步生成的 project
      outputPath: '/Users/mercury/Project/lowcode-generator/lowcode-demo-main/demo-next-pro/', // 项目标识 -- 对应下载 your-project-slug.zip 文件
    });
    console.log(27, result2);
    if (result2.success) {
      Message.success('出码中');
      const url = window.URL.createObjectURL(result2.payload, { type: 'application/zip' });
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = 'you-project.zip';
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
      // Message.destroy();
    } else {
      Message.error('文件下载异常');
    }
    
  } catch (err) {
    console.log(29, err);
  }
  Message.success('出码成功');
};

export const saveSchema = async (scenarioName: string = 'unknown') => {
  setProjectSchemaToLocalStorage(scenarioName);
  await setPackagesToLocalStorage(scenarioName);
  Message.success('成功保存到本地');
};

const getLSName = (scenarioName: string, ns: string = 'projectSchema') => `${scenarioName}:${ns}`;

const setProjectSchemaToLocalStorage = (scenarioName: string) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }
  window.localStorage.setItem(
    getLSName(scenarioName),
    JSON.stringify(project.exportSchema(IPublicEnumTransformStage.Save))
  );
}

const setPackagesToLocalStorage = async (scenarioName: string) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }
  const packages = await filterPackages(material.getAssets().packages);
  window.localStorage.setItem(
    getLSName(scenarioName, 'packages'),
    JSON.stringify(packages),
  );
}

const getPackagesToLocalStorage = async (scenarioName: string) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }
  const schema = window.localStorage.getItem(
    getLSName(scenarioName, 'projectSchema')
  );
  return JSON.parse(schema)
}