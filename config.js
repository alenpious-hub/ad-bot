// config.js
module.exports = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    loginUrl: 'https://login.goethe.de/cas/login?service=https%3A%2F%2Fwww.goethe.de%2Fservices%2Fcas%2Fservice%2Fgoethe%2F&locale=en&renew=false',
    modulePageUrl: 'https://www.goethe.de/ins/in/en/sta/ban/prf/gzb2.cfm',
    maxRetries: 5,
    concurrentLimit: 5, // Set to the desired number of tabs to open simultaneously
    selectors: {
        loginForm: '#login-form',
        username: '#username',
        password: '#password',
        loginButton: '.btn.submit'
    }
};
