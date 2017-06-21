<template>
  <div class="main">
    <h1 class="title center">Keychain</h1>
    <p class="subtitle center">Algorithm-based Password Manager</p>
    <div class="input-group margin-space">
      <span class="input-group-addon" id="seed"><i class="glyphicon glyphicon-gift"></i></span>
      <input type="password" class="form-control" placeholder="Input seed here" v-model="seed">
    </div>
    <div class="input-group margin-space">
      <span class="input-group-addon" id="username"><i class="glyphicon glyphicon-user"></i></span>
      <input type="text" class="form-control" placeholder="Input username here" v-model="username">
    </div>
    <div class="input-group margin-space">
      <span class="input-group-addon" id="domain"><i class="glyphicon glyphicon-globe"></i></span>
      <input type="text" class="form-control" placeholder="Input domain here" v-model="domain">
    </div>
    <div class="row margin-space">
      <div class="col-md-3 col-xs-6">
        <input id="enable-lowercase" name="lowercase" type="checkbox" v-model="lowercase">
        <label for="enable-lowercase" class="input-label">LOWERCASE</label>
      </div>
      <div class="col-md-3 col-xs-6">
        <input id="enable-uppercase" name="uppercase" type="checkbox" v-model="uppercase">
        <label for="enable-uppercase" class="input-label">UPPERCASE</label>
      </div>
      <div class="col-md-3 col-xs-6">
        <input id="enable-number" name="number" type="checkbox" v-model="number">
        <label for="enable-number" class="input-label">NUMBER</label>
      </div>
      <div class="col-md-3 col-xs-6">
        <input id="enable-symbol" name="symbol" type="checkbox" v-model="symbol">
        <label for="enable-symbol" class="input-label">SYMBOL</label>
      </div>
    </div>
    <div class="output" @click="copy">
      <header class="output-header">(Click to copy to clipboard)</header>
      <div id="password" class="output-content">{{ password }}</div>
    </div>
  </div>
</template>

<style scoped>
  .main {
    max-width: 800px;
    text-align: center;
    margin: 0 auto;
    font-family: "Yuanti SC", Times, "PingFang SC", "Microsoft YaHei", Helvetica, sans-serif;
  }

  .center {
    text-align: center;
  }

  .title {
    margin: 100px 0 20px 0;
  }

  .subtitle {
    color: #aaaaaa;
    margin: 10px 0;
  }

  .margin-space {
    margin: 15px;
  }

  .input-label {
    display: inline-block;
    width: 100px;
    margin-left: 5px;
    font-weight: normal;
  }

  .output {
    position: relative;
    margin: 20px;
    border: 1px dashed #aaaaaa;
  }

  .output-header {
    color: #aaaaaa;
    font-size: .8em;
    text-align: center;
  }

  .output-content {
    padding: 20px 0 34px 0;
    font-size: 1.25em;
  }
</style>

<script>

  import md5    from 'md5';

  // Define iCheck options.
  const ICHECK_OPTIONS = {
    checkboxClass: 'icheckbox_square-aero',
    radioClass: 'iradio_square-aero'
  };

  // Define the visible characters.
  const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const NUMBER = '1234567890'.split('');
  const SYMBOL = '`~!@#$%^&*()-=_+[]\\{}|;\':",./<>?'.split('');

  export default {
    data: function () {
      return {
        seed: '',
        username: '',
        domain: '',
        lowercase: true,
        uppercase: true,
        number: true,
        symbol: true
      }
    },
    computed: {
      password: function () {

        // Define the default message.
        const DEFAULT_MSG = '- Please fill out the form -';

        // Seed, username and domain is required.
        if (!this.prepared()) {
          return DEFAULT_MSG;
        }

        // plaintext
        let plaintext = this.seed + this.username + this.domain;
        let ptMd5 = md5(plaintext);

        // Generate password.
        return this.generate(ptMd5, this.chars());
      }
    },
    methods: {
      prepared: function () {
        return this.seed.length > 0 && this.username.length > 0 && this.domain.length > 0;
      },
      chars: function () {

        let chars = [];

        if (this.lowercase) {
          chars = chars.concat(LOWERCASE);
        }
        if (this.uppercase) {
          chars = chars.concat(UPPERCASE);
        }
        if (this.number) {
          chars = chars.concat(NUMBER);
        }
        if (this.symbol) {
          chars = chars.concat(SYMBOL);
        }

        return chars;
      },
      generate: function (hash, chars) {

        // random character pointer.
        let pointer = 0;

        // ciphertext.
        let ciphertext = '';

        for (let i = 0; i < hash.length; i += 2) {

          // Parse the 0x?? to integer.
          let hex = hash.substr(i, 2);

          // Move random character pointer.
          pointer += parseInt(`0x${ hex }`);

          // Append cipher text.
          ciphertext += chars[pointer % chars.length];
        }

        return ciphertext;
      },
      copy: function () {

        // Ensure password generated.
        if (!this.prepared()) {
          return;
        }

        let password = document.querySelector('#password');

        // Clear window selection.
        let selection = window.getSelection();
        if (selection.rangeCount > 0) {
          selection.removeAllRanges();
        }

        // Create password text range.
        let range = document.createRange();
        range.selectNodeContents(password);
        selection.addRange(range);

        // Copy.
        document.execCommand('copy')
      }
    },
    watch: {
      seed: function (value) {
        localStorage.setItem('keychain-seed', value);
      }
    },
    mounted() {

      // Load seed from local storage.
      this.seed = localStorage.getItem('keychain-seed') || '';

      // Initialize icheck.
      $('#enable-lowercase').iCheck(ICHECK_OPTIONS)
      .on('ifChecked', $.proxy(function () {
        this.lowercase = true;
      }, this))
      .on('ifUnchecked', $.proxy(function () {
        this.lowercase = false;
      }, this));

      $('#enable-uppercase').iCheck(ICHECK_OPTIONS)
      .on('ifChecked', $.proxy(function () {
        this.uppercase = true;
      }, this))
      .on('ifUnchecked', $.proxy(function () {
        this.uppercase = false;
      }, this));

      $('#enable-number').iCheck(ICHECK_OPTIONS)
      .on('ifChecked', $.proxy(function () {
        this.number = true;
      }, this))
      .on('ifUnchecked', $.proxy(function () {
        this.number = false;
      }, this));

      $('#enable-symbol').iCheck(ICHECK_OPTIONS)
      .on('ifChecked', $.proxy(function () {
        this.symbol = true;
      }, this))
      .on('ifUnchecked', $.proxy(function () {
        this.symbol = false;
      }, this));
    }
  }
</script>
