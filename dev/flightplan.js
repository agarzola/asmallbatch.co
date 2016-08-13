var plan = require('flightplan');

var appName = 'smallbatch',
    username = 'deploy';

var tmpDir = appName + '-' + new Date().getTime();

// configuration
plan.target('hosting', [
  {
    host: '104.236.77.106',
    username: username,
    agent: process.env.SSH_AUTH_SOCK
  }
]);

// run commands on localhost
plan.local(function(local) {
  // check that changes are committed and pushed before deploying
  local.log('Checking git status')
  var commitStatus = local.exec('git status -b --porcelain', { silent: true })
  if (commitStatus.stdout !== null) {
    if (commitStatus.stdout.search(/\[/) >= 0) {
      plan.abort('Error: Current branch is different from remote repo. Please push any commits you may have locally.')
    }
    if (commitStatus.stdout.search(/(\sM\s|\s\?\?\s)/) >= 0) {
      plan.abort('Error: Uncommitted file changes found. Please commit your changes and push them to the remote repository.')
    }
    var branch = commitStatus.stdout.replace(/(\#\#\s)(.*)\.\.\.(.*\n|.*$)*(.*\n|.*$)?/,'$2')
    if (branch !== plan.runtime.target) {
      if (branch.charAt(0) === '\#') {
        plan.abort('Error: Current branch not being tracked remotely. Please track this branch remotely or merge it to master (and push to remote) before deploying.')
      }
    }
  }

  // uncomment these if you need to run a build on your machine first
  // local.log('Clean up and build assets');
  // local.exec('npm run build');

  local.log('Copy files to remote hosts');
  local.with('cd ../', { silent: true }, () => {
    var filesToCopy = local.exec('find assets index.js package.json lib -type f \\( ! -name ".DS_Store" \\) \\( ! -name "*.test.js" \\)', { silent: true });
    // rsync files to all the destination's hosts
    local.transfer(filesToCopy, '/tmp/' + tmpDir);
  })
});

// run commands on remote hosts (destinations)
plan.remote(function(remote) {
  remote.log('Move everything out of build directory');
  remote.exec('mv /tmp/' + tmpDir + '/build/* /tmp/' + tmpDir + '/ && rm -rf /tmp/' + tmpDir + '/build')

  remote.log('Move deployment to root');
  remote.sudo('cp -Rp /tmp/' + tmpDir + ' ~', { user: username });
  remote.rm('-rf /tmp/' + tmpDir);

  remote.log('Point to new deployment');
  remote.sudo('ln -snf ~/' + tmpDir + ' /var/www/html', { user: username });
});
