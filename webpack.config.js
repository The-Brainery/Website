var brainery = {
  entry: './src/Brainery.js',
  output: {
    filename: './public/Brainery.web.js',
    library: 'Brainery',
    libraryTarget: 'var'
  },
  module:{
    loaders: [
      { test: /\.(png|woff|woff2|eot|ttf|svg|otf)$/,
        loader: 'url-loader?limit=100000'
      },
      { test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      }
    ]
  },
  resolve: {
      alias: {
          "jquery": "jquery"
      }
  }
};

var metaball = {
  entry: './src/MetaBall.js',
  output: {
    filename: './public/MetaBall.web.js',
    library: 'MetaBall',
    libraryTarget: 'var'
  },
  module:{
    loaders: [
      { test: /\.(png|woff|woff2|eot|ttf|svg|otf)$/,
        loader: 'url-loader?limit=100000'
      },
      { test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      }
    ]
  },
  resolve: {
      alias: {
          "jquery": "jquery"
      }
  }
};

module.exports = [brainery, metaball];
