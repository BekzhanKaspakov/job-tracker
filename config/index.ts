import BaseConfig from "./config.base";

// let ExtraConfig = ProdConfig;

// if (__DEV__) {
//   ExtraConfig = DevConfig;
// }

const Config = { ...BaseConfig };
// const Config = { ...BaseConfig, ...ExtraConfig };

export default Config;
