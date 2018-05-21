const { parsed } = require('dotenv').config();
const { DefinePlugin } = require('webpack');
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");
const { NODE_ENV, CLIENT_ID, CLIENT_SECRET } = parsed;
const path = require("path");

module.exports = {
  webpack: (config, { dev }) => {
    config.plugins.push(
      new DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(NODE_ENV),
          CLIENT_ID: JSON.stringify(CLIENT_ID),
          CLIENT_SECRET: JSON.stringify(CLIENT_SECRET)
        }
      })
    );
    const oldEntry = config.entry

    config.entry = () =>
      oldEntry().then(entry => {
        entry['main.js'] && entry['main.js'].push(path.resolve('./utils/offline'))
        return entry
      })

    /* Enable only in Production */
    if (!dev) {
      // Service Worker
      config.plugins.push(
        new SWPrecacheWebpackPlugin({
          cacheId: 'next-ss',
          filepath: './static/sw.js',
          minify: true,
          staticFileGlobsIgnorePatterns: [/\.next\//],
          staticFileGlobs: [
            'static/**/*' // Precache all static files by default
          ],
          runtimeCaching: [
            // Example with different handlers
            {
              handler: 'fastest',
              urlPattern: /[.](png|jpg|css)/
            },
            {
              handler: 'networkFirst',
              urlPattern: /^http.*/ //cache all files
            }
          ]
        })
      )
    }
    return config;
  }
};
