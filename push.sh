
#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_website_files() {
  git checkout
  git add --all
  git commit -m "Travis build: $TRAVIS_BUILD_NUMBER"
}

upload_files() {
  git remote add origin https://fourjuaneight:23b76aa2e55b90f8e685e73b206bc7a38fc528fc@github.com/fourjuaneight/rustled-jimmies.git > /dev/null 2>&1
  git push origin HEAD:master --quiet --set-upstream
}

setup_git
commit_website_files
upload_files