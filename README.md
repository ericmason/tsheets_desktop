# TSheets Desktop Client

Unofficial desktop application for [TSheets](http://www.tsheets.com). 

## Features

* Dock icon changes to show when you are clocked in
* Auto clock-out after 5 minutes of idle time

## Download

Download the [latest release](https://github.com/ericmason/tsheets_desktop/releases/latest)

## Status

This software is alpha-quality and may be broken for you – but it works for me!

## Development

To set up your development environment on Mac:

    brew install nodejs
    npm install electron-prebuilt@1.1.1
    git clone https://github.com/ericmason/tsheets_desktop.git
    cd tsheets_desktop/src
    npm install
    
To run from your development environment, in the root of the project run

    electron src