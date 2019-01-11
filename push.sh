
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
  git push origin HEAD:master --quiet --set-upstream
}

setup_git
commit_website_files
upload_files