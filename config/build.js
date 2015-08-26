import webpack from 'webpack'
import config from './webpack'

webpack(config, (err) => {
  err ? console.log(err) : console.log('Done.');
});
