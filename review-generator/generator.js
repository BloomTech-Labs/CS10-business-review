const program = require('commander');
const { genReviews, genUsers, genBusinesses } = require('./logic');

program
  .version('1.0.0')
  .description('True Business Generator');

program
  .command('genReviews <numberGenerate>')
  .alias('r')
  .description('Generate Reviews')
  .action((count) => {
    genReviews(count);
  });

program
  .command('genUsers <numberGenerate>')
  .alias('u')
  .description('Generate Users')
  .action((count) => {
    genUsers(count);
  });

program
  .command('genBusinesses <numberGenerate>')
  .alias('b')
  .description('Generate Businesses')
  .action((count) => {
    genBusinesses(count);
  });

program.parse(process.argv);