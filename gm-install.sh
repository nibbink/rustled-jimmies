#!/bin/sh

# Install pre-requisites
apt-get install build-essential software-properties-common libjpeg-dev libtiff5-dev libpng16-dev --fix-missing

# Download from SourceForge
wget --no-cookies --timestamping https://downloads.sourceforge.net/project/graphicsmagick/graphicsmagick/1.3.31/GraphicsMagick-1.3.31.tar.gz --directory /tmp

# Decompress package into /opt/graphicsmagick
if [ ! -d "/opt/graphicsmagick/src" ]; then
  mkdir --parents /opt/graphicsmagick/src
fi
tar zxvf /tmp/GraphicsMagick-1.3.26.tar.gz --directory /opt/graphicsmagick/src

# Build binaries
cd /opt/graphicsmagick/src/GraphicsMagick-1.3.26
./configure --prefix=/opt/graphicsmagick/GraphicsMagick-1.3.26
make
make install