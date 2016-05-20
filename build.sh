#!/bin/bash

electron-packager --name tsheets --version 1.1.1 --overwrite --platform=darwin --arch=x64 --icon=images/tsheets.icns --osx-sign --osx-sign.identity="Developer ID Application: Equisolve LLC (3MMFZ6XFFA)" src
