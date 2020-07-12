<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center">Insure GUI - Bitcoin Insurance Transaction Crafter</h3>

  <p align="center">
    GUI for creating bitcoin cryptocurrency life insurance transactions
    <br />
    <br />
    ·
    <a href="https://github.com/lacksfish/insure-gui/issues">Report Bug</a>
    ·
    <a href="https://github.com/lacksfish/insure-gui/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
* [Getting Started](#getting-started)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

This project provides the functionality of signing a bitcoin transaction TODAY which is only valid AFTER a later point in time.
Currently, only Ledger hardware wallets are supported, the plan is to add Trezor and Coldcard once I own these devices..

How this works:
* Connect your Ledger to your computer (navigate to the coin app on your Ledger)
* Run this application
* Sync your wallet (this might take a little while)
* Set a recipient (beneficiary) of your Insurance transaction, if something bad would happen to you
* Set a validity date, the transaction you're about to create is not valid before this day (minimum is 1 year)
* Create the insurance
* Confirm on your Ledger hardware wallet
* Save your Insurance as a PDF (Button on the upper left Menu bar)

If you're still alive and well before this day, make sure you move your coins - send them to a new address you own - thus invalidating the insurance transaction before it becomes valid
In the horrible case of death, your beneficiary will have this insurance transaction and will be able to claim the coins


<!-- GETTING STARTED -->
## Getting Started

Don't use this tool of you don't understand what it is trying to do.

If you want to use it, please give it a test run with testnet coins first.

THIS IS BETA, if not ALPHA version software and is guaranteed to contain bugs.

USE AT YOUR OWN RISK!!

You need to connect to a Electrum node to retrieve information about your current balances:

For testnet: https://1209k.com/bitcoin-eye/ele.php?chain=tbtc

For mainnet: https://1209k.com/bitcoin-eye/ele.php?chain=btc

You can set the Electrum server in the Settings.

To run in development mode, you can run `npm run dev`
To build the tool into an executable, you can run `npm run package`.

After running `npm run package`, the binaries will be in the `package` folder, I hope they work on Windows and Mac as well.
If not, let me know!

## Donations

This took a while to make, if you wanna but me a coffee or a beer, I'd be very happy to gulp it down :)


Bitcoin addresses:

17dcxrEx6gNpA3pYMAo9JgDKHNd7xmw8q7

39rckGNi2sLDz7psedf5evGm24yjvCbeR4 (this is a P2SH nested segwit address - please do not send Bitcoin Cash)

bc1q6egjrqddw0eq67d997u2jsfz2flh0u6ujq3cwc


## Screenshot

![Screenshot](https://ipfs.io/ipfs/QmQEgxwH82EBHCBsE9gircimvXCFejAYtUAf1oybng49Nn)

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/lacksfish/insure-gui/issues) for a list of proposed features (and known issues).

Help me find the bugs and fix the bugs :)

I coded this for my own personal use and just polished the code a bit, so it is not as tidy and nice as it should be.

It *should* get the job done, but again please be careful and please please know what you are doing.

In the best case, before using with mainnet coins, you have audited the source code yourself. :)


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

lacksfish - lacksfish@gmail.com



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
Check the `package.json` file for awesome dependencies this library is using.
Extra big shoutout to Electron, VueJS, bitcoinjs and the Ledger dev team!





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/lacksfish/insure-gui.svg?style=flat-square
[contributors-url]: https://github.com/lacksfish/insure-gui/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/lacksfish/insure-gui.svg?style=flat-square
[forks-url]: https://github.com/lacksfish/insure-gui/network/members
[stars-shield]: https://img.shields.io/github/stars/lacksfish/insure-gui.svg?style=flat-square
[stars-url]: https://github.com/lacksfish/insure-gui/stargazers
[issues-shield]: https://img.shields.io/github/issues/lacksfish/insure-gui.svg?style=flat-square
[issues-url]: https://github.com/lacksfish/insure-gui/issues
[license-shield]: https://img.shields.io/github/license/lacksfish/insure-gui.svg?style=flat-square
[license-url]: https://github.com/lacksfish/insure-gui/blob/master/LICENSE
