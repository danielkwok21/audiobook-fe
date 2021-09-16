const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
              // '@layout-header-background': '#135263',
              '@primary-color': 'black'
             
             },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};