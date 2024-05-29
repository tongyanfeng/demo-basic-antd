"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/cli/index.ts
var cli_exports = {};
__export(cli_exports, {
  initSolution: () => initSolution,
  run: () => run
});
module.exports = __toCommonJS(cli_exports);

// src/cli/run.ts
var import_chalk = __toESM(require("chalk"));
var fs = __toESM(require("fs-extra"));
var import_json5 = __toESM(require("json5"));
var import_jsonc = require("jsonc");
var import_child_process = require("child_process");
var path = __toESM(require("path"));

// src/utils/errors.ts
function getErrorMessage(error) {
  if (!error) {
    return null;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object" && error !== null) {
    return getErrorMessage(error.message) || getErrorMessage(error.errorMessage) || getErrorMessage(error.detail);
  }
  return null;
}

// src/parser/SchemaParser.ts
var import_change_case2 = __toESM(require("change-case"));

// src/types/error.ts
var CodeGeneratorError = class extends Error {
  constructor(message, detail) {
    super(message);
    __publicField(this, "detail");
    this.name = this.constructor.name;
    this.detail = detail;
    Object.setPrototypeOf(this, new.target.prototype);
  }
};
var CompatibilityError = class extends CodeGeneratorError {
};
var PublisherError = class extends CodeGeneratorError {
};

// src/const/index.ts
var const_exports = {};
__export(const_exports, {
  BUILTIN_SLOT_NAMES: () => BUILTIN_SLOT_NAMES,
  CLASS_DEFINE_CHUNK_NAME: () => CLASS_DEFINE_CHUNK_NAME,
  COMMON_CHUNK_NAME: () => COMMON_CHUNK_NAME,
  COMMON_SUB_MODULE_NAME: () => COMMON_SUB_MODULE_NAME,
  CONTAINER_TYPE: () => CONTAINER_TYPE,
  DEFAULT_LINK_AFTER: () => DEFAULT_LINK_AFTER,
  FILE_TYPE_FAMILY: () => FILE_TYPE_FAMILY,
  NATIVE_ELE_PKG: () => NATIVE_ELE_PKG,
  SUPPORT_SCHEMA_VERSION_LIST: () => SUPPORT_SCHEMA_VERSION_LIST,
  isBuiltinSlotName: () => isBuiltinSlotName
});

// src/const/file.ts
var FILE_TYPE_FAMILY = [["tsx" /* TSX */, "ts" /* TS */, "jsx" /* JSX */, "js" /* JS */]];

// src/const/generator.ts
var COMMON_CHUNK_NAME = {
  ExternalDepsImport: "CommonExternalDependencyImport",
  InternalDepsImport: "CommonInternalDependencyImport",
  ImportAliasDefine: "CommonImportAliasDefine",
  FileVarDefine: "CommonFileScopeVarDefine",
  FileUtilDefine: "CommonFileScopeMethodDefine",
  FileMainContent: "CommonFileMainContent",
  FileExport: "CommonFileExport",
  StyleDepsImport: "CommonStyleDepsImport",
  StyleCssContent: "CommonStyleCssContent",
  HtmlContent: "CommonHtmlContent",
  CustomContent: "CommonCustomContent"
};
var CLASS_DEFINE_CHUNK_NAME = {
  Start: "CommonClassDefineStart",
  ConstructorStart: "CommonClassDefineConstructorStart",
  ConstructorContent: "CommonClassDefineConstructorContent",
  ConstructorEnd: "CommonClassDefineConstructorEnd",
  StaticVar: "CommonClassDefineStaticVar",
  StaticMethod: "CommonClassDefineStaticMethod",
  InsVar: "CommonClassDefineInsVar",
  InsVarMethod: "CommonClassDefineInsVarMethod",
  InsMethod: "CommonClassDefineInsMethod",
  InsPrivateMethod: "CommonClassDefineInsPrivateMethod",
  End: "CommonClassDefineEnd"
};
var DEFAULT_LINK_AFTER = {
  [COMMON_CHUNK_NAME.ExternalDepsImport]: [],
  [COMMON_CHUNK_NAME.InternalDepsImport]: [COMMON_CHUNK_NAME.ExternalDepsImport],
  [COMMON_CHUNK_NAME.ImportAliasDefine]: [
    COMMON_CHUNK_NAME.ExternalDepsImport,
    COMMON_CHUNK_NAME.InternalDepsImport
  ],
  [COMMON_CHUNK_NAME.FileVarDefine]: [
    COMMON_CHUNK_NAME.ExternalDepsImport,
    COMMON_CHUNK_NAME.InternalDepsImport,
    COMMON_CHUNK_NAME.ImportAliasDefine
  ],
  [COMMON_CHUNK_NAME.FileUtilDefine]: [
    COMMON_CHUNK_NAME.ExternalDepsImport,
    COMMON_CHUNK_NAME.InternalDepsImport,
    COMMON_CHUNK_NAME.ImportAliasDefine,
    COMMON_CHUNK_NAME.FileVarDefine
  ],
  [CLASS_DEFINE_CHUNK_NAME.Start]: [
    COMMON_CHUNK_NAME.ExternalDepsImport,
    COMMON_CHUNK_NAME.InternalDepsImport,
    COMMON_CHUNK_NAME.ImportAliasDefine,
    COMMON_CHUNK_NAME.FileVarDefine,
    COMMON_CHUNK_NAME.FileUtilDefine
  ],
  [CLASS_DEFINE_CHUNK_NAME.ConstructorStart]: [
    CLASS_DEFINE_CHUNK_NAME.Start,
    CLASS_DEFINE_CHUNK_NAME.StaticVar,
    CLASS_DEFINE_CHUNK_NAME.StaticMethod,
    CLASS_DEFINE_CHUNK_NAME.InsVar,
    CLASS_DEFINE_CHUNK_NAME.InsVarMethod
  ],
  [CLASS_DEFINE_CHUNK_NAME.ConstructorContent]: [CLASS_DEFINE_CHUNK_NAME.ConstructorStart],
  [CLASS_DEFINE_CHUNK_NAME.ConstructorEnd]: [
    CLASS_DEFINE_CHUNK_NAME.ConstructorStart,
    CLASS_DEFINE_CHUNK_NAME.ConstructorContent
  ],
  [CLASS_DEFINE_CHUNK_NAME.StaticVar]: [CLASS_DEFINE_CHUNK_NAME.Start],
  [CLASS_DEFINE_CHUNK_NAME.StaticMethod]: [
    CLASS_DEFINE_CHUNK_NAME.Start,
    CLASS_DEFINE_CHUNK_NAME.StaticVar
  ],
  [CLASS_DEFINE_CHUNK_NAME.InsVar]: [
    CLASS_DEFINE_CHUNK_NAME.Start,
    CLASS_DEFINE_CHUNK_NAME.StaticVar,
    CLASS_DEFINE_CHUNK_NAME.StaticMethod
  ],
  [CLASS_DEFINE_CHUNK_NAME.InsVarMethod]: [
    CLASS_DEFINE_CHUNK_NAME.Start,
    CLASS_DEFINE_CHUNK_NAME.StaticVar,
    CLASS_DEFINE_CHUNK_NAME.StaticMethod,
    CLASS_DEFINE_CHUNK_NAME.InsVar
  ],
  [CLASS_DEFINE_CHUNK_NAME.InsMethod]: [
    CLASS_DEFINE_CHUNK_NAME.Start,
    CLASS_DEFINE_CHUNK_NAME.StaticVar,
    CLASS_DEFINE_CHUNK_NAME.StaticMethod,
    CLASS_DEFINE_CHUNK_NAME.InsVar,
    CLASS_DEFINE_CHUNK_NAME.InsVarMethod,
    CLASS_DEFINE_CHUNK_NAME.ConstructorEnd
  ],
  [CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod]: [
    CLASS_DEFINE_CHUNK_NAME.Start,
    CLASS_DEFINE_CHUNK_NAME.StaticVar,
    CLASS_DEFINE_CHUNK_NAME.StaticMethod,
    CLASS_DEFINE_CHUNK_NAME.InsVar,
    CLASS_DEFINE_CHUNK_NAME.InsVarMethod,
    CLASS_DEFINE_CHUNK_NAME.InsMethod,
    CLASS_DEFINE_CHUNK_NAME.ConstructorEnd
  ],
  [CLASS_DEFINE_CHUNK_NAME.End]: [
    CLASS_DEFINE_CHUNK_NAME.Start,
    CLASS_DEFINE_CHUNK_NAME.StaticVar,
    CLASS_DEFINE_CHUNK_NAME.StaticMethod,
    CLASS_DEFINE_CHUNK_NAME.InsVar,
    CLASS_DEFINE_CHUNK_NAME.InsVarMethod,
    CLASS_DEFINE_CHUNK_NAME.InsMethod,
    CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod,
    CLASS_DEFINE_CHUNK_NAME.ConstructorEnd
  ],
  [COMMON_CHUNK_NAME.FileMainContent]: [
    COMMON_CHUNK_NAME.ExternalDepsImport,
    COMMON_CHUNK_NAME.InternalDepsImport,
    COMMON_CHUNK_NAME.ImportAliasDefine,
    COMMON_CHUNK_NAME.FileVarDefine,
    COMMON_CHUNK_NAME.FileUtilDefine,
    CLASS_DEFINE_CHUNK_NAME.End
  ],
  [COMMON_CHUNK_NAME.FileExport]: [
    COMMON_CHUNK_NAME.ExternalDepsImport,
    COMMON_CHUNK_NAME.InternalDepsImport,
    COMMON_CHUNK_NAME.ImportAliasDefine,
    COMMON_CHUNK_NAME.FileVarDefine,
    COMMON_CHUNK_NAME.FileUtilDefine,
    CLASS_DEFINE_CHUNK_NAME.End,
    COMMON_CHUNK_NAME.FileMainContent
  ],
  [COMMON_CHUNK_NAME.StyleDepsImport]: [],
  [COMMON_CHUNK_NAME.StyleCssContent]: [COMMON_CHUNK_NAME.StyleDepsImport],
  [COMMON_CHUNK_NAME.HtmlContent]: []
};
var COMMON_SUB_MODULE_NAME = "index";

// src/const/index.ts
var NATIVE_ELE_PKG = "native";
var CONTAINER_TYPE = {
  COMPONENT: "Component",
  BLOCK: "Block",
  PAGE: "Page"
};
var SUPPORT_SCHEMA_VERSION_LIST = ["0.0.1", "1.0.0"];
var BUILTIN_SLOT_NAMES = [
  "pages",
  "components",
  "router",
  "entry",
  "appConfig",
  "buildConfig",
  "constants",
  "utils",
  "i18n",
  "globalStyle",
  "htmlEntry",
  "packageJSON",
  "demo"
];
var isBuiltinSlotName = function(name) {
  return BUILTIN_SLOT_NAMES.includes(name);
};

// src/utils/schema.ts
var schema_exports = {};
__export(schema_exports, {
  ContainerType: () => ContainerType,
  handleSubNodes: () => handleSubNodes,
  isContainerSchema: () => isContainerSchema,
  isNpmInfo: () => isNpmInfo,
  isValidContainerType: () => isValidContainerType
});
var _ = __toESM(require("lodash"));
var import_lowcode_types = require("@alilc/lowcode-types");

// src/utils/common.ts
var common_exports = {};
__export(common_exports, {
  camel2dash: () => camel2dash,
  camelize: () => camelize,
  generateID: () => generateID,
  getStaticExprValue: () => getStaticExprValue,
  isExternalDependency: () => isExternalDependency,
  isInternalDependency: () => isInternalDependency,
  isJSExpressionFn: () => isJSExpressionFn,
  uniqueArray: () => uniqueArray,
  upperCaseFirst: () => upperCaseFirst
});
var import_change_case = __toESM(require("change-case"));
var import_short_uuid = __toESM(require("short-uuid"));
function camel2dash(input) {
  return import_change_case.default.paramCase(input);
}
function camelize(str) {
  return import_change_case.default.camelCase(str);
}
function generateID() {
  return import_short_uuid.default.generate();
}
function upperCaseFirst(inputValue) {
  return import_change_case.default.upperCaseFirst(inputValue);
}
function uniqueArray(arr, by) {
  const map = {};
  arr.forEach((item) => {
    map[by(item)] = item;
  });
  const uniqueKeys = Array.from(new Set(Object.keys(map)));
  const uniqueItems = uniqueKeys.map((key) => map[key]);
  return uniqueItems;
}
function getStaticExprValue(expr) {
  return Function(`"use strict";return (${expr})`)();
}
function isJSExpressionFn(data) {
  return (data == null ? void 0 : data.type) === "JSExpression" && (data == null ? void 0 : data.extType) === "function";
}
function isInternalDependency(dependency) {
  return dependency.dependencyType === "Internal" /* Internal */;
}
function isExternalDependency(dependency) {
  return dependency.dependencyType === "External" /* External */;
}

// src/utils/schema.ts
function isContainerSchema(x) {
  return typeof x === "object" && x && typeof x.componentName === "string" && typeof x.fileName === "string";
}
function isNpmInfo(x) {
  return typeof x === "object" && x && typeof x.package === "string";
}
var noop = () => void 0;
var handleChildrenDefaultOptions = {
  rerun: false
};
var DEFAULT_MAX_DEPTH = 1e5;
function handleSubNodes(children, handlers, options) {
  var _a;
  const opt = {
    ...handleChildrenDefaultOptions,
    ...options || {}
  };
  const maxDepth = (_a = opt.maxDepth) != null ? _a : DEFAULT_MAX_DEPTH;
  if (maxDepth <= 0) {
    throw new Error("handleSubNodes maxDepth reached");
  }
  if (Array.isArray(children)) {
    const list = children;
    return list.map((child) => handleSubNodes(child, handlers, { ...opt, maxDepth: maxDepth - 1 })).reduce((p, c) => p.concat(c), []);
  }
  let result;
  const childrenRes = [];
  if (children === null || children === void 0) {
    return [];
  } else if ((0, import_lowcode_types.isDOMText)(children)) {
    const handler = handlers.string || noop;
    result = handler(children);
  } else if ((0, import_lowcode_types.isJSExpression)(children)) {
    const handler = handlers.expression || noop;
    result = handler(children);
  } else if ((0, import_lowcode_types.isJSSlot)(children)) {
    return handleSubNodes(children.value, handlers, { ...opt, maxDepth: maxDepth - 1 });
  } else if ((0, import_lowcode_types.isNodeSchema)(children)) {
    const handler = handlers.node || noop;
    const child = children;
    result = handler(child);
    if (child.children) {
      const childRes = handleSubNodes(child.children, handlers, opt);
      childrenRes.push(...childRes);
    }
    if (child.props) {
      if (Array.isArray(child.props)) {
        child.props.forEach(({ value }) => {
          const childRes = handleCompositeValueInProps(value);
          childrenRes.push(...childRes);
        });
      } else {
        Object.values(child.props).forEach((value) => {
          const childRes = handleCompositeValueInProps(value);
          childrenRes.push(...childRes);
        });
      }
    }
  } else {
    throw new CodeGeneratorError("handleSubNodes got invalid NodeData", children);
  }
  if (result !== void 0) {
    childrenRes.unshift(result);
  }
  return childrenRes;
  function handleCompositeValueInProps(value) {
    if ((0, import_lowcode_types.isJSSlot)(value)) {
      return handleSubNodes(value.value, handlers, { ...opt, maxDepth: maxDepth - 1 });
    }
    if (Array.isArray(value)) {
      return _.flatMap(value, (v) => handleCompositeValueInProps(v));
    }
    if (!(0, import_lowcode_types.isJSExpression)(value) && !isJSExpressionFn(value) && !(0, import_lowcode_types.isJSFunction)(value) && typeof value === "object" && value !== null) {
      return _.flatMap(Object.values(value), (v) => handleCompositeValueInProps(v));
    }
    return [];
  }
}
function isValidContainerType(schema) {
  return [
    "Page",
    "Component",
    "Block"
  ].includes(schema.componentName);
}
var ContainerType = /* @__PURE__ */ ((ContainerType2) => {
  ContainerType2["Page"] = "Page";
  ContainerType2["Component"] = "Component";
  ContainerType2["Block"] = "Block";
  return ContainerType2;
})(ContainerType || {});

// src/analyzer/componentAnalyzer.ts
var componentAnalyzer = (container) => {
  let hasRefAttr = false;
  const nodeValidator = (n) => {
    if (n.props) {
      const props = n.props;
      if (props.ref) {
        hasRefAttr = true;
      }
    }
  };
  nodeValidator(container);
  if (!hasRefAttr && container.children) {
    handleSubNodes(
      container.children,
      {
        node: nodeValidator
      },
      {
        rerun: true
      }
    );
  }
  return {
    isUsingRef: hasRefAttr
  };
};

// src/utils/validate.ts
var validate_exports = {};
__export(validate_exports, {
  ensureValidClassName: () => ensureValidClassName,
  isValidComponentName: () => isValidComponentName,
  isValidIdentifier: () => isValidIdentifier
});
var isValidIdentifier = (name) => {
  return /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/.test(name);
};
var isValidComponentName = (name) => {
  return /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF.]*$/.test(name);
};
var ensureValidClassName = (name) => {
  if (!isValidIdentifier(name)) {
    return `$${name.replace(/[^_$a-zA-Z0-9]/g, "")}`;
  }
  return name;
};

// src/parser/SchemaParser.ts
var defaultContainer = {
  containerType: "Component",
  componentName: "Component",
  moduleName: "Index",
  fileName: "Index",
  css: "",
  props: {}
};
function getRootComponentName(typeName, maps) {
  if (maps[typeName]) {
    const rec = maps[typeName];
    if (rec.destructuring) {
      return rec.componentName || typeName;
    }
    const peerName = Object.keys(maps).find((depName) => {
      const depInfo = maps[depName];
      return depName !== typeName && !depInfo.destructuring && depInfo.package === rec.package && depInfo.version === rec.version && depInfo.main === rec.main && depInfo.exportName === rec.exportName && depInfo.subName === rec.subName;
    });
    return peerName || typeName;
  }
  return typeName;
}
function processChildren(schema) {
  if (schema.props) {
    if (Array.isArray(schema.props)) {
    } else {
      const nodeProps = schema.props;
      if (nodeProps.children) {
        if (!schema.children) {
          schema.children = nodeProps.children;
        } else {
          let _children = [];
          if (Array.isArray(schema.children)) {
            _children = _children.concat(schema.children);
          } else {
            _children.push(schema.children);
          }
          if (Array.isArray(nodeProps.children)) {
            _children = _children.concat(nodeProps.children);
          } else {
            _children.push(nodeProps.children);
          }
          schema.children = _children;
        }
        delete nodeProps.children;
      }
    }
  }
}
function getInternalDep(internalDeps, depName) {
  const dep = internalDeps[depName];
  return dep && dep.type !== "pages" /* PAGE */ ? dep : null;
}
var SchemaParser = class {
  validate(schema) {
    if (SUPPORT_SCHEMA_VERSION_LIST.indexOf(schema.version) < 0) {
      throw new CompatibilityError(`Not support schema with version [${schema.version}]`);
    }
    return true;
  }
  parse(schemaSrc) {
    const compDeps = {};
    const internalDeps = {};
    let utilsDeps = [];
    const schema = this.decodeSchema(schemaSrc);
    schema.componentsMap.forEach((info) => {
      var _a, _b;
      if (info.componentName) {
        compDeps[info.componentName] = {
          ...info,
          dependencyType: "External" /* External */,
          componentName: info.componentName,
          exportName: (_a = info.exportName) != null ? _a : info.componentName,
          version: info.version || "*",
          destructuring: (_b = info.destructuring) != null ? _b : false
        };
      }
    });
    let containers;
    if (schema.componentsTree.length > 0) {
      const firstRoot = schema.componentsTree[0];
      if (!firstRoot.fileName && !isValidContainerType(firstRoot)) {
        const container = {
          ...firstRoot,
          ...defaultContainer,
          props: firstRoot.props || defaultContainer.props,
          css: firstRoot.css || defaultContainer.css,
          moduleName: firstRoot.moduleName || defaultContainer.moduleName,
          children: schema.componentsTree
        };
        containers = [container];
      } else {
        containers = schema.componentsTree.map((n) => {
          const subRoot = n;
          const container = {
            ...subRoot,
            componentName: getRootComponentName(subRoot.componentName, compDeps),
            containerType: subRoot.componentName,
            moduleName: ensureValidClassName(subRoot.componentName === "Component" /* Component */ ? subRoot.fileName : import_change_case2.default.pascalCase(subRoot.fileName))
          };
          return container;
        });
      }
    } else {
      throw new CodeGeneratorError("Can't find anything to generate.");
    }
    containers = containers.map((con) => ({
      ...con,
      analyzeResult: componentAnalyzer(con)
    }));
    containers.forEach((container) => {
      let type;
      switch (container.containerType) {
        case "Page":
          type = "pages" /* PAGE */;
          break;
        case "Block":
          type = "components" /* BLOCK */;
          break;
        default:
          type = "components" /* COMPONENT */;
          break;
      }
      const dep = {
        type,
        moduleName: container.moduleName,
        destructuring: false,
        exportName: container.moduleName,
        dependencyType: "Internal" /* Internal */
      };
      internalDeps[dep.moduleName] = dep;
    });
    const containersDeps = [].concat(...containers.map((c) => c.deps || []));
    containers.forEach((container) => {
      if (container.children) {
        handleSubNodes(
          container.children,
          {
            node: (i) => processChildren(i)
          },
          {
            rerun: true
          }
        );
      }
    });
    containers.forEach((container) => {
      const depNames = this.getComponentNames(container);
      container.deps = uniqueArray(depNames, (i) => i).map((depName) => getInternalDep(internalDeps, depName) || compDeps[depName]).filter(Boolean);
    });
    const routes = containers.filter((container) => container.containerType === "Page").map((page) => {
      const { meta } = page;
      if (meta) {
        return {
          path: meta.router || `/${page.fileName}`,
          fileName: page.fileName,
          componentName: page.moduleName
        };
      }
      return {
        path: "",
        fileName: page.fileName,
        componentName: page.moduleName
      };
    });
    const routerDeps = routes.map((r) => internalDeps[r.componentName] || compDeps[r.componentName]).filter((dep) => !!dep);
    let utils;
    if (schema.utils) {
      utils = schema.utils;
      utilsDeps = schema.utils.filter(
        (u) => u.type !== "function"
      ).map(
        (u) => {
          var _a, _b;
          return {
            ...u.content,
            componentName: u.name,
            version: u.content.version || "*",
            destructuring: (_a = u.content.destructuring) != null ? _a : false,
            exportName: (_b = u.content.exportName) != null ? _b : u.name
          };
        }
      );
    } else {
      utils = [];
    }
    let npms = [];
    containers.forEach((con) => {
      const p = (con.deps || []).map((dep) => {
        return dep.dependencyType === "External" /* External */ ? dep : null;
      }).filter((dep) => dep !== null);
      const npmInfos = p.filter(Boolean).map((i) => ({
        package: i.package,
        version: i.version
      }));
      npms.push(...npmInfos);
    });
    npms.push(
      ...utilsDeps.map((utilsDep) => ({
        package: utilsDep.package,
        version: utilsDep.version
      }))
    );
    npms = uniqueArray(npms, (i) => i.package).filter(Boolean);
    return {
      containers,
      globalUtils: {
        utils,
        deps: utilsDeps
      },
      globalI18n: schema.i18n,
      globalRouter: {
        routes,
        deps: routerDeps
      },
      project: {
        css: schema.css,
        constants: schema.constants,
        config: schema.config || {},
        meta: schema.meta || {},
        i18n: schema.i18n,
        containersDeps,
        utilsDeps,
        packages: npms || [],
        dataSourcesTypes: this.collectDataSourcesTypes(schema),
        projectRemark: this.getProjectRemark(containers)
      }
    };
  }
  getProjectRemark(containers) {
    return {
      isSingleComponent: containers.length === 1 && containers[0].containerType === "Component"
    };
  }
  getComponentNames(children) {
    return handleSubNodes(
      children,
      {
        node: (i) => i.componentName
      },
      {
        rerun: true
      }
    );
  }
  decodeSchema(schemaSrc) {
    let schema;
    if (typeof schemaSrc === "string") {
      try {
        schema = JSON.parse(schemaSrc);
      } catch (error) {
        throw new CodeGeneratorError(
          `Parse schema failed: ${getErrorMessage(error) || "unknown reason"}`
        );
      }
    } else {
      schema = schemaSrc;
    }
    return schema;
  }
  collectDataSourcesTypes(schema) {
    var _a, _b;
    const dataSourcesTypes = /* @__PURE__ */ new Set();
    const defaultDataSourceType = "fetch";
    (_b = (_a = schema.dataSource) == null ? void 0 : _a.list) == null ? void 0 : _b.forEach((ds) => {
      dataSourcesTypes.add(ds.type || defaultDataSourceType);
    });
    schema.componentsTree.forEach((rootNode) => {
      var _a2, _b2;
      (_b2 = (_a2 = rootNode.dataSource) == null ? void 0 : _a2.list) == null ? void 0 : _b2.forEach((ds) => {
        dataSourcesTypes.add(ds.type || defaultDataSourceType);
      });
    });
    return Array.from(dataSourcesTypes.values());
  }
};

// src/utils/resultHelper.ts
var resultHelper_exports = {};
__export(resultHelper_exports, {
  addDirectory: () => addDirectory,
  addFile: () => addFile,
  createResultDir: () => createResultDir,
  createResultFile: () => createResultFile,
  findDir: () => findDir,
  findFile: () => findFile,
  flattenResult: () => flattenResult,
  getFileNameWithExt: () => getFileNameWithExt,
  globDirs: () => globDirs,
  globFiles: () => globFiles,
  removeDirsFromResult: () => removeDirsFromResult,
  removeFilesFromResult: () => removeFilesFromResult,
  scanDirs: () => scanDirs,
  scanFiles: () => scanFiles
});
var import_nanomatch = __toESM(require("nanomatch"));
function createResultFile(name, ext = "jsx", content = "") {
  return {
    name,
    ext,
    content
  };
}
function createResultDir(name) {
  return {
    name,
    dirs: [],
    files: []
  };
}
function addDirectory(target, dir) {
  if (target.dirs.findIndex((d) => d.name === dir.name) < 0) {
    target.dirs.push(dir);
  } else {
    throw new CodeGeneratorError(
      `Adding same directory to one directory: ${dir.name} -> ${target.name}`
    );
  }
}
function addFile(target, file2) {
  if (target.files.findIndex((f) => f.name === file2.name && f.ext === file2.ext) < 0) {
    target.files.push(file2);
  } else {
    throw new CodeGeneratorError(
      `Adding same file to one directory: ${file2.name} -> ${target.name}`
    );
  }
}
function flattenResult(dir, cwd = "") {
  if (!dir.files.length && !dir.dirs.length) {
    return [];
  }
  return [
    ...dir.files.map(
      (file2) => ({
        pathName: joinPath(cwd, `${file2.name}${file2.ext ? `.${file2.ext}` : ""}`),
        content: file2.content
      })
    )
  ].concat(...dir.dirs.map((subDir) => flattenResult(subDir, joinPath(cwd, subDir.name))));
}
function findFile(result, fileGlobExpr, options = {}, resultDirPath = getResultNameOrDefault(result, "")) {
  const maxDepth = !/\/|\*\*/.test(fileGlobExpr) ? 1 : void 0;
  const files = scanFiles(result, resultDirPath, maxDepth);
  for (let [filePath, file2] of files) {
    if (import_nanomatch.default.isMatch(filePath, fileGlobExpr, options)) {
      return file2;
    }
  }
  return null;
}
function* globFiles(result, fileGlobExpr, options = {}, resultDirPath = getResultNameOrDefault(result, "")) {
  const files = scanFiles(result, resultDirPath);
  for (let [filePath, file2] of files) {
    if (import_nanomatch.default.isMatch(filePath, fileGlobExpr, options)) {
      yield [filePath, file2];
    }
  }
}
function* scanFiles(result, resultDirPath = getResultNameOrDefault(result, ""), maxDepth = 1e4) {
  for (let file2 of result.files) {
    const fileName = getFileNameWithExt(file2);
    yield [joinPath(resultDirPath, fileName), file2];
  }
  for (let subDir of result.dirs) {
    yield* scanFiles(subDir, joinPath(resultDirPath, subDir.name), maxDepth - 1);
  }
}
function getFileNameWithExt(file2) {
  return `${file2.name}${file2.ext ? `.${file2.ext}` : ""}`;
}
function getResultNameOrDefault(result, defaultDir = "/") {
  return result.name && result.name !== "." ? result.name : defaultDir;
}
function joinPath(...pathParts) {
  return pathParts.filter((x) => x !== "" && x !== ".").join("/").replace(/\\+/g, "/").replace(/\/+/g, "/");
}
function* scanDirs(result, resultDirPath = getResultNameOrDefault(result, ""), maxDepth = 1e4) {
  yield [resultDirPath, result];
  for (let subDir of result.dirs) {
    yield* scanDirs(subDir, joinPath(resultDirPath, subDir.name), maxDepth - 1);
  }
}
function* globDirs(result, dirGlobExpr, options = {}, resultDirPath = getResultNameOrDefault(result, "")) {
  const dirs = scanDirs(result, resultDirPath);
  for (let [dirPath, dir] of dirs) {
    if (import_nanomatch.default.isMatch(dirPath, dirGlobExpr, options)) {
      yield [dirPath, dir];
    }
  }
}
function findDir(result, dirGlobExpr, options = {}, resultDirPath = getResultNameOrDefault(result, "")) {
  const dirs = scanDirs(result, resultDirPath);
  for (let [dirPath, dir] of dirs) {
    if (import_nanomatch.default.isMatch(dirPath, dirGlobExpr, options)) {
      return dir;
    }
  }
  return null;
}
function removeFilesFromResult(result, filePathGlobExpr, globOptions = {}) {
  let removedCount = 0;
  const [dirPath, fileName] = splitPath(filePathGlobExpr);
  const dirs = dirPath ? globDirs(result, dirPath) : [["", result]];
  for (let [, dir] of dirs) {
    const files = globFiles(dir, fileName, globOptions, ".");
    for (let [, file2] of files) {
      dir.files.splice(dir.files.indexOf(file2), 1);
      removedCount += 1;
    }
  }
  return removedCount;
}
function removeDirsFromResult(result, dirPathGlobExpr, globOptions = {}) {
  let removedCount = 0;
  const [dirPath, fileName] = splitPath(dirPathGlobExpr);
  const dirs = dirPath ? globDirs(result, dirPath) : [["", result]];
  for (let [, dir] of dirs) {
    const foundDirs = globDirs(dir, fileName, globOptions, ".");
    for (let [, foundDir] of foundDirs) {
      dir.dirs.splice(dir.dirs.indexOf(foundDir), 1);
      removedCount += 1;
    }
  }
  return removedCount;
}
function splitPath(filePath) {
  const parts = filePath.split("/");
  const fileName = parts.pop() || "";
  return [joinPath(...parts), fileName];
}

// src/generator/ChunkBuilder.ts
function whichFamily(type) {
  const idx = FILE_TYPE_FAMILY.findIndex((family) => family.indexOf(type) >= 0);
  if (idx < 0) {
    return void 0;
  }
  return [idx, FILE_TYPE_FAMILY[idx]];
}
var groupChunks = (chunks) => {
  const tmp = {};
  const col = chunks.reduce((chunksSet, chunk) => {
    const fileKey = chunk.subModule || COMMON_SUB_MODULE_NAME;
    if (!chunksSet[fileKey]) {
      chunksSet[fileKey] = [];
    }
    const res = whichFamily(chunk.fileType);
    const info = {
      chunk
    };
    if (res) {
      const [familyIdx, family] = res;
      const rank = family.indexOf(chunk.fileType);
      if (tmp[fileKey]) {
        if (tmp[fileKey][familyIdx] !== void 0) {
          if (tmp[fileKey][familyIdx] > rank) {
            tmp[fileKey][familyIdx] = rank;
          }
        } else {
          tmp[fileKey][familyIdx] = rank;
        }
      } else {
        tmp[fileKey] = {};
        tmp[fileKey][familyIdx] = rank;
      }
      info.familyIdx = familyIdx;
    }
    chunksSet[fileKey].push(info);
    return chunksSet;
  }, {});
  const result = [];
  Object.keys(col).forEach((key) => {
    const byType = {};
    col[key].forEach((info) => {
      let t3 = info.chunk.fileType;
      if (info.familyIdx !== void 0) {
        t3 = FILE_TYPE_FAMILY[info.familyIdx][tmp[key][info.familyIdx]];
        info.chunk.fileType = t3;
      }
      if (!byType[t3]) {
        byType[t3] = [];
      }
      byType[t3].push(info.chunk);
    });
    result.push(...Object.keys(byType).map((t3) => byType[t3]));
  });
  return result;
};
var ChunkBuilder = class {
  constructor(plugins5 = []) {
    __publicField(this, "plugins");
    this.plugins = plugins5;
  }
  async run(ir, initialStructure = {
    ir,
    chunks: [],
    depNames: [],
    contextData: {}
  }) {
    const structure = initialStructure;
    const finalStructure = await this.plugins.reduce(
      async (previousPluginOperation, plugin) => {
        const modifiedStructure = await previousPluginOperation;
        return plugin(modifiedStructure);
      },
      Promise.resolve(structure)
    );
    const chunks = groupChunks(finalStructure.chunks);
    return {
      chunks
    };
  }
  getPlugins() {
    return this.plugins;
  }
  addPlugin(plugin) {
    this.plugins.push(plugin);
  }
};

// src/generator/CodeBuilder.ts
var CodeBuilder = class {
  constructor(chunkDefinitions = []) {
    __publicField(this, "chunkDefinitions", []);
    __publicField(this, "generators", {
      ["string" /* STRING */]: (str) => str,
      ["json" /* JSON */]: (json) => JSON.stringify(json)
    });
    this.chunkDefinitions = chunkDefinitions;
  }
  link(chunkDefinitions = []) {
    const chunks = chunkDefinitions || this.chunkDefinitions;
    if (chunks.length <= 0) {
      return "";
    }
    const unprocessedChunks = chunks.map((chunk) => {
      return {
        name: chunk.name,
        type: chunk.type,
        content: chunk.content,
        linkAfter: this.cleanupInvalidChunks(chunk.linkAfter, chunks)
      };
    });
    const resultingString = [];
    while (unprocessedChunks.length > 0) {
      let indexToRemove = 0;
      for (let index = 0; index < unprocessedChunks.length; index++) {
        if (unprocessedChunks[index].linkAfter.length <= 0) {
          indexToRemove = index;
          break;
        }
      }
      if (unprocessedChunks[indexToRemove].linkAfter.length > 0) {
        throw new CodeGeneratorError(
          "Operation aborted. Reason: cyclic dependency between chunks."
        );
      }
      const { type, content, name } = unprocessedChunks[indexToRemove];
      const compiledContent = this.generateByType(type, content);
      if (compiledContent) {
        resultingString.push(`${compiledContent}
`);
      }
      unprocessedChunks.splice(indexToRemove, 1);
      if (!unprocessedChunks.some((ch) => ch.name === name)) {
        unprocessedChunks.forEach(
          (ch) => {
            ch.linkAfter = ch.linkAfter.filter((after) => after !== name);
          }
        );
      }
    }
    return resultingString.join("\n");
  }
  generateByType(type, content) {
    if (!content) {
      return "";
    }
    if (Array.isArray(content)) {
      return content.map((contentItem) => this.generateByType(type, contentItem)).join("\n");
    }
    if (!this.generators[type]) {
      throw new Error(
        `Attempted to generate unknown type ${type}. Please register a generator for this type in builder/index.ts`
      );
    }
    return this.generators[type](content);
  }
  cleanupInvalidChunks(linkAfter, chunks) {
    return linkAfter.filter((chunkName) => chunks.some((chunk) => chunk.name === chunkName));
  }
};

// src/generator/ModuleBuilder.ts
function createModuleBuilder(options = {
  plugins: [],
  postProcessors: []
}) {
  const chunkGenerator = new ChunkBuilder(options.plugins);
  const linker = new CodeBuilder();
  const generateModule = async (input) => {
    const moduleMainName = options.mainFileName || COMMON_SUB_MODULE_NAME;
    if (chunkGenerator.getPlugins().length <= 0) {
      throw new CodeGeneratorError(
        "No plugins found. Component generation cannot work without any plugins!"
      );
    }
    let files = [];
    const { chunks } = await chunkGenerator.run(input, {
      ir: input,
      chunks: [],
      depNames: [],
      contextData: options.contextData || {}
    });
    chunks.forEach((fileChunkList) => {
      const content = linker.link(fileChunkList);
      const file2 = createResultFile(
        fileChunkList[0].subModule || moduleMainName,
        fileChunkList[0].fileType,
        content
      );
      files.push(file2);
    });
    if (options.postProcessors.length > 0) {
      files = files.map((file2) => {
        let { content, ext: type, name } = file2;
        options.postProcessors.forEach((processer) => {
          content = processer(content, type, name);
        });
        return createResultFile(file2.name, type, content);
      });
    }
    return {
      files
    };
  };
  const generateModuleCode = async (schema) => {
    const schemaParser = new SchemaParser();
    const parseResult = schemaParser.parse(schema);
    const containerInfo = parseResult.containers[0];
    const { files } = await generateModule(containerInfo);
    const dir = createResultDir(containerInfo.moduleName);
    files.forEach((file2) => addFile(dir, file2));
    return dir;
  };
  const linkCodeChunks = (chunks, fileName) => {
    const files = [];
    Object.keys(chunks).forEach((fileKey) => {
      const fileChunkList = chunks[fileKey];
      const content = linker.link(fileChunkList);
      const file2 = createResultFile(
        fileChunkList[0].subModule || fileName,
        fileChunkList[0].fileType,
        content
      );
      files.push(file2);
    });
    return files;
  };
  return {
    generateModule,
    generateModuleCode,
    linkCodeChunks,
    addPlugin: chunkGenerator.addPlugin.bind(chunkGenerator)
  };
}

// src/generator/ProjectBuilder.ts
var ProjectBuilder = class {
  constructor(builderOptions) {
    __publicField(this, "template");
    __publicField(this, "plugins");
    __publicField(this, "postProcessors");
    __publicField(this, "schemaParser");
    __publicField(this, "projectPreProcessors");
    __publicField(this, "projectPostProcessors");
    __publicField(this, "inStrictMode");
    __publicField(this, "extraContextData");
    let customBuilderOptions = builderOptions;
    if (typeof builderOptions.customizeBuilderOptions === "function") {
      customBuilderOptions = builderOptions.customizeBuilderOptions(builderOptions);
    }
    const {
      template,
      plugins: plugins5,
      postProcessors,
      schemaParser = new SchemaParser(),
      projectPreProcessors = [],
      projectPostProcessors = [],
      inStrictMode = false,
      extraContextData = {}
    } = customBuilderOptions;
    this.template = template;
    this.plugins = plugins5;
    this.postProcessors = postProcessors;
    this.schemaParser = schemaParser;
    this.projectPreProcessors = projectPreProcessors;
    this.projectPostProcessors = projectPostProcessors;
    this.inStrictMode = inStrictMode;
    this.extraContextData = extraContextData;
  }
  async generateProject(originalSchema) {
    var _a, _b, _c;
    const { schemaParser } = this;
    let schema = typeof originalSchema === "string" ? JSON.parse(originalSchema) : originalSchema;
    for (const preProcessor of this.projectPreProcessors) {
      schema = await preProcessor(schema);
    }
    if (!schemaParser.validate(schema)) {
      throw new CodeGeneratorError("Schema is invalid");
    }
    const parseResult = schemaParser.parse(schema);
    console.log("ProjectBuilder-133-parseResult: ", parseResult);
    const projectRoot = await this.template.generateTemplate(parseResult);
    console.log("ProjectBuilder-136-projectRoot: ", projectRoot);
    let buildResult = [];
    const builders = this.createModuleBuilders({
      extraContextData: {
        projectRemark: (_a = parseResult == null ? void 0 : parseResult.project) == null ? void 0 : _a.projectRemark,
        template: this.template
      }
    });
    console.log(JSON.stringify(builders));
    console.log("ProjectBuilder-144-parseResult:", JSON.stringify(parseResult));
    const containerBuildResult = await Promise.all(
      parseResult.containers.map(async (containerInfo) => {
        let builder;
        let path3;
        console.log("ProjectBuilder-152-containerInfo:", JSON.stringify(containerInfo));
        console.log("ProjectBuilder-152-path:", JSON.stringify(this.template.slots.pages.path));
        if (containerInfo.containerType === "Page") {
          builder = builders.pages;
          path3 = this.template.slots.pages.path;
        } else {
          builder = builders.components;
          path3 = [];
        }
        console.log("ProjectBuilder-162-path:", JSON.stringify(this.template.slots.pages.path));
        console.log("ProjectBuilder-165-builder:", JSON.stringify(builders));
        let files;
        try {
          let data = await builder.generateModule(containerInfo);
          files = data.files;
        } catch (e) {
          console.log(69, e);
        }
        return {
          moduleName: containerInfo.moduleName,
          path: path3,
          files
        };
      })
    );
    console.log("ProjectBuilder-170-containerBuildResult:", JSON.stringify(containerBuildResult));
    buildResult = buildResult.concat(containerBuildResult);
    console.log("ProjectBuilder-180-buildResult:", JSON.stringify(buildResult));
    if (parseResult.globalRouter && builders.router) {
      const { files } = await builders.router.generateModule(parseResult.globalRouter);
      buildResult.push({
        path: this.template.slots.router.path,
        files
      });
    }
    if (parseResult.project && builders.entry) {
      const { files } = await builders.entry.generateModule(parseResult.project);
      buildResult.push({
        path: this.template.slots.entry.path,
        files
      });
    }
    if (builders.appConfig) {
      const { files } = await builders.appConfig.generateModule(parseResult);
      buildResult.push({
        path: this.template.slots.appConfig.path,
        files
      });
    }
    if (builders.buildConfig) {
      const { files } = await builders.buildConfig.generateModule(parseResult);
      buildResult.push({
        path: this.template.slots.buildConfig.path,
        files
      });
    }
    if (parseResult.project && builders.constants && this.template.slots.constants) {
      const { files } = await builders.constants.generateModule(parseResult.project);
      buildResult.push({
        path: this.template.slots.constants.path,
        files
      });
    }
    if (parseResult.globalUtils && builders.utils && this.template.slots.utils) {
      const { files } = await builders.utils.generateModule(parseResult.globalUtils);
      buildResult.push({
        path: this.template.slots.utils.path,
        files
      });
    }
    if (builders.i18n && this.template.slots.i18n) {
      const { files } = await builders.i18n.generateModule(parseResult.project);
      buildResult.push({
        path: this.template.slots.i18n.path,
        files
      });
    }
    if (parseResult.project && builders.globalStyle) {
      const { files } = await builders.globalStyle.generateModule(parseResult.project);
      buildResult.push({
        path: this.template.slots.globalStyle.path,
        files
      });
    }
    if (parseResult.project && builders.htmlEntry) {
      const { files } = await builders.htmlEntry.generateModule(parseResult.project);
      buildResult.push({
        path: this.template.slots.htmlEntry.path,
        files
      });
    }
    if (parseResult.project && builders.packageJSON) {
      const { files } = await builders.packageJSON.generateModule(parseResult.project);
      buildResult.push({
        path: this.template.slots.packageJSON.path,
        files
      });
    }
    if (parseResult.project && builders.demo) {
      const { files } = await builders.demo.generateModule(parseResult.project);
      buildResult.push({
        path: this.template.slots.demo.path,
        files
      });
    }
    await this.generateExtraSlots(builders, parseResult, buildResult);
    const isSingleComponent = (_c = (_b = parseResult == null ? void 0 : parseResult.project) == null ? void 0 : _b.projectRemark) == null ? void 0 : _c.isSingleComponent;
    console.log("ProjectBuilder-286-Combine Modules:", JSON.stringify(projectRoot));
    buildResult.forEach((moduleInfo) => {
      let targetDir = getDirFromRoot(projectRoot, moduleInfo.path);
      if (moduleInfo.moduleName && !isSingleComponent) {
        const dir = createResultDir(moduleInfo.moduleName);
        addDirectory(targetDir, dir);
        targetDir = dir;
      }
      moduleInfo.files.forEach((file2) => addFile(targetDir, file2));
    });
    let finalResult = projectRoot;
    for (const projectPostProcessor of this.projectPostProcessors) {
      finalResult = await projectPostProcessor(finalResult, schema, originalSchema, {
        template: this.template,
        parseResult
      });
    }
    return finalResult;
  }
  createModuleBuilders(extraContextData = {}) {
    const builders = {};
    Object.keys(this.plugins).forEach((pluginName) => {
      if (this.plugins[pluginName].length > 0) {
        const options = {};
        if (this.template.slots[pluginName] && this.template.slots[pluginName].fileName) {
          options.mainFileName = this.template.slots[pluginName].fileName;
        }
        builders[pluginName] = createModuleBuilder({
          plugins: this.plugins[pluginName],
          postProcessors: this.postProcessors,
          contextData: {
            inStrictMode: this.inStrictMode,
            tolerateEvalErrors: true,
            evalErrorsHandler: "",
            ...this.extraContextData,
            ...extraContextData
          },
          ...options
        });
      }
    });
    return builders;
  }
  async generateExtraSlots(builders, parseResult, buildResult) {
    for (const slotName in this.template.slots) {
      if (!isBuiltinSlotName(slotName)) {
        const { files } = await builders[slotName].generateModule(parseResult);
        buildResult.push({
          path: this.template.slots[slotName].path,
          files
        });
      }
    }
  }
};
function createProjectBuilder(initOptions) {
  return new ProjectBuilder(initOptions);
}
function getDirFromRoot(root, path3) {
  let current = root;
  path3.forEach((p) => {
    const exist = current.dirs.find((d) => d.name === p);
    if (exist) {
      current = exist;
    } else {
      const newDir = createResultDir(p);
      addDirectory(current, newDir);
      current = newDir;
    }
  });
  return current;
}

// src/publisher/disk/index.ts
var defaultFs = __toESM(require("fs"));

// src/publisher/disk/utils.ts
var systemFs = __toESM(require("fs"));
var import_path = require("path");
var writeFolder = async (folder, currentPath, createProjectFolder = true, fs3 = systemFs) => {
  const { name, files, dirs } = folder;
  const folderPath = createProjectFolder ? (0, import_path.join)(currentPath, name) : currentPath;
  if (!fs3.existsSync(folderPath)) {
    await createDirectory(folderPath, fs3);
  }
  const promises = [
    writeFilesToFolder(folderPath, files, fs3),
    writeSubFoldersToFolder(folderPath, dirs, fs3)
  ];
  await Promise.all(promises);
};
var writeFilesToFolder = async (folderPath, files, fs3) => {
  const promises = files.map((file2) => {
    const fileName = file2.ext ? `${file2.name}.${file2.ext}` : file2.name;
    const filePath = (0, import_path.join)(folderPath, fileName);
    return writeContentToFile(filePath, file2.content, "utf8", fs3);
  });
  await Promise.all(promises);
};
var writeSubFoldersToFolder = async (folderPath, subFolders, fs3) => {
  const promises = subFolders.map((subFolder) => {
    return writeFolder(subFolder, folderPath, true, fs3);
  });
  await Promise.all(promises);
};
var createDirectory = (pathToDir, fs3) => {
  return new Promise((resolve2, reject) => {
    fs3.mkdir(pathToDir, { recursive: true }, (err) => {
      err ? reject(err) : resolve2();
    });
  });
};
var writeContentToFile = (filePath, fileContent, encoding = "utf8", fs3) => {
  return new Promise((resolve2, reject) => {
    fs3.writeFile(filePath, fileContent, { encoding }, (err) => {
      err ? reject(err) : resolve2();
    });
  });
};

// src/publisher/disk/index.ts
var createDiskPublisher = (params = {}) => {
  let { project, outputPath = "./" } = params;
  const { fs: fs3 = defaultFs } = params;
  const getProject = () => {
    if (!project) {
      throw new PublisherError("MissingProject");
    }
    return project;
  };
  const setProject = (projectToSet) => {
    project = projectToSet;
  };
  const getOutputPath = () => {
    return outputPath;
  };
  const setOutputPath = (path3) => {
    outputPath = path3;
  };
  const publish = async (options = {}) => {
    var _a;
    const projectToPublish = options.project || project;
    if (!projectToPublish) {
      throw new PublisherError("MissingProject");
    }
    const projectOutputPath = options.outputPath || outputPath;
    const overrideProjectSlug = options.projectSlug || params.projectSlug;
    const createProjectFolder = (_a = options.createProjectFolder) != null ? _a : params.createProjectFolder;
    if (overrideProjectSlug) {
      projectToPublish.name = overrideProjectSlug;
    }
    try {
      await writeFolder(projectToPublish, projectOutputPath, createProjectFolder, fs3);
      return { success: true, payload: projectOutputPath };
    } catch (error) {
      throw new PublisherError(getErrorMessage(error) || "UnknownError");
    }
  };
  return {
    publish,
    getProject,
    setProject,
    getOutputPath,
    setOutputPath
  };
};

// src/publisher/zip/utils.ts
var import_jszip = __toESM(require("jszip"));
var isNodeProcess = () => {
  return typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node !== "undefined";
};
var writeZipToDisk = (zipFolderPath, content, zipName) => {
  if (!isNodeProcess()) {
    throw new Error("ZipPublisher: writeZipToDisk is only available in NodeJS");
  }
  const fs3 = require("fs");
  const path3 = require("path");
  if (!fs3.existsSync(zipFolderPath)) {
    fs3.mkdirSync(zipFolderPath, { recursive: true });
  }
  const zipPath = path3.join(zipFolderPath, `${zipName}.zip`);
  const writeStream = fs3.createWriteStream(zipPath);
  writeStream.write(content);
  writeStream.end();
};
var generateProjectZip = async (project) => {
  let zip = new import_jszip.default();
  zip = writeFolderToZip(project, zip, true);
  const zipType = isNodeProcess() ? "nodebuffer" : "blob";
  console.log("44 zip utils zipType: ", zipType);
  return zip.generateAsync({ type: zipType });
};
var writeFolderToZip = (folder, parentFolder, ignoreFolder = false) => {
  const zipFolder = ignoreFolder ? parentFolder : parentFolder.folder(folder.name);
  if (zipFolder !== null) {
    folder.files.forEach((file2) => {
      const options = {};
      const fileName = file2.ext ? `${file2.name}.${file2.ext}` : file2.name;
      zipFolder.file(fileName, file2.content, options);
    });
    folder.dirs.forEach((subFolder) => {
      writeFolderToZip(subFolder, zipFolder);
    });
  }
  return parentFolder;
};

// src/publisher/zip/index.ts
var import_file_saver = require("file-saver");
var createZipPublisher = (params = {}) => {
  let { project, outputPath } = params;
  const getProject = () => project;
  const setProject = (projectToSet) => {
    project = projectToSet;
  };
  const getOutputPath = () => outputPath;
  const setOutputPath = (path3) => {
    outputPath = path3;
  };
  const publish = async (options = {}) => {
    const projectToPublish = options.project || project;
    if (!projectToPublish) {
      throw new PublisherError("MissingProject");
    }
    const zipName = options.projectSlug || params.projectSlug || projectToPublish.name;
    try {
      console.log("45 lowcode projectToPublish: ", projectToPublish);
      const zipContent = await generateProjectZip(projectToPublish);
      console.log("46 lowcode zipContent: ", zipContent);
      console.log("47 lowcode isNodeProcess: ", isNodeProcess());
      if (isNodeProcess()) {
        const projectOutputPath = options.outputPath || outputPath;
        if (projectOutputPath) {
          await writeZipToDisk(projectOutputPath, zipContent, zipName);
        }
      } else {
        (0, import_file_saver.saveAs)(zipContent, `${zipName}.zip`);
      }
      return { success: true, payload: zipContent };
    } catch (error) {
      throw new PublisherError(getErrorMessage(error) || "UnknownError");
    }
  };
  return {
    publish,
    getProject,
    setProject,
    getOutputPath,
    setOutputPath
  };
};

// src/plugins/common/esmodule.ts
var import_lodash = require("lodash");
var DEP_MAIN_BLOCKLIST = ["lib", "lib/index", "es", "es/index", "main"];
var DEFAULT_EXPORT_NAME = "__default__";
function groupDepsByPack(deps) {
  const depMap = {};
  const addDep = (pkg, dep) => {
    if (!depMap[pkg]) {
      depMap[pkg] = [];
    }
    depMap[pkg].push(dep);
  };
  deps.forEach((dep) => {
    if (dep.dependencyType === "Internal" /* Internal */) {
      addDep(`${dep.moduleName}${dep.main ? `/${dep.main}` : ""}`, dep);
    } else {
      let depMain = "";
      if (dep.main && DEP_MAIN_BLOCKLIST.indexOf(dep.main) < 0) {
        depMain = dep.main;
      }
      if (depMain.substring(0, 1) === "/") {
        depMain = depMain.substring(1);
      }
      addDep(`${dep.package}${depMain ? `/${depMain}` : ""}`, dep);
    }
  });
  return depMap;
}
function getDependencyIdentifier(info) {
  return info.aliasName || info.exportName;
}
function getExportNameOfDep(dep) {
  if (dep.destructuring) {
    return dep.exportName || dep.componentName || throwNewError("destructuring dependency must have exportName or componentName");
  }
  if (!dep.subName) {
    return dep.componentName || dep.exportName || throwNewError("dependency item must have componentName or exportName");
  }
  return dep.exportName || `__$${(0, import_lodash.camelCase)(
    (0, import_lodash.get)(dep, "moduleName") || (0, import_lodash.get)(dep, "package") || throwNewError("dep.moduleName or dep.package is undefined")
  )}_default`;
}
function throwNewError(msg) {
  throw new Error(msg);
}
function buildPackageImport(pkg, deps, targetFileType, useAliasName) {
  if (!pkg || pkg === "undefined" || pkg === "null") {
    return [];
  }
  const chunks = [];
  const exportItems = {};
  const defaultExportNames = [];
  const depsInfo = deps.map((dep) => {
    const info = {
      exportName: getExportNameOfDep(dep),
      isDefault: !dep.destructuring,
      subName: dep.subName || void 0,
      nodeIdentifier: dep.componentName || void 0,
      source: dep
    };
    if (info.isDefault) {
      if (defaultExportNames.indexOf(info.exportName) < 0) {
        defaultExportNames.push(info.exportName);
      }
    }
    if (!info.subName) {
      if (info.nodeIdentifier === info.exportName) {
        info.nodeIdentifier = void 0;
      }
      if (info.isDefault) {
        info.aliasName = info.nodeIdentifier || info.exportName;
        info.exportName = DEFAULT_EXPORT_NAME;
      }
      if (info.nodeIdentifier) {
        info.aliasName = info.nodeIdentifier;
        info.nodeIdentifier = void 0;
      }
    } else {
      if (info.isDefault) {
        info.aliasName = info.exportName;
        info.exportName = DEFAULT_EXPORT_NAME;
      }
      if (info.nodeIdentifier === `${info.exportName}.${info.subName}`) {
        info.nodeIdentifier = void 0;
      }
    }
    return info;
  });
  depsInfo.forEach((info) => {
    if (!exportItems[info.exportName]) {
      exportItems[info.exportName] = {
        exportName: info.exportName,
        isDefault: info.isDefault,
        aliasNames: [],
        needOriginExport: false
      };
    }
    if (!info.nodeIdentifier && !info.aliasName) {
      exportItems[info.exportName].needOriginExport = true;
    }
  });
  depsInfo.forEach((info) => {
    if (info.aliasName) {
      const { aliasNames } = exportItems[info.exportName];
      if (aliasNames.indexOf(info.aliasName) < 0) {
        aliasNames.push(info.aliasName);
      }
    }
  });
  depsInfo.forEach((info) => {
    if (info.nodeIdentifier) {
      const exportItem = exportItems[info.exportName];
      if (!exportItem.needOriginExport && exportItem.aliasNames.length > 0) {
        info.aliasName = exportItem.aliasNames[0];
      }
    }
  });
  const nodeIdentifiers = depsInfo.map((info) => info.nodeIdentifier).filter(Boolean);
  const conflictInfos = (0, import_lodash.flatMap)(Object.keys(exportItems), (exportName) => {
    const exportItem = exportItems[exportName];
    const usedNames = [
      ...exportItem.aliasNames,
      ...exportItem.needOriginExport || exportItem.aliasNames.length <= 0 ? [exportName] : []
    ];
    const conflictNames = usedNames.filter((n) => nodeIdentifiers.indexOf(n) >= 0);
    if (conflictNames.length > 0) {
      return [
        ...conflictNames.indexOf(exportName) >= 0 ? [[exportName, true, exportItem]] : [],
        ...conflictNames.filter((n) => n !== exportName).map((n) => [n, false, exportItem])
      ];
    }
    return [];
  });
  const conflictExports = conflictInfos.filter((c) => c[1]).map((c) => c[0]);
  const conflictAlias = conflictInfos.filter((c) => !c[1]).map((c) => c[0]);
  const solutions = {};
  depsInfo.forEach((info) => {
    if (info.aliasName && conflictAlias.indexOf(info.aliasName) >= 0) {
      let solution = solutions[info.aliasName];
      if (!solution) {
        solution = `${info.aliasName}Alias`;
        const conflictItem = (conflictInfos.find((c) => c[0] === info.aliasName) || [])[2];
        conflictItem.aliasNames = conflictItem.aliasNames.filter((a) => a !== info.aliasName);
        conflictItem.aliasNames.push(solution);
        solutions[info.aliasName] = solution;
      }
      info.aliasName = solution;
    }
    if (conflictExports.indexOf(info.exportName) >= 0) {
      let solution = solutions[info.exportName];
      if (!solution) {
        solution = `${info.exportName}Export`;
        const conflictItem = (conflictInfos.find((c) => c[0] === info.exportName) || [])[2];
        conflictItem.aliasNames.push(solution);
        conflictItem.needOriginExport = false;
        solutions[info.exportName] = solution;
      }
      info.aliasName = solution;
    }
  });
  depsInfo.forEach((info) => {
    const name = info.aliasName || info.exportName;
    if (!isValidIdentifier(name)) {
      throw new CodeGeneratorError(`Invalid Identifier [${name}]`);
    }
    if (info.nodeIdentifier && !isValidIdentifier(info.nodeIdentifier)) {
      throw new CodeGeneratorError(`Invalid Identifier [${info.nodeIdentifier}]`);
    }
  });
  const aliasDefineStatements = {};
  if (useAliasName) {
    Object.keys(exportItems).forEach((exportName) => {
      var _a;
      const aliasList = ((_a = exportItems[exportName]) == null ? void 0 : _a.aliasNames) || [];
      if (aliasList.length > 0) {
        const srcName = exportItems[exportName].needOriginExport ? exportName : aliasList[0];
        const aliasNameList = exportItems[exportName].needOriginExport ? aliasList : aliasList.slice(1);
        aliasNameList.forEach((a) => {
          if (!aliasDefineStatements[a]) {
            aliasDefineStatements[a] = `const ${a} = ${srcName};`;
          }
        });
      }
    });
  }
  function getDefaultExportName(info) {
    if (info.isDefault) {
      return defaultExportNames[0];
    }
    return info.exportName;
  }
  depsInfo.forEach((info) => {
    if (info.nodeIdentifier) {
      const ownerName = getDependencyIdentifier(info);
      chunks.push({
        type: "string" /* STRING */,
        fileType: targetFileType,
        name: COMMON_CHUNK_NAME.ImportAliasDefine,
        content: useAliasName ? `const ${info.nodeIdentifier} = ${ownerName}.${info.subName};` : "",
        linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport, COMMON_CHUNK_NAME.InternalDepsImport],
        ext: {
          originalName: `${getDefaultExportName(info)}.${info.subName}`,
          aliasName: info.nodeIdentifier,
          dependency: info.source
        }
      });
    } else if (info.aliasName) {
      if (info.isDefault && defaultExportNames.find((n) => n === info.aliasName)) {
        delete aliasDefineStatements[info.aliasName];
        return;
      }
      let contentStatement = "";
      if (aliasDefineStatements[info.aliasName]) {
        contentStatement = aliasDefineStatements[info.aliasName];
        delete aliasDefineStatements[info.aliasName];
      }
      chunks.push({
        type: "string" /* STRING */,
        fileType: targetFileType,
        name: COMMON_CHUNK_NAME.ImportAliasDefine,
        content: contentStatement,
        linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport, COMMON_CHUNK_NAME.InternalDepsImport],
        ext: {
          originalName: getDefaultExportName(info),
          aliasName: info.aliasName,
          dependency: info.source
        }
      });
    }
  });
  Object.keys(aliasDefineStatements).forEach((a) => {
    chunks.push({
      type: "string" /* STRING */,
      fileType: targetFileType,
      name: COMMON_CHUNK_NAME.ImportAliasDefine,
      content: aliasDefineStatements[a],
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport, COMMON_CHUNK_NAME.InternalDepsImport]
    });
  });
  const exportItemList = Object.keys(exportItems).map((k) => exportItems[k]);
  const defaultExport = exportItemList.filter((item) => item.isDefault);
  const otherExports = exportItemList.filter((item) => !item.isDefault);
  const statementL = ["import"];
  if (defaultExport.length > 0) {
    if (useAliasName) {
      statementL.push(defaultExportNames[0]);
    } else {
      statementL.push(defaultExport[0].aliasNames[0]);
    }
    if (otherExports.length > 0) {
      statementL.push(", ");
    }
  }
  if (otherExports.length > 0) {
    const items = otherExports.map((item) => {
      return !useAliasName || item.needOriginExport || item.aliasNames.length <= 0 ? item.exportName : `${item.exportName} as ${item.aliasNames[0]}`;
    });
    statementL.push(`{ ${items.join(", ")} }`);
  }
  statementL.push("from");
  const getInternalDependencyModuleId = () => `@/${deps[0].type}/${pkg}`;
  if (deps[0].dependencyType === "Internal" /* Internal */) {
    statementL.push(`'${getInternalDependencyModuleId()}';`);
    chunks.push({
      type: "string" /* STRING */,
      fileType: targetFileType,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      content: statementL.join(" "),
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport]
    });
  } else {
    statementL.push(`'${pkg}';`);
    chunks.push({
      type: "string" /* STRING */,
      fileType: targetFileType,
      name: COMMON_CHUNK_NAME.ExternalDepsImport,
      content: statementL.join(" "),
      linkAfter: []
    });
  }
  if (defaultExportNames.length > 1) {
    if (deps[0].dependencyType === "Internal" /* Internal */) {
      defaultExportNames.slice(1).forEach((exportName) => {
        chunks.push({
          type: "string" /* STRING */,
          fileType: targetFileType,
          name: COMMON_CHUNK_NAME.InternalDepsImport,
          content: `import ${exportName} from '${getInternalDependencyModuleId()}';`,
          linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport]
        });
      });
    } else {
      defaultExportNames.slice(1).forEach((exportName) => {
        chunks.push({
          type: "string" /* STRING */,
          fileType: targetFileType,
          name: COMMON_CHUNK_NAME.ExternalDepsImport,
          content: `import ${exportName} from '${pkg}';`,
          linkAfter: []
        });
        chunks.push({
          type: "string" /* STRING */,
          fileType: targetFileType,
          name: COMMON_CHUNK_NAME.ImportAliasDefine,
          content: "",
          linkAfter: [],
          ext: {
            aliasName: exportName,
            originalName: exportName,
            dependency: {
              package: pkg,
              componentName: exportName
            }
          }
        });
      });
    }
  }
  return chunks;
}
var pluginFactory = (config) => {
  const cfg = {
    fileType: "js" /* JS */,
    useAliasName: true,
    ...config || {}
  };
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    if (ir && ir.deps && ir.deps.length > 0) {
      const deps = cfg.filter ? cfg.filter(ir.deps) : ir.deps;
      const packs = groupDepsByPack(deps);
      Object.keys(packs).forEach((pkg) => {
        const chunks = buildPackageImport(pkg, packs[pkg], cfg.fileType, cfg.useAliasName);
        next.chunks.push(...chunks);
      });
    }
    return next;
  };
  return plugin;
};
var esmodule_default = pluginFactory;

// src/plugins/common/styleImport.ts
var import_change_case3 = __toESM(require("change-case"));
var pluginFactory2 = () => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    const { chunks } = next;
    if (ir && ir.deps && ir.deps.length > 0) {
      let lowcodeMaterialsStyleAdded = false;
      let fusionUIStyleAdded = false;
      let nextStyleAddedMap = {};
      ir.deps.forEach((dep) => {
        if (dep.package === "@alifd/next" && !nextStyleAddedMap[dep.exportName]) {
          chunks.push({
            type: "string" /* STRING */,
            fileType: "jsx" /* JSX */,
            name: COMMON_CHUNK_NAME.InternalDepsImport,
            content: `import '@alifd/next/lib/${import_change_case3.default.paramCase(dep.exportName)}/style';`,
            linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport]
          });
          nextStyleAddedMap[dep.exportName] = true;
        } else if (dep.package === "@alilc/lowcode-materials" && !lowcodeMaterialsStyleAdded) {
          chunks.push({
            type: "string" /* STRING */,
            fileType: "jsx" /* JSX */,
            name: COMMON_CHUNK_NAME.InternalDepsImport,
            content: "import '@alilc/lowcode-materials/lib/style';",
            linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport]
          });
          lowcodeMaterialsStyleAdded = true;
        } else if (dep.package === "@alifd/fusion-ui" && !fusionUIStyleAdded) {
          chunks.push({
            type: "string" /* STRING */,
            fileType: "jsx" /* JSX */,
            name: COMMON_CHUNK_NAME.InternalDepsImport,
            content: "import '@alifd/fusion-ui/lib/style';",
            linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport]
          });
          fusionUIStyleAdded = true;
        }
      });
    }
    return next;
  };
  return plugin;
};
var styleImport_default = pluginFactory2;

// src/plugins/component/react/containerClass.ts
var import_change_case4 = __toESM(require("change-case"));

// src/plugins/component/react/const.ts
var REACT_CHUNK_NAME = {
  ClassRenderStart: "ReactComponentClassRenderStart",
  ClassRenderPre: "ReactComponentClassRenderPre",
  ClassRenderEnd: "ReactComponentClassRenderEnd",
  ClassRenderJSX: "ReactComponentClassRenderJSX",
  ClassDidMountStart: "ReactComponentClassDidMountStart",
  ClassDidMountEnd: "ReactComponentClassDidMountEnd",
  ClassDidMountContent: "ReactComponentClassDidMountContent"
};

// src/plugins/component/react/containerClass.ts
var pluginFactory3 = () => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    const componentClassName = ensureValidClassName(
      `${import_change_case4.default.pascalCase(ir.moduleName)}$$${ir.containerType}`
    );
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: CLASS_DEFINE_CHUNK_NAME.Start,
      content: `class ${componentClassName} extends React.Component {`,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.ImportAliasDefine,
        COMMON_CHUNK_NAME.FileVarDefine,
        COMMON_CHUNK_NAME.FileUtilDefine
      ]
    });
    if (ir.containerType === "Component") {
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: "jsx" /* JSX */,
        name: CLASS_DEFINE_CHUNK_NAME.InsVar,
        content: `static displayName = '${ir.moduleName}';`,
        linkAfter: [
          CLASS_DEFINE_CHUNK_NAME.Start
        ]
      });
    }
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: CLASS_DEFINE_CHUNK_NAME.End,
      content: "}",
      linkAfter: [
        ...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.End],
        REACT_CHUNK_NAME.ClassRenderEnd,
        REACT_CHUNK_NAME.ClassDidMountEnd
      ]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorStart,
      content: "constructor(props, context) { super(props); ",
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorStart]]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorEnd,
      content: "}",
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorEnd]]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: REACT_CHUNK_NAME.ClassDidMountStart,
      content: "componentDidMount() {",
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.End]]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: REACT_CHUNK_NAME.ClassDidMountEnd,
      content: "}",
      linkAfter: [REACT_CHUNK_NAME.ClassDidMountContent, REACT_CHUNK_NAME.ClassDidMountStart]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: REACT_CHUNK_NAME.ClassRenderStart,
      content: "render() {",
      linkAfter: [
        ...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.End],
        REACT_CHUNK_NAME.ClassDidMountEnd
      ]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: REACT_CHUNK_NAME.ClassRenderEnd,
      content: "}",
      linkAfter: [
        REACT_CHUNK_NAME.ClassRenderStart,
        REACT_CHUNK_NAME.ClassRenderPre,
        REACT_CHUNK_NAME.ClassRenderJSX
      ]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: COMMON_CHUNK_NAME.FileExport,
      content: `export default ${componentClassName};`,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.ImportAliasDefine,
        COMMON_CHUNK_NAME.FileVarDefine,
        COMMON_CHUNK_NAME.FileUtilDefine,
        CLASS_DEFINE_CHUNK_NAME.End
      ]
    });
    return next;
  };
  return plugin;
};
var containerClass_default = pluginFactory3;

// src/utils/compositeType.ts
var compositeType_exports = {};
__export(compositeType_exports, {
  generateCompositeType: () => generateCompositeType
});
var import_lowcode_types4 = require("@alilc/lowcode-types");
var import_lodash2 = __toESM(require("lodash"));

// src/utils/jsExpression.ts
var jsExpression_exports = {};
__export(jsExpression_exports, {
  generateExpression: () => generateExpression,
  generateFunction: () => generateFunction,
  isBroadJSFunction: () => isBroadJSFunction
});
var parser2 = __toESM(require("@babel/parser"));
var import_generator7 = __toESM(require("@babel/generator"));
var import_traverse2 = __toESM(require("@babel/traverse"));
var t2 = __toESM(require("@babel/types"));
var import_lowcode_types2 = require("@alilc/lowcode-types");

// src/utils/expressionParser.ts
var expressionParser_exports = {};
__export(expressionParser_exports, {
  ParseError: () => ParseError,
  parseExpression: () => parseExpression2,
  parseExpressionConvertThis2Context: () => parseExpressionConvertThis2Context,
  parseExpressionGetGlobalVariables: () => parseExpressionGetGlobalVariables,
  parseExpressionGetKeywords: () => parseExpressionGetKeywords,
  transformExpressionLocalRef: () => transformExpressionLocalRef
});
var parser = __toESM(require("@babel/parser"));
var import_generator6 = __toESM(require("@babel/generator"));
var import_traverse = __toESM(require("@babel/traverse"));
var t = __toESM(require("@babel/types"));
var import_types10 = require("@babel/types");

// src/utils/OrderedSet.ts
var OrderedSet = class {
  constructor(items) {
    __publicField(this, "_set", /* @__PURE__ */ new Set());
    __publicField(this, "_arr", []);
    if (items) {
      this._set = new Set(items);
      this._arr = items.slice(0);
    }
  }
  add(item) {
    if (!this._set.has(item)) {
      this._set.add(item);
      this._arr.push(item);
    }
  }
  delete(item) {
    if (this._set.has(item)) {
      this._set.delete(item);
      this._arr.splice(this._arr.indexOf(item), 1);
    }
  }
  has(item) {
    return this._set.has(item);
  }
  toArray() {
    return this._arr.slice(0);
  }
};

// src/utils/expressionParser.ts
var ParseError = class extends Error {
  constructor(expr, detail) {
    super(`Failed to parse expression "${typeof expr === "string" ? expr : (0, import_generator6.default)(expr)}"`);
    __publicField(this, "expr");
    __publicField(this, "detail");
    this.expr = expr;
    this.detail = detail;
    Object.setPrototypeOf(this, new.target.prototype);
  }
};
var MAYBE_EXPRESSIONS = {
  ArrayExpression: { fields: ["elements"] },
  AssignmentExpression: { fields: ["left", "right"] },
  BinaryExpression: { fields: ["left", "right"] },
  CallExpression: { fields: ["arguments", "callee"] },
  ConditionalExpression: { fields: ["test", "consequent", "alternate"] },
  DoWhileStatement: { fields: ["test"] },
  ExpressionStatement: { fields: ["expression"] },
  ForInStatement: { fields: ["right"] },
  ForStatement: { fields: ["init", "test", "update"] },
  IfStatement: { fields: ["test"] },
  LogicalExpression: { fields: ["left", "right"] },
  MemberExpression: {
    fields: (node) => {
      return node.type === "MemberExpression" && node.computed ? ["object", "property"] : ["object"];
    }
  },
  NewExpression: { fields: ["callee", "arguments"] },
  ObjectMethod: {
    fields: (node) => {
      return node.type === "ObjectMethod" && node.computed ? ["key"] : [];
    }
  },
  ObjectProperty: {
    fields: (node) => {
      return node.type === "ObjectProperty" && node.computed ? ["key", "value"] : ["value"];
    }
  },
  ReturnStatement: { fields: ["argument"] },
  SequenceExpression: { fields: ["expressions"] },
  ParenthesizedExpression: { fields: ["expression"] },
  SwitchCase: { fields: ["test"] },
  SwitchStatement: { fields: ["discriminant"] },
  ThrowStatement: { fields: ["argument"] },
  UnaryExpression: { fields: ["argument"] },
  UpdateExpression: { fields: ["argument"] },
  VariableDeclarator: { fields: ["init"] },
  WhileStatement: { fields: ["test"] },
  WithStatement: { fields: ["object"] },
  AssignmentPattern: { fields: ["right"] },
  ArrowFunctionExpression: { fields: ["body"] },
  ClassExpression: { fields: ["superClass"] },
  ClassDeclaration: { fields: ["superClass"] },
  ExportDefaultDeclaration: { fields: ["declaration"] },
  ForOfStatement: { fields: ["right"] },
  ClassMethod: {
    fields: (node) => {
      return node.type === "ClassMethod" && node.computed ? ["key"] : [];
    }
  },
  SpreadElement: { fields: ["argument"] },
  TaggedTemplateExpression: { fields: ["tag"] },
  TemplateLiteral: { fields: ["expressions"] },
  YieldExpression: { fields: ["argument"] },
  AwaitExpression: { fields: ["argument"] },
  OptionalMemberExpression: {
    fields: (node) => {
      return node.type === "OptionalMemberExpression" && node.computed ? ["object", "property"] : ["object"];
    }
  },
  OptionalCallExpression: { fields: ["callee", "arguments"] },
  JSXSpreadAttribute: { fields: ["argument"] },
  BindExpression: { fields: ["object", "callee"] },
  ClassProperty: {
    fields: (node) => {
      return node.type === "ClassProperty" && node.computed ? ["key", "value"] : ["value"];
    }
  },
  PipelineTopicExpression: { fields: ["expression"] },
  PipelineBareFunction: { fields: ["callee"] },
  ClassPrivateProperty: { fields: ["value"] },
  Decorator: { fields: ["expression"] },
  TupleExpression: { fields: ["elements"] },
  TSDeclareMethod: {
    fields: (node) => {
      return node.type === "TSDeclareMethod" && node.computed ? ["key"] : [];
    }
  },
  TSPropertySignature: {
    fields: (node) => {
      return node.type === "TSPropertySignature" && node.computed ? ["key", "initializer"] : ["initializer"];
    }
  },
  TSMethodSignature: {
    fields: (node) => {
      return node.type === "TSMethodSignature" && node.computed ? ["key"] : [];
    }
  },
  TSAsExpression: { fields: ["expression"] },
  TSTypeAssertion: { fields: ["expression"] },
  TSEnumDeclaration: { fields: ["initializer"] },
  TSEnumMember: { fields: ["initializer"] },
  TSNonNullExpression: { fields: ["expression"] },
  TSExportAssignment: { fields: ["expression"] }
};
var CROSS_THIS_SCOPE_TYPE_NODE = {
  ArrowFunctionExpression: false,
  FunctionExpression: true,
  FunctionDeclaration: true,
  ClassDeclaration: true,
  ClassExpression: true,
  ClassBody: true,
  ClassImplements: true,
  ClassMethod: true,
  ClassPrivateMethod: true,
  ClassProperty: true,
  ClassPrivateProperty: true,
  DeclareClass: true
};
var JS_KEYWORDS = ["arguments", "this", "super"];
function parseExpressionGetKeywords(expr) {
  if (!expr) {
    return [];
  }
  try {
    const keywordVars = new OrderedSet();
    const ast = parser.parse(`!(${expr});`, {
      plugins: [
        "jsx"
      ]
    });
    const addIdentifierIfNeeded = (x) => {
      if (typeof x === "object" && (0, import_types10.isIdentifier)(x) && JS_KEYWORDS.includes(x.name)) {
        keywordVars.add(x.name);
      }
    };
    (0, import_traverse.default)(ast, {
      enter(path3) {
        var _a;
        const { node } = path3;
        const expressionFields = (_a = MAYBE_EXPRESSIONS[node.type]) == null ? void 0 : _a.fields;
        if (expressionFields) {
          (typeof expressionFields === "function" ? expressionFields(node) : expressionFields).forEach((fieldName) => {
            const fieldValue = node[fieldName];
            if (typeof fieldValue === "object") {
              if (Array.isArray(fieldValue)) {
                fieldValue.forEach((item) => {
                  addIdentifierIfNeeded(item);
                });
              } else {
                addIdentifierIfNeeded(fieldValue);
              }
            }
          });
        }
      }
    });
    return keywordVars.toArray().filter(Boolean);
  } catch (e) {
    throw new ParseError(expr, e);
  }
}
function parseExpressionGetGlobalVariables(expr, { filter = () => true } = {}) {
  if (!expr) {
    return [];
  }
  try {
    const undeclaredVars = new OrderedSet();
    const ast = parser.parse(`!(${expr});`);
    const addUndeclaredIdentifierIfNeeded = (x, path3) => {
      if (typeof x === "object" && (0, import_types10.isIdentifier)(x) && !path3.scope.hasBinding(x.name)) {
        undeclaredVars.add(x.name);
      }
    };
    (0, import_traverse.default)(ast, {
      enter(path3) {
        var _a;
        const { node } = path3;
        const expressionFields = (_a = MAYBE_EXPRESSIONS[node.type]) == null ? void 0 : _a.fields;
        if (expressionFields) {
          (typeof expressionFields === "function" ? expressionFields(node) : expressionFields).forEach((fieldName) => {
            const fieldValue = node[fieldName];
            if (typeof fieldValue === "object") {
              if (Array.isArray(fieldValue)) {
                fieldValue.forEach((item) => {
                  addUndeclaredIdentifierIfNeeded(item, path3);
                });
              } else {
                addUndeclaredIdentifierIfNeeded(fieldValue, path3);
              }
            }
          });
        }
      }
    });
    return undeclaredVars.toArray().filter(filter);
  } catch (e) {
    throw new ParseError(expr, e);
  }
}
function parseExpressionConvertThis2Context(expr, contextName = "__$$context", localVariables = []) {
  if (!expr) {
    return expr;
  }
  try {
    const exprAst = typeof expr === "string" ? parser.parseExpression(expr) : expr;
    const exprWrapAst = t.expressionStatement(exprAst);
    const fileAst = t.file(t.program([exprWrapAst]));
    const localVariablesSet = new Set(localVariables);
    let thisScopeLevel = CROSS_THIS_SCOPE_TYPE_NODE[exprAst.type] ? -1 : 0;
    (0, import_traverse.default)(fileAst, {
      enter(path3) {
        if (CROSS_THIS_SCOPE_TYPE_NODE[path3.node.type]) {
          thisScopeLevel++;
        }
      },
      exit(path3) {
        if (CROSS_THIS_SCOPE_TYPE_NODE[path3.node.type]) {
          thisScopeLevel--;
        }
      },
      MemberExpression(path3) {
        if (!path3.isMemberExpression()) {
          return;
        }
        const obj = path3.get("object");
        if (!obj.isThisExpression()) {
          return;
        }
        if (!path3.node.computed) {
          const prop = path3.get("property");
          if (prop.isIdentifier() && localVariablesSet.has(prop.node.name)) {
            path3.replaceWith(t.identifier(prop.node.name));
            return;
          }
        }
        if (thisScopeLevel <= 0) {
          obj.replaceWith(t.identifier(contextName));
        }
      },
      ThisExpression(path3) {
        if (!path3.isThisExpression()) {
          return;
        }
        if (path3.parent.type === "MemberExpression") {
          return;
        }
        if (thisScopeLevel <= 0) {
          path3.replaceWith(t.identifier(contextName));
        }
      }
    });
    const { code } = (0, import_generator6.default)(exprWrapAst.expression, { sourceMaps: false });
    return code;
  } catch (e) {
    throw new ParseError(expr, e);
  }
}
function parseExpression2(expr) {
  try {
    return parser.parseExpression(expr);
  } catch (e) {
    throw new ParseError(expr, e);
  }
}
function transformExpressionLocalRef(expr, scope) {
  if (!expr) {
    return expr;
  }
  if (!scope) {
    throw new Error("transform expression without scope");
  }
  try {
    const exprAst = typeof expr === "string" ? parser.parseExpression(expr) : expr;
    const exprWrapAst = t.expressionStatement(exprAst);
    const fileAst = t.file(t.program([exprWrapAst]));
    (0, import_traverse.default)(fileAst, {
      MemberExpression(path3) {
        if (!path3.isMemberExpression()) {
          return;
        }
        const obj = path3.get("object");
        if (!obj.isThisExpression()) {
          return;
        }
        const prop = path3.get("property");
        let memberName = "";
        if (!path3.node.computed && prop.isIdentifier()) {
          memberName = prop.node.name;
        } else if (path3.node.computed && prop.isStringLiteral()) {
          memberName = prop.node.value;
        }
        if (memberName && scope.bindings && scope.bindings.hasBinding(memberName)) {
          path3.replaceWith(t.identifier(memberName));
        }
      }
    });
    const { code } = (0, import_generator6.default)(exprWrapAst.expression, { sourceMaps: false });
    return code;
  } catch (e) {
    throw new ParseError(expr, e);
  }
}

// src/utils/jsExpression.ts
function parseFunction(content) {
  try {
    const ast = parser2.parse(`(${content});`, {
      plugins: [
        "jsx"
      ]
    });
    let resultNode = null;
    (0, import_traverse2.default)(ast, {
      FunctionExpression(path3) {
        resultNode = path3.node;
        path3.stop();
      }
    });
    return resultNode;
  } catch (e) {
    throw new ParseError(content, e);
  }
}
function transformFuncExpr2MethodMember(methodName, content) {
  const funcNode = parseFunction(content);
  if (funcNode) {
    const targetNode = t2.classMethod(
      "method",
      methodName && t2.identifier(methodName) || funcNode.id || t2.identifier("notDefineName"),
      funcNode.params,
      funcNode.body,
      void 0,
      void 0,
      void 0,
      funcNode.async || void 0
    );
    const { code: resultCode } = (0, import_generator7.default)(targetNode, { sourceMaps: false });
    return resultCode;
  }
  throw new Error("Can not find Function Statement");
}
function getArrowFunction(content) {
  const funcNode = parseFunction(content);
  if (funcNode) {
    const targetNode = t2.arrowFunctionExpression(
      funcNode.params,
      funcNode.body,
      funcNode.async || void 0
    );
    const { code: resultCode } = (0, import_generator7.default)(targetNode, { sourceMaps: false });
    return resultCode;
  }
  throw new Error("Can not find Function Statement");
}
function getBodyStatements(content) {
  const funcNode = parseFunction(content);
  if (funcNode) {
    const statements = funcNode.body.body;
    const targetNode = t2.program(statements, void 0, "module", void 0);
    const { code: resultCode } = (0, import_generator7.default)(targetNode, { sourceMaps: false });
    return resultCode;
  }
  throw new Error("Can not find Function Statement");
}
function isBroadJSFunction(value) {
  return isJSExpressionFn(value) || (0, import_lowcode_types2.isJSFunction)(value);
}
function generateExpression(value, scope) {
  if ((0, import_lowcode_types2.isJSExpression)(value)) {
    const exprVal = value.value.trim();
    if (!exprVal) {
      return "null";
    }
    const afterProcessWithLocals = transformExpressionLocalRef(exprVal, scope);
    return afterProcessWithLocals;
  }
  throw new CodeGeneratorError("Not a JSExpression");
}
function getFunctionSource(cfg) {
  return cfg.source || cfg.value || cfg.compiled;
}
function generateFunction(value, config = {
  name: void 0,
  isMember: false,
  isBlock: false,
  isArrow: false,
  isBindExpr: false
}) {
  if (isBroadJSFunction(value)) {
    const functionCfg = value;
    const functionSource = getFunctionSource(functionCfg);
    if (config.isMember) {
      return transformFuncExpr2MethodMember(config.name || "", functionSource);
    }
    if (config.isBlock) {
      return getBodyStatements(functionSource);
    }
    if (config.isArrow) {
      return getArrowFunction(functionSource);
    }
    if (config.isBindExpr) {
      return `(${functionSource}).bind(this)`;
    }
    return functionSource;
  }
  if ((0, import_lowcode_types2.isJSExpression)(value)) {
    return value.value;
  }
  throw new CodeGeneratorError("Not a JSFunction or JSExpression");
}

// src/utils/jsSlot.ts
var jsSlot_exports = {};
__export(jsSlot_exports, {
  generateJsSlot: () => generateJsSlot
});
var import_lowcode_types3 = require("@alilc/lowcode-types");

// src/utils/jsxHelpers.ts
function unwrapJsExprQuoteInJsx(jsxExpr) {
  if (jsxExpr.length >= 2 && jsxExpr[0] === "{" && jsxExpr[jsxExpr.length - 1] === "}") {
    return jsxExpr.slice(1, jsxExpr.length - 1);
  }
  return jsxExpr;
}

// src/utils/jsSlot.ts
function generateSingleLineComment(commentText) {
  return `/* ${commentText.split("\n").join(" ").replace(/\*\//g, "*-/")}*/`;
}
function generateJsSlot(slot, scope, generator) {
  if ((0, import_lowcode_types3.isJSSlot)(slot)) {
    const { title, params, value } = slot;
    const slotScope = params ? scope.createSubScope(params || []) : scope;
    const contentExpr = !value ? "null" : generateNodeDataOrArrayForJsSlot(value, generator, slotScope);
    if (params) {
      return [
        title && generateSingleLineComment(title),
        "(",
        (params || []).join(", "),
        ") => ((__$$context) => (",
        contentExpr,
        "))(",
        `  __$$createChildContext(__$$context, { ${(params || []).join(", ")} }`,
        "))"
      ].filter(Boolean).join("");
    }
    return contentExpr || "[]";
  }
  throw new CodeGeneratorError("Not a JSSlot");
}
function generateNodeDataOrArrayForJsSlot(value, generator, scope) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    if (value.length === 1) {
      return unwrapJsExprQuoteInJsx(generator(value, scope)) || "null";
    }
    return `[
${value.map((v) => {
      if (typeof v === "string") {
        return JSON.stringify(v);
      }
      return unwrapJsExprQuoteInJsx(generator(v, scope)) || "null";
    }).join(",\n") || "null"}
]`;
  }
  return unwrapJsExprQuoteInJsx(generator(value, scope)) || "null";
}

// src/utils/aopHelper.ts
function executeFunctionStack(input, scope, funcs, baseFunc, config) {
  const funcList = [];
  if (Array.isArray(funcs)) {
    funcList.push(...funcs);
  } else {
    funcList.push(funcs);
  }
  let next = baseFunc;
  while (funcList.length > 0) {
    const func = funcList.pop();
    if (func) {
      const warppedFunc = ((nextFunc) => (i, s, cfg) => func(i, s, cfg, nextFunc))(next);
      next = warppedFunc;
    }
  }
  return next(input, scope, config);
}

// src/utils/compositeType.ts
function isVariable(v) {
  if (import_lodash2.default.isObject(v) && v.type === "variable") {
    return true;
  }
  return false;
}
function isDataSource(v) {
  return typeof v === "object" && v != null && v.type === "DataSource";
}
function generateArray(value, scope, options = {}) {
  const body = value.map((v) => generateUnknownType(v, scope, options)).join(",");
  return `[${body}]`;
}
function generateObject(value, scope, options = {}) {
  if (value.type === "i18n") {
    if (value.params && typeof value.params === "object") {
      return `this._i18nText(${generateUnknownType(import_lodash2.default.omit(value, "type"), scope, options)})`;
    }
    return `this._i18nText(${JSON.stringify(import_lodash2.default.omit(value, "type"))})`;
  }
  const body = Object.keys(value).map((key) => {
    const propName = JSON.stringify(key);
    const v = generateUnknownType(value[key], scope, options);
    return `${propName}: ${v}`;
  }).join(",\n");
  return `{${body}}`;
}
function generateString(value) {
  return JSON.stringify(value);
}
function generateNumber(value) {
  return String(value);
}
function generateBool(value) {
  return value ? "true" : "false";
}
function genFunction(value) {
  const globalVars = parseExpressionGetKeywords(value.value);
  if (globalVars.includes("arguments")) {
    return generateFunction(value, { isBindExpr: true });
  }
  return generateFunction(value, { isArrow: true });
}
function genJsSlot(value, scope, options = {}) {
  if (options.nodeGenerator) {
    return generateJsSlot(value, scope, options.nodeGenerator);
  }
  return "";
}
function generateUnknownType(value, scope, options = {}) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  if (import_lodash2.default.isUndefined(value)) {
    return "undefined";
  }
  if (import_lodash2.default.isNull(value)) {
    return "null";
  }
  if (import_lodash2.default.isArray(value)) {
    if ((_a = options.handlers) == null ? void 0 : _a.array) {
      return executeFunctionStack(value, scope, options.handlers.array, generateArray, options);
    }
    return generateArray(value, scope, options);
  }
  if (isVariable(value)) {
    const transValue = {
      type: "JSExpression",
      value: value.variable
    };
    if ((_b = options.handlers) == null ? void 0 : _b.expression) {
      const expression = executeFunctionStack(
        transValue,
        scope,
        options.handlers.expression,
        generateExpression,
        options
      );
      return expression || "undefined";
    }
    return generateExpression(transValue, scope);
  }
  if ((0, import_lowcode_types4.isJSExpression)(value)) {
    if ((_c = options.handlers) == null ? void 0 : _c.expression) {
      return executeFunctionStack(
        value,
        scope,
        options.handlers.expression,
        generateExpression,
        options
      );
    }
    return generateExpression(value, scope);
  }
  if ((0, import_lowcode_types4.isJSFunction)(value) || isJSExpressionFn(value)) {
    if ((_d = options.handlers) == null ? void 0 : _d.function) {
      return executeFunctionStack(value, scope, options.handlers.function, genFunction, options);
    }
    return genFunction(value);
  }
  if ((0, import_lowcode_types4.isJSSlot)(value)) {
    if ((_e = options.handlers) == null ? void 0 : _e.slot) {
      return executeFunctionStack(value, scope, options.handlers.slot, genJsSlot, options);
    }
    return genJsSlot(value, scope, options);
  }
  if (isDataSource(value)) {
    return generateUnknownType(
      {
        type: "JSExpression",
        value: `this.dataSourceMap[${JSON.stringify(value.id)}]`
      },
      scope,
      options
    );
  }
  if (import_lodash2.default.isObject(value)) {
    if ((_f = options.handlers) == null ? void 0 : _f.object) {
      return executeFunctionStack(value, scope, options.handlers.object, generateObject, options);
    }
    return generateObject(value, scope, options);
  }
  if (import_lodash2.default.isString(value)) {
    if ((_g = options.handlers) == null ? void 0 : _g.string) {
      return executeFunctionStack(value, scope, options.handlers.string, generateString, options);
    }
    return generateString(value);
  }
  if (import_lodash2.default.isNumber(value)) {
    if ((_h = options.handlers) == null ? void 0 : _h.number) {
      return executeFunctionStack(value, scope, options.handlers.number, generateNumber, options);
    }
    return generateNumber(value);
  }
  if (import_lodash2.default.isBoolean(value)) {
    if ((_i = options.handlers) == null ? void 0 : _i.boolean) {
      return executeFunctionStack(value, scope, options.handlers.boolean, generateBool, options);
    }
    return generateBool(value);
  }
  throw new CodeGeneratorError("Meet unknown composite value type");
}
function generateCompositeType(value, scope, options = {}) {
  const result = generateUnknownType(value, scope, options);
  return result;
}

// src/utils/Scope.ts
var Scope_exports = {};
__export(Scope_exports, {
  Scope: () => Scope
});

// src/utils/ScopeBindings.ts
var ScopeBindings = class {
  constructor(p = null) {
    __publicField(this, "parent");
    __publicField(this, "_bindings", new OrderedSet());
    this.parent = p;
  }
  hasBinding(varName) {
    var _a;
    return this._bindings.has(varName) || !!((_a = this.parent) == null ? void 0 : _a.hasBinding(varName));
  }
  hasOwnBinding(varName) {
    return this._bindings.has(varName);
  }
  addBinding(varName) {
    this._bindings.add(varName);
  }
  removeBinding(varName) {
    this._bindings.delete(varName);
  }
  getAllBindings() {
    const allBindings = new OrderedSet(this._bindings.toArray());
    for (let { parent } = this; parent; parent = parent == null ? void 0 : parent.parent) {
      parent.getAllOwnedBindings().forEach((varName) => {
        allBindings.add(varName);
      });
    }
    return allBindings.toArray();
  }
  getAllOwnedBindings() {
    return this._bindings.toArray();
  }
};

// src/utils/Scope.ts
var Scope = class {
  constructor(parent = null) {
    this.parent = parent;
    __publicField(this, "bindings");
    this.bindings = void 0;
  }
  static createRootScope() {
    return new Scope();
  }
  createSubScope(ownIdentifiers) {
    const originalScopeBindings = this.bindings;
    const newScopeBindings = new ScopeBindings(originalScopeBindings);
    ownIdentifiers.forEach((identifier3) => {
      newScopeBindings.addBinding(identifier3);
    });
    const newScope = new Scope(this);
    newScope.bindings = newScopeBindings;
    return newScope;
  }
};

// src/plugins/component/react/containerInitState.ts
var pluginFactory4 = (config) => {
  const cfg = {
    fileType: "jsx" /* JSX */,
    implementType: "inConstructor",
    ...config
  };
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    const scope = Scope.createRootScope();
    const state = ir.state || {};
    const fields = Object.keys(state).map((stateName) => {
      const value = generateCompositeType(state[stateName], scope);
      return `${stateName}: ${value},`;
    });
    if (cfg.implementType === "inConstructor") {
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
        content: `this.state = { ${fields.join("")} };`,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorContent]]
      });
    } else if (cfg.implementType === "insMember") {
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsVar,
        content: `state = { ${fields.join("")} };`,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsVar]]
      });
    }
    return next;
  };
  return plugin;
};
var containerInitState_default = pluginFactory4;

// src/plugins/component/react/containerInjectContext.ts
var pluginFactory5 = (config) => {
  const cfg = {
    fileType: "jsx" /* JSX */,
    ...config
  };
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    const scope = Scope.createRootScope();
    const { inStrictMode } = next.contextData;
    if (!inStrictMode) {
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsVar,
        content: `
          _context = this;
        `,
        linkAfter: [CLASS_DEFINE_CHUNK_NAME.Start]
      });
    } else {
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsVar,
        content: `
          _context = this._createContext();
        `,
        linkAfter: [CLASS_DEFINE_CHUNK_NAME.Start]
      });
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod,
        content: `
          _createContext() {
            const self = this;
            const context = {
              get state() { return self.state; },
              setState(newState, callback) { self.setState(newState, callback); },
              get dataSourceMap() { return self._dataSourceEngine.dataSourceMap || {}; },
              async reloadDataSource() { await self._dataSourceEngine.reloadDataSource(); },
              get utils() { return self.utils; },
              get page() { return context; },
              get component() { return context; },
              get props() { return self.props; },
              get constants() { return self.constants; },
              get $() { return self.$ },
              get $$() { return self.$$ },
              ...this._methods,
            };
  
            return context;
          }
        `,
        linkAfter: DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod]
      });
    }
    return next;
  };
  return plugin;
};
var containerInjectContext_default = pluginFactory5;

// src/utils/pathHelper.ts
var pathHelper_exports = {};
__export(pathHelper_exports, {
  getSlotRelativePath: () => getSlotRelativePath
});
function relativePath(from, to) {
  const length = Math.min(from.length, to.length);
  let samePartsLength = length;
  for (let i = 0; i < length; i++) {
    if (from[i] !== to[i]) {
      samePartsLength = i;
      break;
    }
  }
  if (samePartsLength === 0) {
    return to;
  }
  let outputParts = [];
  for (let i = samePartsLength; i < from.length; i++) {
    outputParts.push("..");
  }
  outputParts = [...outputParts, ...to.slice(samePartsLength)];
  if (outputParts[0] !== "..") {
    outputParts.unshift(".");
  }
  return outputParts;
}
function getSlotRelativePath(options) {
  var _a, _b, _c;
  const { contextData, from, to } = options;
  const isSingleComponent = (_b = (_a = contextData == null ? void 0 : contextData.extraContextData) == null ? void 0 : _a.projectRemark) == null ? void 0 : _b.isSingleComponent;
  const template = (_c = contextData == null ? void 0 : contextData.extraContextData) == null ? void 0 : _c.template;
  let toPath = template.slots[to].path;
  toPath = [...toPath, template.slots[to].fileName];
  let fromPath = template.slots[from].path;
  if (!isSingleComponent && ["components", "pages"].indexOf(from) !== -1) {
    fromPath = [...fromPath, "pageName"];
  }
  return relativePath(fromPath, toPath).join("/");
}

// src/plugins/component/react/containerInjectUtils.ts
var pluginFactory6 = (config) => {
  const cfg = {
    fileType: "jsx" /* JSX */,
    ...config
  };
  const plugin = async (pre) => {
    var _a;
    const next = {
      ...pre
    };
    const ir = next.ir;
    next.contextData.useRefApi = true;
    const useRef = !!((_a = ir.analyzeResult) == null ? void 0 : _a.isUsingRef);
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      content: `
        import utils${useRef ? ", { RefsManager }" : ""} from '${getSlotRelativePath({ contextData: next.contextData, from: "components", to: "utils" })}';
      `,
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport]
    });
    if (cfg.preferClassProperty) {
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsVar,
        content: "utils = utils;",
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsVar]]
      });
    } else {
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
        content: "this.utils = utils;",
        linkAfter: [CLASS_DEFINE_CHUNK_NAME.ConstructorStart]
      });
    }
    if (useRef) {
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
        content: "this._refsManager = new RefsManager();",
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorContent]]
      });
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
        content: `
          $ = (refName) => {
            return this._refsManager.get(refName);
          }
        `,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]]
      });
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
        content: `
          $$ = (refName) => {
            return this._refsManager.getAll(refName);
          }
        `,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]]
      });
    } else {
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
        content: " $ = () => null; ",
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]]
      });
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
        content: " $$ = () => [];        ",
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]]
      });
    }
    return next;
  };
  return plugin;
};
var containerInjectUtils_default = pluginFactory6;

// src/plugins/component/react/containerInjectDataSourceEngine.ts
var import_lowcode_types5 = require("@alilc/lowcode-types");
var import_change_case5 = __toESM(require("change-case"));
var pluginFactory7 = (config) => {
  const cfg = {
    ...config,
    fileType: (config == null ? void 0 : config.fileType) || "jsx" /* JSX */
  };
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const scope = Scope.createRootScope();
    const dataSourceConfig = isValidContainerType(pre.ir) ? pre.ir.dataSource : null;
    const dataSourceItems = dataSourceConfig && dataSourceConfig.list || [];
    const dataSourceEngineOptions = { runtimeConfig: true };
    if (dataSourceItems.length > 0) {
      const requestHandlersMap = {};
      dataSourceItems.forEach((ds) => {
        var _a, _b;
        const dsType = ds.type || "fetch";
        if (!(dsType in requestHandlersMap) && dsType !== "custom") {
          const handlerFactoryName = `__$$create${import_change_case5.default.pascal(dsType)}RequestHandler`;
          requestHandlersMap[dsType] = {
            type: "JSExpression",
            value: handlerFactoryName + (dsType === "urlParams" ? "(window.location.search)" : "()")
          };
          const handlerFactoryExportName = `create${import_change_case5.default.pascal(dsType)}Handler`;
          const handlerPkgName = ((_b = (_a = cfg.datasourceConfig) == null ? void 0 : _a.handlersPackages) == null ? void 0 : _b[dsType]) || `@alilc/lowcode-datasource-${import_change_case5.default.kebab(dsType)}-handler`;
          next.chunks.push({
            type: "string" /* STRING */,
            fileType: "jsx" /* JSX */,
            name: COMMON_CHUNK_NAME.ExternalDepsImport,
            content: `
              import { ${handlerFactoryExportName} as ${handlerFactoryName} } from '${handlerPkgName}';
            `,
            linkAfter: []
          });
        }
      });
      Object.assign(dataSourceEngineOptions, { requestHandlersMap });
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: "jsx" /* JSX */,
        name: COMMON_CHUNK_NAME.ExternalDepsImport,
        content: `
          import { create as __$$createDataSourceEngine } from '@alilc/lowcode-datasource-engine/runtime';
        `,
        linkAfter: []
      });
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsVar,
        content: `
          _dataSourceConfig = this._defineDataSourceConfig();
          _dataSourceEngine = __$$createDataSourceEngine(
            this._dataSourceConfig,
            this,
            ${generateCompositeType(dataSourceEngineOptions, scope)}
          );

          get dataSourceMap() {
            return this._dataSourceEngine.dataSourceMap || {};
          }

          reloadDataSource = async () => {
            await this._dataSourceEngine.reloadDataSource();
          }

          `,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsVar]]
      });
      next.chunks.unshift({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: REACT_CHUNK_NAME.ClassDidMountContent,
        content: `
          this._dataSourceEngine.reloadDataSource();
        `,
        linkAfter: [REACT_CHUNK_NAME.ClassDidMountStart]
      });
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
        content: `
  _defineDataSourceConfig() {
    const _this = this;
    return (${generateCompositeType(
          {
            ...dataSourceConfig,
            list: [
              ...dataSourceItems.map((item) => ({
                ...item,
                isInit: wrapAsFunction(item.isInit, scope),
                options: wrapAsFunction(item.options, scope)
              }))
            ]
          },
          scope,
          {
            handlers: {
              function: (jsFunc) => parseExpressionConvertThis2Context(jsFunc.value, "_this"),
              expression: (jsExpr) => parseExpressionConvertThis2Context(jsExpr.value, "_this")
            }
          }
        )});
  }
        `,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]]
      });
    }
    return next;
  };
  return plugin;
};
var containerInjectDataSourceEngine_default = pluginFactory7;
function wrapAsFunction(value, scope) {
  if ((0, import_lowcode_types5.isJSExpression)(value) || (0, import_lowcode_types5.isJSFunction)(value) || isJSExpressionFn(value)) {
    return {
      type: "JSExpression",
      value: `function(){ return ((${value.value}))}.bind(this)`
    };
  }
  return {
    type: "JSExpression",
    value: `function(){return((${generateCompositeType(value, scope)}))}.bind(this)`
  };
}

// src/plugins/component/react/containerInjectConstants.ts
var pluginFactory8 = (config) => {
  const cfg = {
    fileType: "jsx" /* JSX */,
    ...config
  };
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      content: "import __$$constants from '../../constants';",
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsVar,
      content: `
        get constants() {
          return __$$constants || {};
        }
        `,
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsVar]]
    });
    return next;
  };
  return plugin;
};
var containerInjectConstants_default = pluginFactory8;

// src/plugins/component/react/containerInjectI18n.ts
var pluginFactory9 = (config) => {
  const cfg = {
    fileType: "jsx" /* JSX */,
    ...config
  };
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      content: `
        import * as __$$i18n from '${getSlotRelativePath({ contextData: next.contextData, from: "components", to: "i18n" })}';
      `,
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
      content: `
        __$$i18n._inject2(this);
      `,
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorContent]]
    });
    return next;
  };
  return plugin;
};
var containerInjectI18n_default = pluginFactory9;

// src/plugins/component/react/containerLifeCycle.ts
var import_lowcode_types6 = require("@alilc/lowcode-types");
var pluginFactory10 = (config) => {
  const cfg = {
    fileType: "jsx" /* JSX */,
    exportNameMapping: {},
    normalizeNameMapping: {},
    ...config
  };
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    if (ir.lifeCycles) {
      const { lifeCycles } = ir;
      const chunks = Object.keys(lifeCycles).map((lifeCycleName) => {
        var _a;
        if (!(0, import_lowcode_types6.isJSFunction)(lifeCycles[lifeCycleName]) && !isJSExpressionFn(lifeCycles[lifeCycleName]) && !(0, import_lowcode_types6.isJSExpression)(lifeCycles[lifeCycleName])) {
          return null;
        }
        let normalizeName;
        if (lifeCycleName === "constructor") {
          normalizeName = lifeCycleName;
        } else {
          normalizeName = cfg.normalizeNameMapping[lifeCycleName] || lifeCycleName;
        }
        if ((_a = cfg == null ? void 0 : cfg.exclude) == null ? void 0 : _a.includes(normalizeName)) {
          return null;
        }
        const exportName = cfg.exportNameMapping[lifeCycleName] || lifeCycleName;
        if (normalizeName === "constructor") {
          return {
            type: "string" /* STRING */,
            fileType: cfg.fileType,
            name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
            content: generateFunction(lifeCycles[lifeCycleName], { isBlock: true }),
            linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorStart]]
          };
        }
        if (normalizeName === "componentDidMount") {
          return {
            type: "string" /* STRING */,
            fileType: cfg.fileType,
            name: REACT_CHUNK_NAME.ClassDidMountContent,
            content: generateFunction(lifeCycles[lifeCycleName], { isBlock: true }),
            linkAfter: [REACT_CHUNK_NAME.ClassDidMountStart]
          };
        }
        if (normalizeName === "render") {
          return {
            type: "string" /* STRING */,
            fileType: cfg.fileType,
            name: REACT_CHUNK_NAME.ClassRenderPre,
            content: generateFunction(lifeCycles[lifeCycleName], { isBlock: true }),
            linkAfter: [REACT_CHUNK_NAME.ClassRenderStart]
          };
        }
        return {
          type: "string" /* STRING */,
          fileType: cfg.fileType,
          name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
          content: generateFunction(lifeCycles[lifeCycleName], {
            name: exportName,
            isMember: true
          }),
          linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]]
        };
      }).filter((i) => !!i);
      next.chunks.push(...chunks.filter((x) => x !== null));
    }
    return next;
  };
  return plugin;
};
var containerLifeCycle_default = pluginFactory10;

// src/plugins/component/react/containerMethod.ts
var pluginFactory11 = (config) => {
  const cfg = {
    fileType: "jsx" /* JSX */,
    ...config
  };
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    const { inStrictMode } = next.contextData;
    if (!ir.methods) {
      return next;
    }
    const { methods } = ir;
    const chunks = Object.keys(methods).map((methodName) => ({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
      content: generateFunction(methods[methodName], { name: methodName, isMember: true }),
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]]
    }));
    next.chunks.push(...chunks);
    if (inStrictMode) {
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
        content: Object.keys(ir.methods).map(
          (methodName) => isValidIdentifier(methodName) ? `.${methodName}` : `[${JSON.stringify(methodName)}]`
        ).map((method) => `this._context${method} = this${method};`).join("\n"),
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorContent]]
      });
    }
    return next;
  };
  return plugin;
};
var containerMethod_default = pluginFactory11;

// src/utils/nodeToJSX.ts
var nodeToJSX_exports = {};
__export(nodeToJSX_exports, {
  createNodeGenerator: () => createNodeGenerator,
  createReactNodeGenerator: () => createReactNodeGenerator,
  generateConditionReactCtrl: () => generateConditionReactCtrl,
  generateReactExprInJS: () => generateReactExprInJS,
  generateReactLoopCtrl: () => generateReactLoopCtrl,
  isPureString: () => isPureString
});
var import_lodash4 = __toESM(require("lodash"));
var import_function = require("fp-ts/function");
var import_lowcode_types7 = require("@alilc/lowcode-types");

// src/utils/encodeJsxAttrString.ts
var import_lodash3 = __toESM(require("lodash"));
var SPECIAL_CHARS = `
\r'"<>&`;
var SPECIAL_CHARS_REG = new RegExp(
  `[${SPECIAL_CHARS.split("").map((c) => `\\x${import_lodash3.default.padStart(c.charCodeAt(0).toString(16), 2, "0")}`).join("")}]`,
  "g"
);
function encodeJsxStringNode(str) {
  return str.replace(SPECIAL_CHARS_REG, (c) => `&#${c.charCodeAt(0)};`);
}

// src/core/jsx/handlers/transformThis2Context.ts
var import_generator16 = __toESM(require("@babel/generator"));
function transformThis2Context(expr, scope, { ignoreRootScope = false } = {}) {
  var _a;
  if (ignoreRootScope && scope.parent == null) {
    return typeof expr === "string" ? expr : (0, import_generator16.default)(expr).code;
  }
  return parseExpressionConvertThis2Context(
    expr,
    "__$$context",
    ((_a = scope.bindings) == null ? void 0 : _a.getAllBindings()) || []
  );
}

// src/utils/nodeToJSX.ts
function mergeNodeGeneratorConfig(cfg1, cfg2 = {}) {
  const resCfg = {};
  if (cfg1.handlers || cfg2.handlers) {
    resCfg.handlers = {
      ...cfg1.handlers || {},
      ...cfg2.handlers || {}
    };
  }
  if (cfg1.tagMapping || cfg2.tagMapping) {
    resCfg.tagMapping = cfg2.tagMapping || cfg1.tagMapping;
  }
  if (cfg1.attrPlugins || cfg2.attrPlugins) {
    resCfg.attrPlugins = [];
    resCfg.attrPlugins.push(...cfg2.attrPlugins || []);
    resCfg.attrPlugins.push(...cfg1.attrPlugins || []);
  }
  if (cfg1.nodePlugins || cfg2.nodePlugins) {
    resCfg.nodePlugins = [];
    resCfg.nodePlugins.push(...cfg2.nodePlugins || []);
    resCfg.nodePlugins.push(...cfg1.nodePlugins || []);
  }
  return resCfg;
}
function isPureString(v) {
  return v[0] === "'" && v[v.length - 1] === "'" || v[0] === '"' && v[v.length - 1] === '"';
}
function generateAttrValue(attrData, scope, config) {
  const valueStr = generateCompositeType(attrData.attrValue, scope, {
    handlers: config == null ? void 0 : config.handlers,
    nodeGenerator: config == null ? void 0 : config.self
  });
  return [
    {
      type: "NodeCodePieceAttr" /* ATTR */,
      name: attrData.attrName,
      value: valueStr
    }
  ];
}
function generateAttr(attrName, attrValue, scope, config) {
  let pieces;
  if (config == null ? void 0 : config.attrPlugins) {
    pieces = executeFunctionStack(
      { attrName, attrValue },
      scope,
      config.attrPlugins,
      generateAttrValue,
      config
    );
  } else {
    pieces = generateAttrValue({ attrName, attrValue }, scope, config);
  }
  pieces = pieces.map((p) => {
    let newValue;
    if (p.value && isPureString(p.value)) {
      const content = getStaticExprValue(p.value);
      newValue = JSON.stringify(encodeJsxStringNode(content));
    } else {
      newValue = `{${p.value}}`;
    }
    return {
      value: `${p.name}=${newValue}`,
      type: "NodeCodePieceAttr" /* ATTR */
    };
  });
  return pieces;
}
function generateAttrs(nodeItem, scope, config) {
  const { props } = nodeItem;
  let pieces = [];
  if (props) {
    if (!Array.isArray(props)) {
      Object.keys(props).forEach((propName) => {
        if (isValidIdentifier(propName)) {
          pieces = pieces.concat(generateAttr(propName, props[propName], scope, config));
        }
      });
    } else {
      props.forEach((prop) => {
        if (prop.name && isValidIdentifier(prop.name) && !prop.spread) {
          pieces = pieces.concat(generateAttr(prop.name, prop.value, scope, config));
        }
      });
    }
  }
  return pieces;
}
function generateBasicNode(nodeItem, scope, config) {
  const pieces = [];
  const tagName = ((config == null ? void 0 : config.tagMapping) || import_lodash4.default.identity)(nodeItem.componentName);
  pieces.push({
    value: tagName || "",
    type: "NodeCodePieceTag" /* TAG */
  });
  return pieces;
}
function generateSimpleNode(nodeItem, scope, config) {
  const basicParts = generateBasicNode(nodeItem, scope, config) || [];
  const attrParts = generateAttrs(nodeItem, scope, config) || [];
  const childrenParts = [];
  if (nodeItem.children && (config == null ? void 0 : config.self)) {
    const childrenStr = config.self(nodeItem.children, scope);
    childrenParts.push({
      type: "NodeCodePieceChildren" /* CHILDREN */,
      value: childrenStr
    });
  }
  return [...basicParts, ...attrParts, ...childrenParts];
}
function linkPieces(pieces) {
  const tagsPieces = pieces.filter((p) => p.type === "NodeCodePieceTag" /* TAG */);
  if (tagsPieces.length !== 1) {
    throw new CodeGeneratorError("Only one tag definition required", tagsPieces);
  }
  const tagName = tagsPieces[0].value;
  const beforeParts = pieces.filter((p) => p.type === "NodeCodePieceBefore" /* BEFORE */).map((p) => p.value).join("");
  const afterParts = pieces.filter((p) => p.type === "NodeCodePieceAfter" /* AFTER */).map((p) => p.value).join("");
  const childrenParts = pieces.filter((p) => p.type === "NodeCodePieceChildren" /* CHILDREN */).map((p) => p.value).join("");
  let attrsParts = pieces.filter((p) => p.type === "NodeCodePieceAttr" /* ATTR */).map((p) => p.value).join(" ");
  attrsParts = attrsParts ? ` ${attrsParts}` : "";
  if (childrenParts) {
    return `${beforeParts}<${tagName}${attrsParts}>${childrenParts}</${tagName}>${afterParts}`;
  }
  return `${beforeParts}<${tagName}${attrsParts} />${afterParts}`;
}
function generateNodeSchema(nodeItem, scope, config) {
  const pieces = [];
  if (config == null ? void 0 : config.nodePlugins) {
    const res = executeFunctionStack(
      nodeItem,
      scope,
      config.nodePlugins,
      generateSimpleNode,
      config
    );
    pieces.push(...res);
  } else {
    pieces.push(...generateSimpleNode(nodeItem, scope, config));
  }
  return linkPieces(pieces);
}
function generateReactLoopCtrl(nodeItem, scope, config, next) {
  var _a, _b, _c;
  if (nodeItem.loop) {
    const tolerateEvalErrors = (_a = config == null ? void 0 : config.tolerateEvalErrors) != null ? _a : true;
    const loopItemName = ((_b = nodeItem.loopArgs) == null ? void 0 : _b[0]) || "item";
    const loopIndexName = ((_c = nodeItem.loopArgs) == null ? void 0 : _c[1]) || "index";
    const subScope = scope.createSubScope([loopItemName, loopIndexName]);
    const pieces = next ? next(nodeItem, subScope, config) : [];
    const loopDataExpr = (0, import_function.pipe)(
      nodeItem.loop,
      (expr) => generateCompositeType(expr, scope, {
        handlers: config == null ? void 0 : config.handlers,
        tolerateEvalErrors: false
      }),
      (expr) => transformThis2Context(expr, scope, { ignoreRootScope: true }),
      (expr) => tolerateEvalErrors ? `__$$evalArray(() => (${expr}))` : expr
    );
    pieces.unshift({
      value: `(${loopDataExpr}).map((${loopItemName}, ${loopIndexName}) => ((__$$context) => (`,
      type: "NodeCodePieceBefore" /* BEFORE */
    });
    pieces.push({
      value: `))(__$$createChildContext(__$$context, { ${loopItemName}, ${loopIndexName} })))`,
      type: "NodeCodePieceAfter" /* AFTER */
    });
    return pieces;
  }
  return next ? next(nodeItem, scope, config) : [];
}
function generateConditionReactCtrl(nodeItem, scope, config, next) {
  const pieces = next ? next(nodeItem, scope, config) : [];
  if (nodeItem.condition != null && nodeItem.condition !== true) {
    const value = generateCompositeType(nodeItem.condition, scope, {
      handlers: config == null ? void 0 : config.handlers
    });
    pieces.unshift({
      value: `!!(${value}) && (`,
      type: "NodeCodePieceBefore" /* BEFORE */
    });
    pieces.push({
      value: ")",
      type: "NodeCodePieceAfter" /* AFTER */
    });
  }
  return pieces;
}
function generateReactExprInJS(nodeItem, scope, config, next) {
  const pieces = next ? next(nodeItem, scope, config) : [];
  if (nodeItem.condition != null && nodeItem.condition !== true || nodeItem.loop != null) {
    pieces.unshift({
      value: "{",
      type: "NodeCodePieceBefore" /* BEFORE */
    });
    pieces.push({
      value: "}",
      type: "NodeCodePieceAfter" /* AFTER */
    });
  }
  return pieces;
}
var handleChildren = (v) => v.join("");
function createNodeGenerator(cfg = {}) {
  const generateNode = (nodeItem, scope) => {
    if (import_lodash4.default.isArray(nodeItem)) {
      const resList = nodeItem.map((n) => generateNode(n, scope));
      return handleChildren(resList);
    }
    if ((0, import_lowcode_types7.isNodeSchema)(nodeItem)) {
      return generateNodeSchema(nodeItem, scope, {
        ...cfg,
        self: generateNode
      });
    }
    const valueStr = generateCompositeType(nodeItem, scope, {
      handlers: cfg.handlers,
      nodeGenerator: generateNode
    });
    if (isPureString(valueStr)) {
      return encodeJsxStringNode(getStaticExprValue(valueStr));
    }
    return `{${valueStr}}`;
  };
  return (nodeItem, scope) => unwrapJsExprQuoteInJsx(generateNode(nodeItem, scope));
}
var defaultReactGeneratorConfig = {
  nodePlugins: [generateReactExprInJS, generateReactLoopCtrl, generateConditionReactCtrl]
};
function createReactNodeGenerator(cfg) {
  const newCfg = mergeNodeGeneratorConfig(defaultReactGeneratorConfig, cfg);
  return createNodeGenerator(newCfg);
}

// src/core/jsx/util/isLiteralAtomicExpr.ts
function isLiteralAtomicExpr(expr) {
  return expr === "null" || expr === "undefined" || expr === "true" || expr === "false" || /^-?\d+(\.\d+)?$/.test(expr);
}

// src/core/jsx/util/isSimpleStraightLiteral.ts
function isSimpleStraightLiteral(expr) {
  switch (expr.type) {
    case "BigIntLiteral":
    case "BooleanLiteral":
    case "DecimalLiteral":
    case "NullLiteral":
    case "NumericLiteral":
    case "RegExpLiteral":
    case "StringLiteral":
      return true;
    default:
      return false;
  }
}

// src/core/jsx/handlers/transformJsExpression.ts
function transformJsExpr(expr, scope, { dontWrapEval = false, dontTransformThis2ContextAtRootScope = false } = {}) {
  if (!expr) {
    return "undefined";
  }
  if (isLiteralAtomicExpr(expr)) {
    return expr;
  }
  const exprAst = parseExpression2(expr);
  if (isSimpleStraightLiteral(exprAst)) {
    return expr;
  }
  if (dontWrapEval) {
    return transformThis2Context(exprAst, scope, {
      ignoreRootScope: dontTransformThis2ContextAtRootScope
    });
  }
  switch (exprAst.type) {
    case "ArrowFunctionExpression":
    case "FunctionExpression":
      return transformThis2Context(exprAst, scope, {
        ignoreRootScope: dontTransformThis2ContextAtRootScope
      });
    default:
      break;
  }
  return `__$$eval(() => (${transformThis2Context(exprAst, scope, {
    ignoreRootScope: dontTransformThis2ContextAtRootScope
  })}))`;
}

// src/plugins/component/react/jsx.ts
var pluginFactory12 = (config) => {
  const cfg = {
    fileType: "jsx" /* JSX */,
    nodeTypeMapping: {},
    ...config
  };
  const { nodeTypeMapping } = cfg;
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const { tolerateEvalErrors = true, evalErrorsHandler = "" } = next.contextData;
    const customHandlers = {
      expression(input, scope2, config2) {
        var _a;
        return transformJsExpr(generateExpression(input, scope2), scope2, {
          dontWrapEval: !((_a = config2 == null ? void 0 : config2.tolerateEvalErrors) != null ? _a : tolerateEvalErrors),
          dontTransformThis2ContextAtRootScope: true
        });
      },
      function(input, scope2) {
        return transformThis2Context(
          generateCompositeType(
            {
              type: "JSFunction",
              value: input.value || "function () {}"
            },
            Scope.createRootScope()
          ),
          scope2,
          { ignoreRootScope: true }
        );
      }
    };
    const generatorPlugins = {
      handlers: customHandlers,
      tagMapping: (v) => nodeTypeMapping[v] || v,
      tolerateEvalErrors
    };
    if (next.contextData.useRefApi) {
      generatorPlugins.attrPlugins = [
        (attrData, scope2, pluginCfg, nextFunc) => {
          if (attrData.attrName === "ref") {
            return [
              {
                name: attrData.attrName,
                value: `this._refsManager.linkRef('${attrData.attrValue}')`,
                type: "NodeCodePieceAttr" /* ATTR */
              }
            ];
          }
          return nextFunc ? nextFunc(attrData, scope2, pluginCfg) : [];
        }
      ];
    }
    const generator = createReactNodeGenerator(generatorPlugins);
    const ir = next.ir;
    const scope = Scope.createRootScope();
    const jsxContent = generator(ir, scope);
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: REACT_CHUNK_NAME.ClassRenderJSX,
      content: `
        const __$$context = this._context || this;
        const { state } = __$$context;
        return ${jsxContent};
      `,
      linkAfter: [REACT_CHUNK_NAME.ClassRenderStart, REACT_CHUNK_NAME.ClassRenderPre]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.CustomContent,
      content: [
        tolerateEvalErrors && `
          function __$$eval(expr) {
            try {
              return expr();
            } catch (error) {
              ${evalErrorsHandler}
            }
          }

          function __$$evalArray(expr) {
            const res = __$$eval(expr);
            return Array.isArray(res) ? res : [];
          }
      `,
        `
        function __$$createChildContext(oldContext, ext) {
          const childContext = {
            ...oldContext,
            ...ext,
          };
          childContext.__proto__ = oldContext;
          return childContext;
        }
      `
      ].filter(Boolean).join("\n"),
      linkAfter: [COMMON_CHUNK_NAME.FileExport]
    });
    return next;
  };
  return plugin;
};
var jsx_default = pluginFactory12;

// src/plugins/component/react/reactCommonDeps.ts
var pluginFactory13 = () => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: COMMON_CHUNK_NAME.ExternalDepsImport,
      content: `
// \u6CE8\u610F: \u51FA\u7801\u5F15\u64CE\u6CE8\u5165\u7684\u4E34\u65F6\u53D8\u91CF\u9ED8\u8BA4\u90FD\u4EE5 "__$$" \u5F00\u5934\uFF0C\u7981\u6B62\u5728\u642D\u5EFA\u7684\u4EE3\u7801\u4E2D\u76F4\u63A5\u8BBF\u95EE\u3002
// \u4F8B\u5916\uFF1Areact \u6846\u67B6\u7684\u5BFC\u51FA\u540D\u548C\u5404\u79CD\u7EC4\u4EF6\u540D\u9664\u5916\u3002
'use client';
import React from 'react';`,
      linkAfter: []
    });
    return next;
  };
  return plugin;
};
var reactCommonDeps_default = pluginFactory13;

// src/plugins/component/style/css.ts
var pluginFactory14 = (config) => {
  const cfg = {
    fileType: "css" /* CSS */,
    moduleFileType: "jsx" /* JSX */,
    ...config
  };
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.StyleCssContent,
      content: ir.css,
      linkAfter: [COMMON_CHUNK_NAME.StyleDepsImport]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.moduleFileType,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      content: `import './page.${cfg.fileType}';`,
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport]
    });
    return next;
  };
  return plugin;
};
var css_default = pluginFactory14;

// src/plugins/project/constants.ts
var pluginFactory15 = () => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    const scope = Scope.createRootScope();
    const constantStr = generateCompositeType(ir.constants || {}, scope);
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "js" /* JS */,
      name: COMMON_CHUNK_NAME.FileVarDefine,
      content: `
        const __$$constants = (${constantStr});
      `,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.ImportAliasDefine
      ]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "js" /* JS */,
      name: COMMON_CHUNK_NAME.FileExport,
      content: `
        export default __$$constants;
      `,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.ImportAliasDefine,
        COMMON_CHUNK_NAME.FileVarDefine,
        COMMON_CHUNK_NAME.FileUtilDefine,
        COMMON_CHUNK_NAME.FileMainContent
      ]
    });
    return next;
  };
  return plugin;
};
var constants_default = pluginFactory15;

// src/plugins/project/i18n.ts
var pluginFactory16 = () => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    const i18nStr = ir.i18n ? JSON.stringify(ir.i18n, null, 2) : "{}";
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "js" /* JS */,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: `
        const i18nConfig = ${i18nStr};

        let locale = typeof navigator === 'object' && typeof navigator.language === 'string' ? navigator.language : 'zh-CN';

        const getLocale = () => locale;

        const setLocale = (target) => {
          locale = target;
        };

        const isEmptyVariables = variables => (
          Array.isArray(variables) && variables.length === 0
          || typeof variables === 'object' && (!variables || Object.keys(variables).length === 0)
        );

        // \u6309\u4F4E\u4EE3\u7801\u89C4\u8303\u91CC\u9762\u7684\u8981\u6C42\u8FDB\u884C\u53D8\u91CF\u66FF\u6362
        const format = (msg, variables) => (
          typeof msg === 'string'
            ? msg.replace(/\\$?\\{(\\w+)\\}/g, (match, key) => variables?.[key] ?? '')
            : msg
        );

        const i18nFormat = ({ id, defaultMessage, fallback }, variables) => {
          const msg = i18nConfig[locale]?.[id] ??  i18nConfig[locale.replace('-', '_')]?.[id] ??  defaultMessage;
          if (msg == null) {
            console.warn('[i18n]: unknown message id: %o (locale=%o)', id, locale);
            return fallback === undefined ? \`\${id}\` : fallback;
          }

          return format(msg, variables);
        }

        const i18n = (id, params) => {
          return i18nFormat({ id }, params);
        };

        // \u5C06\u56FD\u9645\u5316\u7684\u4E00\u4E9B\u65B9\u6CD5\u6CE8\u5165\u5230\u76EE\u6807\u5BF9\u8C61&\u4E0A\u4E0B\u6587\u4E2D
        const _inject2 = (target) => {
          target.i18n = i18n;
          target.getLocale = getLocale;
          target.setLocale = (locale) => {
            setLocale(locale);
            target.forceUpdate();
          };
          target._i18nText = (t) => {
            // \u4F18\u5148\u53D6\u76F4\u63A5\u4F20\u8FC7\u6765\u7684\u8BED\u6599
            const localMsg = t[locale] ?? t[String(locale).replace('-', '_')]
            if (localMsg != null) {
              return format(localMsg, t.params);
            }

            // \u5176\u6B21\u7528\u9879\u76EE\u7EA7\u522B\u7684
            const projectMsg = i18nFormat({ id: t.key, fallback: null }, t.params);
            if (projectMsg != null) {
              return projectMsg;
            }

            // \u515C\u5E95\u7528 use \u6307\u5B9A\u7684\u6216\u9ED8\u8BA4\u8BED\u8A00\u7684
            return format(t[t.use || "zh-CN"] ?? t.en_US, t.params);
          }

          // \u6CE8\u5165\u5230\u4E0A\u4E0B\u6587\u4E2D\u53BB
          if (target._context && target._context !== target) {
            Object.assign(target._context, {
              i18n,
              getLocale, setLocale: target.setLocale
            });
          }
        }
      `,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.ImportAliasDefine,
        COMMON_CHUNK_NAME.FileVarDefine,
        COMMON_CHUNK_NAME.FileUtilDefine
      ]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "js" /* JS */,
      name: COMMON_CHUNK_NAME.FileExport,
      content: `
        export {
          getLocale,
          setLocale,
          i18n,
          i18nFormat,
          _inject2,
        };
      `,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.ImportAliasDefine,
        COMMON_CHUNK_NAME.FileVarDefine,
        COMMON_CHUNK_NAME.FileUtilDefine,
        COMMON_CHUNK_NAME.FileMainContent
      ]
    });
    return next;
  };
  return plugin;
};
var i18n_default = pluginFactory16;

// src/plugins/project/utils.ts
var pluginFactory17 = (baseFramework) => {
  const plugin = async (pre) => {
    const framework = baseFramework || "react";
    const next = {
      ...pre
    };
    const ir = next.ir;
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "js" /* JS */,
      name: COMMON_CHUNK_NAME.ExternalDepsImport,
      content: `
        import { createRef } from '${framework}';
      `,
      linkAfter: []
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "js" /* JS */,
      name: COMMON_CHUNK_NAME.FileUtilDefine,
      content: `
        export class RefsManager {
          constructor() {
            this.refInsStore = {};
          }

          clearNullRefs() {
            Object.keys(this.refInsStore).forEach((refName) => {
              const filteredInsList = this.refInsStore[refName].filter(insRef => !!insRef.current);
              if (filteredInsList.length > 0) {
                this.refInsStore[refName] = filteredInsList;
              } else {
                delete this.refInsStore[refName];
              }
            });
          }

          get(refName) {
            this.clearNullRefs();
            if (this.refInsStore[refName] && this.refInsStore[refName].length > 0) {
              return this.refInsStore[refName][0].current;
            }

            return null;
          }

          getAll(refName) {
            this.clearNullRefs();
            if (this.refInsStore[refName] && this.refInsStore[refName].length > 0) {
              return this.refInsStore[refName].map(i => i.current);
            }

            return [];
          }

          linkRef(refName) {
            const refIns = createRef();
            this.refInsStore[refName] = this.refInsStore[refName] || [];
            this.refInsStore[refName].push(refIns);
            return refIns;
          }
        }
      `,
      linkAfter: [...DEFAULT_LINK_AFTER[COMMON_CHUNK_NAME.FileUtilDefine]]
    });
    if (ir.utils) {
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: "js" /* JS */,
        name: COMMON_CHUNK_NAME.FileExport,
        content: `
          export default {
        `,
        linkAfter: [
          COMMON_CHUNK_NAME.ExternalDepsImport,
          COMMON_CHUNK_NAME.InternalDepsImport,
          COMMON_CHUNK_NAME.ImportAliasDefine,
          COMMON_CHUNK_NAME.FileVarDefine,
          COMMON_CHUNK_NAME.FileUtilDefine,
          COMMON_CHUNK_NAME.FileMainContent
        ]
      });
      ir.utils.forEach((util) => {
        if (util.type === "function") {
          next.chunks.push({
            type: "string" /* STRING */,
            fileType: "js" /* JS */,
            name: COMMON_CHUNK_NAME.FileVarDefine,
            content: `
              const ${util.name} = ${util.content.value};
            `,
            linkAfter: [
              COMMON_CHUNK_NAME.ExternalDepsImport,
              COMMON_CHUNK_NAME.InternalDepsImport,
              COMMON_CHUNK_NAME.ImportAliasDefine
            ]
          });
        }
        next.chunks.push({
          type: "string" /* STRING */,
          fileType: "js" /* JS */,
          name: COMMON_CHUNK_NAME.FileExport,
          content: `${util.name},`,
          linkAfter: [
            COMMON_CHUNK_NAME.ExternalDepsImport,
            COMMON_CHUNK_NAME.InternalDepsImport,
            COMMON_CHUNK_NAME.ImportAliasDefine,
            COMMON_CHUNK_NAME.FileVarDefine,
            COMMON_CHUNK_NAME.FileUtilDefine,
            COMMON_CHUNK_NAME.FileMainContent
          ]
        });
      });
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: "js" /* JS */,
        name: COMMON_CHUNK_NAME.FileExport,
        content: `
          };
        `,
        linkAfter: [
          COMMON_CHUNK_NAME.ExternalDepsImport,
          COMMON_CHUNK_NAME.InternalDepsImport,
          COMMON_CHUNK_NAME.ImportAliasDefine,
          COMMON_CHUNK_NAME.FileVarDefine,
          COMMON_CHUNK_NAME.FileUtilDefine,
          COMMON_CHUNK_NAME.FileMainContent
        ]
      });
    }
    return next;
  };
  return plugin;
};
var utils_default = pluginFactory17;

// src/utils/templateHelper.ts
var templateHelper_exports = {};
__export(templateHelper_exports, {
  insertFile: () => insertFile,
  runFileGenerator: () => runFileGenerator
});
function insertFile(root, path3, file2) {
  let current = root;
  path3.forEach((pathNode) => {
    const dir = current.dirs.find((d) => d.name === pathNode);
    if (dir) {
      current = dir;
    } else {
      const newDir = createResultDir(pathNode);
      addDirectory(current, newDir);
      current = newDir;
    }
  });
  addFile(current, file2);
}
function runFileGenerator(root, fun) {
  try {
    const result = fun();
    const [path3, file2] = result;
    insertFile(root, path3, file2);
  } catch (error) {
    throw new Error(`Error: ${typeof fun}`);
  }
}

// src/plugins/project/framework/icejs/template/files/abc.json.ts
function getFile() {
  return [
    [],
    {
      name: "abc",
      ext: "json",
      content: `
{
  "type": "ice-app",
  "builder": "@ali/builder-ice-app"
}
    `
    }
  ];
}

// src/plugins/project/framework/icejs/template/files/build.json.ts
function getFile2() {
  return [
    [],
    {
      name: "build",
      ext: "json",
      content: `
{
  "entry": "src/app.js",
  "plugins": [
    [
      "build-plugin-fusion",
      {
        "themePackage": "@alifd/theme-design-pro"
      }
    ],
    [
      "build-plugin-moment-locales",
      {
        "locales": [
          "zh-cn"
        ]
      }
    ]
  ]
}
      `
    }
  ];
}

// src/plugins/project/framework/icejs/template/files/editorconfig.ts
function getFile3() {
  const file2 = createResultFile(
    ".editorconfig",
    "",
    `
# http://editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
    `
  );
  return [[], file2];
}

// src/plugins/project/framework/icejs/template/files/eslintignore.ts
function getFile4() {
  const file2 = createResultFile(
    ".eslintignore",
    "",
    `
# \u5FFD\u7565\u76EE\u5F55
build/
tests/
demo/
.ice/

# node \u8986\u76D6\u7387\u6587\u4EF6
coverage/

# \u5FFD\u7565\u6587\u4EF6
**/*-min.js
**/*.min.js

package-lock.json
yarn.lock
    `
  );
  return [[], file2];
}

// src/plugins/project/framework/icejs/template/files/eslintrc.js.ts
function getFile5() {
  const file2 = createResultFile(
    ".eslintrc",
    "js",
    `
const { eslint } = require('@ice/spec');

module.exports = eslint;
    `
  );
  return [[], file2];
}

// src/plugins/project/framework/icejs/template/files/gitignore.ts
function getFile6() {
  const file2 = createResultFile(
    ".gitignore",
    "",
    `
# See https://help.github.com/ignore-files/ for more about ignoring files.

# dependencies
node_modules/

# production
build/
dist/
tmp/
lib/

# misc
.idea/
.happypack
.DS_Store
*.swp
*.dia~
.ice

npm-debug.log*
yarn-debug.log*
yarn-error.log*
index.module.scss.d.ts
    `
  );
  return [[], file2];
}

// src/plugins/project/framework/icejs/template/files/jsconfig.json.ts
function getFile7() {
  const file2 = createResultFile(
    "jsconfig",
    "json",
    `
{
  "compilerOptions": {
    "baseUrl": ".",
    "jsx": "react",
    "paths": {
      "@/*": ["./src/*"],
      "ice": [".ice/index.ts"],
      "ice/*": [".ice/pages/*"]
    }
  }
}
    `
  );
  return [[], file2];
}

// src/plugins/project/framework/icejs/template/files/prettierignore.ts
function getFile8() {
  const file2 = createResultFile(
    ".prettierignore",
    "",
    `
build/
tests/
demo/
.ice/
coverage/
**/*-min.js
**/*.min.js
package-lock.json
yarn.lock
    `
  );
  return [[], file2];
}

// src/plugins/project/framework/icejs/template/files/prettierrc.js.ts
function getFile9() {
  const file2 = createResultFile(
    ".prettierrc",
    "js",
    `
const { prettier } = require('@ice/spec');

module.exports = prettier;
    `
  );
  return [[], file2];
}

// src/plugins/project/framework/icejs/template/files/README.md.ts
function getFile10() {
  const file2 = createResultFile(
    "README",
    "md",
    `
## Scaffold Lite

> \u8F7B\u91CF\u7EA7\u6A21\u677F\uFF0C\u4F7F\u7528 JavaScript\uFF0C\u4EC5\u5305\u542B\u57FA\u7840\u7684 Layout\u3002

## \u4F7F\u7528

\`\`\`bash
# \u5B89\u88C5\u4F9D\u8D56
$ npm install

# \u542F\u52A8\u670D\u52A1
$ npm start  # visit http://localhost:3333
\`\`\`

[More docs](https://ice.work/docs/guide/about).

## \u76EE\u5F55

\`\`\`md
\u251C\u2500\u2500 build/                         # \u6784\u5EFA\u4EA7\u7269
\u251C\u2500\u2500 mock/                          # \u672C\u5730\u6A21\u62DF\u6570\u636E
\u2502   \u251C\u2500\u2500 index.[j,t]s
\u251C\u2500\u2500 public/
\u2502   \u251C\u2500\u2500 index.html                 # \u5E94\u7528\u5165\u53E3 HTML
\u2502   \u2514\u2500\u2500 favicon.png                # Favicon
\u251C\u2500\u2500 src/                           # \u6E90\u7801\u8DEF\u5F84
\u2502   \u251C\u2500\u2500 components/                # \u81EA\u5B9A\u4E49\u4E1A\u52A1\u7EC4\u4EF6
\u2502   \u2502   \u2514\u2500\u2500 Guide/
\u2502   \u2502       \u251C\u2500\u2500 index.[j,t]sx
\u2502   \u2502       \u251C\u2500\u2500 index.module.scss
\u2502   \u251C\u2500\u2500 layouts/                   # \u5E03\u5C40\u7EC4\u4EF6
\u2502   \u2502   \u2514\u2500\u2500 BasicLayout/
\u2502   \u2502       \u251C\u2500\u2500 index.[j,t]sx
\u2502   \u2502       \u2514\u2500\u2500 index.module.scss
\u2502   \u251C\u2500\u2500 pages/                     # \u9875\u9762
\u2502   \u2502   \u2514\u2500\u2500 Home/                  # home \u9875\u9762\uFF0C\u7EA6\u5B9A\u8DEF\u7531\u8F6C\u6210\u5C0F\u5199
\u2502   \u2502       \u251C\u2500\u2500 components/        # \u9875\u9762\u7EA7\u81EA\u5B9A\u4E49\u4E1A\u52A1\u7EC4\u4EF6
\u2502   \u2502       \u251C\u2500\u2500 models.[j,t]sx     # \u9875\u9762\u7EA7\u6570\u636E\u72B6\u6001
\u2502   \u2502       \u251C\u2500\u2500 index.[j,t]sx      # \u9875\u9762\u5165\u53E3
\u2502   \u2502       \u2514\u2500\u2500 index.module.scss  # \u9875\u9762\u6837\u5F0F\u6587\u4EF6
\u2502   \u251C\u2500\u2500 configs/                   # [\u53EF\u9009] \u914D\u7F6E\u6587\u4EF6
\u2502   \u2502   \u2514\u2500\u2500 menu.[j,t]s            # [\u53EF\u9009] \u83DC\u5355\u914D\u7F6E
\u2502   \u251C\u2500\u2500 models/                    # [\u53EF\u9009] \u5E94\u7528\u7EA7\u6570\u636E\u72B6\u6001
\u2502   \u2502   \u2514\u2500\u2500 user.[j,t]s
\u2502   \u251C\u2500\u2500 utils/                     # [\u53EF\u9009] \u5DE5\u5177\u5E93
\u2502   \u251C\u2500\u2500 global.scss                # \u5168\u5C40\u6837\u5F0F
\u2502   \u251C\u2500\u2500 routes.[j,t]s              # \u8DEF\u7531\u914D\u7F6E
\u2502   \u2514\u2500\u2500 app.[j,t]s[x]              # \u5E94\u7528\u5165\u53E3\u811A\u672C
\u251C\u2500\u2500 build.json                     # \u5DE5\u7A0B\u914D\u7F6E
\u251C\u2500\u2500 README.md
\u251C\u2500\u2500 package.json
\u251C\u2500\u2500 .editorconfig
\u251C\u2500\u2500 .eslintignore
\u251C\u2500\u2500 .eslintrc.[j,t]s
\u251C\u2500\u2500 .gitignore
\u251C\u2500\u2500 .stylelintignore
\u251C\u2500\u2500 .stylelintrc.[j,t]s
\u251C\u2500\u2500 .gitignore
\u2514\u2500\u2500 [j,t]sconfig.json
\`\`\`
    `
  );
  return [[], file2];
}

// src/plugins/project/framework/icejs/template/files/src/layouts/BasicLayout/components/Footer/index.jsx.ts
function getFile11() {
  const file2 = createResultFile(
    "index",
    "jsx",
    `
import React from 'react';
import styles from './index.module.scss';

export default function Footer() {
  return (
    <p className={styles.footer}>
      <span className={styles.logo}>Alibaba Fusion</span>
      <br />
      <span className={styles.copyright}>\xA9 2019-\u73B0\u5728 Alibaba Fusion & ICE</span>
    </p>
  );
}
    `
  );
  return [["src", "layouts", "BasicLayout", "components", "Footer"], file2];
}

// src/plugins/project/framework/icejs/template/files/src/layouts/BasicLayout/components/Footer/index.style.ts
function getFile12() {
  const file2 = createResultFile(
    "index",
    "module.scss",
    `
.footer {
  line-height: 20px;
  text-align: center;
}

.logo {
  font-weight: bold;
  font-size: 16px;
}

.copyright {
  font-size: 12px;
}
    `
  );
  return [["src", "layouts", "BasicLayout", "components", "Footer"], file2];
}

// src/plugins/project/framework/icejs/template/files/src/layouts/BasicLayout/components/Logo/index.jsx.ts
function getFile13() {
  const file2 = createResultFile(
    "index",
    "jsx",
    `
import React from 'react';
import { Link } from 'ice';
import styles from './index.module.scss';

export default function Logo({ image, text, url }) {
  return (
    <div className="logo">
      <Link to={url || '/'} className={styles.logo}>
        {image && <img src={image} alt="logo" />}
        <span>{text}</span>
      </Link>
    </div>
  );
}
    `
  );
  return [["src", "layouts", "BasicLayout", "components", "Logo"], file2];
}

// src/plugins/project/framework/icejs/template/files/src/layouts/BasicLayout/components/Logo/index.style.ts
function getFile14() {
  const file2 = createResultFile(
    "index",
    "module.scss",
    `
.logo{
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text1-1;
  font-weight: bold;
  font-size: 14px;
  line-height: 22px;

  &:visited, &:link {
    color: $color-text1-1;
  }

  img {
    height: 24px;
    margin-right: 10px;
  }
}
    `
  );
  return [["src", "layouts", "BasicLayout", "components", "Logo"], file2];
}

// src/plugins/project/framework/icejs/template/files/src/layouts/BasicLayout/components/PageNav/index.jsx.ts
function getFile15() {
  const file2 = createResultFile(
    "index",
    "jsx",
    `
import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'ice';
import { Nav } from '@alifd/next';
import { asideMenuConfig } from '../../menuConfig';

const { SubNav } = Nav;
const NavItem = Nav.Item;

function getNavMenuItems(menusData) {
  if (!menusData) {
    return [];
  }

  return menusData
    .filter(item => item.name && !item.hideInMenu)
    .map((item, index) => getSubMenuOrItem(item, index));
}

function getSubMenuOrItem(item, index) {
  if (item.children && item.children.some(child => child.name)) {
    const childrenItems = getNavMenuItems(item.children);

    if (childrenItems && childrenItems.length > 0) {
      const subNav = (
        <SubNav key={index} icon={item.icon} label={item.name}>
          {childrenItems}
        </SubNav>
      );
      return subNav;
    }

    return null;
  }

  const navItem = (
    <NavItem key={item.path} icon={item.icon}>
      <Link to={item.path}>{item.name}</Link>
    </NavItem>
  );
  return navItem;
}

const Navigation = (props, context) => {
  const { location } = props;
  const { pathname } = location;
  const { isCollapse } = context;
  return (
    <Nav
      type="primary"
      selectedKeys={[pathname]}
      defaultSelectedKeys={[pathname]}
      embeddable
      openMode="single"
      iconOnly={isCollapse}
      hasArrow={false}
      mode={isCollapse ? 'popup' : 'inline'}
    >
      {getNavMenuItems(asideMenuConfig)}
    </Nav>
  );
};

Navigation.contextTypes = {
  isCollapse: PropTypes.bool,
};
const PageNav = withRouter(Navigation);
export default PageNav;
    `
  );
  return [["src", "layouts", "BasicLayout", "components", "PageNav"], file2];
}

// src/plugins/project/framework/icejs/template/files/src/layouts/BasicLayout/index.jsx.ts
function getFile16() {
  const file2 = createResultFile(
    "index",
    "jsx",
    `
import React, { useState } from 'react';
import { Shell, ConfigProvider } from '@alifd/next';
import PageNav from './components/PageNav';
import Logo from './components/Logo';
import Footer from './components/Footer';

(function() {
  const throttle = function(type, name, obj = window) {
    let running = false;

    const func = () => {
      if (running) {
        return;
      }

      running = true;
      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };

    obj.addEventListener(type, func);
  };

  throttle('resize', 'optimizedResize');
})();

export default function BasicLayout({ children }) {
  const getDevice = width => {
    const isPhone =
      typeof navigator !== 'undefined' && navigator && navigator.userAgent.match(/phone/gi);

    if (width < 680 || isPhone) {
      return 'phone';
    }
    if (width < 1280 && width > 680) {
      return 'tablet';
    }
    return 'desktop';
  };

  const [device, setDevice] = useState(getDevice(NaN));
  window.addEventListener('optimizedResize', e => {
    setDevice(getDevice(e && e.target && e.target.innerWidth));
  });
  return (
    <ConfigProvider device={device}>
      <Shell
        type="dark"
        style={{
          minHeight: '100vh',
        }}
      >
        <Shell.Branding>
          <Logo
            image="https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png"
            text="Logo"
          />
        </Shell.Branding>
        <Shell.Navigation
          direction="hoz"
          style={{
            marginRight: 10,
          }}
        ></Shell.Navigation>
        <Shell.Action></Shell.Action>
        <Shell.Navigation>
          <PageNav />
        </Shell.Navigation>

        <Shell.Content>{children}</Shell.Content>
        <Shell.Footer>
          <Footer />
        </Shell.Footer>
      </Shell>
    </ConfigProvider>
  );
}
    `
  );
  return [["src", "layouts", "BasicLayout"], file2];
}

// src/plugins/project/framework/icejs/template/files/src/layouts/BasicLayout/menuConfig.js.ts
function getFile17() {
  const file2 = createResultFile(
    "menuConfig",
    "js",
    `
const headerMenuConfig = [];
const asideMenuConfig = [
  {
    name: 'Dashboard',
    path: '/',
    icon: 'smile',
  },
];
export { headerMenuConfig, asideMenuConfig };
    `
  );
  return [["src", "layouts", "BasicLayout"], file2];
}

// src/plugins/project/framework/icejs/template/files/stylelintignore.ts
function getFile18() {
  const file2 = createResultFile(
    ".stylelintignore",
    "",
    `
# \u5FFD\u7565\u76EE\u5F55
build/
tests/
demo/

# node \u8986\u76D6\u7387\u6587\u4EF6
coverage/
    `
  );
  return [[], file2];
}

// src/plugins/project/framework/icejs/template/files/stylelintrc.js.ts
function getFile19() {
  const file2 = createResultFile(
    ".stylelintrc",
    "js",
    `
const { stylelint } = require('@ice/spec');

module.exports = stylelint;
    `
  );
  return [[], file2];
}

// src/plugins/project/framework/icejs/template/files/tsconfig.json.ts
function getFile20() {
  const file2 = createResultFile(
    "tsconfig",
    "json",
    `
{
  "compileOnSave": false,
  "buildOnSave": false,
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "build",
    "module": "esnext",
    "target": "es6",
    "jsx": "react",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "lib": ["es6", "dom"],
    "sourceMap": true,
    "allowJs": true,
    "rootDir": "./",
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": false,
    "importHelpers": true,
    "strictNullChecks": true,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"],
      "ice": [".ice/index.ts"],
      "ice/*": [".ice/pages/*"]
    }
  },
  "include": ["src/*", ".ice"],
  "exclude": ["node_modules", "build", "public"]
}
    `
  );
  return [[], file2];
}

// src/plugins/project/framework/icejs/template/static-files.ts
function generateStaticFiles(root = createResultDir(".")) {
  runFileGenerator(root, getFile20);
  runFileGenerator(root, getFile19);
  runFileGenerator(root, getFile18);
  runFileGenerator(root, getFile9);
  runFileGenerator(root, getFile8);
  runFileGenerator(root, getFile7);
  runFileGenerator(root, getFile6);
  runFileGenerator(root, getFile5);
  runFileGenerator(root, getFile4);
  runFileGenerator(root, getFile3);
  runFileGenerator(root, getFile2);
  runFileGenerator(root, getFile);
  runFileGenerator(root, getFile10);
  runFileGenerator(root, getFile16);
  runFileGenerator(root, getFile17);
  runFileGenerator(root, getFile11);
  runFileGenerator(root, getFile12);
  runFileGenerator(root, getFile13);
  runFileGenerator(root, getFile14);
  runFileGenerator(root, getFile15);
  return root;
}

// src/plugins/project/framework/icejs/template/index.ts
var icejsTemplate = {
  slots: {
    components: {
      path: ["src", "components"]
    },
    pages: {
      path: ["src", "pages"]
    },
    router: {
      path: ["src"],
      fileName: "routes"
    },
    entry: {
      path: ["src"],
      fileName: "app"
    },
    constants: {
      path: ["src"],
      fileName: "constants"
    },
    utils: {
      path: ["src"],
      fileName: "utils"
    },
    i18n: {
      path: ["src"],
      fileName: "i18n"
    },
    globalStyle: {
      path: ["src"],
      fileName: "global"
    },
    htmlEntry: {
      path: ["public"],
      fileName: "index"
    },
    packageJSON: {
      path: [],
      fileName: "package"
    }
  },
  generateTemplate() {
    return generateStaticFiles();
  }
};
var template_default = icejsTemplate;

// src/plugins/project/framework/icejs/plugins/entry.ts
var pluginFactory18 = () => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "js" /* JS */,
      name: COMMON_CHUNK_NAME.ExternalDepsImport,
      content: `
        import { createApp } from 'ice';
      `,
      linkAfter: []
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "js" /* JS */,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: `
        const appConfig = {
          app: {
            rootId: 'app',
          },
          router: {
            type: 'hash',
          },
        };
        createApp(appConfig);
      `,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.ImportAliasDefine,
        COMMON_CHUNK_NAME.FileVarDefine,
        COMMON_CHUNK_NAME.FileUtilDefine
      ]
    });
    return next;
  };
  return plugin;
};
var entry_default = pluginFactory18;

// src/plugins/project/framework/icejs/plugins/entryHtml.ts
var pluginFactory19 = () => {
  const plugin = async (pre) => {
    var _a;
    const next = {
      ...pre
    };
    const ir = next.ir;
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "html" /* HTML */,
      name: COMMON_CHUNK_NAME.HtmlContent,
      content: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta http-equiv="x-ua-compatible" content="ie=edge,chrome=1" />
            <meta name="viewport" content="width=device-width" />
            <title>${((_a = ir == null ? void 0 : ir.meta) == null ? void 0 : _a.name) || "Ice App"}</title>
          </head>
          <body>
            <div id="app"></div>
          </body>
        </html>
      `,
      linkAfter: []
    });
    return next;
  };
  return plugin;
};
var entryHtml_default = pluginFactory19;

// src/plugins/project/framework/icejs/plugins/globalStyle.ts
var pluginFactory20 = () => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "scss" /* SCSS */,
      name: COMMON_CHUNK_NAME.StyleDepsImport,
      content: `
        // \u5F15\u5165\u9ED8\u8BA4\u5168\u5C40\u6837\u5F0F
        @import '@alifd/next/reset.scss';
      `,
      linkAfter: []
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "scss" /* SCSS */,
      name: COMMON_CHUNK_NAME.StyleCssContent,
      content: `
        body {
          -webkit-font-smoothing: antialiased;
        }
      `,
      linkAfter: [COMMON_CHUNK_NAME.StyleDepsImport]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "scss" /* SCSS */,
      name: COMMON_CHUNK_NAME.StyleCssContent,
      content: ir.css || "",
      linkAfter: [COMMON_CHUNK_NAME.StyleDepsImport]
    });
    return next;
  };
  return plugin;
};
var globalStyle_default = pluginFactory20;

// src/utils/dataSource.ts
var dataSource_exports = {};
__export(dataSource_exports, {
  buildDataSourceDependencies: () => buildDataSourceDependencies
});
var import_change_case6 = __toESM(require("change-case"));
function buildDataSourceDependencies(ir, cfg = {}) {
  return {
    [cfg.enginePackage || "@alilc/lowcode-datasource-engine"]: cfg.engineVersion || "^1.0.0",
    ...(ir.dataSourcesTypes || []).reduce(
      (acc, dsType) => {
        var _a;
        return {
          ...acc,
          [getDataSourceHandlerPackageName(dsType)]: ((_a = cfg.handlersVersion) == null ? void 0 : _a[dsType]) || "^1.0.0"
        };
      },
      {}
    )
  };
  function getDataSourceHandlerPackageName(dsType) {
    var _a;
    return ((_a = cfg.handlersPackages) == null ? void 0 : _a[dsType]) || `@alilc/lowcode-datasource-${import_change_case6.default.kebab(dsType)}-handler`;
  }
}

// src/plugins/project/framework/icejs/plugins/packageJSON.ts
var pluginFactory21 = (cfg) => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    const packageJson = {
      name: (cfg == null ? void 0 : cfg.packageName) || "icejs-demo-app",
      version: (cfg == null ? void 0 : cfg.packageVersion) || "0.1.5",
      description: "\u8F7B\u91CF\u7EA7\u6A21\u677F\uFF0C\u4F7F\u7528 JavaScript\uFF0C\u4EC5\u5305\u542B\u57FA\u7840\u7684 Layout\u3002",
      dependencies: {
        moment: "^2.24.0",
        react: "^16.4.1",
        "react-dom": "^16.4.1",
        "react-router": "^5.2.1",
        "@alifd/theme-design-pro": "^0.x",
        "intl-messageformat": "^9.3.6",
        "@ice/store": "^1.4.3",
        "@loadable/component": "^5.15.2",
        ...buildDataSourceDependencies(ir, cfg == null ? void 0 : cfg.datasourceConfig)
      },
      devDependencies: {
        "@ice/spec": "^1.0.0",
        "build-plugin-fusion": "^0.1.0",
        "build-plugin-moment-locales": "^0.1.0",
        eslint: "^6.0.1",
        "ice.js": "^1.0.0",
        stylelint: "^13.2.0"
      },
      scripts: {
        start: "icejs start",
        build: "icejs build",
        lint: "npm run eslint && npm run stylelint",
        eslint: "eslint --cache --ext .js,.jsx ./",
        stylelint: "stylelint ./**/*.scss"
      },
      ideMode: {
        name: "ice-react"
      },
      iceworks: {
        type: "react",
        adapter: "adapter-react-v3"
      },
      engines: {
        node: ">=8.0.0"
      },
      repository: {
        type: "git",
        url: "http://gitlab.xxx.com/msd/leak-scan/tree/master"
      },
      private: true,
      originTemplate: "@alifd/scaffold-lite-js"
    };
    ir.packages.forEach((packageInfo) => {
      packageJson.dependencies[packageInfo.package] = packageInfo.version;
    });
    next.chunks.push({
      type: "json" /* JSON */,
      fileType: "json" /* JSON */,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: packageJson,
      linkAfter: []
    });
    return next;
  };
  return plugin;
};
var packageJSON_default = pluginFactory21;

// src/plugins/project/framework/icejs/plugins/router.ts
var pluginFactory22 = () => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "js" /* JS */,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      content: `
        import BasicLayout from '@/layouts/BasicLayout';
      `,
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "js" /* JS */,
      name: COMMON_CHUNK_NAME.FileVarDefine,
      content: `
        const routerConfig = [
          {
            path: '/',
            component: BasicLayout,
            children: [
              ${ir.routes.map(
        (route) => `
                    {
                      path: '${route.path}',
                      component: ${route.componentName},
                    }
                  `
      ).join(",")}
            ],
          },
        ];
      `,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.ImportAliasDefine,
        COMMON_CHUNK_NAME.FileUtilDefine
      ]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "js" /* JS */,
      name: COMMON_CHUNK_NAME.FileExport,
      content: `
        export default routerConfig;
      `,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.FileUtilDefine,
        COMMON_CHUNK_NAME.ImportAliasDefine,
        COMMON_CHUNK_NAME.FileVarDefine,
        COMMON_CHUNK_NAME.FileMainContent
      ]
    });
    return next;
  };
  return plugin;
};
var router_default = pluginFactory22;

// src/plugins/project/framework/icejs/index.ts
var icejs_default = {
  template: template_default,
  plugins: {
    entry: entry_default,
    entryHtml: entryHtml_default,
    globalStyle: globalStyle_default,
    packageJSON: packageJSON_default,
    router: router_default
  }
};

// src/postprocessor/prettier/index.ts
var import_prettier = __toESM(require("prettier"));
var import_parser_babel = __toESM(require("prettier/parser-babel"));
var import_parser_postcss = __toESM(require("prettier/parser-postcss"));
var import_parser_html = __toESM(require("prettier/parser-html"));
var PARSERS = ["css", "scss", "less", "json", "html", "vue"];
var factory = (config) => {
  const cfg = {
    customFileTypeParser: {},
    ...config
  };
  const codePrettier = (content, fileType) => {
    let parser3;
    if (fileType === "js" || fileType === "jsx" || fileType === "ts" || fileType === "tsx") {
      parser3 = "babel-ts";
    } else if (fileType === "json") {
      parser3 = "json-stringify";
    } else if (PARSERS.indexOf(fileType) >= 0) {
      parser3 = fileType;
    } else if (cfg.customFileTypeParser[fileType]) {
      parser3 = cfg.customFileTypeParser[fileType];
    } else {
      return content;
    }
    return import_prettier.default.format(content, {
      parser: parser3,
      plugins: [import_parser_babel.default, import_parser_postcss.default, import_parser_html.default, ...cfg.plugins || []],
      singleQuote: true,
      jsxSingleQuote: false
    });
  };
  return codePrettier;
};
var prettier_default = factory;

// src/solutions/icejs.ts
function createIceJsProjectBuilder(options) {
  return createProjectBuilder({
    inStrictMode: options == null ? void 0 : options.inStrictMode,
    extraContextData: { ...options },
    template: icejs_default.template,
    plugins: {
      components: [
        reactCommonDeps_default(),
        esmodule_default({
          fileType: "jsx"
        }),
        styleImport_default(),
        containerClass_default(),
        containerInjectContext_default(),
        containerInjectUtils_default(),
        containerInjectDataSourceEngine_default(),
        containerInjectI18n_default(),
        containerInjectConstants_default(),
        containerInitState_default(),
        containerLifeCycle_default(),
        containerMethod_default(),
        jsx_default({
          nodeTypeMapping: {
            Div: "div",
            Component: "div",
            Page: "div",
            Block: "div"
          }
        }),
        css_default()
      ],
      pages: [
        reactCommonDeps_default(),
        esmodule_default({
          fileType: "jsx"
        }),
        styleImport_default(),
        containerClass_default(),
        containerInjectContext_default(),
        containerInjectUtils_default(),
        containerInjectDataSourceEngine_default(),
        containerInjectI18n_default(),
        containerInjectConstants_default(),
        containerInitState_default(),
        containerLifeCycle_default(),
        containerMethod_default(),
        jsx_default({
          nodeTypeMapping: {
            Div: "div",
            Component: "div",
            Page: "div",
            Block: "div"
          }
        }),
        css_default()
      ],
      router: [esmodule_default(), icejs_default.plugins.router()],
      entry: [icejs_default.plugins.entry()],
      constants: [constants_default()],
      utils: [esmodule_default(), utils_default("react")],
      i18n: [i18n_default()],
      globalStyle: [icejs_default.plugins.globalStyle()],
      htmlEntry: [icejs_default.plugins.entryHtml()],
      packageJSON: [icejs_default.plugins.packageJSON()]
    },
    postProcessors: [prettier_default()],
    customizeBuilderOptions: options == null ? void 0 : options.customizeBuilderOptions
  });
}
var plugins = {
  containerClass: containerClass_default,
  containerInjectContext: containerInjectContext_default,
  containerInjectUtils: containerInjectUtils_default,
  containerInjectDataSourceEngine: containerInjectDataSourceEngine_default,
  containerInjectI18n: containerInjectI18n_default,
  containerInjectConstants: containerInjectConstants_default,
  containerInitState: containerInitState_default,
  containerLifeCycle: containerLifeCycle_default,
  containerMethod: containerMethod_default,
  jsx: jsx_default,
  commonDeps: reactCommonDeps_default,
  reactCommonDeps: reactCommonDeps_default
};

// src/plugins/project/framework/icejs3/template/files/gitignore.ts
function getFile21() {
  const file2 = createResultFile(
    ".gitignore",
    "",
    `
# See https://help.github.com/ignore-files/ for more about ignoring files.

# dependencies
node_modules/

# production
build/
dist/
tmp/
lib/

# misc
.idea/
.happypack
.DS_Store
*.swp
*.dia~
.ice

npm-debug.log*
yarn-debug.log*
yarn-error.log*
index.module.scss.d.ts
    `
  );
  return [[], file2];
}

// src/plugins/project/framework/icejs3/template/files/README.md.ts
function getFile22() {
  const file2 = createResultFile(
    "README",
    "md",
    "This project is generated by lowcode-code-generator & lowcode-solution-icejs3."
  );
  return [[], file2];
}

// src/plugins/project/framework/icejs3/template/files/browserslistrc.ts
function getFile23() {
  const file2 = createResultFile(
    ".browserslistrc",
    "",
    `defaults
ios_saf 9
    `
  );
  return [[], file2];
}

// src/plugins/project/framework/icejs3/template/files/typings.ts
function getFile24() {
  const file2 = createResultFile(
    "typings.d",
    "ts",
    `/// <reference types="@ice/app/types" />

export {};
declare global {
  interface Window {
    g_config: Record<string, any>;
  }
}
    `
  );
  return [["src"], file2];
}

// src/plugins/project/framework/icejs3/template/files/document.ts
function getFile25() {
  const file2 = createResultFile(
    "document",
    "tsx",
    `import React from 'react';
import { Meta, Title, Links, Main, Scripts } from 'ice';

export default function Document() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="description" content="ice.js 3 lite scaffold" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="//alifd.alicdn.com/npm/@alifd/next/1.21.16/next.min.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <Meta />
        <Title />
        <Links />
      </head>
      <body>
        <Main />
        <script crossOrigin="anonymous" src="//g.alicdn.com/code/lib/react/18.2.0/umd/react.development.js" />
        <script crossOrigin="anonymous" src="//g.alicdn.com/code/lib/react-dom/18.2.0/umd/react-dom.development.js" />
        <script crossOrigin="anonymous" src="//g.alicdn.com/code/lib/??react-router/6.9.0/react-router.production.min.js,react-router-dom/6.9.0/react-router-dom.production.min.js" />
        <script crossOrigin="anonymous" src="//g.alicdn.com/code/lib/alifd__next/1.26.22/next.min.js" />
        <script crossOrigin="anonymous" src="//g.alicdn.com/code/lib/prop-types/15.7.2/prop-types.js" />
        <script crossOrigin="anonymous" src="//g.alicdn.com/platform/c/??lodash/4.6.1/lodash.min.js,immutable/3.7.6/dist/immutable.min.js" />
        <Scripts />
      </body>
    </html>
  );
}`
  );
  return [["src"], file2];
}

// src/plugins/project/framework/icejs3/template/files/src/layouts/BasicLayout/components/Footer/index.jsx.ts
function getFile26() {
  const file2 = createResultFile(
    "index",
    "jsx",
    `
import React from 'react';
import styles from './index.module.scss';

export default function Footer() {
  return (
    <p className={styles.footer}>
      <span className={styles.logo}>Alibaba Fusion</span>
      <br />
      <span className={styles.copyright}>\xA9 2019-\u73B0\u5728 Alibaba Fusion & ICE</span>
    </p>
  );
}
    `
  );
  return [["src", "layouts", "BasicLayout", "components", "Footer"], file2];
}

// src/plugins/project/framework/icejs3/template/files/src/layouts/BasicLayout/components/Footer/index.style.ts
function getFile27() {
  const file2 = createResultFile(
    "index",
    "module.scss",
    `
.footer {
  line-height: 20px;
  text-align: center;
}

.logo {
  font-weight: bold;
  font-size: 16px;
}

.copyright {
  font-size: 12px;
}
    `
  );
  return [["src", "layouts", "BasicLayout", "components", "Footer"], file2];
}

// src/plugins/project/framework/icejs3/template/files/src/layouts/BasicLayout/components/Logo/index.jsx.ts
function getFile28() {
  const file2 = createResultFile(
    "index",
    "jsx",
    `
import React from 'react';
import { Link } from 'ice';
import styles from './index.module.scss';

export default function Logo({ image, text, url }) {
  return (
    <div className="logo">
      <Link to={url || '/'} className={styles.logo}>
        {image && <img src={image} alt="logo" />}
        <span>{text}</span>
      </Link>
    </div>
  );
}
    `
  );
  return [["src", "layouts", "BasicLayout", "components", "Logo"], file2];
}

// src/plugins/project/framework/icejs3/template/files/src/layouts/BasicLayout/components/Logo/index.style.ts
function getFile29() {
  const file2 = createResultFile(
    "index",
    "module.scss",
    `
.logo{
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FF7300;
  font-weight: bold;
  font-size: 14px;
  line-height: 22px;

  &:visited, &:link {
    color: #FF7300;
  }

  img {
    height: 24px;
    margin-right: 10px;
  }
}
    `
  );
  return [["src", "layouts", "BasicLayout", "components", "Logo"], file2];
}

// src/plugins/project/framework/icejs3/template/files/src/layouts/BasicLayout/components/PageNav/index.jsx.ts
function getFile30() {
  const file2 = createResultFile(
    "index",
    "jsx",
    `import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'ice';
import { Nav } from '@alifd/next';
import { asideMenuConfig } from '../../menuConfig';

const { SubNav } = Nav;
const NavItem = Nav.Item;

function getNavMenuItems(menusData) {
  if (!menusData) {
    return [];
  }

  return menusData
    .filter(item => item.name && !item.hideInMenu)
    .map((item, index) => getSubMenuOrItem(item, index));
}

function getSubMenuOrItem(item, index) {
  if (item.children && item.children.some(child => child.name)) {
    const childrenItems = getNavMenuItems(item.children);

    if (childrenItems && childrenItems.length > 0) {
      const subNav = (
        <SubNav key={index} icon={item.icon} label={item.name}>
          {childrenItems}
        </SubNav>
      );
      return subNav;
    }

    return null;
  }

  const navItem = (
    <NavItem key={item.path} icon={item.icon}>
      <Link to={item.path}>{item.name}</Link>
    </NavItem>
  );
  return navItem;
}

const Navigation = (props, context) => {
  const location = useLocation();
  const { pathname } = location;
  const { isCollapse } = context;
  return (
    <Nav
      type="primary"
      selectedKeys={[pathname]}
      defaultSelectedKeys={[pathname]}
      embeddable
      openMode="single"
      iconOnly={isCollapse}
      hasArrow={false}
      mode={isCollapse ? 'popup' : 'inline'}
    >
      {getNavMenuItems(asideMenuConfig)}
    </Nav>
  );
};

Navigation.contextTypes = {
  isCollapse: PropTypes.bool,
};
export default Navigation;
    `
  );
  return [["src", "layouts", "BasicLayout", "components", "PageNav"], file2];
}

// src/plugins/project/framework/icejs3/template/files/src/layouts/BasicLayout/index.jsx.ts
function getFile31() {
  const file2 = createResultFile(
    "index",
    "jsx",
    `
import React, { useState } from 'react';
import { Shell, ConfigProvider } from '@alifd/next';
import PageNav from './components/PageNav';
import Logo from './components/Logo';
import Footer from './components/Footer';

(function() {
  const throttle = function(type, name, obj = window) {
    let running = false;

    const func = () => {
      if (running) {
        return;
      }

      running = true;
      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };

    obj.addEventListener(type, func);
  };

  throttle('resize', 'optimizedResize');
})();

export default function BasicLayout({ children }) {
  const getDevice = width => {
    const isPhone =
      typeof navigator !== 'undefined' && navigator && navigator.userAgent.match(/phone/gi);

    if (width < 680 || isPhone) {
      return 'phone';
    }
    if (width < 1280 && width > 680) {
      return 'tablet';
    }
    return 'desktop';
  };

  const [device, setDevice] = useState(getDevice(NaN));
  window.addEventListener('optimizedResize', e => {
    setDevice(getDevice(e && e.target && e.target.innerWidth));
  });
  return (
    <ConfigProvider device={device}>
      <Shell
        type="dark"
        style={{
          minHeight: '100vh',
        }}
      >
        <Shell.Branding>
          <Logo
            image="https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png"
            text="Logo"
          />
        </Shell.Branding>
        <Shell.Navigation
          direction="hoz"
          style={{
            marginRight: 10,
          }}
        ></Shell.Navigation>
        <Shell.Action></Shell.Action>
        <Shell.Navigation>
          <PageNav />
        </Shell.Navigation>

        <Shell.Content>{children}</Shell.Content>
        <Shell.Footer>
          <Footer />
        </Shell.Footer>
      </Shell>
    </ConfigProvider>
  );
}
    `
  );
  return [["src", "layouts", "BasicLayout"], file2];
}

// src/plugins/project/framework/icejs3/template/files/src/layouts/BasicLayout/menuConfig.js.ts
function getFile32() {
  const file2 = createResultFile(
    "menuConfig",
    "js",
    `
const headerMenuConfig = [];
const asideMenuConfig = [
  {
    name: 'Dashboard',
    path: '/',
    icon: 'smile',
  },
];
export { headerMenuConfig, asideMenuConfig };
    `
  );
  return [["src", "layouts", "BasicLayout"], file2];
}

// src/plugins/project/framework/icejs3/template/static-files.ts
function generateStaticFiles2(root = createResultDir(".")) {
  runFileGenerator(root, getFile21);
  runFileGenerator(root, getFile22);
  runFileGenerator(root, getFile23);
  runFileGenerator(root, getFile24);
  runFileGenerator(root, getFile25);
  runFileGenerator(root, getFile26);
  runFileGenerator(root, getFile27);
  runFileGenerator(root, getFile28);
  runFileGenerator(root, getFile29);
  runFileGenerator(root, getFile30);
  runFileGenerator(root, getFile31);
  runFileGenerator(root, getFile32);
  return root;
}

// src/plugins/project/framework/icejs3/template/index.ts
var icejs3Template = {
  slots: {
    components: {
      path: ["src", "components"],
      fileName: "index"
    },
    pages: {
      path: ["src", "pages"],
      fileName: "index"
    },
    entry: {
      path: ["src"],
      fileName: "app"
    },
    constants: {
      path: ["src"],
      fileName: "constants"
    },
    utils: {
      path: ["src"],
      fileName: "utils"
    },
    i18n: {
      path: ["src"],
      fileName: "i18n"
    },
    globalStyle: {
      path: ["src"],
      fileName: "global"
    },
    packageJSON: {
      path: [],
      fileName: "package"
    },
    appConfig: {
      path: ["src"],
      fileName: "app"
    },
    buildConfig: {
      path: [],
      fileName: "ice.config"
    },
    layout: {
      path: ["src", "pages"],
      fileName: "layout"
    }
  },
  generateTemplate() {
    return generateStaticFiles2();
  }
};
var template_default2 = icejs3Template;

// src/plugins/project/framework/icejs3/plugins/globalStyle.ts
var pluginFactory23 = () => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "scss" /* SCSS */,
      name: COMMON_CHUNK_NAME.StyleDepsImport,
      content: `
        // \u5F15\u5165\u9ED8\u8BA4\u5168\u5C40\u6837\u5F0F
        @import '@alifd/next/reset.scss';
      `,
      linkAfter: []
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "scss" /* SCSS */,
      name: COMMON_CHUNK_NAME.StyleCssContent,
      content: `
        body {
          -webkit-font-smoothing: antialiased;
        }
      `,
      linkAfter: [COMMON_CHUNK_NAME.StyleDepsImport]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "scss" /* SCSS */,
      name: COMMON_CHUNK_NAME.StyleCssContent,
      content: ir.css || "",
      linkAfter: [COMMON_CHUNK_NAME.StyleDepsImport]
    });
    return next;
  };
  return plugin;
};
var globalStyle_default2 = pluginFactory23;

// src/plugins/project/framework/icejs3/plugins/packageJSON.ts
var pluginFactory24 = (cfg) => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    const packageJson = {
      name: (cfg == null ? void 0 : cfg.packageName) || "icejs3-demo-app",
      version: (cfg == null ? void 0 : cfg.packageVersion) || "0.1.5",
      description: "icejs 3 \u8F7B\u91CF\u7EA7\u6A21\u677F\uFF0C\u4F7F\u7528 JavaScript\uFF0C\u4EC5\u5305\u542B\u57FA\u7840\u7684 Layout\u3002",
      dependencies: {
        moment: "^2.24.0",
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router": "^6.9.0",
        "react-router-dom": "^6.9.0",
        "intl-messageformat": "^9.3.6",
        "@alifd/next": "1.26.15",
        "@ice/runtime": "~1.1.0",
        ...buildDataSourceDependencies(ir, cfg == null ? void 0 : cfg.datasourceConfig)
      },
      devDependencies: {
        "@ice/app": "~3.1.0",
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        "@types/node": "^18.11.17",
        "@ice/plugin-fusion": "^1.0.1",
        "@ice/plugin-moment-locales": "^1.0.0",
        eslint: "^6.0.1",
        stylelint: "^13.2.0"
      },
      scripts: {
        start: "ice start",
        build: "ice build",
        lint: "npm run eslint && npm run stylelint",
        eslint: "eslint --cache --ext .js,.jsx ./",
        stylelint: "stylelint ./**/*.scss"
      },
      engines: {
        node: ">=14.0.0"
      },
      repository: {
        type: "git",
        url: "http://gitlab.xxx.com/msd/leak-scan/tree/master"
      },
      private: true,
      originTemplate: "@alifd/scaffold-lite-js"
    };
    ir.packages.forEach((packageInfo) => {
      packageJson.dependencies[packageInfo.package] = packageInfo.version;
    });
    next.chunks.push({
      type: "json" /* JSON */,
      fileType: "json" /* JSON */,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: packageJson,
      linkAfter: []
    });
    return next;
  };
  return plugin;
};
var packageJSON_default2 = pluginFactory24;

// src/plugins/project/framework/icejs3/plugins/layout.ts
var pluginFactory25 = () => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: `
      import { Outlet } from 'ice';
      import BasicLayout from '@/layouts/BasicLayout';

      export default function Layout() {
        return (
          <BasicLayout>
            <Outlet />
          </BasicLayout>
        );;
      }
      `,
      linkAfter: []
    });
    return next;
  };
  return plugin;
};
var layout_default = pluginFactory25;

// src/plugins/project/framework/icejs3/plugins/appConfig.ts
function getContent() {
  return `import { defineAppConfig } from 'ice';

// App config, see https://v3.ice.work/docs/guide/basic/app
export default defineAppConfig(() => ({
  // Set your configs here.
  app: {
    rootId: 'App',
  },
  router: {
    type: 'browser',
    basename: '/',
  },
}));`;
}
var pluginFactory26 = () => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "ts" /* TS */,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: getContent(),
      linkAfter: []
    });
    return next;
  };
  return plugin;
};
var appConfig_default = pluginFactory26;

// src/utils/format.ts
var import_prettier3 = __toESM(require("prettier"));
var import_parser_babel2 = __toESM(require("prettier/parser-babel"));
function format(content, options = {}) {
  return import_prettier3.default.format(content, {
    parser: "babel",
    plugins: [import_parser_babel2.default],
    singleQuote: true,
    jsxSingleQuote: false,
    ...options
  });
}

// src/utils/theme.ts
function getThemeInfo(theme) {
  const sepIdx = theme.indexOf("@", 1);
  if (sepIdx === -1) {
    return { name: theme };
  }
  return {
    name: theme.slice(0, sepIdx),
    version: theme.slice(sepIdx + 1)
  };
}

// src/plugins/project/framework/icejs3/plugins/buildConfig.ts
function getContent2(cfg, routesContent) {
  return `
import { join } from 'path';
import { defineConfig } from '@ice/app';
import _ from 'lodash';
import fusion from '@ice/plugin-fusion';
import locales from '@ice/plugin-moment-locales';
import type { Plugin } from '@ice/app/esm/types';

interface PluginOptions {
  id: string;
}

const plugin: Plugin<PluginOptions> = (options) => ({
  // name \u53EF\u9009\uFF0C\u63D2\u4EF6\u540D\u79F0
  name: 'plugin-name',
  // setup \u5FC5\u9009\uFF0C\u7528\u4E8E\u5B9A\u5236\u5DE5\u7A0B\u6784\u5EFA\u914D\u7F6E
  setup: ({ onGetConfig, modifyUserConfig }) => {
    modifyUserConfig('codeSplitting', 'page');

    onGetConfig((config) => {
      config.entry = {
        web: join(process.cwd(), '.ice/entry.client.tsx'),
      };

      config.cssFilename = '[name].css';

      config.configureWebpack = config.configureWebpack || [];
      config.configureWebpack?.push((webpackConfig) => {
        if (webpackConfig.output) {
          webpackConfig.output.filename = '[name].js';
          webpackConfig.output.chunkFilename = '[name].js';
        }
        return webpackConfig;
      });

      config.swcOptions = _.merge(config.swcOptions, {
        compilationConfig: {
          jsc: {
            transform: {
              react: {
                runtime: 'classic',
              },
            },
          },
        }
      });

      // \u89E3\u51B3 webpack publicPath \u95EE\u9898
      config.transforms = config.transforms || [];
      config.transforms.push((source: string, id: string) => {
        if (id.includes('.ice/entry.client.tsx')) {
          let code = \`
          if (!__webpack_public_path__?.startsWith('http') && document.currentScript) {
            // @ts-ignore
            __webpack_public_path__ = document.currentScript.src.replace(/^(.*\\\\/)[^/]+$/, '$1');
            window.__ICE_ASSETS_MANIFEST__ = window.__ICE_ASSETS_MANIFEST__ || {};
            window.__ICE_ASSETS_MANIFEST__.publicPath = __webpack_public_path__;
          }
          \`;
          code += source;
          return { code };
        }
      });
    });
  },
});

// The project config, see https://v3.ice.work/docs/guide/basic/config
const minify = process.env.NODE_ENV === 'production' ? 'swc' : false;
export default defineConfig(() => ({
  ssr: false,
  ssg: false,
  minify,
  ${routesContent}
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-dom/client': 'ReactDOM',
    '@alifd/next': 'Next',
    lodash: 'var window._',
    '@alilc/lowcode-engine': 'var window.AliLowCodeEngine',
  },
  plugins: [
    fusion(${(cfg == null ? void 0 : cfg.themePackage) ? `{
      importStyle: 'sass',
      themePackage: '${getThemeInfo(cfg.themePackage).name}',
    }` : `{
      importStyle: 'sass',
    }`}),
    locales(),
    plugin(),
  ]
}));
  `;
}
function getRoutesContent(navData, needShell = true) {
  const routes = [
    "routes: {",
    "  defineRoutes: route => {"
  ];
  function _getRoutes(nav, _routes = []) {
    const { slug, children } = nav;
    if (children && children.length > 0) {
      children.forEach((_nav) => _getRoutes(_nav, _routes));
    } else if (slug) {
      _routes.push(`route('/${slug}', '${slug}/index.jsx');`);
    }
  }
  if (needShell) {
    routes.push("    route('/', 'layout.jsx', () => {");
  }
  navData == null ? void 0 : navData.forEach((nav) => {
    _getRoutes(nav, routes);
  });
  if (needShell) {
    routes.push("    });");
  }
  routes.push("  }");
  routes.push("  },");
  return routes.join("\n");
}
var pluginFactory27 = (cfg) => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const { navConfig } = next.contextData;
    const routesContent = (navConfig == null ? void 0 : navConfig.data) ? getRoutesContent(navConfig.data, true) : "";
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "mts" /* MTS */,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: format(getContent2(cfg, routesContent)),
      linkAfter: []
    });
    return next;
  };
  return plugin;
};
var buildConfig_default = pluginFactory27;

// src/plugins/project/framework/icejs3/index.ts
var icejs3_default = {
  template: template_default2,
  plugins: {
    appConfig: appConfig_default,
    buildConfig: buildConfig_default,
    globalStyle: globalStyle_default2,
    packageJSON: packageJSON_default2,
    layout: layout_default
  }
};

// src/solutions/icejs3.ts
function createIceJsProjectBuilder2(options) {
  return createProjectBuilder({
    inStrictMode: options == null ? void 0 : options.inStrictMode,
    extraContextData: { ...options },
    template: icejs3_default.template,
    plugins: {
      components: [
        reactCommonDeps_default(),
        esmodule_default({
          fileType: "jsx"
        }),
        styleImport_default(),
        containerClass_default(),
        containerInjectContext_default(),
        containerInjectUtils_default(),
        containerInjectDataSourceEngine_default(),
        containerInjectI18n_default(),
        containerInjectConstants_default(),
        containerInitState_default(),
        containerLifeCycle_default(),
        containerMethod_default(),
        jsx_default({
          nodeTypeMapping: {
            Div: "div",
            Component: "div",
            Page: "div",
            Block: "div"
          }
        }),
        css_default()
      ],
      pages: [
        reactCommonDeps_default(),
        esmodule_default({
          fileType: "jsx"
        }),
        styleImport_default(),
        containerClass_default(),
        containerInjectContext_default(),
        containerInjectUtils_default(),
        containerInjectDataSourceEngine_default(),
        containerInjectI18n_default(),
        containerInjectConstants_default(),
        containerInitState_default(),
        containerLifeCycle_default(),
        containerMethod_default(),
        jsx_default({
          nodeTypeMapping: {
            Div: "div",
            Component: "div",
            Page: "div",
            Block: "div",
            Box: "div"
          }
        }),
        css_default()
      ],
      constants: [constants_default()],
      utils: [esmodule_default(), utils_default("react")],
      i18n: [i18n_default()],
      globalStyle: [icejs3_default.plugins.globalStyle()],
      packageJSON: [icejs3_default.plugins.packageJSON()],
      buildConfig: [icejs3_default.plugins.buildConfig()],
      appConfig: [icejs3_default.plugins.appConfig()],
      layout: [icejs3_default.plugins.layout()]
    },
    postProcessors: [prettier_default()],
    customizeBuilderOptions: options == null ? void 0 : options.customizeBuilderOptions
  });
}
var plugins2 = {
  containerClass: containerClass_default,
  containerInitState: containerInitState_default,
  containerInjectContext: containerInjectContext_default,
  containerInjectUtils: containerInjectUtils_default,
  containerInjectI18n: containerInjectI18n_default,
  containerInjectDataSourceEngine: containerInjectDataSourceEngine_default,
  containerLifeCycle: containerLifeCycle_default,
  containerMethod: containerMethod_default,
  jsx: jsx_default,
  commonDeps: reactCommonDeps_default
};

// src/plugins/component/rax/containerClass.ts
var import_change_case7 = __toESM(require("change-case"));

// src/plugins/component/rax/const.ts
var RAX_CHUNK_NAME = {
  ClassDidMountBegin: "RaxComponentClassDidMountBegin",
  ClassDidMountContent: "RaxComponentClassDidMountContent",
  ClassDidMountEnd: "RaxComponentClassDidMountEnd",
  ClassWillUnmountBegin: "RaxComponentClassWillUnmountBegin",
  ClassWillUnmountContent: "RaxComponentClassWillUnmountContent",
  ClassWillUnmountEnd: "RaxComponentClassWillUnmountEnd",
  ClassRenderBegin: "RaxComponentClassRenderBegin",
  ClassRenderPre: "RaxComponentClassRenderPre",
  ClassRenderJSX: "RaxComponentClassRenderJSX",
  ClassRenderEnd: "RaxComponentClassRenderEnd",
  MethodsBegin: "RaxComponentMethodsBegin",
  MethodsContent: "RaxComponentMethodsContent",
  MethodsEnd: "RaxComponentMethodsEnd",
  LifeCyclesBegin: "RaxComponentLifeCyclesBegin",
  LifeCyclesContent: "RaxComponentLifeCyclesContent",
  LifeCyclesEnd: "RaxComponentLifeCyclesEnd"
};

// src/plugins/component/rax/containerClass.ts
var pluginFactory28 = () => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    const componentClassName = ensureValidClassName(
      `${import_change_case7.default.pascalCase(ir.moduleName)}$$Page`
    );
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: CLASS_DEFINE_CHUNK_NAME.Start,
      content: `class ${componentClassName} extends Component {`,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.ImportAliasDefine,
        COMMON_CHUNK_NAME.FileVarDefine,
        COMMON_CHUNK_NAME.FileUtilDefine
      ]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: CLASS_DEFINE_CHUNK_NAME.End,
      content: "}",
      linkAfter: [
        CLASS_DEFINE_CHUNK_NAME.Start,
        CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod,
        RAX_CHUNK_NAME.ClassRenderEnd,
        RAX_CHUNK_NAME.MethodsEnd
      ]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorStart,
      content: "constructor(props, context) { super(props); ",
      linkAfter: DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorStart]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorEnd,
      content: "} /* end of constructor */",
      linkAfter: DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorEnd]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: RAX_CHUNK_NAME.ClassDidMountBegin,
      content: "componentDidMount() {",
      linkAfter: [
        CLASS_DEFINE_CHUNK_NAME.Start,
        CLASS_DEFINE_CHUNK_NAME.InsVar,
        CLASS_DEFINE_CHUNK_NAME.InsMethod,
        CLASS_DEFINE_CHUNK_NAME.ConstructorEnd
      ]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: RAX_CHUNK_NAME.ClassDidMountEnd,
      content: "} /* end of componentDidMount */",
      linkAfter: [RAX_CHUNK_NAME.ClassDidMountBegin, RAX_CHUNK_NAME.ClassDidMountContent]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: RAX_CHUNK_NAME.ClassWillUnmountBegin,
      content: "componentWillUnmount() {",
      linkAfter: [
        CLASS_DEFINE_CHUNK_NAME.Start,
        CLASS_DEFINE_CHUNK_NAME.InsVar,
        CLASS_DEFINE_CHUNK_NAME.InsMethod,
        RAX_CHUNK_NAME.ClassDidMountEnd
      ]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: RAX_CHUNK_NAME.ClassWillUnmountEnd,
      content: "} /* end of componentWillUnmount */",
      linkAfter: [RAX_CHUNK_NAME.ClassWillUnmountBegin, RAX_CHUNK_NAME.ClassWillUnmountContent]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: RAX_CHUNK_NAME.ClassRenderBegin,
      content: "render() {",
      linkAfter: [RAX_CHUNK_NAME.ClassDidMountEnd, RAX_CHUNK_NAME.ClassWillUnmountEnd]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: RAX_CHUNK_NAME.ClassRenderEnd,
      content: "} /* end of render */",
      linkAfter: [
        RAX_CHUNK_NAME.ClassRenderBegin,
        RAX_CHUNK_NAME.ClassRenderPre,
        RAX_CHUNK_NAME.ClassRenderJSX
      ]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: COMMON_CHUNK_NAME.FileExport,
      content: `export default ${componentClassName};`,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.ImportAliasDefine,
        COMMON_CHUNK_NAME.FileVarDefine,
        COMMON_CHUNK_NAME.FileUtilDefine,
        CLASS_DEFINE_CHUNK_NAME.End
      ]
    });
    return next;
  };
  return plugin;
};
var containerClass_default2 = pluginFactory28;

// src/plugins/component/rax/containerLifeCycle.ts
var import_lodash5 = __toESM(require("lodash"));
var import_lowcode_types8 = require("@alilc/lowcode-types");

// src/utils/debug.ts
var import_debug = __toESM(require("debug"));
var debug = (0, import_debug.default)("code-generator");

// src/plugins/component/rax/containerLifeCycle.ts
var pluginFactory29 = (config) => {
  const cfg = {
    fileType: "jsx" /* JSX */,
    exportNameMapping: {},
    normalizeNameMapping: {
      didMount: "componentDidMount",
      willUnmount: "componentWillUnmount"
    },
    ...config
  };
  const exportNameMapping = new Map(Object.entries(cfg.exportNameMapping));
  const normalizeNameMapping = new Map(Object.entries(cfg.normalizeNameMapping));
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    const { lifeCycles } = ir;
    if (lifeCycles && !import_lodash5.default.isEmpty(lifeCycles)) {
      Object.entries(lifeCycles).forEach(([lifeCycleName, lifeCycleMethodExpr]) => {
        if (!(0, import_lowcode_types8.isJSFunction)(lifeCycles[lifeCycleName]) && !isJSExpressionFn(lifeCycles[lifeCycleName]) && !(0, import_lowcode_types8.isJSExpression)(lifeCycles[lifeCycleName])) {
          return;
        }
        const normalizeName = normalizeNameMapping.get(lifeCycleName) || lifeCycleName;
        const exportName = exportNameMapping.get(lifeCycleName) || lifeCycleName;
        next.chunks.push({
          type: "string" /* STRING */,
          fileType: cfg.fileType,
          name: RAX_CHUNK_NAME.LifeCyclesContent,
          content: `${exportName}: (${lifeCycleMethodExpr.value}),`,
          linkAfter: [RAX_CHUNK_NAME.LifeCyclesBegin]
        });
        if (normalizeName === "constructor") {
          next.chunks.push({
            type: "string" /* STRING */,
            fileType: cfg.fileType,
            name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
            content: `this._lifeCycles.${exportName}();`,
            linkAfter: [CLASS_DEFINE_CHUNK_NAME.ConstructorStart]
          });
        } else if (normalizeName === "componentDidMount") {
          next.chunks.push({
            type: "string" /* STRING */,
            fileType: cfg.fileType,
            name: RAX_CHUNK_NAME.ClassDidMountContent,
            content: `this._lifeCycles.${exportName}();`,
            linkAfter: [RAX_CHUNK_NAME.ClassDidMountBegin]
          });
        } else if (normalizeName === "componentWillUnmount") {
          next.chunks.push({
            type: "string" /* STRING */,
            fileType: cfg.fileType,
            name: RAX_CHUNK_NAME.ClassWillUnmountContent,
            content: `this._lifeCycles.${exportName}();`,
            linkAfter: [RAX_CHUNK_NAME.ClassWillUnmountBegin]
          });
        } else {
          debug(`[CodeGen]: unknown life cycle: ${lifeCycleName}`);
        }
      });
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsVar,
        content: "_lifeCycles = this._defineLifeCycles();",
        linkAfter: [CLASS_DEFINE_CHUNK_NAME.Start]
      });
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: RAX_CHUNK_NAME.LifeCyclesBegin,
        content: `
          _defineLifeCycles() {
            const __$$lifeCycles = ({
        `,
        linkAfter: [RAX_CHUNK_NAME.ClassRenderEnd, CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod]
      });
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: RAX_CHUNK_NAME.LifeCyclesEnd,
        content: `
            });

            // \u4E3A\u6240\u6709\u7684\u65B9\u6CD5\u7ED1\u5B9A\u4E0A\u4E0B\u6587
            Object.entries(__$$lifeCycles).forEach(([lifeCycleName, lifeCycleMethod]) => {
              if (typeof lifeCycleMethod === 'function') {
                __$$lifeCycles[lifeCycleName] = (...args) => {
                  return lifeCycleMethod.apply(this._context, args);
                }
              }
            });

            return __$$lifeCycles;
          }
        `,
        linkAfter: [RAX_CHUNK_NAME.LifeCyclesBegin, RAX_CHUNK_NAME.LifeCyclesContent]
      });
    }
    return next;
  };
  return plugin;
};
var containerLifeCycle_default2 = pluginFactory29;

// src/plugins/component/rax/containerMethods.ts
var pluginFactory30 = (config) => {
  const cfg = {
    fileType: "jsx" /* JSX */,
    ...config
  };
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsVar,
      content: `
         _methods = this._defineMethods();
      `,
      linkAfter: [CLASS_DEFINE_CHUNK_NAME.Start]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: RAX_CHUNK_NAME.MethodsBegin,
      content: `
        _defineMethods() {
          return ({
      `,
      linkAfter: [
        RAX_CHUNK_NAME.ClassRenderEnd,
        CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod,
        RAX_CHUNK_NAME.LifeCyclesEnd
      ]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: RAX_CHUNK_NAME.MethodsEnd,
      content: `
          });
        }
      `,
      linkAfter: [RAX_CHUNK_NAME.MethodsBegin, RAX_CHUNK_NAME.MethodsContent]
    });
    if (ir.methods && Object.keys(ir.methods).length > 0) {
      Object.entries(ir.methods).forEach(([methodName, methodDefine]) => {
        next.chunks.push({
          type: "string" /* STRING */,
          fileType: cfg.fileType,
          name: RAX_CHUNK_NAME.MethodsContent,
          content: `${methodName}: (${methodDefine.value}),`,
          linkAfter: [RAX_CHUNK_NAME.MethodsBegin]
        });
      });
    }
    return next;
  };
  return plugin;
};
var containerMethods_default = pluginFactory30;

// src/plugins/component/rax/containerInitState.ts
var pluginFactory31 = (config) => {
  const cfg = {
    fileType: "jsx" /* JSX */,
    implementType: "insMember",
    ...config
  };
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    const scope = Scope.createRootScope();
    const state = ir.state || {};
    const fields = Object.keys(state).map((stateName) => {
      const value = generateCompositeType(state[stateName], scope);
      return `${JSON.stringify(stateName)}: ${value}`;
    });
    if (cfg.implementType === "inConstructor") {
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
        content: `this.state = { ${fields.join(",")} };`,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorContent]]
      });
    } else if (cfg.implementType === "insMember") {
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsVar,
        content: `state = { ${fields.join(",")} };`,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsVar]]
      });
    }
    return next;
  };
  return plugin;
};
var containerInitState_default2 = pluginFactory31;

// src/plugins/component/rax/containerInjectContext.ts
var pluginFactory32 = (config) => {
  const cfg = {
    fileType: "jsx" /* JSX */,
    ...config
  };
  const plugin = async (pre) => {
    var _a;
    const next = {
      ...pre
    };
    const ir = next.ir;
    const useRef = !!((_a = ir.analyzeResult) == null ? void 0 : _a.isUsingRef);
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      content: "import __$$constants from '../../constants';",
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      content: "import * as __$$i18n from '../../i18n';",
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
      content: `
        __$$i18n._inject2(this);
      `,
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorContent]]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsVar,
      content: `
        _context = this._createContext();
      `,
      linkAfter: [CLASS_DEFINE_CHUNK_NAME.Start]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod,
      content: `
        _createContext() {
          const self = this;
          const context = {
            get state() {
              return self.state;
            },
            setState(newState, callback) {
              self.setState(newState, callback);
            },
            get dataSourceMap() {
              return self._dataSourceEngine.dataSourceMap || {};
            },
            async reloadDataSource() {
              await self._dataSourceEngine.reloadDataSource();
            },
            get utils() {
              return self._utils;
            },
            get page() {
              return context;
            },
            get component() {
              return context;
            },
            get props() {
              return self.props;
            },
            get constants() {
              return __$$constants;
            },
            i18n: __$$i18n.i18n,
            i18nFormat: __$$i18n.i18nFormat,
            getLocale: __$$i18n.getLocale,
            setLocale(locale) {
              __$$i18n.setLocale(locale);
              self.forceUpdate();
            },${useRef ? `
                  $(refName) {
                    return self._refsManager.get(refName);
                  },
                  $$(refName) {
                    return self._refsManager.getAll(refName);
                  },
                  get _refsManager() {
                    if (!self._refsManager) {
                      self._refsManager = new RefsManager();
                    }
                    return self._refsManager;
                  },
                ` : ""}
            ...this._methods,
          };

          return context;
        }
      `,
      linkAfter: [RAX_CHUNK_NAME.ClassRenderEnd]
    });
    return next;
  };
  return plugin;
};
var containerInjectContext_default2 = pluginFactory32;

// src/plugins/component/rax/containerInjectDataSourceEngine.ts
var import_lowcode_types9 = require("@alilc/lowcode-types");
var import_change_case8 = __toESM(require("change-case"));
var pluginFactory33 = (config) => {
  var _a;
  const cfg = {
    fileType: "jsx" /* JSX */,
    ...config,
    dataSourceHandlersPackageMap: (config == null ? void 0 : config.dataSourceHandlersPackageMap) || ((_a = config == null ? void 0 : config.datasourceConfig) == null ? void 0 : _a.handlersPackages)
  };
  const plugin = async (pre) => {
    var _a2;
    const next = {
      ...pre
    };
    const scope = Scope.createRootScope();
    const dataSourceConfig = isContainerSchema(pre.ir) ? pre.ir.dataSource : null;
    const dataSourceItems = dataSourceConfig && dataSourceConfig.list || [];
    const dataSourceEngineOptions = { runtimeConfig: true };
    if (dataSourceItems.length > 0) {
      const requestHandlersMap = {};
      dataSourceItems.forEach((ds) => {
        var _a3;
        const dsType = ds.type || "fetch";
        if (!(dsType in requestHandlersMap) && dsType !== "custom") {
          const handlerFactoryName = `__$$create${import_change_case8.default.pascal(dsType)}RequestHandler`;
          requestHandlersMap[dsType] = {
            type: "JSExpression",
            value: `${handlerFactoryName}(${dsType === "urlParams" ? "__$$getSearchParams()" : ""})`
          };
          const handlerFactoryExportName = `create${import_change_case8.default.pascal(dsType)}Handler`;
          const handlerPkgName = ((_a3 = cfg.dataSourceHandlersPackageMap) == null ? void 0 : _a3[dsType]) || `@alilc/lowcode-datasource-${import_change_case8.default.kebab(dsType)}-handler`;
          next.chunks.push({
            type: "string" /* STRING */,
            fileType: "jsx" /* JSX */,
            name: COMMON_CHUNK_NAME.ExternalDepsImport,
            content: `
              import { ${handlerFactoryExportName} as ${handlerFactoryName} } from '${handlerPkgName}';
            `,
            linkAfter: []
          });
        }
      });
      Object.assign(dataSourceEngineOptions, { requestHandlersMap });
    }
    const datasourceEnginePackageName = ((_a2 = cfg.datasourceConfig) == null ? void 0 : _a2.enginePackage) || "@alilc/lowcode-datasource-engine";
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: COMMON_CHUNK_NAME.ExternalDepsImport,
      content: `
        import { create as __$$createDataSourceEngine } from '${datasourceEnginePackageName}/runtime';
      `,
      linkAfter: []
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsVar,
      content: `
        _dataSourceConfig = this._defineDataSourceConfig();
        _dataSourceEngine = __$$createDataSourceEngine(
          this._dataSourceConfig,
          this._context,
          ${generateCompositeType(dataSourceEngineOptions, scope)}
        );`,
      linkAfter: [CLASS_DEFINE_CHUNK_NAME.Start]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: RAX_CHUNK_NAME.ClassDidMountContent,
      content: `
        this._dataSourceEngine.reloadDataSource();
      `,
      linkAfter: [RAX_CHUNK_NAME.ClassDidMountBegin]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod,
      content: `
_defineDataSourceConfig() {
  const __$$context = this._context;
  return (${generateCompositeType(
        {
          ...dataSourceConfig,
          list: [
            ...dataSourceItems.map((item) => {
              var _a3;
              return {
                errorHandler: {
                  type: "JSFunction",
                  value: `function (err){
              setTimeout(() => {
                this.setState({ __refresh: Date.now() + Math.random() });
              }, 0);
              throw err;
            }`
                },
                ...item,
                isInit: typeof item.isInit === "boolean" || typeof item.isInit === "undefined" ? (_a3 = item.isInit) != null ? _a3 : true : wrapAsFunction2(item.isInit, scope),
                options: wrapAsFunction2(item.options, scope)
              };
            })
          ]
        },
        scope,
        {
          handlers: {
            function: (jsFunc) => parseExpressionConvertThis2Context(jsFunc.value, "__$$context"),
            expression: (jsExpr) => parseExpressionConvertThis2Context(jsExpr.value, "__$$context")
          }
        }
      )});
}
      `,
      linkAfter: [RAX_CHUNK_NAME.ClassRenderEnd]
    });
    return next;
  };
  return plugin;
};
var containerInjectDataSourceEngine_default2 = pluginFactory33;
function wrapAsFunction2(value, scope) {
  if ((0, import_lowcode_types9.isJSExpression)(value) || (0, import_lowcode_types9.isJSFunction)(value)) {
    return {
      type: "JSExpression",
      value: `function(){ return ((${value.value}))}`
    };
  }
  return {
    type: "JSExpression",
    value: `function(){return((${generateCompositeType(value, scope)}))}`
  };
}

// src/plugins/component/rax/containerInjectUtils.ts
var pluginFactory34 = (config) => {
  const cfg = {
    fileType: "jsx" /* JSX */,
    ...config
  };
  const plugin = async (pre) => {
    var _a;
    const next = {
      ...pre
    };
    const ir = next.ir;
    const useRef = !!((_a = ir.analyzeResult) == null ? void 0 : _a.isUsingRef);
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      content: `
        import __$$projectUtils${useRef ? ", { RefsManager }" : ""} from '../../utils';
      `,
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsVar,
      content: "_utils = this._defineUtils();",
      linkAfter: [CLASS_DEFINE_CHUNK_NAME.Start]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod,
      content: `
        _defineUtils() {
          return {
            ...__$$projectUtils,
          };
        }`,
      linkAfter: [RAX_CHUNK_NAME.ClassRenderEnd]
    });
    return next;
  };
  return plugin;
};
var containerInjectUtils_default2 = pluginFactory34;

// src/plugins/component/rax/jsx.ts
var import_lowcode_types10 = require("@alilc/lowcode-types");
var import_lodash6 = __toESM(require("lodash"));
var import_change_case9 = __toESM(require("change-case"));
var pluginFactory35 = (config) => {
  const cfg = {
    fileType: "jsx" /* JSX */,
    ...config
  };
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    const rootScope = Scope.createRootScope();
    const { tolerateEvalErrors = true, evalErrorsHandler = "" } = next.contextData;
    const componentsNameAliasMap = /* @__PURE__ */ new Map();
    next.chunks.forEach((chunk) => {
      if (isImportAliasDefineChunk(chunk)) {
        componentsNameAliasMap.set(chunk.ext.aliasName, chunk.ext.originalName);
      }
    });
    const mapComponentNameToAliasOrKeepIt = (componentName) => componentsNameAliasMap.get(componentName) || componentName;
    next.chunks = next.chunks.filter((chunk) => !isImportAliasDefineChunk(chunk));
    const customHandlers = {
      expression(input, scope) {
        return transformJsExpr(generateExpression(input, scope), scope, {
          dontWrapEval: !tolerateEvalErrors
        });
      },
      function(input, scope) {
        return transformThis2Context(input.value || "null", scope);
      }
    };
    const commonNodeGenerator = createNodeGenerator({
      handlers: customHandlers,
      tagMapping: mapComponentNameToAliasOrKeepIt,
      nodePlugins: [generateReactExprInJS, generateConditionReactCtrl, generateRaxLoopCtrl],
      attrPlugins: [generateNodeAttrForRax.bind({ cfg })]
    });
    const jsxContent = commonNodeGenerator(ir, rootScope);
    if (!cfg.ignoreMiniApp) {
      next.chunks.push({
        type: "string" /* STRING */,
        fileType: cfg.fileType,
        name: COMMON_CHUNK_NAME.ExternalDepsImport,
        content: "import { isMiniApp as __$$isMiniApp } from 'universal-env';",
        linkAfter: []
      });
    }
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: RAX_CHUNK_NAME.ClassRenderPre,
      content: `
        const __$$context = this._context;
        const { state, setState, dataSourceMap, reloadDataSource, utils, constants, i18n, i18nFormat, getLocale, setLocale } = __$$context;
      `,
      linkAfter: [RAX_CHUNK_NAME.ClassRenderBegin]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: RAX_CHUNK_NAME.ClassRenderJSX,
      content: `return ${jsxContent};`,
      linkAfter: [RAX_CHUNK_NAME.ClassRenderBegin, RAX_CHUNK_NAME.ClassRenderPre]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.CustomContent,
      content: [
        tolerateEvalErrors && `
        function __$$eval(expr) {
          try {
            return expr();
          } catch (error) {
            ${evalErrorsHandler}
          }
        }

        function __$$evalArray(expr) {
          const res = __$$eval(expr);
          return Array.isArray(res) ? res : [];
        }
        `,
        `
        function __$$createChildContext(oldContext, ext) {
          return Object.assign({}, oldContext, ext);
        }
      `
      ].filter(Boolean).join("\n"),
      linkAfter: [COMMON_CHUNK_NAME.FileExport]
    });
    return next;
    function generateRaxLoopCtrl(nodeItem, scope, config2, next2) {
      var _a, _b;
      if (nodeItem.loop) {
        const loopItemName = ((_a = nodeItem.loopArgs) == null ? void 0 : _a[0]) || "item";
        const loopIndexName = ((_b = nodeItem.loopArgs) == null ? void 0 : _b[1]) || "index";
        const subScope = scope.createSubScope([loopItemName, loopIndexName]);
        const pieces = next2 ? next2(nodeItem, subScope, config2) : [];
        const loopDataExpr = tolerateEvalErrors ? `__$$evalArray(() => (${transformThis2Context(
          generateCompositeType(nodeItem.loop, scope, { handlers: config2 == null ? void 0 : config2.handlers }),
          scope
        )}))` : `(${transformThis2Context(
          generateCompositeType(nodeItem.loop, scope, { handlers: config2 == null ? void 0 : config2.handlers }),
          scope
        )})`;
        pieces.unshift({
          value: `${loopDataExpr}.map((${loopItemName}, ${loopIndexName}) => ((__$$context) => (`,
          type: "NodeCodePieceBefore" /* BEFORE */
        });
        pieces.push({
          value: `))(__$$createChildContext(__$$context, { ${loopItemName}, ${loopIndexName} })))`,
          type: "NodeCodePieceAfter" /* AFTER */
        });
        return pieces;
      }
      return next2 ? next2(nodeItem, scope, config2) : [];
    }
  };
  return plugin;
};
var jsx_default2 = pluginFactory35;
function isImportAliasDefineChunk(chunk) {
  var _a;
  return chunk.name === COMMON_CHUNK_NAME.ImportAliasDefine && !!chunk.ext && typeof chunk.ext.aliasName === "string" && typeof chunk.ext.originalName === "string" && !!((_a = chunk.ext.dependency) == null ? void 0 : _a.componentName);
}
function generateNodeAttrForRax(attrData, scope, config, next) {
  if (!this.cfg.ignoreMiniApp && /^on/.test(attrData.attrName)) {
    return generateEventHandlerAttrForRax(attrData.attrName, attrData.attrValue, scope, config);
  }
  if (attrData.attrName === "ref") {
    return [
      {
        name: attrData.attrName,
        value: `__$$context._refsManager.linkRef('${attrData.attrValue}')`,
        type: "NodeCodePieceAttr" /* ATTR */
      }
    ];
  }
  return next ? next(attrData, scope, config) : [];
}
function generateEventHandlerAttrForRax(attrName, attrValue, scope, config) {
  var _a;
  const valueExpr = generateCompositeType(
    (0, import_lowcode_types10.isJSExpression)(attrValue) ? { type: "JSFunction", value: attrValue.value } : attrValue,
    scope,
    {
      handlers: config == null ? void 0 : config.handlers
    }
  );
  const currentScopeVariables = ((_a = scope.bindings) == null ? void 0 : _a.getAllBindings()) || [];
  if (currentScopeVariables.length <= 0) {
    return [
      {
        type: "NodeCodePieceAttr" /* ATTR */,
        name: attrName,
        value: valueExpr
      }
    ];
  }
  const undeclaredVariablesInValueExpr = parseExpressionGetGlobalVariables(valueExpr);
  const referencedLocalVariables = import_lodash6.default.intersection(
    undeclaredVariablesInValueExpr,
    currentScopeVariables
  );
  if (referencedLocalVariables.length <= 0) {
    return [
      {
        type: "NodeCodePieceAttr" /* ATTR */,
        name: attrName,
        value: valueExpr
      }
    ];
  }
  const wrappedAttrValueExpr = [
    "(...__$$args) => {",
    "  if (__$$isMiniApp) {",
    "    const __$$event = __$$args[0];",
    ...referencedLocalVariables.map(
      (localVar) => `const ${localVar} = __$$event.target.dataset.${localVar};`
    ),
    `    return (${valueExpr}).apply(this, __$$args);`,
    "  } else {",
    `    return (${valueExpr}).apply(this, __$$args);`,
    "  }",
    "}"
  ].join("\n");
  return [
    ...referencedLocalVariables.map((localVar) => ({
      type: "NodeCodePieceAttr" /* ATTR */,
      name: `data-${import_change_case9.default.snake(localVar)}`,
      value: localVar
    })),
    {
      type: "NodeCodePieceAttr" /* ATTR */,
      name: attrName,
      value: wrappedAttrValueExpr
    }
  ];
}

// src/plugins/component/rax/commonDeps.ts
var pluginFactory36 = () => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: COMMON_CHUNK_NAME.ExternalDepsImport,
      content: `
        // \u6CE8\u610F: \u51FA\u7801\u5F15\u64CE\u6CE8\u5165\u7684\u4E34\u65F6\u53D8\u91CF\u9ED8\u8BA4\u90FD\u4EE5 "__$$" \u5F00\u5934\uFF0C\u7981\u6B62\u5728\u642D\u5EFA\u7684\u4EE3\u7801\u4E2D\u76F4\u63A5\u8BBF\u95EE\u3002
        // \u4F8B\u5916\uFF1Arax \u6846\u67B6\u7684\u5BFC\u51FA\u540D\u548C\u5404\u79CD\u7EC4\u4EF6\u540D\u9664\u5916\u3002
        import { createElement, Component } from 'rax';
        import { getSearchParams as __$$getSearchParams } from 'rax-app';
      `,
      linkAfter: []
    });
    return next;
  };
  return plugin;
};
var commonDeps_default = pluginFactory36;

// src/plugins/project/framework/rax/template/files/.eslintignore.ts
function getFile33() {
  return [
    ["."],
    {
      name: ".eslintignore",
      ext: "",
      content: "node_modules/\nlib/\ndist/\nbuild/\ncoverage/\ndemo/\nes/\n.rax/\n"
    }
  ];
}

// src/plugins/project/framework/rax/template/files/.eslintrc.js.ts
function getFile34() {
  return [
    ["."],
    {
      name: ".eslintrc",
      ext: "js",
      content: "const { getESLintConfig } = require('@iceworks/spec');\n\n// https://www.npmjs.com/package/@iceworks/spec\nmodule.exports = {\n  ...getESLintConfig('rax'),\n  rules: {\n    'max-len': ['error', { code: 200 }],\n    'function-paren-newline': 'off',\n    '@typescript-eslint/indent': 'off',\n    'prettier/prettier': 'off',\n    'no-empty': 'off',\n    'no-unused-vars': 'off',\n    '@iceworks/best-practices/recommend-functional-component': 'off',\n  },\n};\n"
    }
  ];
}

// src/plugins/project/framework/rax/template/files/.gitignore.ts
function getFile35() {
  return [
    ["."],
    {
      name: ".gitignore",
      ext: "",
      content: "# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.\n\n*~\n*.swp\n*.log\n\n.DS_Store\n.idea/\n.temp/\n\nbuild/\ndist/\nlib/\ncoverage/\nnode_modules/\n.rax/\n\ntemplate.yml"
    }
  ];
}

// src/plugins/project/framework/rax/template/files/.prettierignore.ts
function getFile36() {
  return [
    ["."],
    {
      name: ".prettierignore",
      ext: "",
      content: "node_modules/\nlib/\ndist/\nbuild/\ncoverage/\ndemo/\nes/\n.rax/\n"
    }
  ];
}

// src/plugins/project/framework/rax/template/files/.prettierrc.js.ts
function getFile37() {
  return [
    ["."],
    {
      name: ".prettierrc",
      ext: "js",
      content: "const { getPrettierConfig } = require('@iceworks/spec');\n\nmodule.exports = getPrettierConfig('rax');\n"
    }
  ];
}

// src/plugins/project/framework/rax/template/files/.stylelintignore.ts
function getFile38() {
  return [
    ["."],
    {
      name: ".stylelintignore",
      ext: "",
      content: "node_modules/\nlib/\ndist/\nbuild/\ncoverage/\ndemo/\nes/\n.rax/\n"
    }
  ];
}

// src/plugins/project/framework/rax/template/files/.stylelintrc.js.ts
function getFile39() {
  return [
    ["."],
    {
      name: ".stylelintrc",
      ext: "js",
      content: "const { getStylelintConfig } = require('@iceworks/spec');\n\nmodule.exports = getStylelintConfig('rax');\n"
    }
  ];
}

// src/plugins/project/framework/rax/template/files/jsconfig.json.ts
function getFile40() {
  return [
    ["."],
    {
      name: "jsconfig",
      ext: "json",
      content: '{\n  "compilerOptions": {\n    "baseUrl": ".",\n    "jsx": "react",\n    "paths": {\n      "@/*": ["./src/*"],\n      "rax-app": [".rax/index.ts"]\n    }\n  }\n}\n'
    }
  ];
}

// src/plugins/project/framework/rax/template/files/README.md.ts
function getFile41() {
  return [
    ["."],
    {
      name: "README",
      ext: "md",
      content: "# rax-materials-basic-app\n\n## Getting Started\n\n### `npm run start`\n\nRuns the app in development mode.\n\nOpen [http://localhost:3333](http://localhost:3333) to view it in the browser.\n\nThe page will reload if you make edits.\n\n### `npm run build`\n\nBuilds the app for production to the `build` folder.\n"
    }
  ];
}

// src/plugins/project/framework/rax/template/files/tsconfig.json.ts
function getFile42() {
  return [
    ["."],
    {
      name: "tsconfig",
      ext: "json",
      content: '{\n  "compileOnSave": false,\n  "buildOnSave": false,\n  "compilerOptions": {\n    "baseUrl": ".",\n    "outDir": "build",\n    "module": "esnext",\n    "target": "es6",\n    "jsx": "preserve",\n    "jsxFactory": "createElement",\n    "moduleResolution": "node",\n    "allowSyntheticDefaultImports": true,\n    "lib": ["es6", "dom"],\n    "sourceMap": true,\n    "allowJs": true,\n    "rootDir": "./",\n    "forceConsistentCasingInFileNames": true,\n    "noImplicitReturns": true,\n    "noImplicitThis": true,\n    "noImplicitAny": false,\n    "importHelpers": true,\n    "strictNullChecks": true,\n    "suppressImplicitAnyIndexErrors": true,\n    "noUnusedLocals": true,\n    "skipLibCheck": true,\n    "paths": {\n      "@/*": ["./src/*"],\n      "rax-app": [".rax/index.ts"]\n    }\n  },\n  "include": ["src", ".rax"],\n  "exclude": ["node_modules", "build", "public"]\n}'
    }
  ];
}

// src/plugins/project/framework/rax/template/static-files.ts
function generateStaticFiles3(root = createResultDir(".")) {
  runFileGenerator(root, getFile33);
  runFileGenerator(root, getFile34);
  runFileGenerator(root, getFile35);
  runFileGenerator(root, getFile36);
  runFileGenerator(root, getFile37);
  runFileGenerator(root, getFile38);
  runFileGenerator(root, getFile39);
  runFileGenerator(root, getFile40);
  runFileGenerator(root, getFile41);
  runFileGenerator(root, getFile42);
  return root;
}

// src/plugins/project/framework/rax/template/index.ts
var raxAppTemplate = {
  slots: {
    components: {
      path: ["src", "components"]
    },
    pages: {
      path: ["src", "pages"]
    },
    router: {
      path: ["src"],
      fileName: "router"
    },
    entry: {
      path: ["src"],
      fileName: "app"
    },
    appConfig: {
      path: ["src"],
      fileName: "app"
    },
    buildConfig: {
      path: [],
      fileName: "build"
    },
    constants: {
      path: ["src"],
      fileName: "constants"
    },
    utils: {
      path: ["src"],
      fileName: "utils"
    },
    i18n: {
      path: ["src"],
      fileName: "i18n"
    },
    globalStyle: {
      path: ["src"],
      fileName: "global"
    },
    htmlEntry: {
      path: ["src", "document"],
      fileName: "index"
    },
    packageJSON: {
      path: [],
      fileName: "package"
    }
  },
  async generateTemplate() {
    return generateStaticFiles3();
  }
};
var template_default3 = raxAppTemplate;

// src/plugins/project/framework/rax/plugins/entry.ts
var pluginFactory37 = (cfg) => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "js" /* JS */,
      name: COMMON_CHUNK_NAME.ExternalDepsImport,
      content: `
import { runApp } from 'rax-app';

import './global.${(cfg == null ? void 0 : cfg.globalStylesFileType) || "css"}';
`,
      linkAfter: []
    });
    const appConfig = (cfg == null ? void 0 : cfg.appConfig) || {};
    Object.assign(appConfig, {
      router: {
        mode: "hash",
        ...appConfig.router
      }
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "js" /* JS */,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: `
runApp(${JSON.stringify(appConfig, null, 2)});
`,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.ImportAliasDefine,
        COMMON_CHUNK_NAME.FileVarDefine,
        COMMON_CHUNK_NAME.FileUtilDefine
      ]
    });
    return next;
  };
  return plugin;
};
var entry_default2 = pluginFactory37;

// src/plugins/project/framework/rax/plugins/appConfig.ts
var import_change_case10 = __toESM(require("change-case"));
var pluginFactory38 = (cfg) => {
  const plugin = async (pre) => {
    var _a, _b, _c, _d, _e, _f;
    const next = {
      ...pre
    };
    const ir = next.ir;
    const routes = ((_b = (_a = ir.globalRouter) == null ? void 0 : _a.routes) == null ? void 0 : _b.map((route) => ({
      path: route.path,
      source: `pages/${ensureValidClassName(import_change_case10.default.pascalCase(route.fileName))}/index`
    }))) || [{ path: "/", source: "pages/Home/index" }];
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "json" /* JSON */,
      name: COMMON_CHUNK_NAME.CustomContent,
      content: `
{
  "routes": ${JSON.stringify(routes, null, 2)},
  "window": {
    "title": ${JSON.stringify(
        (cfg == null ? void 0 : cfg.title) || ((_d = (_c = ir.project) == null ? void 0 : _c.meta) == null ? void 0 : _d.title) || ((_f = (_e = ir.project) == null ? void 0 : _e.meta) == null ? void 0 : _f.name) || ""
      )}
  }
}
      `,
      linkAfter: []
    });
    return next;
  };
  return plugin;
};
var appConfig_default2 = pluginFactory38;

// src/plugins/project/framework/rax/plugins/buildConfig.ts
var pluginFactory39 = (cfg) => {
  const plugin = async (pre) => {
    var _a, _b, _c, _d, _e;
    const next = {
      ...pre
    };
    const ir = next.ir;
    const miniAppBuildType = ((_a = cfg == null ? void 0 : cfg.buildConfig) == null ? void 0 : _a.miniAppBuildType) || ((_c = (_b = ir.project) == null ? void 0 : _b.config) == null ? void 0 : _c.miniAppBuildType);
    const targets = (cfg == null ? void 0 : cfg.targets) || ["web"];
    const buildCfg = {
      inlineStyle: false,
      plugins: [],
      targets,
      miniapp: miniAppBuildType ? {
        buildType: miniAppBuildType,
        ...(_d = cfg == null ? void 0 : cfg.buildConfig) == null ? void 0 : _d.miniapp
      } : (_e = cfg == null ? void 0 : cfg.buildConfig) == null ? void 0 : _e.miniapp,
      ...cfg == null ? void 0 : cfg.buildConfig
    };
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "json" /* JSON */,
      name: COMMON_CHUNK_NAME.CustomContent,
      content: `${JSON.stringify(buildCfg, null, 2)}
`,
      linkAfter: []
    });
    return next;
  };
  return plugin;
};
var buildConfig_default2 = pluginFactory39;

// src/plugins/project/framework/rax/plugins/entryDocument.ts
var pluginFactory40 = (cfg) => {
  const plugin = async (pre) => {
    var _a;
    const next = {
      ...pre
    };
    const ir = next.ir;
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: COMMON_CHUNK_NAME.CustomContent,
      content: `
import { createElement } from 'rax';
import { Root, Style, Script } from 'rax-document';

function Document() {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover"
        />
        <title>${(cfg == null ? void 0 : cfg.title) || ((_a = ir == null ? void 0 : ir.meta) == null ? void 0 : _a.name) || "Rax App"}</title>
        <Style />
      </head>
      <body>
        {/* root container */}
        <Root />
        <Script />
      </body>
    </html>
  );
}

export default Document;
`,
      linkAfter: []
    });
    return next;
  };
  return plugin;
};
var entryDocument_default = pluginFactory40;

// src/plugins/project/framework/rax/plugins/globalStyle.ts
var pluginFactory41 = (config) => {
  const cfg = {
    fileType: "scss" /* SCSS */,
    ...config
  };
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.StyleDepsImport,
      content: "",
      linkAfter: []
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.StyleCssContent,
      content: `
body {
  -webkit-font-smoothing: antialiased;
}
`,
      linkAfter: [COMMON_CHUNK_NAME.StyleDepsImport]
    });
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.StyleCssContent,
      content: ir.css || "",
      linkAfter: [COMMON_CHUNK_NAME.StyleDepsImport]
    });
    return next;
  };
  return plugin;
};
var globalStyle_default3 = pluginFactory41;

// src/utils/version.ts
var version_exports = {};
__export(version_exports, {
  calcCompatibleVersion: () => calcCompatibleVersion
});
var import_semver = __toESM(require("semver"));
function calcCompatibleVersion(v1, v2) {
  if (!v1 && !v2) {
    return "*";
  }
  if (!v1 || v1 === "*") {
    return v2 || "*";
  }
  if (!v2 || v2 === "*") {
    return v1;
  }
  if (v1 === v2) {
    return v1;
  }
  if (!import_semver.default.intersects(v1, v2, { loose: true })) {
    throw new Error(`no compatible versions for "${v1}" and "${v2}"`);
  }
  if (import_semver.default.subset(v1, v2, { loose: true })) {
    return v1;
  }
  return v2;
}

// src/plugins/project/framework/rax/plugins/packageJSON.ts
var pluginFactory42 = (cfg) => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    const npmDeps = getNpmDependencies(ir);
    const packageJson = {
      name: (cfg == null ? void 0 : cfg.packageName) || "rax-demo-app",
      private: true,
      version: (cfg == null ? void 0 : cfg.packageVersion) || "1.0.0",
      scripts: {
        start: "rax-app start",
        build: "rax-app build",
        eslint: "eslint --ext .js,.jsx ./",
        stylelint: 'stylelint "**/*.{css,scss,less}"',
        prettier: "prettier **/* --write",
        lint: "npm run eslint && npm run stylelint"
      },
      dependencies: {
        ...buildDataSourceDependencies(ir, cfg == null ? void 0 : cfg.datasourceConfig),
        "universal-env": "^3.2.0",
        "intl-messageformat": "^9.3.6",
        rax: "^1.1.0",
        "rax-document": "^0.1.6",
        ...npmDeps.reduce(
          (acc, npm) => ({
            ...acc,
            [npm.package]: npm.version || "*"
          }),
          {}
        )
      },
      devDependencies: {
        "@iceworks/spec": "^1.0.0",
        "rax-app": "^3.0.0",
        eslint: "^6.8.0",
        prettier: "^2.1.2",
        stylelint: "^13.7.2"
      }
    };
    next.chunks.push({
      type: "json" /* JSON */,
      fileType: "json" /* JSON */,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: packageJson,
      linkAfter: []
    });
    return next;
  };
  return plugin;
};
var packageJSON_default3 = pluginFactory42;
function getNpmDependencies(project) {
  const npmDeps = [];
  const npmNameToPkgMap = /* @__PURE__ */ new Map();
  const allDeps = project.packages;
  allDeps.forEach((dep) => {
    if (!isNpmInfo(dep)) {
      return;
    }
    const existing = npmNameToPkgMap.get(dep.package);
    if (!existing) {
      npmNameToPkgMap.set(dep.package, dep);
      npmDeps.push(dep);
      return;
    }
    if (existing.version !== dep.version) {
      try {
        npmNameToPkgMap.set(dep.package, {
          ...existing,
          version: calcCompatibleVersion(existing.version, dep.version)
        });
      } catch (e) {
        throw new Error(
          `Cannot find compatible version for ${dep.package}. Detail: ${getErrorMessage(e)}`
        );
      }
    }
  });
  return npmDeps;
}

// src/plugins/project/framework/rax/index.ts
var rax_default = {
  template: template_default3,
  plugins: {
    appConfig: appConfig_default2,
    buildConfig: buildConfig_default2,
    entry: entry_default2,
    entryDocument: entryDocument_default,
    globalStyle: globalStyle_default3,
    packageJSON: packageJSON_default3
  }
};

// src/solutions/rax-app.ts
function createRaxProjectBuilder(options) {
  return createProjectBuilder({
    inStrictMode: options == null ? void 0 : options.inStrictMode,
    extraContextData: { ...options },
    template: rax_default.template,
    plugins: {
      components: [
        commonDeps_default(),
        esmodule_default({ fileType: "jsx", useAliasName: false }),
        containerClass_default2(),
        containerInitState_default2(),
        containerMethods_default(),
        containerInjectContext_default2(),
        containerInjectDataSourceEngine_default2(options),
        containerInjectUtils_default2(),
        containerLifeCycle_default2(),
        jsx_default2(),
        css_default()
      ],
      pages: [
        commonDeps_default(),
        esmodule_default({ fileType: "jsx" }),
        containerClass_default2(),
        containerInitState_default2(),
        containerMethods_default(),
        containerInjectContext_default2(),
        containerInjectDataSourceEngine_default2(options),
        containerInjectUtils_default2(),
        containerLifeCycle_default2(),
        jsx_default2(),
        css_default()
      ],
      appConfig: [rax_default.plugins.appConfig(options)],
      buildConfig: [rax_default.plugins.buildConfig(options)],
      entry: [rax_default.plugins.entry(options)],
      constants: [constants_default()],
      utils: [esmodule_default(), utils_default("rax")],
      i18n: [i18n_default()],
      globalStyle: [
        rax_default.plugins.globalStyle({ fileType: (options == null ? void 0 : options.globalStylesFileType) || "css" })
      ],
      htmlEntry: [rax_default.plugins.entryDocument(options)],
      packageJSON: [rax_default.plugins.packageJSON(options)]
    },
    postProcessors: [prettier_default()],
    customizeBuilderOptions: options == null ? void 0 : options.customizeBuilderOptions
  });
}
var plugins3 = {
  containerClass: containerClass_default2,
  containerLifeCycles: containerLifeCycle_default2,
  containerMethods: containerMethods_default,
  containerInitState: containerInitState_default2,
  containerInjectContext: containerInjectContext_default2,
  containerInjectDataSourceEngine: containerInjectDataSourceEngine_default2,
  containerInjectUtils: containerInjectUtils_default2,
  jsx: jsx_default2,
  commonDeps: commonDeps_default,
  raxApp: rax_default
};

// src/plugins/project/framework/nextjs/template/files/tsconfig.json.ts
function getFile43() {
  return [
    [],
    {
      name: "tsconfig",
      ext: "json",
      content: `
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "fontEnd/types/**/*.ts",
    "imasacs/types/**/*.ts",
    "counter-web/types/**/*.ts",
    "web/types/**/*.ts",
    "./web/types/**/*.ts",
    "../web/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}         
    `
    }
  ];
}

// src/plugins/project/framework/nextjs/template/files/tailwind.config.ts.ts
function getFile44() {
  return [
    [],
    {
      name: "tailwind.config",
      ext: "ts",
      content: `
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  corePlugins: {
    // preflight: false,
  },
}
export default config      
    `
    }
  ];
}

// src/plugins/project/framework/nextjs/template/files/README.md.ts
function getFile45() {
  return [
    [],
    {
      name: "README",
      ext: "md",
      content: `
This is a [Next.js](https://nextjs.org/) project bootstrapped with [\`create-next-app\`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying \`app/page.tsx\`. The page auto-updates as you edit the file.

This project uses [\`next/font\`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
    `
    }
  ];
}

// src/plugins/project/framework/nextjs/template/files/postcss.config.js.ts
function getFile46() {
  return [
    [],
    {
      name: "postcss.config",
      ext: "js",
      content: `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
    `
    }
  ];
}

// src/plugins/project/framework/nextjs/template/files/next.config.js.ts
function getFile47() {
  return [
    [],
    {
      name: "next.config",
      ext: "js",
      content: `
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.BUILD_OUTPUT,
  distDir: "esscweb",
  assetPrefix: "/esscweb",
  basePath: "/esscweb",
  trailingSlash: true,
  typescript: {
    // \u7981\u7528\u7C7B\u578B\u68C0\u67E5
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig;      
`
    }
  ];
}

// src/plugins/project/framework/nextjs/template/files/next-env.d.ts
function getFile48() {
  return [
    [],
    {
      name: "next-env.d",
      ext: "ts",
      content: `
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.  
    `
    }
  ];
}

// src/plugins/project/framework/nextjs/template/files/env.ts
function getFile49() {
  const file2 = createResultFile(
    ".env",
    "",
    `
BUILD_OUTPUT='standalone'
    `
  );
  return [[], file2];
}

// src/plugins/project/framework/nextjs/template/files/env.production.ts
function getFile50() {
  const file2 = createResultFile(
    ".env.production",
    "",
    `
BUILD_OUTPUT='export'
    `
  );
  return [[], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/utils/utils.js.ts
function getFile51() {
  const file2 = createResultFile(
    "utils",
    "js",
    `
import { parse } from 'querystring';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?://)?)(?:[-;:&=+$,w]+@)?[A-Za-z0-9.-]+(?::d+)?|(?:www.|[-;:&=+$,w]+@)[A-Za-z0-9.-]+)((?:/[+~%/.w-_]*)???(?:[-+=&;%@.w_]*)#?(?:[w]*))?)$/;
export const isUrl = (path) => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // \u7ED9\u5B98\u65B9\u6F14\u793A\u7AD9\u70B9\u7528\uFF0C\u7528\u4E8E\u5173\u95ED\u771F\u5B9E\u5F00\u53D1\u73AF\u5883\u4E0D\u9700\u8981\u4F7F\u7528\u7684\u7279\u6027

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);         
    `
  );
  return [["src", "utils"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/utils/DateUtil.js.ts
function getFile52() {
  const file2 = createResultFile(
    "DateUtil",
    "js",
    `
import moment from 'moment';

export function fixedZero(val) {
  return val * 1 < 10 ? \`0\${val}\` : val;
}

export const dateFormatTime = 'YYYY-MM-DD HH:mm:ss';
export const dateFormat = 'YYYY-MM-DD';
const hhmmss = 'HHmmss';
export const timeFormat = 'HHmm';
export const hhmmssD = 'HH:mm:ss';
const YYYYMMDDHHmmss = 'YYYYMMDDHHmmss';

export function formatterTime (val) {
    return val ? moment(new Date(val)).format(dateFormatTime) : '';
}

export function formatterDate (val) {
  return val ? moment(new Date(val)).format(dateFormat) : '';
}

export function formatterHHmmss (val) {
  return val ? moment(new Date(val)).format(hhmmss) : '';
}

export function dateTimeByTime (val) {
  if(!val){
    return moment(new Date(), dateFormatTime);
  }
  let dateTime = moment(new Date()).format(dateFormat) + ' ' + val;
  return moment(new Date(dateTime), dateFormatTime);
}

export function formatterTimeByDate (val) {
  return moment(val ? val : new Date(), dateFormatTime);
}

export function getMomentStartTime (val) {
  if(!val){
    return;
  }
  return val + ' 00:00:00';
}

export function getMomentEndTime (val) {
  if(!val){
    return;
  }
  return val + ' 23:59:59';
}

export function getYYYYMMDDHHmmss (val) {
  return val ? moment(new Date(val)).format(YYYYMMDDHHmmss) : '';
}

export function formatterDateStr (val) {
  return val ? moment(val, dateFormat) : '';
}

export function YYYYMMDDHHmm (date) {
  if(!date){
    return "";
  }
  let year = date.getFullYear();
  let months = (date.getMonth()+1) + "";
  if(parseInt(months) < 10){
      months = "0" + months;
  }
  let days = date.getDate() + "";
  if(parseInt(days) < 10){
      days = "0" + days;
  }
  let hour = date.getHours() + "";
  if(parseInt(hour) < 10){
      hour = "0" + hour;
  }
  let minute = date.getMinutes() + "";
  if(parseInt(minute) < 10){
      minute = "0" + minute;
  }
  return year + "-" + months + "-" + days + " " + hour + ":" + minute;
}
    `
  );
  return [["src", "utils"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/utils/constants.js.ts
function getFile53() {
  const file2 = createResultFile(
    "constants",
    "js",
    `
export const DAY_TYPE = {
  workday: '\u5DE5\u4F5C\u65E5',
  holiday: '\u8282\u5047\u65E5'
}
    `
  );
  return [["src", "utils"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/utils/Authorized.js.ts
function getFile54() {
  const file2 = createResultFile(
    "Authorized",
    "js",
    `
import RenderAuthorize from '@/components/Authorized';
import { getAuthority } from './authority';
/* eslint-disable eslint-comments/disable-enable-pair */

/* eslint-disable import/no-mutable-exports */

let Authorized = RenderAuthorize(getAuthority()); // Reload the rights component

const reloadAuthorized = () => {
  Authorized = RenderAuthorize(getAuthority());
};
/**
 * hard code
 * block need it\u3002
 */

window.reloadAuthorized = reloadAuthorized;
export { reloadAuthorized };
export default Authorized;  
    `
  );
  return [["src", "utils"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/utils/authority.js.ts
function getFile55() {
  const file2 = createResultFile(
    "authority",
    "js",
    `
import { reloadAuthorized } from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str; // authorityString could be admin, "admin", ["admin"]

  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  } // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design \u4E13\u7528\u73AF\u5883\u53D8\u91CF\uFF0C\u8BF7\u4E0D\u8981\u5728\u4F60\u7684\u9879\u76EE\u4E2D\u4F7F\u7528\u5B83\u3002

  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }

  return authority;
}
export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority)); // auto reload

  reloadAuthorized();
}    
    `
  );
  return [["src", "utils"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/theme/themeConfig.ts.ts
function getFile56() {
  const file2 = createResultFile(
    "themeConfig",
    "ts",
    `
// theme/themeConfig.ts
import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    fontSize: 16,
    // colorPrimary: '#52c41a',
  },
};

export default theme;
    `
  );
  return [["src", "theme"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/services/README.md.ts
function getFile57() {
  const file2 = createResultFile(
    "README",
    "md",
    `
## \u63A5\u53E3\u8BF7\u6C42\u7BA1\u7406

request.ts   \u81EA\u5B9A\u4E49\u5C01\u88C5axios\u5B9E\u4F8B
services.ts  \u8FDB\u4E00\u6B65\u5C01\u88C5\u516C\u5171\u8BF7\u6C42\u65B9\u6CD5            
    `
  );
  return [["src", "services"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/services/hooks.ts.ts
function getFile58() {
  const file2 = createResultFile(
    "hooks",
    "ts",
    `
import dynamic from 'next/dynamic';
import { pageResult } from "@/lib/interface";
import { post } from "./request";
import { message } from 'antd';

/**
 * \u5206\u9875\u5217\u8868
 * @param {*} url
 * @param {*} params
 */
export async function pageRequest(url:string, params:any):Promise<pageResult> {
    return post({
    url,
    params
    }).then((res:any) => {
    let list = [];
    if (res.resultCode === '39500000') {
        list = res.data === undefined ? [] : res.data;
    } else {
        message.error(res.resultMsg);
    }
    return { data: list, total: res.total };
    }).catch((error) => {
    message.error('\u7CFB\u7EDF\u6B63\u5FD9\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5');
    return { data: [], total: 0 };
    })
}

/**
 * \u4E00\u822C\u63D0\u4EA4\u4F7F\u7528\uFF0C\u6BD4\u5982\u65B0\u589E\u3001\u4FEE\u6539\uFF0C\u53EA\u9700\u8981\u6210\u529F\u6709\u5426\uFF0C\u6210\u529F\u9700\u8981\u6709\u63D0\u793A
 * @param {*} url
 * @param {*} data
 */
export async function requestSubmit(url: string, params: any) {
    return post({url, params}).then((res) => {
    if (res.resultCode === '39500000') {
        message.success('\u63D0\u4EA4\u6210\u529F');
        return true;
    } else {
        message.error(res.resultMsg);
        return false;
    }
    }).catch((error) => {
    message.error('\u7CFB\u7EDF\u6B63\u5FD9\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5');
    return false;
    })
}    
    `
  );
  return [["src", "services"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/services/request.ts.ts
function getFile59() {
  const file2 = createResultFile(
    "request",
    "ts",
    `
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { message } from "antd";
// \u5BA2\u6237\u7AEF\u6E32\u67D3\u65F6\uFF0C\u624D\u5B58\u5728 window
// \u82E5\u662F\u670D\u52A1\u6BB5\u6E32\u67D3\u754C\u9762\uFF0C\u8BF7\u4F7F\u7528\u539F\u751F nextjs \u6A21\u5F0F\uFF1B
let myWindow = { location: { host: "" }};
if (typeof window !== "undefined") {
    myWindow = window;
} else {
    myWindow = { location: { host: "" }}
}
let base = myWindow.location.host ? "http://" + myWindow.location.host + '/counter' : "/counter";
export const requestUrl = base + '/sys/';
/**
 * \u81EA\u5B9A\u4E49\u5C01\u88C5axios\u5B9E\u4F8B
 */
const request = axios.create({
    baseURL: requestUrl, // \u8BBE\u7F6E\u57FA\u7840URL
    timeout: 5000, // \u8D85\u65F6\u65F6\u95F4
    withCredentials: true, // \u8DE8\u57DF\u8BF7\u6C42\u65F6\u9700\u8981\u4F7F\u7528\u51ED\u8BC1 or \u643A\u5E26 cookies
    headers: {
        'Content-Type': 'application/json',
    },
    maxRedirects: 0
});

//\u8BF7\u6C42\u679A\u4E3E
export enum MethodEnum {
    Get = "GET",
    Post = "POST",
}

//\u8FD4\u56DE\u7ED3\u679C
export interface ResponseResultInterface<Body> {
    Header: {}
    Body: Body
}

//\u8BF7\u6C42\u53C2\u6570
export interface RequestInterface<params> {
    url: string
    params?: params
    method?: MethodEnum
}

// \u6DFB\u52A0\u8BF7\u6C42\u62E6\u622A\u5668
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// \u6DFB\u52A0\u54CD\u5E94\u62E6\u622A\u5668
request.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status && response.status == 200 && response.data.status == 'error') {
            message.error(response.data.msg);
            return;
        }
        return response;
    },
    error => {
        const { response } = error;
        if (!response) {
            axios({
                method: "POST",
                url: \`\${base}\` + "/get/public/properties",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: '',
            }).then((res) => {
                window.location.href = res.data.logoutUrl;
            })
        } else {
            message.error('\u8BF7\u6C42\u5F02\u5E38');
        }
        return response;
    }
)

const baseRequest = async <params, responseData>(requestPar: RequestInterface<params>): Promise<responseData> => {
    const requestResult: AxiosResponse = await request({
        method: requestPar.method || MethodEnum.Post,
        url: requestPar.url,
        data: requestPar.params,
    })
    return requestResult.data as responseData
}

const post = async <data, responseData>(requestPar: RequestInterface<data>): Promise<responseData> => {
    const requestResult: AxiosResponse = await request({
        method: MethodEnum.Post,
        url: requestPar.url,
        data: requestPar.params,
    })
    return requestResult.data as responseData
}

const get = async <data, responseData>(requestPar: RequestInterface<data>): Promise<responseData> => {
    const requestResult: AxiosResponse = await request({
        method: MethodEnum.Get,
        url: requestPar.url,
        data: requestPar.params,
    })
    return requestResult.data as responseData
}

const postBigFile = async <data, responseData>(requestPar: RequestInterface<data>): Promise<responseData> => {
    const requestResult: AxiosResponse = await request({
        method: MethodEnum.Post,
        url: requestPar.url,
        data: requestPar.params,
        headers: {
            'Transfer-Encoding': 'chunked'
        }
    })
    return requestResult.data as responseData
}
export {
    baseRequest,
    post,
    get,
    postBigFile
}
        
    `
  );
  return [["src", "services"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/services/sys/dictMapRequest.ts.ts
function getFile60() {
  const file2 = createResultFile(
    "dictMapRequest",
    "ts",
    `
import { post } from '../request';

/**
 * \u5B57\u5178\u5217\u8868\uFF08\u4E0B\u62C9\u6846\uFF09
 * @param {*} data
 */
export async function dictItemList(params:any) {
    return post({
    url: "dict_item_select",
    params
    }).then((res:any) => {
    return res.data;
    }).catch((error) => {
    return [];
    })
}
    `
  );
  return [["src", "services", "sys"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/services/sys/index.ts.ts
function getFile61() {
  const file2 = createResultFile(
    "index",
    "ts",
    `
export { dictItemList } from './dictMapRequest';
export { sysRole, resTreeSelect, resConfig } from './sysAuth';
    `
  );
  return [["src", "services", "sys"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/services/sys/sysAuth.ts.ts
function getFile62() {
  const file2 = createResultFile(
    "sysAuth",
    "ts",
    `
// @ts-ignore

/* eslint-disable */
import { requestSubmit, pageRequest } from '../hooks';
import { post } from "../request";
import { message } from 'antd'

/**
 * \u89D2\u8272\u67E5\u8BE2
 * @param {*} params 
 * @param {*} options 
 */
export async function sysRole(data: any) {
    return pageRequest('role', data)
}

export async function resTreeSelect(data: any) {
    return post({url: 'res/tree', params: data}).then((res) => {
    if (res.resultCode === '39500000') {
        return res.data;
    } else {
        message.error(res.resultMsg);
        return {treeList: [], treeList: []};
    }
    }).catch((error) => {
    message.error('\u7CFB\u7EDF\u6B63\u5FD9\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5');
    return {treeList: [], treeList: []};
    })
}

export async function resConfig(data: any) {
    return requestSubmit('res/config', data)
}
    `
  );
  return [["src", "services", "sys"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/services/app/TableDetail/api.ts.ts
function getFile63() {
  const file2 = createResultFile(
    "api",
    "ts",
    `
import { pageRequest } from "../../hooks";
/**
 * \u76D1\u63A7\u914D\u7F6E\u67E5\u8BE2
 * @param {*} params 
 * @param {*} options 
 */
export async function imaDetailQry(data: any) {
  return pageRequest('imasa_detail_qry', data);
}        
    `
  );
  return [["src", "services", "app", "TableDetail"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/services/app/TableDetail/index.ts.ts
function getFile64() {
  const file2 = createResultFile(
    "index",
    "ts",
    `
export * from './api';     
    `
  );
  return [["src", "services", "app", "TableDetail"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/services/app/user.ts.ts
function getFile65() {
  const file2 = createResultFile(
    "user",
    "ts",
    `
import {post} from "../request";

const queryUserInfo = async () => {
    return post({url: 'sys/current_user', params: null});
    // return Promise.resolve({
    //     "resultCode": "39500000",
    //     "resultMsg": null,
    //     "resultType": null,
    //     "data": {
    //         "loginId": "zhifu001",
    //         "role": [
    //             "3950_imasa_chl_manager"
    //         ],
    //         "auth": [
    //             "debit_collect",
    //             "monitor_super_clear",
    //             "monitor_renhang",
    //             "async_auth_b",
    //             "ibps",
    //             "async_auth",
    //             "chart",
    //             "fund",
    //             "view_config_trigger",
    //             "monitor_super_mgt",
    //             "monitor_super",
    //             "dashboard",
    //             "view_config",
    //             "monitor_super_fund",
    //             "imasa_det",
    //             "monitor_super_check",
    //             "credit_payment",
    //             "debit_payment",
    //             "monitor_super_info",
    //             "monitor",
    //             "credit_collect",
    //             "async_auth_q"
    //         ],
    //         "logoutUrl": "http://uat.sso.webank.com:8080/cas/logout?service=http://localhost:8000/counter/sys/login",
    //         "userName": "zhifu001"
    //     },
    //     "page": null,
    //     "total": 0
    // })
}
export {
    queryUserInfo
}
    `
  );
  return [["src", "services", "app"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/models/README.md.ts
function getFile66() {
  const file2 = createResultFile(
    "README",
    "md",
    `
## \u5168\u5C40 Store \u7BA1\u7406            
    `
  );
  return [["src", "models"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/models/index.ts.ts
function getFile67() {
  const file2 = createResultFile(
    "index",
    "ts",
    `
import storage from "redux-persist/lib/storage";

import { auth } from "./authSlice";
import { counter } from "./counter/counterSlice";
import { __sysInfo } from './_sysInfoSlice';

// global store reducer register
export const storeReducer = {
    auth,
    counter,
    __sysInfo
}

// configure which key we want to persist
export const persistConfig = {
    "auth": {
    key: "auth",
    storage: storage,
    whitelist: ["authState"],
    },
    "counter": {
    key: "counter",
    storage: storage,
    // whitelist: ["value"],
    },
    "__sysInfo": {
    key: "__sysInfo",
    storage: storage,
    whitelist: ["user"],
    },
}           
    `
  );
  return [["src", "models"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/models/authSlice.ts.ts
function getFile68() {
  const file2 = createResultFile(
    "authSlice",
    "ts",
    `
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface IAuthState {
    authState: boolean;
}

const initialState: IAuthState = {
    authState: false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
        state.authState = action.payload;
    },
    },
});

export const { setAuthState } = authSlice.actions;
export const auth = authSlice.reducer;         
    `
  );
  return [["src", "models"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/models/_sysInfoSlice.ts.ts
function getFile69() {
  const file2 = createResultFile(
    "_sysInfoSlice",
    "ts",
    `
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface ISysState {
    userInfo?: userInfo;
}
export interface userInfo {
    loginId?: string;
    userName?: string;
    role?: Array<string>;
    auth?: Array<string>;
    logoutUrl?: string;
}
const initialState: ISysState = {
    userInfo: {},
};

export const __sysInfoSlice = createSlice({
    name: "__sysInfo",
    initialState,
    reducers: {
    __setUserInfoState: (state, action: PayloadAction<userInfo>) => {
        state.userInfo = action.payload;
    },
    },
    selectors: {
    selectUserInfo: (sys) => sys.userInfo,
    },
});
export const { selectUserInfo } = __sysInfoSlice.selectors;
export const { __setUserInfoState } = __sysInfoSlice.actions;
export const __sysInfo = __sysInfoSlice.reducer;         
    `
  );
  return [["src", "models"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/models/counter/counterAPI.ts.ts
function getFile70() {
  const file2 = createResultFile(
    "counterAPI",
    "ts",
    `
// A mock function to mimic making an async request for data
export const fetchCount = async (amount = 1) => {
    const response = await fetch("http://localhost:8000/api/counter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
    });
    const result: { data: number } = await response.json();

    return result;
};
    `
  );
  return [["src", "models", "counter"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/models/counter/counterSlice.ts.ts
function getFile71() {
  const file2 = createResultFile(
    "counterSlice",
    "ts",
    `
import { createAppSlice } from "@/lib/store/createAppSlice";
import type { AppThunk } from "@/lib/_store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchCount } from "./counterAPI";

export interface CounterSliceState {
    value: number;
    status: "idle" | "loading" | "failed";
}

const initialState: CounterSliceState = {
    value: 0,
    status: "idle",
};

// If you are not using async thunks you can use the standalone \`createSlice\`.
export const counterSlice = createAppSlice({
    name: "counter",
    // \`createSlice\` will infer the state type from the \`initialState\` argument
    initialState,
    // The \`reducers\` field lets us define reducers and generate associated actions
    reducers: (create) => ({
    increment: create.reducer((state) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        state.value += 1;
    }),
    decrement: create.reducer((state) => {
        state.value -= 1;
    }),
    // Use the \`PayloadAction\` type to declare the contents of \`action.payload\`
    incrementByAmount: create.reducer(
        (state, action: PayloadAction<number>) => {
        state.value += action.payload;
        },
    ),
    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: \`dispatch(incrementAsync(10))\`. This
    // will call the thunk with the \`dispatch\` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    incrementAsync: create.asyncThunk(
        async (amount: number) => {
        console.log(46);
        const response = await fetchCount(amount);
        // The value we return becomes the \`fulfilled\` action payload
        console.log(48, response);
        return response.data;
        },
        {
        pending: (state) => {
            state.status = "loading";
        },
        fulfilled: (state, action) => {
            state.status = "idle";
            state.value += action.payload;
        },
        rejected: (state) => {
            state.status = "failed";
        },
        },
    ),
    }),
    // You can define your selectors here. These selectors receive the slice
    // state as their first argument.
    selectors: {
    selectCount: (counter) => counter.value,
    selectStatus: (counter) => counter.status,
    },
});

// Action creators are generated for each case reducer function.
export const { decrement, increment, incrementByAmount, incrementAsync } =
    counterSlice.actions;

// Selectors returned by \`slice.selectors\` take the root state as their first argument.
export const { selectCount, selectStatus } = counterSlice.selectors;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const incrementIfOdd =
    (amount: number): AppThunk =>
    (dispatch, getState) => {
    const currentValue = selectCount(getState());

    if (currentValue % 2 === 1 || currentValue % 2 === -1) {
        dispatch(incrementByAmount(amount));
    }
    };


export const counter = counterSlice.reducer;        
    `
  );
  return [["src", "models", "counter"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/lib/routes.tsx.ts
function getFile72() {
  const file2 = createResultFile(
    "routes",
    "tsx",
    `
/**
 * \u8DEF\u7531
 */
import {
    ChromeFilled,
    CrownFilled,
    SmileFilled,
    TabletFilled,
} from '@ant-design/icons';

const routes = [
    {
        path: '/',
        routes: [
            {
                path: '/',
                icon: <SmileFilled />,
                routes: [
                    {
                        path: '/Test/',
                        name: '\u7BA1\u7406\u9875',
                        icon: <CrownFilled />,
                        access: 'monitor', // access \u53EF\u9009\u5C5E\u6027\uFF0C\u4E0D\u914D\u7F6E\u9ED8\u8BA4\u5C55\u793A
                    },
                    {
                        path: '/TableDetail/',
                        name: '\u5217\u8868\u67E5\u8BE2',
                        icon: <ChromeFilled />,
                        access: 'imasa_det',
                    },
                    {
                        path: "/sys/",
                        icon: <TabletFilled />,
                        name: "\u7CFB\u7EDF\u914D\u7F6E",
                        routes: [
                            {
                                path: "/sys/sysRole/",
                                name: "\u89D2\u8272\u914D\u7F6E"
                            }
                        ]
                    },
                ]
            },
        ],
    }
];

export default routes;
    `
  );
  return [["src", "lib"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/lib/interface.ts.ts
function getFile73() {
  const file2 = createResultFile(
    "interface",
    "ts",
    `
// Define the global interface
// exapmle
export interface ApiResult {
    resultCode: "39500000"; // systemId
    resultMsg: "string";
    data?: any;
    total?:number
} 
export interface pageResult {
    data: Array<any>;
    total: number;
} 
    `
  );
  return [["src", "lib"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/lib/getInitialState.ts.ts
function getFile74() {
  const file2 = createResultFile(
    "getInitialState",
    "ts",
    `
/**
 * \u521D\u59CB state \u83B7\u53D6 userInfo/dict/ ...
 */
import { queryUserInfo } from "../services/app/user";
export async function getInitialState() {
    let userInfo = {};
    const getUserInfo = async () => {
        const { data } = await queryUserInfo();
        userInfo = data;
    }
    await getUserInfo();
    return {
        userInfo
    };
}
    `
  );
  return [["src", "lib"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/lib/definitions.ts.ts
function getFile75() {
  const file2 = createResultFile(
    "definitions",
    "ts",
    `
// Define the global types
// exapmle
export type Invoice = {
    id: string;
    customer_id: string;
    amount: number;
    date: string;
    // In TypeScript, this is called a string union type.
    // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
    status: 'pending' | 'paid';
};        
    `
  );
  return [["src", "lib"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/lib/AntdRegistry.tsx.ts
function getFile76() {
  const file2 = createResultFile(
    "AntdRegistry",
    "tsx",
    `
'use client';

import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import type Entity from '@ant-design/cssinjs/es/Cache';
import { useServerInsertedHTML } from 'next/navigation';

const StyledComponentsRegistry = ({ children }: React.PropsWithChildren) => {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);
  useServerInsertedHTML(() => {
    // \u907F\u514D css \u91CD\u590D\u63D2\u5165
    if (isServerInserted.current) {
      return;
    }
    isServerInserted.current = true;
    return <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />;
  });
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default StyledComponentsRegistry;
    `
  );
  return [["src", "lib"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/lib/access.ts.ts
function getFile77() {
  const file2 = createResultFile(
    "access",
    "ts",
    `
import { authFilter } from "@/layout/utils";

export default function accessFactory({ userInfo }: any): any {
    return authFilter([
        "monitor",
        "monitor_renhang",
        "monitor_super",
        "monitor_super_fund",
        "monitor_super_info",
        "monitor_super_mgt",
        "monitor_super_check",
        "imasa_det",
        "async_auth",
        "dashboard",
        "sys",
        "sys_role"
    ], userInfo.auth);
    }        
    `
  );
  return [["src", "lib"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/lib/_store.ts.ts
function getFile78() {
  const file2 = createResultFile(
    "_store",
    "ts",
    `
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { storeReducer, persistConfig } from "@/models/index";

import { persistReducer } from "redux-persist";

const iterate = (reducer:any, config:any) => {
    let iterateReducer:any = {};
    for (let i in reducer) {
    iterateReducer[i] = config[i] ? persistReducer(config[i], reducer[i]) : reducer[i]
    }
    return iterateReducer;
}

const rootReducer = combineReducers(iterate(storeReducer, persistConfig));

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>;        
    `
  );
  return [["src", "lib"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/lib/_defaultProps.tsx.ts
function getFile79() {
  const file2 = createResultFile(
    "_defaultProps",
    "tsx",
    `
export default {
  title:"",
  location: {
    pathname: '/',
  },
  appList: [],
  token:{
    header: {
      colorBgHeader: '#001529',
      colorHeaderTitle: '#fff',
      colorTextMenu: '#dfdfdf',
      colorTextMenuSecondary: '#dfdfdf',
      colorTextMenuSelected: '#fff',
      colorBgMenuItemSelected: '#22272b',
      colorTextMenuActive: 'rgba(255,255,255,0.85)',
      colorTextRightActionsItem: '#dfdfdf',
    },
    colorTextAppListIconHover: '#fff',
    colorTextAppListIcon: '#dfdfdf',
    sider: {
      colorMenuBackground: '#fff',
      colorMenuItemDivider: '#dfdfdf',
      colorBgMenuItemHover: '#f6f6f6',
      colorTextMenu: '#595959',
      colorTextMenuSelected: '#242424',
      colorTextMenuActive: '#242424',
    },
  }
};
    `
  );
  return [["src", "lib"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/lib/store/hooks.ts.ts
function getFile80() {
  const file2 = createResultFile(
    "hooks",
    "ts",
    `
// This file serves as a central hub for re-exporting pre-typed Redux hooks.
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "../_store";

// Use throughout your app instead of plain \`useDispatch\` and \`useSelector\`

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;     
    `
  );
  return [["src", "lib", "store"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/lib/store/StoreProvider.tsx.ts
function getFile81() {
  const file2 = createResultFile(
    "StoreProvider",
    "tsx",
    `
import { Provider } from "react-redux";
import { store } from "../_store";
import { persistStore } from "redux-persist";
persistStore(store);

export const StoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Provider store={store}>{children}</Provider>;
}      
    `
  );
  return [["src", "lib", "store"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/lib/store/createAppSlice.ts.ts
function getFile82() {
  const file2 = createResultFile(
    "createAppSlice",
    "ts",
    `
import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

// \`buildCreateSlice\` allows us to create a slice with async thunks.
export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});      
    `
  );
  return [["src", "lib", "store"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/lib/storage/config.ts.ts
function getFile83() {
  const file2 = createResultFile(
    "config",
    "ts",
    `
interface globalConfig {
  type: 'localStorage' | 'sessionStorage';
  prefix: string;
  expire: number;
  isEncrypt: boolean;
}

export const config: globalConfig = {
  type: 'localStorage',              //\u5B58\u50A8\u7C7B\u578B\uFF0ClocalStorage | sessionStorage
  prefix: 'counter_systemId_0.0.1',     //\u7248\u672C\u53F7
  expire: 24 * 60,                   //\u8FC7\u671F\u65F6\u95F4\uFF0C\u9ED8\u8BA4\u4E3A\u4E00\u5929\uFF0C\u5355\u4F4D\u4E3A\u5206\u949F
  isEncrypt: true,                   //\u652F\u6301\u52A0\u5BC6\u3001\u89E3\u5BC6\u6570\u636E\u5904\u7406
};        
    `
  );
  return [["src", "lib", "storage"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/lib/storage/encrypt.ts.ts
function getFile84() {
  const file2 = createResultFile(
    "encrypt",
    "ts",
    `
import CryptoJS from 'crypto-js';

const SECRET_KEY = CryptoJS.enc.Utf8.parse('3333e6e143439161'); //\u5341\u516D\u4F4D\u5341\u516D\u8FDB\u5236\u6570\u4F5C\u4E3A\u5BC6\u94A5
const SECRET_IV = CryptoJS.enc.Utf8.parse('e3bbe7e3ba84431a'); //\u5341\u516D\u4F4D\u5341\u516D\u8FDB\u5236\u6570\u4F5C\u4E3A\u5BC6\u94A5\u504F\u79FB\u91CF

const encrypt = (data: object | string): string => {
    //\u52A0\u5BC6
    if (typeof data === 'object') {
        try {
            data = JSON.stringify(data);
        } catch (e) {
            throw new Error('encrypt error' + e);
        }
    }
    const dataHex = CryptoJS.enc.Utf8.parse(data);
    const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString();
};

const decrypt = (data: string) => {
    //\u89E3\u5BC6
    const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
    const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
};

export {
    encrypt,
    decrypt
}    
    `
  );
  return [["src", "lib", "storage"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/lib/storage/hooks.ts.ts
function getFile85() {
  const file2 = createResultFile(
    "hooks",
    "ts",
    `
"use client";
import { config } from './config';
import { encrypt, decrypt } from './encrypt';
const setStorage = (key: string, value: any, expire: number = 24 * 60): boolean => {
  //\u8BBE\u5B9A\u503C
  if (value === '' || value === null || value === undefined) {
    //\u7A7A\u503C\u91CD\u7F6E
    value = null;
  }
  if (isNaN(expire) || expire < 0) {
    //\u8FC7\u671F\u65F6\u95F4\u503C\u5408\u7406\u6027\u5224\u65AD
    throw new Error('Expire must be a number');
  }
  const data = {
    value, //\u5B58\u50A8\u503C
    time: Date.now(), //\u5B58\u50A8\u65E5\u671F
    expire: Date.now() + 1000 * 60 * expire, //\u8FC7\u671F\u65F6\u95F4
  };
  //\u662F\u5426\u9700\u8981\u52A0\u5BC6\uFF0C\u5224\u65AD\u88C5\u8F7D\u52A0\u5BC6\u6570\u636E\u6216\u539F\u6570\u636E
  window[config.type].setItem(
    autoAddPreFix(key),
    config.isEncrypt ? encrypt(JSON.stringify(data)) : JSON.stringify(data),
  );
  return true;
};

const getStorageFromKey = (key: string) => {
  //\u83B7\u53D6\u6307\u5B9A\u503C
  if (config.prefix) {
    key = autoAddPreFix(key);
  }
  if (!window[config.type].getItem(key)) {
    //\u4E0D\u5B58\u5728\u5224\u65AD
    return null;
  }
  const storageVal = config.isEncrypt
    ? JSON.parse(decrypt(window[config.type].getItem(key) as string))
    : JSON.parse(window[config.type].getItem(key) as string);
  const now = Date.now();
  if (now >= storageVal.expire) {
    //\u8FC7\u671F\u9500\u6BC1
    removeStorageFromKey(key);
    return null;
    //\u4E0D\u8FC7\u671F\u56DE\u503C
  } else {
    return storageVal.value;
  }
};

const getAllStorage = () => {
  //\u83B7\u53D6\u6240\u6709\u503C
  const storageList: any = {};
  const keys = Object.keys(window[config.type]);
  keys.forEach((key) => {
    const value = getStorageFromKey(key);
    if (value !== null) {
      //\u5982\u679C\u503C\u6CA1\u6709\u8FC7\u671F\uFF0C\u52A0\u5165\u5230\u5217\u8868\u4E2D
      storageList[key] = value;
    }
  });
  return storageList;
};

const getStorageLength = () => {
  //\u83B7\u53D6\u503C\u5217\u8868\u957F\u5EA6
  return window[config.type].length;
};

const removeStorageFromKey = (key: string) => {
  //\u5220\u9664\u503C
  if (config.prefix) {
    key = autoAddPreFix(key);
  }
  window[config.type].removeItem(key);
};

const clearStorage = () => {
  window[config.type].clear();
};

const autoAddPreFix = (key: string) => {
  //\u6DFB\u52A0\u524D\u7F00\uFF0C\u4FDD\u6301\u6D4F\u89C8\u5668Application\u89C6\u56FE\u552F\u4E00\u6027
  const prefix = config.prefix || '';
  return \`\${prefix}_\${key}\`;
};

/** eg: 
setStorage('name', 'fx', 1)
setStorage('age', { now: 18 }, 100000)
setStorage('history', [1, 2, 3], 100000)
console.log('getStorageFromKey:name', getStorageFromKey('name'))
console.log('getStorageFromKey:name', getStorageFromKey('history'))
console.log('getStorageLength', getStorageLength());
console.log('getAllStorage', getAllStorage());
clearStorage();
*/ 

export {
  setStorage,
  getStorageFromKey,
  getAllStorage,
  getStorageLength,
  removeStorageFromKey,
  clearStorage,
};    
    `
  );
  return [["src", "lib", "storage"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/layout/StateLayout.tsx.ts
function getFile86() {
  const file2 = createResultFile(
    "StateLayout",
    "tsx",
    `
"use client";
import React, { useEffect, useState } from "react";
import { __setUserInfoState } from "@/models/_sysInfoSlice";
import { setStorage } from "@/lib/storage/hooks";
import { getInitialState } from "@/lib/getInitialState";
import { StoreProvider } from '@/lib/store/StoreProvider';
import { Spin } from "antd";
let watermark = undefined;
if (typeof document !== "undefined") {
    // watermark = require('@webank/watermark');
}

export default ({ children }: any) => {
    const [state, setState] = useState(null);
    useEffect(() => {
    const init = async () => {
        let initialState = await getInitialState();
        setState(initialState);
        setStorage("userInfo", initialState.userInfo);
        // \u652F\u6301\u914D\u7F6E\u7684\u5C5E\u6027
        if (typeof document !== "undefined") {
        /** watermark.init({
            id: "",  // \u6307\u5B9A\u6C34\u5370\u8BA1\u7B97\u7684dom \u9ED8\u8BA4\u5F53\u524D\u7684\u9875\u9762body
            waterMaskBoxId: "root", // \u6C34\u5370\u5BB9\u5668\u7684id
            frontX: "", // \u6C34\u5370\u5F00\u59CB\u7684\u6A2A\u5750\u6807 \u9ED8\u8BA4\u4EE5body\u6807\u7B7E\u6765\u8BA1\u7B97
            frontY: "", // \u6C34\u5370\u5F00\u59CB\u7684\u7EB5\u5750\u6807 \u9ED8\u8BA4\u4EE5body\u6807\u7B7E\u6765\u8BA1\u7B97
            frontRows: "", // \u6C34\u5370\u7684\u884C\u6570 \u9ED8\u8BA4\u4EE5body\u6807\u7B7E\u6765\u8BA1\u7B97
            frontCols: "", // \u6C34\u5370\u7684\u5217\u6570 \u9ED8\u8BA4\u4EE5body\u6807\u7B7E\u6765\u8BA1\u7B97
            maskTxt: initialState.userInfo.loginId,  // \u6C34\u5370\u7684\u5185\u5BB9
            color: "#000000", // \u5B57\u4F53\u989C\u8272
            width: 150, // \u5BBD\u5EA6
            height: 50, // \u9AD8\u5EA6
            fontSize: "16px", // \u5B57\u4F53\u5927\u5C0F
            frontFont: "\u5FAE\u8F6F\u96C5\u9ED1", // \u5B57\u4F53
            frontBackgroundAlpha: 0, // \u80CC\u666F\u900F\u660E\u6BD4\u4F8B
            frontTxtAlpha: 0.1, // \u6587\u5B57\u900F\u660E\u6BD4\u4F8B
            angle: 15, // \u65CB\u8F6C\u89D2\u5EA6
            frontXSpace: 15, // \u6C34\u5370\u6A2A\u5411\u95F4\u9699
            frontYSpace: 15, // \u6C34\u5370\u7EB5\u5411\u95F4\u9699
            backgroundColor: "#000000", // \u80CC\u666F\u989C\u8272
            resizeable: true, // \u652F\u6301resize\u91CD\u65B0\u8BA1\u7B97\u6C34\u5370
            addTime: true, // \u652F\u6301\u6C34\u5370\u5185\u5BB9\u540E\u9762\u65B0\u589E\u65F6\u95F4
            setIntervalTime: "60000", // \u652F\u6301\u8BBE\u7F6E\u66F4\u65B0\u6C34\u5370\u65F6\u95F4\u7684\u7B49\u5F85\u65F6\u95F4
            dateFormatter: "YYYY-MM-DD hh:mm", // \u652F\u6301\u8BBE\u7F6E\u6C34\u5370\u65F6\u95F4\u7684\u683C\u5F0F
          });*/
        }
    }
    init();
    }, [])
    if (state != null) {
    return <StoreProvider>{React.cloneElement(children, { initialState: state })}</StoreProvider>;
    } else {
    return <Spin fullscreen></Spin>
    }
} 
    `
  );
  return [["src", "layout"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/layout/README.md.ts
function getFile87() {
  const file2 = createResultFile(
    "README",
    "md",
    `
## \u9ED8\u8BA4\u57FA\u7840\u5E03\u5C40         
    `
  );
  return [["src", "layout"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/layout/BasicLayout.tsx.ts
function getFile88() {
  const file2 = createResultFile(
    "BasicLayout",
    "tsx",
    `
"use client";
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ProSettings } from '@ant-design/pro-components';
import { Result, Button, Dropdown } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

import '@/app/globals.css';
import defaultProps from '@/lib/_defaultProps';
import accessFactory from "@/lib/access";
import routes from "@/lib/routes";

import { isMatchPath, matchRouter } from './utils';
import { useAppDispatch } from '@/lib/store/hooks';
import { __setUserInfoState } from '@/models/_sysInfoSlice';
const ProLayout = dynamic(
    () => import("@ant-design/pro-components").then((com) => com.ProLayout),
    { ssr: false }
);

const noMatch = (
    <Result
        status={403}
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
            <Button type="primary">
                <Link href="/">Back to home</Link>
            </Button>
        }
    />
);
const BasicLayout = (props: any) => {
    const {
        children,
        initialState
    } = props;
    useAppDispatch()(__setUserInfoState(initialState.userInfo));
    const pathname = usePathname();
    const [pathnameProp, setPathnameProp] = useState('/');
    const [logoImg, setLogoImg] = useState("/esscweb/menu_logo.svg");
    const [collapsed, setCollapsed] = useState(true);
    const router = useRouter()
    const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
        colorPrimary: '#1890ff',
        fixSiderbar: true,
        layout: 'mix',
        splitMenus: true,
        menu: { locale: true },
    });
    useEffect(() => {
        setPathnameProp(pathname);
    }, [pathname])
    const access = accessFactory(initialState);
    // \u8DEF\u7531\u6743\u9650\u8FC7\u6EE4
    let newRoutes = matchRouter(access, routes);
    const renderContent = useCallback(() => {
        const matchPath = isMatchPath(pathname, newRoutes);
        if (matchPath) {
            return children
        }
        return noMatch
    }, [pathname])
    const handleMenuCollapse = (payload) => {
        setCollapsed(payload);
        payload ? setLogoImg("/esscweb/user-empty.svg") : setLogoImg("/esscweb/menu_logo.svg")
    };
    return (
        <ProLayout
            logo={() => <img src={logoImg} alt="logoImg" />}
            collapsed={collapsed}
            onCollapse={handleMenuCollapse}
            siderWidth={216}
            {...defaultProps}
            route={newRoutes[0]}
            location={{
                pathname: pathnameProp,
            }}
            avatarProps={{
                src: '/web/user-empty.svg',
                title: initialState.userInfo.userName || '\u67DC\u5458',
                size: 'small',
                render: (props, dom) => {
                    return (
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: 'logout',
                                        icon: <LogoutOutlined />,
                                        label: '\u9000\u51FA\u767B\u5F55',
                                    },
                                ],
                                onClick: ({ key }) => {
                                    // message.info(\`Click on item \${key}\`);
                                    if (key === "logout") {
                                        window.location.href = initialState.userInfo.logoutUrl;
                                    }
                                }
                            }}
                        >
                            {dom}
                        </Dropdown>
                    );
                },
            }}
            actionsRender={(props) => {
                if (props.isMobile) return [];
                return [];
            }}
            onMenuHeaderClick={() => {
                setPathnameProp('/');
                router.push('/');
            }}
            menuItemRender={(item, dom) => (
                <div
                    onClick={() => {
                        router.push(item.path || '/');
                    }}>
                    {dom}
                </div>
            )}
            {...settings}
        >
            <PageContainer>
                {renderContent()}
            </PageContainer>
        </ProLayout>
    );
};
export default BasicLayout;
    `
  );
  return [["src", "layout"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/layout/utils.ts.ts
function getFile89() {
  const file2 = createResultFile(
    "utils",
    "ts",
    `
export const matchRouter = (accessProp: any, routesProp: any) => {
    let matchRoute = routesProp;
    let newList = [];
    for (let i = 0; i < matchRoute.length; i++) {
        let currentRoute = matchRoute[i];
        let currentAccess = currentRoute.access || undefined;
        if (typeof currentAccess === "string" && accessProp[currentAccess] || typeof currentAccess === "undefined") {
        let routesTmp = undefined;
        if (currentRoute.routes && currentRoute.routes.length > 0) {
            routesTmp = matchRouter(accessProp, currentRoute.routes)
            if (routesTmp && routesTmp.length > 0) {
            currentRoute.routes = routesTmp;
            newList.push(currentRoute)
            } else {
            delete currentRoute.routes
            }
        } else {
            newList.push(currentRoute)
        }
        }
    }
    return newList
    }
    export const isMatchPath = (path: string, routes: Array<any>): any => {
    let isMatch = '';
    
    for (let i = 0; i < routes.length; i++) {
        const routeItem = routes[i];
        if (path === routeItem.path) {
        isMatch = routeItem
        break
        }
        if (routeItem.routes?.length) {
        isMatch = isMatchPath(path, routeItem.routes)
        if (isMatch) {
            break;
        }
        }
    }
    return isMatch
    }
    export const hasRoleAuth = (roleList:any, auth:string):boolean => {
    return roleList.findIndex((item:string) => item === auth) > -1
    }
    export const authFilter = (list: Array<string>, auth: any) => {
    let tmp = {}
    for (let i of list) {
        tmp[i] = hasRoleAuth(auth, i)
    }
    return tmp;
    }        
    `
  );
  return [["src", "layout"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/compoents/common/AuthComponent.tsx.ts
function getFile90() {
  const file2 = createResultFile(
    "AuthComponent",
    "tsx",
    `
import { Component } from "react";
import PropTypes from 'prop-types';
import { getStorageFromKey } from "@/lib/storage/hooks";
interface AuthComState {
  isShow: boolean;
}
export const AuthComponent = (ComposedComponent:any) => class WrapComponent extends Component<{}, AuthComState> {

  constructor(props:any) {
    super(props);
    this.state = { isShow: false };
  }

  componentDidMount() {
    const authority =  getStorageFromKey('userInfo').auth;
    if (authority && authority.indexOf(this.props["auth"]) > -1) {
      this.setState({ isShow: true });
    }
  }

  static propTypes = {
    auth: PropTypes.string.isRequired,
  };

  render() {
    //\u5982\u679C\u6743\u9650\u6709\u503C\uFF0C\u5E76\u4E14\u5177\u5907\u6743\u9650\uFF0C\u90A3\u4E48\u521B\u5EFA\u6309\u94AE
    if (this.state.isShow) {
      return <ComposedComponent {...this.props} />;
    } else {
      return null;
      // return <ComposedComponent disabled={true} { ...this.props} /> // \u7070\u8D28
      // return <ComposedComponent onClick={() => message.info("\u6743\u9650\u4E0D\u8DB3\uFF0C\u8BF7\u627E\u7BA1\u7406\u5458\u7533\u8BF7")} {...this.props} />  // \u65E0\u6743\u9650\u63D0\u793A
    }
  }
};    
    `
  );
  return [["src", "components", "common"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/app/page.tsx.ts
function getFile91() {
  const file2 = createResultFile(
    "page",
    "tsx",
    `
import React from "react";
const Page = ({children}: React.PropsWithChildren) => {
    return (
        <div>Welcome</div>
    )
}
export default Page;
    `
  );
  return [["src", "app"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/app/not-found.tsx.ts
function getFile92() {
  const file2 = createResultFile(
    "not-found",
    "tsx",
    `
import React from 'react';
import { Button, Result } from 'antd';
import Link from 'next/link';

const App: React.FC = () => (
    <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary"><Link href="/">Back to home</Link></Button>}
    />

);

export default App;
    `
  );
  return [["src", "app"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/app/loading.tsx.ts
function getFile93() {
  const file2 = createResultFile(
    "loading",
    "tsx",
    `
"use client";
import React from 'react';
import { Spin } from 'antd';

const Loading: React.FC = () => (
  <Spin />
);

export default Loading;
    `
  );
  return [["src", "app"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/app/layout.tsx.ts
function getFile94() {
  const file2 = createResultFile(
    "layout",
    "tsx",
    `
import React from 'react';
// import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import BasicLayout from '@/layout/BasicLayout';
import '@/app/globals.css';
import StateLayout from '@/layout/StateLayout';

// const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: '\u67DC\u9762',
	description: '\u67DC\u9762\u63CF\u8FF0',
};
const RootLayout = async (props: React.PropsWithChildren) => {
	const {
		children
	} = props;
	return (
		<html lang="en">
			<body >
				<AntdRegistry>
					<StateLayout id="root">
						<BasicLayout >
							{children}
						</BasicLayout>
					</StateLayout>
				</AntdRegistry>
			</body>
		</html>
	);
};
export default RootLayout;
    `
  );
  return [["src", "app"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/app/globals.css.ts
function getFile95() {
  const file2 = createResultFile(
    "globals",
    "css",
    `
/* @tailwind base;
@tailwind components;
@tailwind utilities; */

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

body {}
  
  `
  );
  return [["src", "app"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/app/error.tsx.ts
function getFile96() {
  const file2 = createResultFile(
    "error",
    "tsx",
    `
"use client";
import React from 'react';
import { Button, Result } from 'antd';

const App: React.FC = () => (
  <Result
    status="error"
    title="Error"
    subTitle="Sorry, something went wrong."
    extra={<Button type="primary">Back Home</Button>}
  />
);

export default App;
  `
  );
  return [["src", "app"], file2];
}

// src/plugins/project/framework/nextjs/template/files/src/app/sys/sysRole/page.tsx.ts
function getFile97() {
  const file2 = createResultFile(
    "page",
    "tsx",
    `
"use client";
import { ProTable } from '@ant-design/pro-components';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { message, Tree } from 'antd';
import { sysRole, resTreeSelect, resConfig } from '@/services/sys';
import Modal from 'antd/lib/modal/Modal';

export default () => {

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalVisit, setModalVisit] = useState(false);
    const actionRef = useRef();
    const formRef = useRef();
    const [treeData, setTreeData] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [currentRow, setCurrentRow] = useState();

    const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
    };

    const columns = [
    {
        title: 'ID',
        search: false,
        dataIndex: 'id',
        valueType: 'text'
    },
    {
        title: '\u89D2\u8272\u7F16\u7801',
        dataIndex: 'roleCode',
        valueType: 'text',
        search: {
        transform: (value: any) => {
            return { roleCode: value.trim() };
        },
        },
    },
    {
        title: '\u89D2\u8272\u540D\u79F0',
        dataIndex: 'roleName',
        valueType: 'text',
        search: {
        transform: (value: any) => {
            return { roleName: value.trim() };
        },
        },
    },
    {
        title: '\u64CD\u4F5C',
        dataIndex: 'option',
        valueType: 'option',
        fixed: 'right',
        align: 'center',
        render: (_: any, record: any) => {
        let buttonList = [];
        //\u4FEE\u6539
        buttonList.push(
            <a key="id" onClick={async () => {
            setCurrentRow(record);
            let data = await resTreeSelect({ roleCode: record.roleCode });
            if (data.treeList) {
                setTreeData(data.treeList);
                setCheckedKeys(data.checkedKeys);
                setModalVisit(true);
            } else {
                message.warn("\u6743\u9650\u6570\u636E\u4E3A\u7A7A");
            }
            }}>\u7ED1\u5B9A\u6743\u9650</a>
        );
        return buttonList;
        }
    }
    ];

    return (
    <>
        <ProTable
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        size="small"
        search={{
            defaultCollapsed: false
        }}
        pagination={{
            pageSize: 10
        }}
        request={sysRole}
        columns={columns}
        form={{
            ignoreRules: false,
            labelWidth: 110,
        }}
        dateFormatter="string"
        />

        <Modal
        open={modalVisit}
        title="\u6743\u9650\u914D\u7F6E"
        okText="\u63D0\u4EA4"
        cancelText="\u5173\u95ED"
        confirmLoading={confirmLoading}
        onCancel={() => { setModalVisit(false) }}
        onOk={async () => {
            if (checkedKeys.length == 0) {
            message.warn("\u8BF7\u5148\u9009\u62E9\u6743\u9650");
            return;
            }
            setConfirmLoading(true);
            let result = await resConfig({ checkedKeys: checkedKeys.toString(), roleCode: currentRow.roleCode });
            if (result) {
            setModalVisit(false);
            }
            setConfirmLoading(false);
        }}
        >
        <Tree
            checkable
            autoExpandParent={true}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={treeData}
        />
        </Modal>
    </>
    );
};
    `
  );
  return [["src", "app", "sys", "sysRole"], file2];
}

// src/plugins/project/framework/nextjs/template/files/public/next.svg.ts
function getFile98() {
  const file2 = createResultFile(
    "next",
    "svg",
    `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
    `
  );
  return [["public"], file2];
}

// src/plugins/project/framework/nextjs/template/files/public/vercel.svg.ts
function getFile99() {
  const file2 = createResultFile(
    "vercel",
    "svg",
    `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 283 64"><path fill="black" d="M141 16c-11 0-19 7-19 18s9 18 20 18c7 0 13-3 16-7l-7-5c-2 3-6 4-9 4-5 0-9-3-10-7h28v-3c0-11-8-18-19-18zm-9 15c1-4 4-7 9-7s8 3 9 7h-18zm117-15c-11 0-19 7-19 18s9 18 20 18c6 0 12-3 16-7l-8-5c-2 3-5 4-8 4-5 0-9-3-11-7h28l1-3c0-11-8-18-19-18zm-10 15c2-4 5-7 10-7s8 3 9 7h-19zm-39 3c0 6 4 10 10 10 4 0 7-2 9-5l8 5c-3 5-9 8-17 8-11 0-19-7-19-18s8-18 19-18c8 0 14 3 17 8l-8 5c-2-3-5-5-9-5-6 0-10 4-10 10zm83-29v46h-9V5h9zM37 0l37 64H0L37 0zm92 5-27 48L74 5h10l18 30 17-30h10zm59 12v10l-3-1c-6 0-10 4-10 10v15h-9V17h9v9c0-5 6-9 13-9z"/></svg>
    `
  );
  return [["public"], file2];
}

// src/plugins/project/framework/nextjs/template/files/public/user-empty.svg.ts
function getFile100() {
  const file2 = createResultFile(
    "user-empty",
    "svg",
    `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="200px" height="200px" viewBox="0 0 500 500" enable-background="new 0 0 500 500" xml:space="preserve">  <image id="image0" width="500" height="500" x="0" y="0"
    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAA+
5UlEQVR42u3deXxU5d3+8c+ZmawkEJawb7KLAgUEEXeruKKg1t1qXWqx9XGvtsWnj92ePvbXWltb
3NqqtS6ttYtarXXfBVdAQEFWASFAgJA9mfP740wkIEuWmfme5Xq/XvMKJCHnOiGZa84597lvx3Vd
REREJNhi1gFERESk/VToIiIiIaBCFxERCQEVuoiISAio0EVEREJAhS4iIhICKnQREZEQUKGLiIiE
gApdREQkBFToIiIiIaBCFxERCQEVuoiISAio0EVEREJAhS4iIhICKnQREZEQUKGLiIiEgApdREQk
BFToIiIiIaBCFxERCQEVuoiISAio0EVEREJAhS4iIhICKnQREZEQUKGLiIiEgApdREQkBFToIiIi
IaBCFxERCQEVuoiISAio0EVEREJAhS4iIhICKnQREZEQUKGLiIiEgApdREQkBFToIiIiIaBCFxER
CQEVuoiISAio0EVEREJAhS4iIhICKnQREZEQUKGLiIiEQMI6QNSNnjDBOoKISNbNnTPHOkLo6Ahd
REQkBFToIiIiIaBCFxERCQEVuoiISAio0EVEREJAhS4iIhICKnQREZEQUKGLiIiEgApdREQkBFTo
IiIiIaBCFxERCQEVuoiISAio0EVEREJAhS4iIhICKnQREZEQUKGLiIiEgApdREQkBFToIiIiIaBC
FxERCQEVuoiISAgkrAOISCglgGKgI1CYenRu9vEOQG6zvyeBLc3+Xg5UpR5bgQqgwXqnRPxMhS4i
LeUAvYEBQC+gT+rvvYFuqUcp0BWvzNNtM7Ae2JB6rAM+BZYDq4CVqbd11t8oEQsqdBFpzsEr7GHA
iNRjH2BQ6v15htlKUo9he/icJF7BfwQsAD4GFgJz2fEMgEjoqNBFoqsQGAV8CRibejsq9f6giuG9
+BgEHN/s/S7wCfAO8G7q7Ry80/kioaBCF4mGBF5pHwxMxCvvYUDcOliWOMCQ1OPM1PsagQ+Al4GX
gNeAMuugIm2lQhcJpyLgcOAgvBKfgDcQTbaLA+NSj6vwjuLnA08BTwKvo4F4EiAqdJFwSAAHAken
HpPQ73drOXiXHEYB38a75v4MXrn/E2/kvYhv6RdeJLg6AscB0/CuF5dYBwqZTsBXUo9avHJ/BK/c
K6zDiexMhS4SLAXAKcC5wBR2vJdbMicPmJp6VOMdtd8LPI13LV7EnApdxP8c4FDga8DpeNfHxU4B
3v/D6Xj3vf8+9VhpHUyiTVO/ivhXJ+BKvPuoXwIuRGXuN/2A7wNLgSeAE/BegIlknQpdxH9GAXfg
zYL2S2C4dSDZqzhwIt6p+A+AC9DlEMkyFbqIPzh4R3cv4s1qdhk6Gg+qUXjX15cB1+ENXhTJOBW6
iK0EcA7wPt7R3eHWgSRtegM/w5uK9kaCPQOfBIAKXcRGLt5R+EfAn4DR1oEkYzoD/wssAb6FTsVL
hqjQRbIrBpyPN9DtDrw5xyUaegG/xnsR91X0/Ctpph8okexw8O4fnwvcj4o8ygYC9wFv4M3oJ5IW
KnSRzBuHNy/434H9rMOIb0zE+7m4D28deZF2UaGLZE534Hd4y3TqSEx2xcE7/b4IuBTdwy7toEIX
Sb8EcA3etdKL0O+Z7F0X4C7g33iT1Yi0mp5oRNJrHDAb+DlaLEVa7xi8JVwvtg4iwaNCF0mPQrx7
jt8CxlqHkUDrCNyDN5VsL+swEhwqdJH2OxyYhzcrmBY8knQ5Ee/n6kTrIBIMKnSRtsvHO7X+PLoN
TTKjK/A48FO8+eJFdkuFLtI2++FdK78G/R5JZjnADcB/gJ7WYcS/9EQk0npfB97GW4RDJFuOBN5D
8/3LbqjQRVquEPgDcCfe6XaRbOsJPAvMsA4i/qNCF2mZEXgj2C+0DiKRlwB+C9yOBmFKMyp0kb07
Ee96+f7WQUSa+SbwD6DIOoj4gwpdZM+ux3vSLLYOIrILJ+DdZdHDOojYU6GL7FoecC9wC7pdSPxt
At4iL1r4J+JU6CJfVAI8DVxgHUSkhQYBrwFftg4idlToIjvqA7wEHGEdRKSVOgFPAqdYBxEbKnSR
7UbgHeWMtg4i0kZ5wKPAGdZBJPtU6CKescDLwADrICLtlAAeBE6zDiLZpUIX8QYVPQeUWgcRSZM4
Xqkfbx1EskeFLlF3MN4c2Z2tg4ikWS7e6fcDrYNIdqjQJcoOBP6FN5hIJIwK8VZrG2IdRDJPhS5R
NRb4N9DROohIhpUCf0MvXENPhS5RtD9emesJTqJif+ABvKVYJaRU6BI1fYGn0AA4iZ6TgJusQ0jm
qNAlSrrhXTPvax1ExMh/A8dah5DMUKFLVBQCTwCjrIOIGIoDfwIGWgeR9FOhSxQ4wB/Q7TsiAF3x
rqdr0aGQUaFLFHwfTYUp0tzBwA3WISS9VOgSdmfhXTcUkR19H+/2TQkJFbqE2Rjgd+hWHZFdyQX+
CORbB5H0UKFLWHUC/oo3GE5Edm0/4H+tQ0h6qNAljBy8I4/B1kFEAuAKYKJ1CGm/hHUAkQy4Dphq
HcIPunbpwoABA+jVowfdu3ene2kp3bp1o7ioiI7FxRQXFxOPx+lQWEg8vn3Qc119PTU1NQBUVFSw
cdMm1qxdy9Jly/h48WIWLFpEVVWV9e5JesSBu/BWHay3DiNtp0KXsJkI/Mg6RLYVFBQwfOhQRgwf
zr4jRjB0yBAG9u9PUVFRRraXTCZZumwZb82Zw5uzZ/P2O+9QqYIPsjHANcD/WQeRtnNc17XOEGmj
J0ywjhAmHYH3gEHWQTKtsLCQCePHM37sWMZ96UvsN3LkDkfY2VZfX89bc+bwzLPP8sJLL7Fl61br
b5G03jZgBLA6GxubO2eO9f6GjgrdmAo9re4BLrYOkSm9e/XiqCOO4JDJkxk/bhx5ubnWkXapoaGB
V157jb/985+8/OqrJJNJ60jScg8C52ZjQyr09FOhG1Ohp80U4GlCdota1y5dmHriiUw5+mj2HznS
Ok6rrVm7lof//Gf+/NhjuuYeDC5wKPBapjekQk8/FboxFXpaFAPzgf7WQdIhFosx6cADOX3aNI44
7DASieAPdSkvL+feBx7gkUcfVbH73+vAIXjlnjEq9PRToRtToafF3cAl1iHaq0uXLpw+fTqnnnIK
vXv1so6TEeXl5fzuvvt46M9/pr5eA6p97HS8eRwyRoWefip0Yyr0dgv8qfZ+fftywXnnccrUqb69
Lp5uS5ct4yc/+xmz9aTuV0uAfYGGTG1AhZ5+KnRjKvR2KQI+JKCn2vv07s1ll1zC1BNOMB2hbsV1
Xf7xxBP87NZbqaiosI4jX3QJ3tTJGaFCTz/NFCdB9j0CWObFxcVcf/XV/PPRR5k2dWokyxzAcRym
TZ3KXx96iHFjtUaID83Em+9dAkKFLkE1BLjaOkRrxGIxzjjtNJ587DHOP+cccnJyrCP5Qs8ePfj9
HXdw4XnnWUeRHQ0ELrIOIS2nU+7GdMq9zf4GTLMO0VLjxo7lxmuvZcTw4dZRfO3pZ57hpptvprau
zjqKeFbgvXhO+7V0nXJPv+DfDyNRNIWAlHl+fj5XfetbnPWVrxCL6YTY3hw3ZQqlpaVced11bNVs
c34wADgbb7Ej8Tk9w0jQ5AC3WYdoibFf+hKPPvgg55x5psq8FcaPHcvv77iDzp07W0cRz7cJ8F0k
UaJnGQmaS/Dmm/atRCLBNf/1X/zhzjvp36+fdZxAGjZ0KHf/5jcqdX/YHzjJOoTsnQpdgqQAb2S7
b/Xu1Yt777qLC88/X0fl7TRs6FBu/8UvyM/Pt44i3prp4nN6xpEguRzoYx1idyZNnMjDf/wjo0eN
so4SGqP2359bfvxjvTiydzQQvMUEIka/JRIUxcAN1iF259yzzuKOX/+akk6drKOEzhGHHcZV3/qW
dYyoc4CrrEPInqnQJSiuAkqtQ+wsFotxw7XXcsO11+ooMoMuOO88jj7qKOsYUXcOoFesPqZnIAmC
IuC/rEPsLD8/n1tvuYVzzzrLOkroOY7DzTNn0qN7d+soUdYBr9TFp1ToEgSXAt2sQzTXobCQ3952
G0cefrh1lMgoLi7m5pkzcRzdQWUo8KsahpkKXfwugc+u3RUXF3Pn7bdzwLhx1lEiZ/JBBzFt6lTr
GFE2DhhvHUJ2TYUufncqPlqApaioiDtvv10j2Q1dfcUVdOzY0TpGlGl+d59SoYvf+WYBlvz8fG7/
xS/Yf6Tu3rFUUlLCNy7RmV9DZ+DN2Cg+o0IXPxsHTLIOAd5o9lt+/GMt8+kTXzntNLqX+u6mh6jo
BhxvHUK+SIUufnaZdYAm1199NUccdph1DEnJy83logsusI4RZRrt7kMqdPGrDnirPJk7ffp03Zrm
Q6dNn6653u1MxZvsSXxEhS5+NQ0fPGGMHzuW71x/vXUM2YW83FxOmzbNOkZUFQInWIeQHWk9dPGr
860DlHTqxC0//jE5OTbjf2rr6vhg7lzmzp/PsuXLKS8vp6GhgdzcXLp168bAAQMYN2YM+40cSTwe
t/52mfjKqafyh/vvp7Gx0TpKFE0HHrEOIdup0MWPuuEtBmHq29deS6nBwKuPFi/mgQcf5D/PP09V
VdVeP79Lly6ccOyxnHvWWfTp3dviW2WmV8+eTJ40iVdee806ShSdAOQBtdZBxKNT7uJHUwHTQ86D
DjyQk47P7kDedevXc+2NN3LGuefyjyeeaFGZA2zatIkHHnqIk049lR//3/9RUVFh8S0zM/UEnfk1
UgxMsQ4h2zmu61pniLTREyZYR8ikXGAY0AvoCfQAegNd8K7BxYGmGUI6AY3ANmA40M8qdF5eHo89
/DD9+vbN2jafefZZ/udHP2JbZWW7v1ZpaSk/i9AtdlVVVRx+zDHU1tVZR4mie/CmZm61uXPmWGcP
HZ1yl3QpBg7Fu298JDAKGEQAf8ZmXHppVst81l13Mevuu9P29crKyrh4xgxunjmTk086KWv7YaWw
sJAJBxzAq6+/bh0lio6zDiDbBe7JVnzlAOB04Ci8SWACPzJr+NChXHDeeVnb3q9+8xvuuffetH/d
xsZGbvrBD4gnEpx4XPifcydPmqRCt9EX78X7POsgokKX1usHfAM4ExhsHSbdbrjuuqyNGP/7449n
pMybuK7LzP/5H7qXljJhfLjX0zjowAOtI0TZcajQfUGD4qSlDsC7RWUp8F1CWOZHH3lk1lZQW7Fy
JT+55ZaMb6exsZEbZ85k85YtWdkvK4MHDaJb167WMaJK08D6hApd9qY/8BdgNt6iDKE8qxOPx7nq
iiuytr0f/vSn1NTUZGVbZRs2cPsdd2Rt36yM0Qp4ViYDBdYhRIUuu+fgzaW+AO86uWMdKJOmn3wy
/ftlZ2D962++yewsj/B99LHHWLlqVVa3mW37jhhhHSGq8vDJIkpRp0KXXSkCHgPuwJtTPdRyc3O5
LIvLcf7+/vuzvo/JZJL7//SnrG83m4YPG2YdIcqOsA4gKnT5ot7AK3hzqUfCKSedRI/u3bOyrTVr
1zLn7bdN9vOpZ56hLsT3ag8cMMA6QpQdbh1AVOiyo1LgGeBL1kGyJR6P87WvfjVr23v51Vexmsyp
oqKCt995x2Tb2dCnd29iMT2lGTkQyLcOEXX66ZcmOcBfgf2sg2TT0UceSd8+fbK2vXfefdd0f995
/33T7WdSIpGgV8+e1jGiKh8I972RAaBClyYz8WZ6i5Tzzzknq9v7ZNky0/1dvGSJ6fYzrUePHtYR
okyTARhToQvAUOA71iGybcTw4YzO8q1Oq9esMd3nzz77zHT7mVbUIfRjOP1sonWAqFOhC8ANeKfc
I+X0adOyur1kMkl1dbXpPlds22a6/UzLz9dlXEM6QjemQheAU60DZFtubi7HH3usdYysc5xQTydA
Xm6udYQoG4g3sFaMqNClE9DZOkS2HTp5MsXFxVndZiwWo7Cw0HS/w35KOi8vzzpC1IV6PWi/U6FL
x/Z/ieA5zujovHevXqb73bt3b9PtZ1qV8SUNYbR1gChTocsGIGkdIptyc3M5ZPJkk20PGTTIdN+H
DA7dmjo7qKystI4QdSp0Qyp0qQYWWofIpgPGj6eD0anvbK3mtjvjx4413X6mZWvBG9mtMdYBoiyU
K2dJq/2dCE0oc9BEu7trDj3kEJxbbjGZLa5Tx44qdMm0YUDerLqy2r194mtjBgJw8AfLrTOHho7Q
BeBOYK+/gGFxoGGh9+rZk0lG2z9uyhRyQz4KfMPGjdYRoi4B7GsdIqpU6AKwCrjNOkQ2FBYWMmzI
ENMM2Zw7vkk8Huer555rut+ZlkwmWbd+vXUMUaGbUaFLk+8D86xDZNr+I0eaL+AxaeJEJk/K7vLR
p02fTr++fU33O9PWl5XR0NBgHUO8mSfFgApdmtTgTTBTZh0kk/yyZvZ3rr+egoKCrGyrR/fuXHn5
5da7nHFLjefJl8+p0I2o0KW5JcBxQLl1kEwZbHzbWJMB/fsz88YbM76dnJwc/u9HP8r6JDoWli1f
bh1BPOG+N9LHVOiys3eBw4DV1kEyYWD//tYRPjf1hBP4xiWXZOzrO47DD/77vxkX8pHtTT5csMA6
gniGWweIKhW67Mp8vCkc37AOkm69jGdq29nll13GFTNmpH2O9UQiwf/+4AeceNxx1ruYNfNV6H7R
ZUZuaRfrEFGkQpfdWYt3pP6/QKN1mHTp1rWrdYQvuPSii7j1llvo2DE9s/D26tmTe++6ixMiVObl
5eWsWLnSOoZsN9A6QBSp0GVPGmbVlX0XOBjvqD3QCgsLycnx5yqxRx1xBH975BFOPO64No/Cz8nJ
4dyzzuKvDz+c9XXerb01Z47JZD2yWwOsA0SRCl32alZd2VvAWOA6YLN1nrby+6Qqpd268b8//CF/
feghTp8+nU4tPGIvLS3logsu4Mm//Y0brr029Cuq7cobb71lHUF2pEI34OhVra3RE/y92uCsuh3v
YpuRW9oZ+C7wTSA7912lSa+ePfn3449bx2ix+vp6Ppg3j/kLFrB8xQq2btnCtspKiouL6dy5M4P3
2YcvjR7N8GHDzO+tt5RMJvny8cezcdMm6yiy3c9n1ZVd15JP1NSv6aO53KVVZtWVlQPXz8gt/RVw
LXAJEL1DwizIycnhgHHjzBd08bt3339fZe4/4V6n16ei+7Je2mVWXdmqWXVlV+ENfvkBIZ+QRvzr
mWeftY4gX+Sv20kiQoUu7TKrrmzDrLqy7wP9gPOBN60z7U5lVZV1BEmz2tpanvr3v61jCOAAfd0G
jm6s5lsNW8YTsEtyYaBT7pIWqeUSHwAemJFbOgr4GnAu0N06W5OtW7fS2NhIPB63jiJp8uwLL7Bl
61brGJHVw21kqFvPiGQdw5P1FJFs+lAx3lTSf7LOGCUqdEm7WXVl84BrZuSW3gBMAU4DpgGdrbOt
LyujV8+e1jEkTR597DHrCJHS3W1kiFvP8GQ9w906OrnJPX36V1ChZ5UKXTJmVl1ZPfAk8OSM3NLL
gC/jlft0wGSGlzVr16rQQ2LRRx/xznvvWccILQfo4zYwNFnPYLeeoW49Hfdc4Dtw4VgH8vEWfpIs
UKFLVqTK/Wng6Rm5pd8AJgJH4y0GM5Es/Swu+eQTxkdkbvOw++NDD1lHCJUELgPcBoYk6xni1jM4
WU8Bbb+tOVXmk4HnrfctKlToknWz6soa8eaJfwP44Yzc0k4HJWtuisG185xctjqZG6s5/8MPOfP0
062/BdJOn61bx7+efto6RqCVuEkGufXs49YzKNlAf7eBRDsKfDeOQoWeNSp0MTerriyvDudrubi4
wGonwcJYLgudHD6J5VBH+hYu+WDePOvdlTS474EHaGwMzRIDGZfApb/bwKBkg1fgbj0lrTh93g4H
Wu97lKjQxVoceDgXtwtsv/Wlb2MDxwD1OHwSy+EjJ4fFsRxWODk0tGNjK1auZNOmTXTposWggmrz
5s389e9/t47hW3Ggl9vAALeB/skGBrj19HUbMLq3Q7MiZZEKXaz9BDhydx/MwWVEso4R1EGjV/BL
YwmWODksc3JYGsuhuhVH8K7r8uLLL3PqtGnW+y1tdP+f/kRNjcZZgTeRSC/XO10+IFXefdxGctJ/
6rytugCDgKXWQaJAhS6WjgGub80/yMH1bpmhHgAXWOskWOokWBrLYbmTYJ2TYE8nE59/6SUVekBt
2rSJh/78Z+sYJgpwvbNXyQb6ug30cRvo7a/y3p2RqNCzQoUuVkqA30H7LpA7QG+3gd5uA4ckvaO2
WhxWOglWxBKscHJY4STY4MQ/f9p77Y032LBxoy/XRpc9u/sPfwj9jH8xvPu9m36u+7kN9HEb6eoG
dszAEOsAUaFCFyu34U0Xm3Z5uAx16xnaWA9UA17Jr3YSrHISfJpM8PQ9d3LOVdcSy8uz/j5IC322
bh1/CdFEMk3F3St1pN0z9ba72xC2J2YVepaE7OdGAmI68NVsbjAPl0Gp0b0kgQfv4s2Hf0d+v/4U
Dh5GweChdBgynIJ9hlA4aAhOTo7190h2csfdd1NXV2cdo9WKSNLDbaSH20j31KOn20hp+Ip7dwZb
B4iKiPw8iY+UAL+xDgHgJhupXrGM6hXL4PntC3w48QT5fftROHgo+f0GUjBgH/IH7EPBgH3ILe1h
HTuSlq9YwT+eeMI6xm51dJN0o5FubpJuzYq7h9tAof+vcWdaRs7EyRep0CXbforPl1Z0Gxu2F/1O
4oUdyO8/kIL++5Dfrz95vfuS36cfeb37kterD7HcXOv4ofTbO+80u+/cwSvsEpKUuI10+by8txd4
rkp7T0qtA0SFCl2yaQJwqXWI9misqqRy0YdULvrwix90HHK7dfcKvk9fr+R79iavR0/yevYmt3tP
Ep1KrHchcBYuWsS/M7TmeQKXklRZd3aTdHKTdKbRe1/qz53cpNaZbp+ueEMGsjKTTZSp0CVbYsBv
U2/DyXWpK1tHXdk6eP/tXX8T8gvI7d6D3K6l3ttu3cnpVkpul24kOncmp6QLOV26ktOlG/EOHaz3
yBd+duutuG7Lj4BjQJGbpIgkRa5LR5Kf/73YdelMo1feJCnOzmxpURfHK/Uy6yBhp0KXbPkacIB1
CGvJmmpqVi6nZuXyvX5uLDeXROeu5JR0JrdbKYmSziSKiomnHomOnUgUd/T+XFRMvLj487/HCwqt
d7VdGiq2kqyq5JXnn6PsndmMcJPk45KPSwfXpZAkhbgUukk64FKYel8H16UDyTROFixpokLPAhW6
ZEMx8CPrEEGTrKujbt1a6tatpfKj1v/7eFExTjxOorgjTjxOvEMRTk4O8YJCYnn5xPLyiBUWEkt4
I/oTHTt94WvE8vJwcvd+a19j5TZIbj/adRsaaKyq3PFzqipxGxpwGxtprNxGsr6OZHU1yZoaknW1
3vvq6ryvlZIP3Gj9HyHpoNNNWaBCl2y4HtAi5FnWuK0CgIYtm62jiBRYB4iC8F7PFL/oBVxjHUJE
TBmtDRMtKnTJtP9Gp9tEoq7IOkAUqNAlk/YBLrIOISISBSp0yaSZgGZaEZFi6wBRoEKXTBlCludr
FxHfqrAOEAUqdMmU76O7KEREskaFLpkwBDjLOoSISJSo0CUTrkdH5yKyXWX7v4TsjQpd0q03cKF1
CBHxlW3t/xKyNyp0Sbdr0ch2EdmRBsVlgQpd0qkE+Lp1CBHxHR2hZ4EKXdLpEjQjlIh80RbrAFGg
Qpd0SQBXWIcQEd+pRUfoWaFCl3Q5FehvHUJEfEfroGeJCl3S5WrrACLiS+usA0SFCl3S4UBgknUI
EfGljdYBokKFLulwuXUAEfGtNdYBokKFLu3VDTjDOoSI+NYq6wBRoUKX9roYyLcOISK+tdI6QFSo
0KU9HDSRjIjsmQo9S1To0h5HAIOsQ4iIr+mUe5ao0KU9LrYOICK+lgSWWYeIChW6tFUJ3mQyIiK7
swqosQ4RFSp0aauzgQLrECLiax9bB4gSFbq0lU63i8jeLLYOECUqdGmLMcB46xAi4ns6Qs8iFbq0
hY7ORaQlPrIOECUqdGmtBHCmdQgRCYR51gGiRIUurXU00N06hIj43gZgtXWIKFGhS2udYx1ARAJh
rnWAqFGhS2sUAtOsQ4hIIOh0e5ap0KU1pgLF1iFEJBBU6FmmQpfW0Ol2EWmpd6wDRI0KXVqqE3Cs
dQgRCYQqYL51iKhRoUtLTQXyrEOISCC8BzRYh4gaFbq01HTrACISGHOsA0SRCl1aojAJJ1qHEJHA
UKEbUKHLXm0jdkpMp9tFpOVmWweIIhW67NV6J/4d6wwiEgwNUA4ssc4RRQnrAOJvM3JLR3VzG4d/
OVnN5MYacnGtI4mIj9UQm1NE0jpGJOkIXfYkB7h3gxPPfSRexPdyu/CveCGVONa5RMSnHHjOOkNU
6Qhd9uR7wLimv2wjxuPxDvwnXsghjTUclayis6tX4iKyXQeS/7HOEFUqdNmdccB3d/WBGhyejRfw
YryAcckajmisYR+33jqviBirxWnMw9WiLEZU6LIrOcC9qbe71QDMjuUzO5ZPf7eBwxurmZCsJUfX
2UUi6ZNYzqcjk3WN1jmiSoUuu3IDMKo1/2Clk+CPiWL+ShGTG2s4LFlNqavfa5Ew2+TE+djJYVEs
h0VOLluc2MOz6sqsY0WWCl12NgKY2dZ/XJU6Hf9cvIARyTomJWsYm6zTUbtICGxw4ix2cvg4lsNi
J4eNTnznT1lmnTHKVOjSXAy4mzRMIuMCC2O5LIzl8jAu45O1TGysYYhbrzHyIgGxzomzxMlhcSyH
xU4um5y93hilQjekQpfmLgMOSfcXrcbh1Vg+r8byKXUbmZSsYVKyli46JS/iGw3ASieHpbEEnzg5
fOLkULH3At/ZYuv9iDIVujTpDvwk0xspc+I8Hu/AE/EODHTrGZusY1yylq4qd5Gs2uzEWObksNTJ
YXkswQonQTvPn9UBK633K8pU6NLk/wEl2dqYCyxzclgWz+GxeAcGuA2MS9YyLllLN5W7SFrV4rDK
SbAslsMyJ8EyJ4fNrT/63psls+rK9MtrSIUuAIcB51kGWOEkWBFP8Ld4B/q7DUyIu5zUvxc1ixeB
qwF1Ii1Vj8OnToKVqaPulU6CtU4iG5Oxav52Yyp0SQC/Bf+MVVvpJDj76msZf9ZZ1G0oo/zVFyh/
5QU2v/kqjdsqrOOJ+EYdDqudBKuaFfhaJ4HRYfJC6+9H1KnQ5XJgP+sQze23776cfcYZAOR2K6XH
tDPoMe0M3Pp6tr43h/LXXmLzm69S+fFCSGrqWYmGbcRYFfPK+9NUia934n5aBkUD4oyp0KOtG3Cz
dYjm4vE43//e94jFvnh9z8nJodPEyXSaOBmAhs3lbHl3Nltmv86W2W9QtXSxTs9L4DXgsNaJs9aJ
s9pJfH4EvjX917zT7WPrAFGnQo+2H5DFgXAtcf7ZZzNi+PAWfW6ipDNdjzqWrkcdC0D9xg1seftN
trz9JlvfneMVvI7gxaeSeHd9rHYSrHESnxd4mb+OulvjI+sAUee4OqIxNXrCBKtNjwLeA+Lt/ULp
0rtXL/72yCMUFBSk5es1bqtg6wfvUvHBu1TMe49t896noWKr9W5KxNTisM6Jpx4J1jlxPks9Gvwz
dKW9ymbVlXVvyz88+IPl1tlDQ0fo0fVzfFTmADNvvDFtZQ4QLyqm88GH0/ngw713uC7Vy5eybcFc
KhctYNvC+VQu+lAlL+3mAuVObIfCXkec9U6iJbOrhcEC6wCiQo+qKcAx1iGaO27KFA6ZPDmzG3Ec
CvYZTME+gyk9cfrn765ZvYrKjxawbcE8KhctoOqTj6ldu1rX42UH9ThsdGKUOXHKnDgbSL114mxw
YmE62m6LD60DiAo9imLALdYhmissLOS6q64y235+n37k9+n3+bV4gMbqKqqXLqbqkyVUL1tC1dIl
VC1dTM2nK3VdPqQacCh3YmwmxkYnTnmqvDekynuzE9MSQ7s33zqAqNCj6HxgjHWI5i792tfoXlpq
HWMH8YJCivYbQ9F+O36rkrW11Hy6gppVK6hZtXLHP69ZhdvQYB1ddsEFtjoxyolRnirrjXhvy504
5cTYqsJuD51y9wEVerTk4bPb1Pr368f555xjHaPFYnl5FA4eRuHgYV/4mNvYQO1na6lbt5bataup
XfdZ6s9rqP1sDXXrPqN+8ybrXQiVOhwqnBhbiVHhOGwlxhbHK+fNxKlwHDYTZ6sTs5psJSp0yt0H
VOjRcikwwDpEc9++5hpyc3OtY6SFE098fvp+d5K1NdRv2khd2Xrqyzc2+/Mm6jeWUb+xjIatW1KP
rTRWVVrvVtZU4VDlxKjCodpxqCJGJQ7bnBiVxNjmOGwjRmXq7VYnRm20r1v7xfpZdWUbrEOICj1K
CoHvWodo7rBDDuGwQ9K+WquvxfLyyevVh7xefVr0+W5Dg1fuWzZ7byu8km/cVkGypprqLVv456N/
obJ8E7muSz4ucSAvdfI4300Sgx3eB5DAJbeVg/5qHIdkqkBrcT4/4q3FodFxqMMbOFaNQ53j0IBD
Jd7bOsd7fz3e51U7MRpS/7bSiVGtYg6yD6wDiEeFHh3fBHpZh2iSk5PDt6+5xjqG7zmJBDldupLT
pesXPua6Lldccw0vb62DeJF1VImu960DiCcSN0gKRcC3rUM0d8Zpp9G/X7/2f6EIu+Oee3j51Vet
Y4joCN0nVOjRcCnevO2+UFRUxGUXX2wdI9Beff117rznHusYIuDNOCk+oEIPv1zgOusQzV18wQWU
lJRYxwisT1ev5sabbiKp++HFXjWaw903VOjh9zWgt3WIJj179OC8s8+2jhFYtXV1XPPtb7N1q6ar
FV+YN6uuTHcE+oQKPdwSwPXWIZr75je+QV5ennWMwLr1V79i0cdapVJ8433rALKdCj3czgAGW4do
MmTwYKaecIJ1jMB69fXXeejPf7aOIdKcrp/7iAo9vBzgO9YhmvvmN75BLKYfubbYuGkTN918M1ru
WHzmXesAsp2eXcPrZGB/6xBN9h0xgqMOP9w6RiC5rsv3f/hDNm7StLHiK3XolLuvqNDD60brAM19
87LLcBzNBtYWD//lL7rfXPzo/Vl1ZXXWIWQ7FXo4TUo9fGH0qFGRm+I1XVZ9+im/vP126xgiuzLb
OoDsSIUeTldbB2ju8q9/3TpCIDWdaq+urraOIrIrKnSfUaGHT3/gVOsQTUaPGsXkSb45WRAojzz6
KG+/qzFH4lsqdJ9RoYfP1/HRojuXfu1r1hECad369dymU+3iX5sBTYjgMyr0cMkFLrEO0WTokCG6
dt5GP7nlFiqrqqxjiOzOnFl1ZbqH0mdU6OFyGtDDOkSTSy68UCPb2+DFl1/mhZdeso4hsic63e5D
KvRwudw6QJP+/fox5eijrWMETk1NDT/9f//POobI3rxuHUC+SIUeHiMB35zfvvD884nH49YxAud3
993HmrVrrWOI7EkSFbovqdDDwzfXzktKSjRnexusXrOGe++/3zqGyN7Mn1VXttk6hHyRCj0ccoHz
rUM0OeO007SiWhvc+utfU1unibfE916xDiC7pkIPh2lAN+sQADk5OZx5+unWMQJn7rx5/Oe556xj
iLSE5iH2KRV6OFxoHaDJcVOmUNrNF68tAsN1XX5+221aSU2CQkfoPqVCD75ewDHWIZqce+aZ1hEC
5/mXXuK9Dz6wjiHSEstm1ZWttg4hu6ZCD75z8cnMcPvvtx8j993XOkagJJNJfnPHHdYxRFpKp9t9
TIUefOdYB2iia+et99Qzz7Dkk0+sY4i0lArdx1TowTYMGGsdAqBTx44cd4xvzvwHQmNjI7Puuss6
hkhrvGAdQHZPhR5svrlgfcrUqbpVrZX+9fTTrFy1yjqGSEutmlVXttg6hOyeCj3YzrAO0OTUU06x
jhAoyWSSe+691zqGSGs8ax1A9swXg6mkTfYF9rcOATBm1CgG7bOPdYxAee6FF1i2fLl1DJHWeH5G
bmnavtjcOXOs9yd0dIQeXL453T795JOtIwTO3X/4g3UEkdbSzEc+p0IPLl8UekFBAcdOmWIdI1Be
f+MNFn30kXUMkdb4ENCqQT6nQg+mEamHuSMPP5wOhYXWMQLl/oceso4g0lrPWweQvVOhB9OJ1gGa
HK+j81b5ZNky3njzTesYIq2lAXEBoEIPpmnWAQA6duzI5EmTrGMEygMPPqg52yVoGoGXrEPI3qnQ
g6cLcJB1CICjjzySnJwc6xiBsW3bNp565hnrGCKtNRvYYh1C9k6FHjzHAXHrEADHama4Vnniqaeo
qqqyjiHSWk9ZB5CWUaEHz0nWAQC6dunCgRMmWMcIlEcefdQ6gkhbPGkdQFpGhR4sceB46xAAx3z5
y8Ri+vFpqXffe49Pli61jiHSWmuA96xDSMvoGTlYDgBKrEOAV+jScn9//HHrCCJt8S9AozgDQoUe
LEdZBwBvZbXxY32xyFsg1NTU8J/nNMmWBJJOtweICj1YfHFYfNihh+p0eys8+8ILVGownARPLbr/
PFD0rBwc+cBk6xAAhx9yiHWEQHniX/+yjiDSFi8B26xDSMup0IPjYKDAOkQsFuPAiROtYwTGho0b
eXP2bOsYIm3xtHUAaR0VenAcYR0AvKVSO3XsaB0jMJ574QWSyaR1DJG20P3nAaNCDw5fnG4fP26c
dYRA0WA4CahFqYcEiAo9GBKAL85zH6DR7S22YeNG3n73XesYIm3xV+sA0noq9GAYAxRZh4jFYowZ
M8Y6RmA8/+KLOt0uQaVCDyAVejD44nT7yBEjtPZ5K7z86qvWEUTaYhmaHS6QVOjB4IvV1caMHm0d
ITBqa2t5a84c6xgibaGj84BSoQfDeOsAAEOHDLGOEBhvzZlDbW2tdQyRtnjMOoC0jQrd/4oBXzTp
4EGDrCMExsuvvWYdQaQtVgNvWoeQtlGh+99YfPD/5DgOQwYPto4RGK+q0CWYHkOLsQSWeVHIXvni
xu+ePXpoQFwLfbp6NWvWrrWOIdIWOt0eYCp0//PFfWK6ft5yszUYToJpPfCKdQhpOxW6/+1nHQCg
X9++1hECY/Y771hHEGmLp4BG6xDSdip0f3OAfa1DgAq9Neao0CWYtPZ5wKnQ/W0APpghDqBP797W
EQJh5apVlJWVWccQaa164BnrENI+KnR/G24doEmPHj2sIwTC3PnzrSOItMWrwBbrENI+KnR/G2gd
oEnP7t2tIwTC3HnzrCOItIVOt4eACt3fBloHAIjH45SUlFjHCIR5OkKXYFKhh4AK3d8GWgcAKOnU
yTpCINTW1fHxkiXWMURaazla+zwUVOj+to91AIBOKvQWWbx4MfX19dYxRFpLg+FCQoXubwOtAwA6
3d5COjqXgHrOOoCkhwrdvxygm3UIgM46Qm+Rjxcvto4g0lpJ4FnrEJIeKnT/6grErUMA5OXnW0cI
BBW6BNA7wCbrEJIeKnT/8sXROUCBCr1FFuuUuwTPf6wDSPqo0P3LNzd+xxMJ6wi+t2HjRrZs3Wod
Q6S1dLo9RFTo/uWbI/TcnBzrCL63cuVK6wgirVULvGkdQtJHhe5fXa0DNMnLy7OO4HurVq+2jiDS
WnOAausQkj4qdP/yTaHL3q1ctco6gkhrvWQdQNJLhe5fhdYBmlRWVlpH8L1Vn35qHUGktV62DiDp
pUL3L99cuE66rnUE3/tUhS7B0gC8Zh1C0kuF7l8F1gGa1NbUWEfwvXVaA12C5W1Ap95CRoXuX7nW
AZrU1tZaR/C1ZDLJxo0brWOItIZOt4eQCt2/ktYBmuj+6j3bVF5OMumb/y6RllChh5AK3b8qrAM0
2bxli3UEX1u/fr11BJHWcIHXrUNI+qnQZa+2qND3qGzDBusIIq3xMVBuHULST4XuX74ZibapXL/7
e1K+ebN1BJHWmG0dQDJDhe5fvjksrqmp0XX0Paio8M3VEZGWeMs6gGSGCt2/NlsHaG61pjbdrW3b
tllHEGkNHaGHlArdvzZbB2hu9Zo11hF8q0KFLsFRA3xgHUIyQ4XuX74aabV67VrrCL6lU+4SIO8D
ddYhJDNU6P7lq0Pi5cuXW0fwLZ1ylwDR9fMQU6H7l68uWn/08cfWEXyrrr7eOoJIS6nQQ0yF7l+1
gG8mCF+ydKlmQ9uNbVqNToJjjnUAyRwVur8tsw7QpLa2lhUrV1rHEJG2qwA+sQ4hmaNC97fF1gGa
m79ggXUEX6quqrKOINIS8/GmfZWQUqH7m68uXL/73nvWEXypUZciJBjmWQeQzFKh+9tH1gGae+8D
3b4qEmAq9JBTofubrxp02fLllGted5Ggmm8dQDJLhe5viwHfXKB1XZc33tJdLzsrKCiwjiDSEh9a
B5DMUqH7WyM+O0328muvWUfwnXg8bh1BZG8+w0e3wUpmqND9703rAM299vrruh9dJHh8dWAgmaFC
9z9fFfqWrVt5X4PjdpCfl2cdQWRvVOgRoEL3vzesA+zs388+ax3BV/Lz860jiOyNrp9HgArd/1ak
Hr7x72efpbGx0TqGb2hQnATAQusAknkq9GB4zjpAc5s2beLN2bOtY/hGUVGRdQSRvfHVrJOSGSr0
YPDdOe4n/vUv6wi+UaBT7uJvW4EN1iEk81TowfAc4Kuh5c889xybN2+2juELHYuLrSOI7MlS6wCS
HSr0YFiPz5Y9rK+v569//7t1DF/o3LmzdQSRPdEKaxGhQg+Of1oH2NlfHntM96QDJZ06WUcQ2RMV
ekSo0IPjH9YBdrZm7Vqeec5X4/VMdOzY0TqCyJ58ah1AskOFHhwf4sNbT373hz/gutFeYrlr167W
EUT2ZLV1AMkOFXqwPGIdYGcfLV7MKxGf3717t27WEUT2REfoEaFCD5aHrQPsyh133x3po/Ti4mJN
LiN+piP0iFChB8tHgO/WL52/YAH/ifi19O6lpdYRRHalEVhnHUKyQ4UePPdbB9iVX/32tzQ0NFjH
MNOje3frCCK7shGI7i9mxKjQg+dhoNo6xM5WrlrFI48+ah3DTJ/eva0jiOxKuXUAyR4VevBsAv5s
HWJXfnvXXWzYuNE6hol+fftaRxDZFRV6hKjQg2mWdYBdqaio4Be33WYdw4SO0MWnovkKO6JU6MH0
FvCedYhdefLpp3lrjq9mqc2Kvn36WEcQ2ZVN1gEke1TowfVL6wC74rou3//hD6msqrKOklUD+ve3
jiCyK9usA0j2qNCD62F8OmHEmrVr+X+33modI6s6duxIN80YJ/4TrVfWEadCD6464OfWIXbnsX/8
g5deecU6RlYN2mcf6wgiO6u3DiDZo0IPtjvx6aQRruty080389k6X8bLCBW6+JAKPUJU6MFWDfzM
OsTubN6yhRtmzqSxsdE6SlYMGTTIOoLIznTKPUJU6ME3C1hvHWJ33nv/fX4ekVvZhg4ZYh1BRCJM
hR58Vfj4WjrAAw89xD+eeMI6RsYNHzaMWEy/UiJiQ88+4XA7sMY6xJ784Cc/Ye68edYxMqqwsFAz
xonf5FsHkOxRoYdDFTDTOsSe1NfXc8W117Jy1SrrKBm174gR1hFEmsuzDiDZo0IPj/vw6exxTcrL
y7n8yitDPd/7yH33tY4g0lyhdQDJHhV6eCSB661D7M3KVau47FvfYsvWrdZRMmLUfvtZRxBpTuv6
RogKPVyeAx63DrE3i5csYcYVV7BtW/hmpdxv332Jx+PWMUSadLMOINmjQg+fqwjAvafzFyzg8iuv
ZFtlpXWUtMrPz2f4sGHWMUSaDLQOINmjQg+fpcAPrUO0xPtz53LpjBmhO/0+dswY6wgiTfqj5/nI
0H90OP0cCMQ9Yh8uXMhFl10WqoFyY0aNso4g0iQX6G0dQrJDhR5O9cA3ANc6SEssXrKEr158MStW
rrSOkhaTJk7UBDPiJxqpGRF61gmv14FfW4doqU9Xr+b8iy7i/blzraO0W0lJCQeMG2cdQ6TJeOsA
kh0q9HD7LvCJdYiW2rxlC5fOmMGTTz9tHaXdpnz5y9YRRJro1WVEqNDDrRI4HwjMcme1dXV856ab
+OXtt5NMJq3jtNmUo48mkUhYxxABGGsdQLJDhR5+bwA/sQ7RWr+/7z4uv/JKysvLraO0SUlJCZMn
TbKOIQIwCNAiAxGgQo+Gm4FXrUO01utvvslZX/1qYBd1mTZ1qnUEkSbHWAeQzFOhR0MjcDYQuHvD
1n72GRd+/ev8/r77AncK/vBDD6VLly7WMUQATrIOIJmnQo+OT4ELCMitbM01NDTwy9tv5+vf/CZr
1q61jtNiOTk5TD3hBOsYIgDHA0XWISSzVOjR8iQBmUVuV2a//Tann302j/3jH7huMF6XfOXUU3VP
uvhBAd5ZOgkxPdNEz814xR5I2yor+Z8f/YjLr7wyEEfr/fv146gjjrCOIQLeOg+OdQjJHBV69CSB
c4GPrIO0x2tvvMH0M8/kvgceoLHR33flXXjeedYRRABGAsdah5DMUaFH0xa8QTJl1kHao7q6mp/f
dhtnnn8+c955xzrObo0eNUoLtohf3GAdQDJHhR5dS4CpBGCp1b35ePFiLpkxgxtmzvTtafgZX/+6
dQQRgCOAA6xDSGao0KPtLbyBMv4+Z90Cruvy1L//zdTTTuNnt97K5s2brSPtYNLEiYwfqwm7xBd+
ah1AMkOFLv8ELsa7th549fX1/PHBBznx1FO5+/e/p6amxjrS5y6/7DLrCCIAXwZ0P2UIqdClM5AD
+PNcdRtVVFTw61mzOHH6dP744INUV1dbR2LC+PEccdhh1jFEAG4B4tYhJL2coNzPG1ajJ0yw2GwB
cCLeaPfjgTzr70OmlZSUcN5ZZ3H2GWdQXFxslmPlqlWcdtZZ1NbVWX9LRC4F7rHa+Nw5c6z3P3R0
hB4tE4E78Y7G/wJMIwJlDrB582Zuv+MOjp06ldt+8xvWrV9vkqN/v35cetFF1t8OEYAfAIXWISR9
dIRuLAtH6F3wllC9GBhlvb9+kUgk+PIRR3D2GWcwLsuD1RoaGjjvootYsHCh9bdB5HJglsWGdYSe
fip0Yxks9DHAfwHnAPnW++ln+44YwRmnncbxU6ZQWJidA5Zly5dz5vnn+2rQnkTSEmA4BoNiVejp
p0I3luZCjwEn403xeLj1vgVNYWEhxxx1FNNOPplxX/oSjpPZWTKffuYZvv2971nvtsgxwLPZ3qgK
Pf1U6MbSVOhx4Ezgu8B+1vsUBv379ePUU05h6gknUFpamrHtfPu73+Xp//zHencl2u4DLsz2RlXo
6adCN9bOQneAs/AWXBlqvS9hFIvFOHDCBE487jiOOvJIijp0SOvX37xlCyeffrrvJsKRSNkEdCfL
E0yp0NNPhW6sHYV+BPAzNI1j1uTl5XHEoYdy7DHHcMjkyeTnp2dowr0PPMAvbrvNevck2kYB87O5
QRV6+qnQjbWh0LsBP8cbua6lEI3k5+czedIkjjz8cA4+6CC6de3a5q+1fMUKTj79dOtdkmj7KvDH
bG5QhZ5+CesA0irT8e4jz9xFXWmRmpoann/xRZ5/8UUcx2H4sGEcdsghTBg/ntH7709BQUGLv5Zu
XxMfKLIOIO2nI3RjLTxCjwH/B1xnnVf2LpFIsP/IkYwZPZqRI0YwfNgwBg4YQCz2xXmcFn38MVdc
fbXZRDciKWcDD2dzgzpCTz8doftfHHgI+Ip1EGmZhoYG3p87l/fnzv38ffn5+ewzcCB9evWipKSE
hoYGlixdyoKFC0kmQ7EujgTbu9YBpP1U6P73O1TmgVdTU8PCRYtYuGiRdRSRnX0IfGwdQtpPc7n7
21eAC6xDiEio/dI6gKSHCt3fbrIOICKhNg9vYhkJARW6fxWjxVREJHO24g2Gq7cOIumhQvevakCL
ZotIJtTglfmH1kEkfVTo/tUAPGodQkRCZyswFfiXdRBJLxW6v10LLLcOISKh8T7edNFZX11NMk+F
7m+fAYcAr1gHEZFAqwN+CBwELLYOI5mhQve/1XgLsVwCbLYOIyKB8zQwFvhvvGvnElIq9GBI4k0w
MxT4FVBlHUhEfO9t4BjgeGCBdRjJPBV6sGwArgT2AWYCK60DiYjvvAgcC0xA18ojRYUeTOuBH+MV
++HALKDMOpSImKkCfo9X4kcCz1gHkuzTXO7BlgReTj3+CzgMOA7vNNsYtF66SNi9B9wL3I/G2ESe
Cj08GoDnUw+AnsAU4GC8kfL7ooIXCYNPgAfxVmFcaB1G/EOFHl6f4b1qvz/19y54t6wcBIxPPUqt
Q4rIXrl4y5v+M/V43zqQ+JMKPTo2AU+mHk36AuPwyn1/YDQwCI2tELG2EXgBeA54HO/2VZE9UqFH
26epxz+bva8A7/T8yNTbYcCQ1NtC68AiIVUBvI53yew5vGvjSetQEiwqdNlZNd7pvXd38bG+ePfC
DwEGAgOave2NjuxFWupj4I3U401gPtBoHUqCTYUurdF0RP/CLj6WA/QD+rNj0Q9Iva8/kGu9AyIG
luFd934n9Xgbb04JkbRSoUu61ANLU49dcYDuQA+gT+rPfVJ/75V6NH1Mp/YliFbjjTpfiDcz24fA
B3irm4lknApdssUF1qUec/fyuUVsL/veeOXfDW9Ufo/Un5s/dDueZMsWvNvGml68foRX3ItSHxMx
o0IXP9qG90T5UQs+1wG64t2Wt6u3nYGS3Tw6WO+o+M5mvCPtlam3y9he3p/gjT4X8SUVugSdi3c9
si3XJHPYXu47F39noCPe2YIioDj1/qJmj5LU+/V75H9b8OZmKEs91uKdLWoq7k+BVXgvJkUCSU9E
EmX1bH+Cb498vILvCHTCO/LPx3tRkIc3JqBj6s/FzT7eCe82wXy8Fwe5qa+Tm/qcpreyXR1QvpfH
Jrz/06ZLPGVArXVwkUxToYu0X03qkamRy00vCvLxXgAUNPtzPjsWfwneZYjC1L+L472YgB3PJuz8
YqHpBQQ7fR1S/6a42ceattukY2o74B3h1qe+H9WpP2/Du6e66RrzltTft6U+pwJv4Fgl3iIjm5v9
uSL1+VWpt5UZ+h6LBJ4KXcT/atERpojsheO6rnUGERERaSfN7CUiIhICKnQREZEQUKGLiIiEgApd
REQkBFToIiIiIaBCFxERCQEVuoiISAio0EVEREJAhS4iIhICKnQREZEQUKGLiIiEgApdREQkBFTo
IiIiIaBCFxERCQEVuoiISAio0EVEREJAhS4iIhICKnQREZEQUKGLiIiEgApdREQkBFToIiIiIaBC
FxERCQEVuoiISAio0EVEREJAhS4iIhICKnQREZEQUKGLiIiEgApdREQkBFToIiIiIaBCFxERCQEV
uoiISAio0EVEREJAhS4iIhICKnQREZEQUKGLiIiEgApdREQkBFToIiIiIaBCFxERCQEVuoiISAio
0EVEREJAhS4iIhICKnQREZEQUKGLiIiEgApdREQkBFToIiIiIaBCFxERCQEVuoiISAio0EVEREJA
hS4iIhICKnQREZEQUKGLiIiEgApdREQkBFToIiIiIaBCFxERCQEVuoiISAio0EVEREJAhS4iIhIC
KnQREZEQUKGLiIiEgApdREQkBFToIiIiIfD/Aaqsn8mT0yy2AAAAJXRFWHRkYXRlOmNyZWF0ZQAy
MDIwLTEyLTI0VDAxOjU0OjU1KzAwOjAworBzewAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0xMi0y
NFQwMTo1NDo1NSswMDowMNPty8cAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8
AAAAAElFTkSuQmCC" />
</svg>    
    `
  );
  return [["public"], file2];
}

// src/plugins/project/framework/nextjs/template/files/public/menu_logo.svg.ts
function getFile101() {
  const file2 = createResultFile(
    "menu_logo",
    "svg",
    `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="600px" height="60px" viewBox="0 0 600 60" enable-background="new 0 0 600 60" xml:space="preserve">  <image id="image0" width="600" height="60" x="0" y="0"
    xlink:href="data:image/png;base64,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
0jYx2fdEFjzXJnEu1EaGUFGp+S0AKBUdUaz/10A1cNkUerUN0gAgpbxOKfMGY/imLNM33jxx5GbP
kxS27gC5N92MbM+IKNu6dWu4cCEd3rZt22NWrTqr38ehy7sKAEZHk8+deOLQB2BVj1faeueC6J98
ztogyfQHdWa+NzRUcSlrXEqWeTM1sess8/ahXwB46Ph4/QIlkzLevL0CA0ClIi+bnEy/LUP5kFCK
AcAwRL43NO+qAIwxpp8J11kcnc2xqYTytaOj8X/29QUPI0knAqjpjLdPmPSPJ/T331E0Wv78aEUj
7dWhiegnAH6yfzRev6g/vFgbXj28ZUswfMEFatOmTXNGo6F0SWyMGSbi5QBSOF7EGEZu/3dwZNeu
2H+nRzAAkDF+KLTpJ8IYANnuqGNtDJM4rA3fmNSy3y5e3LfL0aUXuv4/lzCXU7Ldyh8AAAAldEVY
dGRhdGU6Y3JlYXRlADIwMjQtMDUtMjdUMTU6NTA6NDMrMDA6MDADp/q6AAAAJXRFWHRkYXRlOm1v
ZGlmeQAyMDI0LTA1LTI3VDE1OjUwOjQzKzAwOjAwcvpCBgAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAA
MjAyNC0wNS0yN1QxNTo1MDo0MyswMDowMCXvY9kAAAATdEVYdGRjOmZvcm1hdABpbWFnZS9wbmf/
uRs+AAAAFXRFWHRwaG90b3Nob3A6Q29sb3JNb2RlADNWArNAAAAAJnRFWHRwaG90b3Nob3A6SUND
UHJvZmlsZQBzUkdCIElFQzYxOTY2LTIuMRwvbAsAAAAQdEVYdHhtcDpDb2xvclNwYWNlADEFDsjR
AAAAKHRFWHR4bXA6Q3JlYXRlRGF0ZQAyMDE3LTExLTEzVDE0OjMzOjE3KzA4OjAwKagvaAAAADN0
RVh0eG1wOkNyZWF0b3JUb29sAEFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChNYWNpbnRvc2gpmllT
CQAAACp0RVh0eG1wOk1ldGFkYXRhRGF0ZQAyMDE3LTExLTEzVDE0OjM2OjUxKzA4OjAwoEGwawAA
ACh0RVh0eG1wOk1vZGlmeURhdGUAMjAxNy0xMS0xM1QxNDozNjo1MSswODowMJzl49UAAAAYdEVY
dHhtcDpQaXhlbFhEaW1lbnNpb24ANzA4MlcxtKwAAAAXdEVYdHhtcDpQaXhlbFlEaW1lbnNpb24A
NzA1tdVkqwAAAD10RVh0eG1wTU06RG9jdW1lbnRJRAB4bXAuZGlkOmY5ZDQwNDg0LWZjNzQtNGE5
MC04NWQ2LThmODMzNmNlYmIyY5me0OoAAAA9dEVYdHhtcE1NOkluc3RhbmNlSUQAeG1wLmlpZDpm
OWQ0MDQ4NC1mYzc0LTRhOTAtODVkNi04ZjgzMzZjZWJiMmPvuUfgAAAARXRFWHR4bXBNTTpPcmln
aW5hbERvY3VtZW50SUQAeG1wLmRpZDpmOWQ0MDQ4NC1mYzc0LTRhOTAtODVkNi04ZjgzMzZjZWJi
MmOVQ74ZAAAAAElFTkSuQmCC" />
</svg>
    `
  );
  return [["public"], file2];
}

// src/plugins/project/framework/nextjs/template/static-files.ts
function generateStaticFiles4(root = createResultDir(".")) {
  runFileGenerator(root, getFile43);
  runFileGenerator(root, getFile44);
  runFileGenerator(root, getFile45);
  runFileGenerator(root, getFile46);
  runFileGenerator(root, getFile48);
  runFileGenerator(root, getFile47);
  runFileGenerator(root, getFile49);
  runFileGenerator(root, getFile50);
  runFileGenerator(root, getFile51);
  runFileGenerator(root, getFile52);
  runFileGenerator(root, getFile53);
  runFileGenerator(root, getFile54);
  runFileGenerator(root, getFile55);
  runFileGenerator(root, getFile56);
  runFileGenerator(root, getFile57);
  runFileGenerator(root, getFile58);
  runFileGenerator(root, getFile59);
  runFileGenerator(root, getFile60);
  runFileGenerator(root, getFile61);
  runFileGenerator(root, getFile62);
  runFileGenerator(root, getFile63);
  runFileGenerator(root, getFile64);
  runFileGenerator(root, getFile65);
  runFileGenerator(root, getFile66);
  runFileGenerator(root, getFile67);
  runFileGenerator(root, getFile68);
  runFileGenerator(root, getFile69);
  runFileGenerator(root, getFile70);
  runFileGenerator(root, getFile71);
  runFileGenerator(root, getFile72);
  runFileGenerator(root, getFile73);
  runFileGenerator(root, getFile74);
  runFileGenerator(root, getFile75);
  runFileGenerator(root, getFile76);
  runFileGenerator(root, getFile77);
  runFileGenerator(root, getFile78);
  runFileGenerator(root, getFile79);
  runFileGenerator(root, getFile80);
  runFileGenerator(root, getFile81);
  runFileGenerator(root, getFile82);
  runFileGenerator(root, getFile85);
  runFileGenerator(root, getFile84);
  runFileGenerator(root, getFile83);
  runFileGenerator(root, getFile86);
  runFileGenerator(root, getFile87);
  runFileGenerator(root, getFile88);
  runFileGenerator(root, getFile89);
  runFileGenerator(root, getFile90);
  runFileGenerator(root, getFile91);
  runFileGenerator(root, getFile92);
  runFileGenerator(root, getFile93);
  runFileGenerator(root, getFile94);
  runFileGenerator(root, getFile95);
  runFileGenerator(root, getFile96);
  runFileGenerator(root, getFile97);
  runFileGenerator(root, getFile98);
  runFileGenerator(root, getFile99);
  runFileGenerator(root, getFile100);
  runFileGenerator(root, getFile101);
  return root;
}

// src/plugins/project/framework/nextjs/template/index.ts
var nextjsTemplate = {
  slots: {
    components: {
      path: ["src", "components"]
    },
    pages: {
      path: ["src", "app"],
      fileName: "page"
    },
    router: {
      path: ["src", "lib"],
      fileName: "routes"
    },
    entry: {
      path: ["src"],
      fileName: "app"
    },
    constants: {
      path: ["src"],
      fileName: "constants"
    },
    utils: {
      path: ["src"],
      fileName: "utils"
    },
    i18n: {
      path: ["src"],
      fileName: "i18n"
    },
    globalStyle: {
      path: ["src"],
      fileName: "global"
    },
    htmlEntry: {
      path: ["public"],
      fileName: "index"
    },
    packageJSON: {
      path: [],
      fileName: "package"
    }
  },
  generateTemplate() {
    return generateStaticFiles4();
  }
};
var template_default4 = nextjsTemplate;

// src/plugins/project/framework/nextjs/plugins/packageJSON.ts
var pluginFactory43 = (cfg) => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    const ir = next.ir;
    const packageJson = {
      name: (cfg == null ? void 0 : cfg.packageName) || "counter-demo",
      version: (cfg == null ? void 0 : cfg.packageVersion) || "0.0.1",
      description: "\u8F7B\u91CF\u7EA7\u6A21\u677F\uFF0C\u4F7F\u7528 TypeScript\uFF0C\u4EC5\u5305\u542B\u57FA\u7840\u7684 Layout\u3002",
      dependencies: {
        "@ant-design/cssinjs": "^1.18.2",
        "@ant-design/icons": "^5.2.6",
        "@ant-design/nextjs-registry": "^1.0.0",
        "@ant-design/pro-components": "^2.6.43",
        "@emotion/css": "^11.11.2",
        "@reduxjs/toolkit": "^2.2.1",
        "@webank/watermark": "^1.0.9",
        "antd": "^5.12.7",
        "axios": "^1.6.5",
        "moment": "^2.30.1",
        "next-auth": "^4.24.5",
        "react": "^18",
        "react-dom": "^18",
        "react-redux": "^9.1.0",
        "redux-persist": "^6.0.0",
        "sass": "^1.77.2",
        ...buildDataSourceDependencies(ir, cfg == null ? void 0 : cfg.datasourceConfig)
      },
      devDependencies: {
        "@types/crypto-js": "^4.2.2",
        "@types/node": "^20",
        "@types/react": "^18",
        "@types/react-dom": "^18",
        "autoprefixer": "^10.0.1",
        "crypto-js": "^4.2.0",
        "eslint": "^8",
        "eslint-config-next": "14.0.4",
        "express": "^4.18.2",
        "http-proxy-middleware": "^2.0.6",
        "next": "^14.1.0",
        "next-env": "^1.0.0",
        "postcss": "^8",
        "tailwindcss": "^3.3.0",
        "typescript": "^5"
      },
      scripts: {
        "dev": "next dev -p 8000",
        "build": "next build",
        "start": "next start",
        "lint": "next lint",
        "dev:proxy": "node proxy.js"
      },
      private: true
    };
    ir.packages.forEach((packageInfo) => {
      packageJson.dependencies[packageInfo.package] = packageInfo.version;
    });
    next.chunks.push({
      type: "json" /* JSON */,
      fileType: "json" /* JSON */,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: packageJson,
      linkAfter: []
    });
    return next;
  };
  return plugin;
};
var packageJSON_default4 = pluginFactory43;

// src/plugins/project/framework/nextjs/index.ts
var nextjs_default = {
  template: template_default4,
  plugins: {
    packageJSON: packageJSON_default4
  }
};

// src/solutions/nextjs.ts
function createNextJsProjectBuilder(options) {
  return createProjectBuilder({
    inStrictMode: options == null ? void 0 : options.inStrictMode,
    extraContextData: { ...options },
    template: nextjs_default.template,
    plugins: {
      components: [
        reactCommonDeps_default(),
        esmodule_default({
          fileType: "tsx"
        }),
        styleImport_default(),
        containerClass_default(),
        containerInjectContext_default(),
        containerInjectUtils_default(),
        containerInjectDataSourceEngine_default(),
        containerInjectI18n_default(),
        containerInjectConstants_default(),
        containerInitState_default(),
        containerLifeCycle_default(),
        containerMethod_default(),
        jsx_default({
          nodeTypeMapping: {
            Div: "div",
            Component: "div",
            Page: "div",
            Block: "div"
          }
        }),
        css_default()
      ],
      pages: [
        reactCommonDeps_default(),
        esmodule_default({
          fileType: "tsx"
        }),
        styleImport_default(),
        containerClass_default(),
        containerInjectContext_default(),
        containerInjectUtils_default(),
        containerInjectDataSourceEngine_default(),
        containerInjectI18n_default(),
        containerInjectConstants_default(),
        containerInitState_default(),
        containerLifeCycle_default(),
        containerMethod_default(),
        jsx_default({
          nodeTypeMapping: {
            Div: "div",
            Component: "div",
            Page: "div",
            Block: "div",
            Box: "div"
          }
        }),
        css_default()
      ],
      constants: [constants_default()],
      utils: [esmodule_default(), utils_default("react")],
      i18n: [i18n_default()],
      packageJSON: [nextjs_default.plugins.packageJSON()]
    },
    postProcessors: [prettier_default()],
    customizeBuilderOptions: options == null ? void 0 : options.customizeBuilderOptions
  });
}
var plugins4 = {
  containerClass: containerClass_default,
  containerInitState: containerInitState_default,
  containerInjectContext: containerInjectContext_default,
  containerInjectUtils: containerInjectUtils_default,
  containerInjectI18n: containerInjectI18n_default,
  containerInjectDataSourceEngine: containerInjectDataSourceEngine_default,
  containerLifeCycle: containerLifeCycle_default,
  containerMethod: containerMethod_default,
  jsx: jsx_default,
  commonDeps: reactCommonDeps_default
};

// src/plugins/common/requireUtils.ts
var pluginFactory44 = () => {
  const plugin = async (pre) => {
    const next = {
      ...pre
    };
    next.chunks.push({
      type: "string" /* STRING */,
      fileType: "jsx" /* JSX */,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      content: "import * from 'react';",
      linkAfter: []
    });
    return next;
  };
  return plugin;
};
var requireUtils_default = pluginFactory44;

// src/utils/index.ts
var utils_exports = {};
__export(utils_exports, {
  common: () => common_exports,
  compositeType: () => compositeType_exports,
  dataSource: () => dataSource_exports,
  expressionParser: () => expressionParser_exports,
  jsExpression: () => jsExpression_exports,
  jsSlot: () => jsSlot_exports,
  nodeToJSX: () => nodeToJSX_exports,
  pathHelper: () => pathHelper_exports,
  resultHelper: () => resultHelper_exports,
  schema: () => schema_exports,
  scope: () => Scope_exports,
  templateHelper: () => templateHelper_exports,
  validate: () => validate_exports,
  version: () => version_exports
});

// src/index.ts
var src_default = {
  createProjectBuilder,
  createModuleBuilder,
  solutions: {
    icejs: createIceJsProjectBuilder,
    icejs3: createIceJsProjectBuilder2,
    rax: createRaxProjectBuilder,
    nextjs: createNextJsProjectBuilder
  },
  solutionParts: {
    icejs: icejs_default,
    icejs3: icejs3_default,
    rax: rax_default,
    nextjs: nextjs_default
  },
  publishers: {
    disk: createDiskPublisher,
    zip: createZipPublisher
  },
  plugins: {
    common: {
      esmodule: esmodule_default,
      esModule: esmodule_default,
      requireUtils: requireUtils_default,
      styleImport: styleImport_default
    },
    style: {
      css: css_default
    },
    project: {
      constants: constants_default,
      i18n: i18n_default,
      utils: utils_default
    },
    icejs: {
      ...plugins
    },
    icejs3: {
      ...plugins2
    },
    rax: {
      ...plugins3
    },
    nextjs: {
      ...plugins4
    },
    react: {
      ...plugins
    }
  },
  postprocessor: {
    prettier: prettier_default
  },
  utils: utils_exports,
  chunkNames: {
    COMMON_CHUNK_NAME,
    CLASS_DEFINE_CHUNK_NAME,
    REACT_CHUNK_NAME
  },
  defaultLinkAfter: {
    COMMON_DEFAULT_LINK_AFTER: DEFAULT_LINK_AFTER
  },
  constants: const_exports
};

// src/cli/run.ts
async function run(args, options) {
  try {
    const schemaFile = options.input || args[0];
    if (!schemaFile) {
      throw new Error(
        "a schema file must be specified by `--input <schema.json>` or by the first positional argument"
      );
    }
    if (options.input && args.length > 0 || args.length > 1) {
      throw new Error(
        "only one schema file can be specified, either by `--input <schema.json>` or by the first positional argument"
      );
    }
    let solutionOptions = {};
    if (options.solutionOptions) {
      try {
        solutionOptions = JSON.parse(options.solutionOptions);
      } catch (err) {
        throw new Error(
          `solution options parse error, error message is "${err.message}"`
        );
      }
    }
    const schema = await loadSchemaFile(schemaFile);
    const createProjectBuilder2 = await getProjectBuilderFactory(options.solution, {
      quiet: options.quiet
    });
    const builder = createProjectBuilder2(solutionOptions);
    const generatedSourceCodes = await builder.generateProject(schema);
    const publisher = src_default.publishers.disk();
    await publisher.publish({
      project: generatedSourceCodes,
      outputPath: options.output || "generated",
      projectSlug: "example",
      createProjectFolder: false
    });
    return 0;
  } catch (e) {
    console.log(import_chalk.default.red(getErrorMessage(e) || `Unexpected error: ${e}`));
    if (typeof e === "object" && (e == null ? void 0 : e.stack) && options.verbose) {
      console.log(import_chalk.default.gray(e.stack));
    }
    return 1;
  }
}
async function getProjectBuilderFactory(solution, { quiet }) {
  if (solution in src_default.solutions) {
    return src_default.solutions[solution];
  }
  const solutionPackageName = isLocalSolution(solution) ? solution : `${solution.startsWith("@") ? solution : `@alilc/lowcode-solution-${solution}`}`;
  if (!isLocalSolution(solution)) {
    if (!quiet) {
      console.log(`"${solution}" is not internal, installing it as ${solutionPackageName}...`);
    }
    (0, import_child_process.spawnSync)("npm", ["i", solutionPackageName], {
      stdio: quiet ? "ignore" : "inherit"
    });
  }
  const solutionExports = !isLocalSolution(solution) ? require(solutionPackageName) : require(`${path.isAbsolute(solution) ? solution : path.join(process.cwd(), solution)}`);
  const projectBuilderFactory = solutionExports.createProjectBuilder || solutionExports.createAppBuilder || solutionExports.default;
  if (typeof projectBuilderFactory !== "function") {
    throw new Error(
      `"${solutionPackageName}" should export project builder factory via named export 'createProjectBuilder' or via default export`
    );
  }
  return projectBuilderFactory;
}
function isLocalSolution(solution) {
  return solution.startsWith(".") || solution.startsWith("/") || solution.startsWith("~");
}
async function loadSchemaFile(schemaFile) {
  if (!schemaFile) {
    throw new Error("invalid schema file name");
  }
  const schemaFileContent = await fs.readFile(schemaFile, "utf8");
  if (/\.json5/.test(schemaFile)) {
    return import_json5.default.parse(schemaFileContent);
  }
  return import_jsonc.jsonc.parse(schemaFileContent);
}

// src/cli/init-solution.ts
var fs2 = __toESM(require("fs-extra"));
var path2 = __toESM(require("path"));
var import_chalk2 = __toESM(require("chalk"));
var changeCase11 = __toESM(require("change-case"));

// src/cli/solutions/example-solution.ts
function getLowcodeSolutionTemplateFiles() {
  return [
    {
      file: ".editorconfig",
      content: `root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
quote_type = single

[*.md]
trim_trailing_whitespace = false
`
    },
    {
      file: ".eslintignore",
      content: `# \u5FFD\u7565\u76EE\u5F55
node_modules/
build/
dist/
test-cases/
test/
tests/
output/
es/
lib/
coverage/

# \u5FFD\u7565\u6587\u4EF6
**/*.min.js
**/*-min.js
**/*.bundle.js
`
    },
    {
      file: ".eslintrc.js",
      content: `module.exports = {
  extends: 'eslint-config-ali/typescript/react',
  rules: {
    'max-len': ['error', { code: 200 }],
    'comma-dangle': 0,
  },
};
`
    },
    {
      file: ".gitignore",
      content: `# project custom
build
es
lib
dist
output
package-lock.json
deploy-space/packages
deploy-space/.env
generated

# IDE
.vscode
.idea

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock


# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release
lib

# Dependency directories
node_modules/
jspm_packages/

# TypeScript v1 declaration files
typings/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# mac config files
.DS_Store

# codealike
codealike.json
.node
`
    },
    {
      file: ".prettierignore",
      content: "/test-cases/"
    },
    {
      file: ".prettierrc",
      content: `{
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "es5"
}
`
    },
    {
      file: "CHANGELOG.md",
      content: ""
    },
    {
      file: "CONTRIBUTING.md",
      content: `# \u6B22\u8FCE\u5171\u5EFA

# \u6CE8\u610F

- \u6CE8\u610F\u89E3\u51B3 eslint \u95EE\u9898
- \u6CE8\u610F\u4EE3\u7801\u683C\u5F0F\u5316 -- \u5EFA\u8BAE\u5B89\u88C5 prettier \u63D2\u4EF6
- \u53D1\u5E03\u524D\u6CE8\u610F\u8981\u8DD1\u901A demo \u548C\u6240\u6709\u7684\u5355\u6D4B

## \u672C\u5730\u8C03\u8BD5\u8FD0\u884C Demo

\`\`\`sh
> npm run demo
\`\`\`

## \u672C\u5730\u8DD1\u5355\u6D4B

\`\`\`sh
> npm test
\`\`\`
`
    },
    {
      file: "README.md",
      content: `# \u4F4E\u4EE3\u7801\u51FA\u7801\u81EA\u5B9A\u4E49\u65B9\u6848\u4E4B Hello World

## \u76F4\u63A5\u6267\u884C

\`\`\`sh
> npx ali-lowcode-solution-hello-world demo-schema.json
\`\`\`

## \u672C\u5730\u8C03\u8BD5\u8FD0\u884C Demo

\`\`\`sh
> npm run demo
\`\`\`
`
    },
    {
      file: "demo-schema.json",
      content: `{
  "version": "1.0.0",
  "componentsMap": [
    {
      "componentName": "Button",
      "package": "@alifd/next",
      "version": "1.19.18",
      "destructuring": true,
      "exportName": "Button"
    },
    {
      "componentName": "Button.Group",
      "package": "@alifd/next",
      "version": "1.19.18",
      "destructuring": true,
      "exportName": "Button",
      "subName": "Group"
    },
    {
      "componentName": "Input",
      "package": "@alifd/next",
      "version": "1.19.18",
      "destructuring": true,
      "exportName": "Input"
    },
    {
      "componentName": "Form",
      "package": "@alifd/next",
      "version": "1.19.18",
      "destructuring": true,
      "exportName": "Form"
    },
    {
      "componentName": "Form.Item",
      "package": "@alifd/next",
      "version": "1.19.18",
      "destructuring": true,
      "exportName": "Form",
      "subName": "Item"
    },
    {
      "componentName": "NumberPicker",
      "package": "@alifd/next",
      "version": "1.19.18",
      "destructuring": true,
      "exportName": "NumberPicker"
    },
    {
      "componentName": "Select",
      "package": "@alifd/next",
      "version": "1.19.18",
      "destructuring": true,
      "exportName": "Select"
    }
  ],
  "componentsTree": [
    {
      "componentName": "Page",
      "id": "node$1",
      "meta": {
        "title": "\u6D4B\u8BD5",
        "router": "/"
      },
      "props": {
        "ref": "outterView",
        "autoLoading": true
      },
      "fileName": "test",
      "state": {
        "text": "outter"
      },
      "lifeCycles": {
        "componentDidMount": {
          "type": "JSFunction",
          "value": "function componentDidMount() {\\n  console.log('componentDidMount');\\n}"
        }
      },
      "methodsModule": {
        "type": "JSModule",
        "source": "export function helloWorld() {\\n  console.log('Hello world!');\\n}\\n"
      },
      "dataSource": {
        "list": [
          {
            "id": "urlParams",
            "type": "urlParams"
          },

          {
            "id": "user",
            "type": "fetch",
            "options": {
              "method": "GET",
              "uri": "https://shs.xxx.com/mock/1458/demo/user",
              "isSync": true
            },
            "dataHandler": {
              "type": "JSExpression",
              "value": "function (response) {\\nif (!response.data.success){\\n    throw new Error(response.data.message);\\n  }\\n  return response.data.data;\\n}"
            }
          },

          {
            "id": "orders",
            "type": "fetch",
            "options": {
              "method": "GET",
              "uri": "https://shs.xxx.com/mock/1458/demo/orders",
              "isSync": true
            },
            "dataHandler": {
              "type": "JSExpression",
              "value": "function (response) {\\nif (!response.data.success){\\n    throw new Error(response.data.message);\\n  }\\n  return response.data.data.result;\\n}"
            }
          }
        ],
        "dataHandler": {
          "type": "JSExpression",
          "value": "function (dataMap) {\\n  console.info(\\"All datasources loaded:\\", dataMap);\\n}"
        }
      },
      "children": [
        {
          "componentName": "Form",
          "id": "node$2",
          "props": {
            "labelCol": {
              "type": "JSExpression",
              "value": "this.state.colNum"
            },
            "style": {},
            "ref": "testForm"
          },
          "children": [
            {
              "componentName": "Form.Item",
              "id": "node$3",
              "props": {
                "label": "\u59D3\u540D\uFF1A",
                "name": "name",
                "initValue": "\u674E\u96F7"
              },
              "children": [
                {
                  "componentName": "Input",
                  "id": "node$4",
                  "props": {
                    "placeholder": "\u8BF7\u8F93\u5165",
                    "size": "medium",
                    "style": {
                      "width": 320
                    }
                  }
                }
              ]
            },
            {
              "componentName": "Form.Item",
              "id": "node$5",
              "props": {
                "label": "\u5E74\u9F84\uFF1A",
                "name": "age",
                "initValue": "22"
              },
              "children": [
                {
                  "componentName": "NumberPicker",
                  "id": "node$6",
                  "props": {
                    "size": "medium",
                    "type": "normal"
                  }
                }
              ]
            },
            {
              "componentName": "Form.Item",
              "id": "node$7",
              "props": {
                "label": "\u804C\u4E1A\uFF1A",
                "name": "profession"
              },
              "children": [
                {
                  "componentName": "Select",
                  "id": "node$8",
                  "props": {
                    "dataSource": [
                      {
                        "label": "\u6559\u5E08",
                        "value": "t"
                      },
                      {
                        "label": "\u533B\u751F",
                        "value": "d"
                      },
                      {
                        "label": "\u6B4C\u624B",
                        "value": "s"
                      }
                    ]
                  }
                }
              ]
            },
            {
              "componentName": "Div",
              "id": "node$9",
              "props": {
                "style": {
                  "textAlign": "center"
                }
              },
              "children": [
                {
                  "componentName": "Button.Group",
                  "id": "node$a",
                  "props": {},
                  "children": [
                    {
                      "componentName": "Button",
                      "id": "node$b",
                      "condition": {
                        "type": "JSExpression",
                        "value": "this.index >= 1"
                      },
                      "loop": ["a", "b", "c"],
                      "props": {
                        "type": "primary",
                        "style": {
                          "margin": "0 5px 0 5px"
                        }
                      },
                      "children": [
                        {
                          "type": "JSExpression",
                          "value": "this.item"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "constants": {
    "ENV": "prod",
    "DOMAIN": "xxx.xxx.com"
  },
  "css": "body {font-size: 12px;} .table { width: 100px;}",
  "config": {
    "sdkVersion": "1.0.3",
    "historyMode": "hash",
    "targetRootID": "J_Container",
    "layout": {
      "componentName": "BasicLayout",
      "props": {
        "logo": "...",
        "name": "\u6D4B\u8BD5\u7F51\u7AD9"
      }
    },
    "theme": {
      "package": "@alife/theme-fusion",
      "version": "^0.1.0",
      "primary": "#ff9966"
    }
  },
  "meta": {
    "name": "demo\u5E94\u7528",
    "git_group": "appGroup",
    "project_name": "app_demo",
    "description": "\u8FD9\u662F\u4E00\u4E2A\u6D4B\u8BD5\u5E94\u7528",
    "spma": "spa23d",
    "creator": "\u6708\u98DE"
  }
}
`
    },
    {
      file: "jest.config.js",
      content: `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/test-cases/', '/static-files/', '/lib/'],
};
`
    },
    {
      file: "package.json",
      content: `{
  "name": "ali-lowcode-solution-hello-world",
  "version": "1.0.0",
  "description": "AlLowCode Code Generate Solution - Hello World",
  "files": [
    "src",
    "lib",
    "tests",
    "jest.config.js",
    ".editorconfig",
    ".eslintignore",
    ".eslintrc.js",
    ".gitignore",
    ".prettierignore",
    ".prettierrc",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "demo-schema.json",
    "package.json",
    "README.md",
    "tsconfig.json"
  ],
  "main": "lib/index.js",
  "scripts": {
    "start": "jest --watch",
    "build": "npm run clean && concurrently 'npm run build:ts' 'npm run lint'",
    "build:ts": "tsc",
    "check:type": "tsc -p . --noEmit",
    "clean": "rm -rf build dist lib generated",
    "dev": "build-scripts start",
    "lint": "eslint --ext .tsx,.ts,.js,.jsx src",
    "lintfix": "eslint --fix --color --ext .tsx,.ts,.js,.jsx src",
    "lint-staged": "lint-staged",
    "prepublishOnly": "npm run build",
    "postpublish": "git push origin master --tags",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:update-snapshots": "cross-env UPDATE_EXPECTED=true npx jest",
    "demo": "npm run build && npx @alilc/lowcode-code-generator --solution . --output generated demo-schema.json"
  },
  "repository": {
    "type": "git",
    "url": "git@github.com:your-name/ali-lowcode-solution-hello-world.git"
  },
  "author": "",
  "license": "ISC",
  "publishConfig": {
    "registry": "https://registry.npm.xxx.com"
  },
  "dependencies": {
    "@alilc/lowcode-code-generator": "^1.0.0",
    "@alilc/lowcode-types": "^1.0.0",
    "tslib": "^2.3.0"
  },
  "devDependencies": {
    "@types/async": "^3.2.3",
    "@types/jest": "^26.0.17",
    "@typescript-eslint/eslint-plugin": "^4.28.4",
    "@typescript-eslint/parser": "^4.28.4",
    "async": "^3.2.0",
    "babel-runtime": "^6.26.0",
    "concurrently": "^5.2.0",
    "cross-env": "^7.0.0",
    "debug": "^4.1.1",
    "eslint": "^7.31.0",
    "eslint-config-ali": "^12.1.0",
    "eslint-plugin-import": "^2.23.4",
    "eslint-plugin-react": "^7.24.0",
    "eslint-plugin-react-hooks": "^4.2.0",
    "glob": "^7.2.0",
    "husky": "4.2.5",
    "jest": "^26.6.3",
    "json5": "^2.2.0",
    "lint-staged": "10.1.x",
    "lodash": "^4.17.21",
    "md5": "^2.2.1",
    "prettier": "^2.3.2",
    "ts-jest": "^26.4.4",
    "ts-node": "^9.0.0",
    "typescript": "4.x"
  }
}
`
    },
    {
      file: "tsconfig.json",
      content: `{
  "compilerOptions": {
    "esModuleInterop": true,
    "declaration": true,
    "experimentalDecorators": true,
    "forceConsistentCasingInFileNames": true,
    "importHelpers": true,
    "incremental": false,
    "jsx": "react",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "stripInternal": true,
    "outDir": "./lib",
    "declarationDir": "./lib",
    "rootDirs": ["./src"],
    "target": "es6",
    "module": "commonjs",
    "lib": ["esnext"],
    "types": ["jest", "node"],
    "noUnusedLocals": false,
    "noUnusedParameters": false
  },
  "include": ["src/**/*", "typings/**/*"]
}
`
    },
    {
      file: "src/index.ts",
      content: `import CodeGen from '@alilc/lowcode-code-generator';

import examplePlugin from './plugins/example';

export default function createHelloWorldProjectBuilder() {
  return CodeGen.createProjectBuilder({
    template: CodeGen.solutionParts.icejs.template,
    plugins: {
      components: [
        CodeGen.plugins.icejs.reactCommonDeps(),
        CodeGen.plugins.common.esModule({ fileType: 'jsx' }),
        CodeGen.plugins.common.styleImport(),
        CodeGen.plugins.icejs.containerClass(),
        CodeGen.plugins.icejs.containerInjectContext(),
        CodeGen.plugins.icejs.containerInjectUtils(),
        CodeGen.plugins.icejs.containerInjectDataSourceEngine(),
        CodeGen.plugins.icejs.containerInjectI18n(),
        CodeGen.plugins.icejs.containerInjectConstants(),
        CodeGen.plugins.icejs.containerInitState(),
        CodeGen.plugins.icejs.containerLifeCycle(),
        CodeGen.plugins.icejs.containerMethod(),
        examplePlugin(),
        CodeGen.plugins.icejs.jsx({
          nodeTypeMapping: {
            Div: 'div',
            Component: 'div',
            Page: 'div',
            Block: 'div',
          },
        }),
        CodeGen.plugins.style.css(),
      ],
      pages: [
        CodeGen.plugins.icejs.reactCommonDeps(),
        CodeGen.plugins.common.esModule({ fileType: 'jsx' }),
        CodeGen.plugins.common.styleImport(),
        CodeGen.plugins.icejs.containerClass(),
        CodeGen.plugins.icejs.containerInjectContext(),
        CodeGen.plugins.icejs.containerInjectUtils(),
        CodeGen.plugins.icejs.containerInjectDataSourceEngine(),
        CodeGen.plugins.icejs.containerInjectI18n(),
        CodeGen.plugins.icejs.containerInjectConstants(),
        CodeGen.plugins.icejs.containerInitState(),
        CodeGen.plugins.icejs.containerLifeCycle(),
        CodeGen.plugins.icejs.containerMethod(),
        examplePlugin(),
        CodeGen.plugins.icejs.jsx({
          nodeTypeMapping: {
            Div: 'div',
            Component: 'div',
            Page: 'div',
            Block: 'div',
          },
        }),
        CodeGen.plugins.style.css(),
      ],
      router: [
        CodeGen.plugins.common.esModule(),
        CodeGen.solutionParts.icejs.plugins.router(),
      ],
      entry: [CodeGen.solutionParts.icejs.plugins.entry()],
      constants: [CodeGen.plugins.project.constants()],
      utils: [
        CodeGen.plugins.common.esModule(),
        CodeGen.plugins.project.utils('react'),
      ],
      i18n: [CodeGen.plugins.project.i18n()],
      globalStyle: [CodeGen.solutionParts.icejs.plugins.globalStyle()],
      htmlEntry: [CodeGen.solutionParts.icejs.plugins.entryHtml()],
      packageJSON: [CodeGen.solutionParts.icejs.plugins.packageJSON()],
    },
    postProcessors: [CodeGen.postprocessor.prettier()],
  });
}
`
    },
    {
      file: "src/plugins/example.ts",
      content: `import {
  ICodeStruct,
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  FileType,
  ChunkType,
  IContainerInfo,
  COMMON_CHUNK_NAME,
  CLASS_DEFINE_CHUNK_NAME,
  DEFAULT_LINK_AFTER,
} from '@alilc/lowcode-code-generator';

export interface PluginConfig {
  fileType: string;
}

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (
  config?
) => {
  const cfg: PluginConfig = {
    fileType: FileType.JSX,
    ...config,
  };

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IContainerInfo & {
      methodsModule?: {
        type?: 'JSModule';
        source?: string;
      };
    };

    if (ir.methodsModule?.type !== 'JSModule' || !ir.methodsModule?.source) {
      return next;
    }

    // \u521B\u5EFA methods.jsx
    next.chunks.push({
      type: ChunkType.STRING,
      subModule: 'methods',
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.CustomContent,
      content: ir.methodsModule.source,
      linkAfter: [],
    });

    // \u5F15\u5165\u5BF9\u5E94\u7684\u6A21\u5757
    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      content: "import __$$methodsModule from './methods';",
      linkAfter: [...DEFAULT_LINK_AFTER[COMMON_CHUNK_NAME.InternalDepsImport]],
    });

    // \u5C06\u5BFC\u51FA\u7684\u4E1C\u4E1C\u90FD\u653E\u5230 class \u4E0A\u5B9E\u4F8B\u65B9\u6CD5\u90E8\u5206
    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
      content: 'Object.assign(this, __$$methodsModule);',
      linkAfter: [
        ...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorContent],
      ],
    });

    return next;
  };

  return plugin;
};

export default pluginFactory;
`
    },
    {
      file: "tests/basic.test.ts",
      content: `test('basic functions should be ok', () => {
  // \u8FD9\u91CC\u653E\u4E00\u4E9B\u5355\u5143\u6D4B\u8BD5
  expect(0).toBe(0);
});
`
    }
  ];
}

// src/cli/init-solution.ts
async function initSolution(args, options) {
  try {
    const cwd = process.cwd();
    let solutionName = args[0] || "hello";
    let solutionPath = path2.resolve(cwd, solutionName);
    if (solutionName === ".") {
      solutionName = path2.basename(cwd);
      solutionPath = cwd;
    }
    const modifyFileContent = (content) => content.replace(/hello-world/g, changeCase11.paramCase(solutionName)).replace(/HelloWorld/g, changeCase11.pascalCase(solutionName)).replace(/Hello World/g, changeCase11.titleCase(solutionName));
    await ensureDirExists(solutionPath);
    const templateFiles = getLowcodeSolutionTemplateFiles();
    for (const templateFile of templateFiles) {
      if (options.verbose) {
        console.log("%s", import_chalk2.default.gray(`creating file ${templateFile.file}`));
      }
      const templateFilePath = path2.join(solutionPath, templateFile.file);
      await ensureDirExists(path2.dirname(templateFilePath));
      await fs2.writeFile(templateFilePath, modifyFileContent(templateFile.content), { encoding: "utf-8" });
    }
    if (!options.quiet) {
      console.log("%s", import_chalk2.default.green(`solution ${solutionName} created successfully`));
    }
    return 0;
  } catch (e) {
    console.log(import_chalk2.default.red(getErrorMessage(e) || `Unexpected error: ${e}`));
    if (typeof e === "object" && (e == null ? void 0 : e.stack) && options.verbose) {
      console.log(import_chalk2.default.gray(e.stack));
    }
    return 1;
  }
}
async function ensureDirExists(dirPath) {
  try {
    await fs2.mkdir(dirPath, { recursive: true });
  } catch (e) {
    if (e.code === "EEXIST") {
      return;
    }
    throw e;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  initSolution,
  run
});
//# sourceMappingURL=cli.js.map
