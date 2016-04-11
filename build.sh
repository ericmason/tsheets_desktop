#!/bin/bash

electron-packager --name tsheets --version 0.37.4  --overwrite --platform=darwin --arch=x64 --icon=images/tsheets.icns --osx-sign --osx-sign.identity="Developer ID Application: Equisolve LLC (3MMFZ6XFFA)" src